import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, getEntitlementByAccessToken } from "@/lib/entitlements";

export async function GET(req: NextRequest) {
  const token = extractBearerToken(req);
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const entitlement = await getEntitlementByAccessToken(token);
  if (!entitlement) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    email: entitlement.email,
    plan_tier: entitlement.planTier,
    subscription_status: entitlement.subscriptionStatus,
    max_mt5_slots: entitlement.maxMt5Slots,
    has_pro: entitlement.hasPro,
    role: entitlement.isOwner ? "owner" : "user",
  });
}
