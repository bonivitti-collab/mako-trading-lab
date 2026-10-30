import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { activateProPass } from "@/lib/entitlements";

export const runtime = "nodejs";

function verifySignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;
  const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const digest = Buffer.from(hmac, "utf8");
  const signature = Buffer.from(signatureHeader, "utf8");
  if (digest.length !== signature.length) return false;
  return crypto.timingSafeEqual(digest, signature);
}

export async function POST(req: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[Lemon webhook] LEMONSQUEEZY_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") || req.headers.get("X-Signature");

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName =
    payload?.meta?.event_name || req.headers.get("x-event-name") || req.headers.get("X-Event-Name");
  const attrs = payload?.data?.attributes || {};
  const email = (attrs.user_email || attrs.customer_email || payload?.meta?.custom_data?.email || "")
    .toString()
    .trim()
    .toLowerCase();

  if (!email) {
    return NextResponse.json({ ok: true, skipped: "no_email" });
  }

  const lemonCustomerId = attrs.customer_id ? String(attrs.customer_id) : null;
  const lemonSubscriptionId = payload?.data?.id ? String(payload.data.id) : null;
  const renewsAt = attrs.renews_at || attrs.ends_at || null;

  try {
    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
      case "subscription_resumed":
      case "subscription_unpaused":
      case "subscription_payment_success":
      case "subscription_payment_recovered":
      case "order_created": {
        const statusRaw = (attrs.status || "active").toString().toLowerCase();
        const status =
          statusRaw === "cancelled" || statusRaw === "canceled"
            ? "canceled"
            : statusRaw === "expired"
              ? "canceled"
              : statusRaw === "past_due"
                ? "past_due"
                : statusRaw === "unpaid"
                  ? "past_due"
                  : statusRaw === "paused"
                    ? "incomplete"
                    : "active";

        const result = await activateProPass({
          email,
          lemonCustomerId,
          lemonSubscriptionId,
          currentPeriodEnd: renewsAt,
          status: status as any,
        });

        return NextResponse.json({ ok: true, result, eventName });
      }

      case "subscription_cancelled":
      case "subscription_expired":
      case "subscription_paused":
      case "subscription_payment_failed": {
        const result = await activateProPass({
          email,
          lemonCustomerId,
          lemonSubscriptionId,
          currentPeriodEnd: renewsAt,
          status: eventName === "subscription_payment_failed" ? "past_due" : "canceled",
        });
        return NextResponse.json({ ok: true, result, eventName });
      }

      default:
        return NextResponse.json({ ok: true, ignored: eventName });
    }
  } catch (err: any) {
    console.error("[Lemon webhook] handler error", err);
    return NextResponse.json({ error: err.message || "Webhook failed" }, { status: 500 });
  }
}
