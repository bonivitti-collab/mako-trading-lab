import { NextRequest, NextResponse } from "next/server";
import { activateProPass } from "@/lib/entitlements";

export const runtime = "nodejs";

/**
 * Hotmart Webhook v2 — https://developers.hotmart.com/docs/en/2.0.0/webhook/purchase-webhook/
 * Validate X-HOTMART-HOTTOK against HOTMART_HOTTOK.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.HOTMART_HOTTOK;
  if (!expected) {
    console.error("[Hotmart webhook] HOTMART_HOTTOK not configured");
    return NextResponse.json({ error: "Webhook token not configured" }, { status: 500 });
  }

  const hottok =
    req.headers.get("x-hotmart-hottok") ||
    req.headers.get("X-HOTMART-HOTTOK") ||
    req.headers.get("hottok");

  if (!hottok || hottok !== expected) {
    return NextResponse.json({ error: "Invalid hottok" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = String(payload?.event || "").toUpperCase();
  const data = payload?.data || {};
  const email = String(data?.buyer?.email || data?.subscriber?.email || "")
    .trim()
    .toLowerCase();

  if (!email) {
    return NextResponse.json({ ok: true, skipped: "no_email", event });
  }

  const purchaseStatus = String(data?.purchase?.status || "").toUpperCase();
  const subscriptionStatus = String(data?.subscription?.status || "").toUpperCase();
  const transaction = data?.purchase?.transaction || data?.purchase?.order_id || null;
  const subscriberCode = data?.subscription?.subscriber_code || data?.subscription?.id || null;
  const nextCharge = data?.purchase?.date_next_charge || data?.subscription?.date_next_charge;
  const currentPeriodEnd =
    typeof nextCharge === "number"
      ? new Date(nextCharge).toISOString()
      : typeof nextCharge === "string"
        ? nextCharge
        : null;

  try {
    switch (event) {
      case "PURCHASE_APPROVED":
      case "PURCHASE_COMPLETE":
      case "PURCHASE_FINISHED": {
        const result = await activateProPass({
          email,
          lemonCustomerId: subscriberCode ? String(subscriberCode) : null,
          lemonSubscriptionId: transaction ? String(transaction) : subscriberCode ? String(subscriberCode) : null,
          currentPeriodEnd,
          status: "active",
        });
        return NextResponse.json({ ok: true, event, result });
      }

      case "PURCHASE_DELAYED":
      case "PURCHASE_PROTEST":
      case "PURCHASE_BILLET_PRINTED": {
        return NextResponse.json({ ok: true, event, ignored: "awaiting_payment", purchaseStatus });
      }

      case "PURCHASE_REFUNDED":
      case "PURCHASE_CHARGEBACK":
      case "PURCHASE_CANCELED":
      case "PURCHASE_CANCELLED":
      case "PURCHASE_EXPIRED":
      case "SUBSCRIPTION_CANCELLATION":
      case "SWITCH_PLAN": {
        if (event === "SWITCH_PLAN" && (subscriptionStatus === "ACTIVE" || purchaseStatus === "APPROVED")) {
          const result = await activateProPass({
            email,
            lemonCustomerId: subscriberCode ? String(subscriberCode) : null,
            lemonSubscriptionId: transaction ? String(transaction) : null,
            currentPeriodEnd,
            status: "active",
          });
          return NextResponse.json({ ok: true, event, result });
        }

        const result = await activateProPass({
          email,
          lemonCustomerId: subscriberCode ? String(subscriberCode) : null,
          lemonSubscriptionId: transaction ? String(transaction) : null,
          currentPeriodEnd,
          status: "canceled",
        });
        return NextResponse.json({ ok: true, event, result });
      }

      default: {
        if (purchaseStatus === "APPROVED" || subscriptionStatus === "ACTIVE") {
          const result = await activateProPass({
            email,
            lemonCustomerId: subscriberCode ? String(subscriberCode) : null,
            lemonSubscriptionId: transaction ? String(transaction) : null,
            currentPeriodEnd,
            status: "active",
          });
          return NextResponse.json({ ok: true, event, result, via: "status_fallback" });
        }
        return NextResponse.json({ ok: true, ignored: event });
      }
    }
  } catch (err: any) {
    console.error("[Hotmart webhook] handler error", err);
    return NextResponse.json({ error: err.message || "Webhook failed" }, { status: 500 });
  }
}
