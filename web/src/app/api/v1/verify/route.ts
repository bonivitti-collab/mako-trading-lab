import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Fallback in-memory cache for development/demo when Supabase is not yet connected
// Free/starter accounts are intentionally omitted — Pro Pass only
const FALLBACK_ACCOUNTS: Record<string, { userId: string; planTier: "pro" | "studio"; status: "active" | "canceled" }> = {
  "88991122": { userId: "usr_pro_01", planTier: "pro", status: "active" },
  "99887766": { userId: "usr_pro_02", planTier: "pro", status: "active" },
  "884422": { userId: "usr_studio_01", planTier: "studio", status: "active" },
};

function isPaidTier(planTier: string | null | undefined): boolean {
  return planTier === "pro" || planTier === "studio";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { account_login, product_slug, is_pro, version } = body;

    if (!account_login || !product_slug) {
      return NextResponse.json(
        { status: "unauthorized", authorized: false, message: "Missing account_login or product_slug" },
        { status: 400 }
      );
    }

    const loginNumber = Number(account_login);
    const loginStr = String(account_login);
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";

    let authorized = false;
    let failureReason = "";
    let userPlanTier: string = "free";

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isSupabaseConfigured) {
      try {
        const { data: mt5Record, error } = await supabaseAdmin
          .from("mt5_accounts")
          .select(`
            account_login,
            user_id,
            profiles (
              plan_tier,
              subscription_status
            )
          `)
          .eq("account_login", loginNumber)
          .single();

        if (error || !mt5Record) {
          authorized = false;
          failureReason = `MT5 Account #${loginStr} is not linked to any active Mako Trading Lab profile. Please link this slot in your dashboard.`;
        } else {
          const profile = (mt5Record as any).profiles;
          userPlanTier = profile?.plan_tier || "free";
          const subStatus = profile?.subscription_status || "active";

          if (subStatus !== "active") {
            authorized = false;
            failureReason = `Your subscription is currently ${subStatus}. Please update your payment method at https://makotradinglab.com/#pricing`;
          } else if (!isPaidTier(userPlanTier)) {
            // Entire catalog requires Pro Pass — free/starter has no tool entitlements
            authorized = false;
            failureReason = `An active Mako Pro Pass is required to run '${product_slug}'. Subscribe at https://makotradinglab.com/#pricing`;
          } else {
            authorized = true;
          }
        }

        await supabaseAdmin
          .from("validation_logs")
          .insert({
            account_login: loginNumber,
            product_slug,
            is_pro: true,
            client_version: version || "1.00",
            authorized,
            reason: failureReason || "OK",
            ip_address: clientIp,
          })
          .then();
      } catch (dbErr: any) {
        console.warn("[Mako LicenseGuard] Supabase query fallback:", dbErr.message);
      }
    }

    if (!isSupabaseConfigured) {
      const fallbackAccount = FALLBACK_ACCOUNTS[loginStr];
      if (!fallbackAccount) {
        authorized = false;
        failureReason = `MT5 Account #${loginStr} is not linked to an active Mako Pro Pass. Subscribe at https://makotradinglab.com/#pricing`;
      } else if (fallbackAccount.status !== "active" || !isPaidTier(fallbackAccount.planTier)) {
        authorized = false;
        failureReason = `This tool (${product_slug}) requires an active Mako Pro Pass. Subscribe at https://makotradinglab.com/#pricing`;
      } else {
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json({
        status: "unauthorized",
        authorized: false,
        message: failureReason,
      });
    }

    return NextResponse.json({
      status: "authorized",
      authorized: true,
      account_login: loginNumber,
      product_slug,
      expires_in: 86400,
      message: "License validated successfully. Mako LicenseGuard protection active.",
    });
  } catch {
    return NextResponse.json(
      { status: "error", authorized: false, message: "Internal License Verification Error" },
      { status: 500 }
    );
  }
}
