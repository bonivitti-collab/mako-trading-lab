import { NextRequest, NextResponse } from "next/server";
import { activateProPass } from "@/lib/entitlements";
import { getSubscription, paypalConfigured } from "@/lib/paypal";

export const runtime = "nodejs";

/** After PayPal return — verify subscription server-side and activate Pro */
export async function GET(req: NextRequest) {
  try {
    if (!paypalConfigured()) {
      return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
    }

    const subscriptionId = req.nextUrl.searchParams.get("subscription_id") || "";
    if (!subscriptionId) {
      return NextResponse.json({ error: "subscription_id required" }, { status: 400 });
    }

    const sub = await getSubscription(subscriptionId);
    const email = (
      sub?.custom_id ||
      sub?.subscriber?.email_address ||
      ""
    )
      .toString()
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json({ activated: false, reason: "no_email", status: sub?.status });
    }

    const statusUpper = String(sub?.status || "").toUpperCase();
    const isActive = statusUpper === "ACTIVE" || statusUpper === "APPROVED";

    if (!isActive) {
      return NextResponse.json({ activated: false, status: sub?.status, email });
    }

    const result = await activateProPass({
      email,
      lemonCustomerId: sub?.subscriber?.payer_id || null,
      lemonSubscriptionId: sub?.id || subscriptionId,
      currentPeriodEnd: sub?.billing_info?.next_billing_time || null,
      status: "active",
    });

    return NextResponse.json({ activated: true, result, status: sub?.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Confirm failed" }, { status: 500 });
  }
}
