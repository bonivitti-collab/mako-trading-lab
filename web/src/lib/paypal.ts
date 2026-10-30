const LIVE_API = "https://api-m.paypal.com";
const SANDBOX_API = "https://api-m.sandbox.paypal.com";

export function paypalApiBase(): string {
  const mode = (process.env.PAYPAL_MODE || "live").toLowerCase();
  return mode === "sandbox" ? SANDBOX_API : LIVE_API;
}

export function paypalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET are not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${paypalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error(data?.error_description || data?.error || `PayPal OAuth failed (${res.status})`);
  }
  return data.access_token as string;
}

async function paypalFetch(path: string, init: RequestInit = {}) {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${paypalApiBase()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

/** Create (or reuse env) billing plan for Mako Pro Pass $19/mo */
export async function ensureProPlanId(): Promise<string> {
  if (process.env.PAYPAL_PLAN_ID) return process.env.PAYPAL_PLAN_ID;

  const { res: productRes, data: product } = await paypalFetch("/v1/catalogs/products", {
    method: "POST",
    headers: { "PayPal-Request-Id": `mako-pro-product-${Date.now()}` },
    body: JSON.stringify({
      name: "Mako Pro Pass",
      description:
        "All-Access Institutional Pass for MetaTrader 5 — 533 .EX5 tools, MT5 slots, and Mako AI Studio.",
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });

  if (!productRes.ok || !product.id) {
    throw new Error(product?.message || product?.details?.[0]?.description || "Failed to create PayPal product");
  }

  const { res: planRes, data: plan } = await paypalFetch("/v1/billing/plans", {
    method: "POST",
    headers: { "PayPal-Request-Id": `mako-pro-plan-${Date.now()}` },
    body: JSON.stringify({
      product_id: product.id,
      name: "Mako Pro Pass Monthly",
      description: "Mako Pro Pass — $19/month",
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: "19.00", currency_code: "USD" },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    }),
  });

  if (!planRes.ok || !plan.id) {
    throw new Error(plan?.message || plan?.details?.[0]?.description || "Failed to create PayPal plan");
  }

  // Ephemeral for this serverless instance; set PAYPAL_PLAN_ID in Vercel to reuse
  process.env.PAYPAL_PLAN_ID = plan.id;
  return plan.id as string;
}

export async function createProSubscription(params: {
  email: string;
  returnUrl: string;
  cancelUrl: string;
}) {
  const planId = await ensureProPlanId();
  const email = params.email.trim().toLowerCase();

  const { res, data } = await paypalFetch("/v1/billing/subscriptions", {
    method: "POST",
    headers: { "PayPal-Request-Id": `mako-sub-${email}-${Date.now()}` },
    body: JSON.stringify({
      plan_id: planId,
      custom_id: email,
      subscriber: { email_address: email },
      application_context: {
        brand_name: "Mako Trading Lab",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(data?.message || data?.details?.[0]?.description || `Create subscription failed (${res.status})`);
  }

  const approve = (data.links || []).find((l: any) => l.rel === "approve")?.href;
  if (!approve) throw new Error("PayPal did not return an approve link");

  return {
    subscriptionId: data.id as string,
    status: data.status as string,
    approveUrl: approve as string,
    planId,
  };
}

export async function getSubscription(subscriptionId: string) {
  const { res, data } = await paypalFetch(`/v1/billing/subscriptions/${subscriptionId}`);
  if (!res.ok) {
    throw new Error(data?.message || `Get subscription failed (${res.status})`);
  }
  return data;
}

export async function verifyPayPalWebhook(params: {
  rawBody: string;
  headers: {
    authAlgo: string | null;
    certUrl: string | null;
    transmissionId: string | null;
    transmissionSig: string | null;
    transmissionTime: string | null;
  };
}): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    // Allow unsigned in development only
    if (process.env.NODE_ENV !== "production") return true;
    return false;
  }

  const { authAlgo, certUrl, transmissionId, transmissionSig, transmissionTime } = params.headers;
  if (!authAlgo || !certUrl || !transmissionId || !transmissionSig || !transmissionTime) {
    return false;
  }

  let webhookEvent: unknown;
  try {
    webhookEvent = JSON.parse(params.rawBody);
  } catch {
    return false;
  }

  const { res, data } = await paypalFetch("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: webhookEvent,
    }),
  });

  return res.ok && data?.verification_status === "SUCCESS";
}
