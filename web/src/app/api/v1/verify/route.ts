import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Fallback in-memory cache for development/demo when Supabase is not yet connected
const FALLBACK_ACCOUNTS: Record<string, { userId: string; planTier: "free" | "pro" | "studio"; status: "active" | "canceled" }> = {
  "12345678": { userId: "usr_free_01", planTier: "free", status: "active" },
  "88991122": { userId: "usr_pro_01", planTier: "pro", status: "active" },
  "99887766": { userId: "usr_pro_02", planTier: "pro", status: "active" },
  "884422":   { userId: "usr_studio_01", planTier: "studio", status: "active" }
};

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
    let userPlanTier: "free" | "pro" | "studio" = "free";

    // 1. Try Live Supabase Query (mt5_accounts joined with profiles)
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

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
          } else if (is_pro && userPlanTier === "free") {
            authorized = false;
            failureReason = `Tool '${product_slug}' requires an active PRO or STUDIO Pass. Upgrade at https://makotradinglab.com/#pricing`;
          } else {
            authorized = true;
          }
        }

        // Asynchronously log verification attempt for audit telemetry
        await supabaseAdmin.from("validation_logs").insert({
          account_login: loginNumber,
          product_slug,
          is_pro: !!is_pro,
          client_version: version || "1.00",
          authorized,
          reason: failureReason || "OK",
          ip_address: clientIp
        }).then();

      } catch (dbErr: any) {
        console.warn("[Mako LicenseGuard] Supabase query fallback:", dbErr.message);
      }
    }

    // 2. Fallback to resilient in-memory verification if DB is offline or mock mode
    if (!isSupabaseConfigured) {
      const fallbackAccount = FALLBACK_ACCOUNTS[loginStr];
      if (!fallbackAccount) {
        authorized = false;
        failureReason = `MT5 Account #${loginStr} is not linked to any Mako Trading Lab profile. Please link this account in your dashboard.`;
      } else if (is_pro && fallbackAccount.planTier === "free") {
        authorized = false;
        failureReason = `This tool (${product_slug}) requires an active PRO subscription. Upgrade at https://makotradinglab.com/#pricing`;
      } else {
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json({
        status: "unauthorized",
        authorized: false,
        message: failureReason
      });
    }

    // 3. Output authorized response with 24-hour client-side caching token
    return NextResponse.json({
      status: "authorized",
      authorized: true,
      account_login: loginNumber,
      product_slug,
      expires_in: 86400, // 24 hours in seconds
      message: "License validated successfully. Mako LicenseGuard protection active."
    });

  } catch (err: any) {
    return NextResponse.json(
      { status: "error", authorized: false, message: "Internal License Verification Error" },
      { status: 500 }
    );
  }
}
