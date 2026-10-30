import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
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
    const { account_login, product_slug, version } = body;

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

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isSupabaseConfigured) {
      try {
        // Prefer SECURITY DEFINER RPC — works with anon key (no service_role required on Vercel)
        const db = process.env.SUPABASE_SERVICE_ROLE_KEY ? supabaseAdmin : supabase;
        const { data: rpcResult, error: rpcError } = await db.rpc("mako_verify_mt5_license", {
          p_account_login: loginNumber,
          p_product_slug: product_slug,
          p_client_version: version || "1.00",
          p_ip_address: clientIp,
        });

        if (!rpcError && rpcResult && typeof rpcResult === "object") {
          const result = rpcResult as {
            authorized?: boolean;
            status?: string;
            message?: string;
            expires_in?: number;
          };
          if (result.authorized) {
            return NextResponse.json({
              status: "authorized",
              authorized: true,
              account_login: loginNumber,
              product_slug,
              expires_in: result.expires_in ?? 86400,
              message: result.message || "License validated successfully. Mako LicenseGuard protection active.",
            });
          }
          return NextResponse.json({
            status: "unauthorized",
            authorized: false,
            message: result.message || "Unauthorized",
          });
        }

        // Legacy path if RPC is unavailable on older DBs
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
          const userPlanTier = profile?.plan_tier || "free";
          const subStatus = profile?.subscription_status || "active";

          if (subStatus !== "active") {
            authorized = false;
            failureReason = `Your subscription is currently ${subStatus}. Please update your payment method at https://makotradinglab.com/#pricing`;
          } else if (!isPaidTier(userPlanTier)) {
            authorized = false;
            failureReason = `An active Mako Pro Pass is required to run '${product_slug}'. Subscribe at https://makotradinglab.com/#pricing`;
          } else {
            authorized = true;
          }
        }

        if (rpcError) {
          console.warn("[Mako LicenseGuard] RPC unavailable, used table fallback:", rpcError.message);
        }
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
