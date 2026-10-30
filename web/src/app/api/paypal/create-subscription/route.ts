import { NextRequest, NextResponse } from "next/server";
import { createProSubscription, paypalConfigured } from "@/lib/paypal";

export const runtime = "nodejs";

function siteOrigin(req: NextRequest): string {
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "makotradinglab.com";
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!paypalConfigured()) {
      return NextResponse.json(
        {
          error: "PayPal is not configured yet. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.",
          code: "paypal_not_configured",
        },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const origin = siteOrigin(req);
    const sub = await createProSubscription({
      email,
      returnUrl: `${origin}/checkout/success?email=${encodeURIComponent(email)}`,
      cancelUrl: `${origin}/checkout?canceled=1`,
    });

    return NextResponse.json({
      success: true,
      approveUrl: sub.approveUrl,
      subscriptionId: sub.subscriptionId,
      planId: sub.planId,
    });
  } catch (err: any) {
    console.error("[PayPal create-subscription]", err);
    return NextResponse.json({ error: err.message || "Failed to start PayPal checkout" }, { status: 500 });
  }
}

/** Convenience redirect: /api/paypal/create-subscription?email= */
export async function GET(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get("email") || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.redirect(new URL("/checkout", siteOrigin(req)));
  }

  try {
    if (!paypalConfigured()) {
      return NextResponse.redirect(new URL("/checkout?error=paypal_not_configured", siteOrigin(req)));
    }
    const origin = siteOrigin(req);
    const sub = await createProSubscription({
      email,
      returnUrl: `${origin}/checkout/success?email=${encodeURIComponent(email)}`,
      cancelUrl: `${origin}/checkout?canceled=1`,
    });
    return NextResponse.redirect(sub.approveUrl);
  } catch (err: any) {
    const url = new URL("/checkout", siteOrigin(req));
    url.searchParams.set("error", err.message || "paypal_error");
    return NextResponse.redirect(url);
  }
}
