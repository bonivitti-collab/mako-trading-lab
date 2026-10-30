import { PRO_MAX_MT5_SLOTS, OWNER_MAX_MT5_SLOTS } from "@/lib/plans";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const OWNER_EMAIL = "dbonivitti@gmail.com";

export type Entitlement = {
  email: string;
  userId: string;
  planTier: "free" | "pro" | "studio";
  subscriptionStatus: string;
  maxMt5Slots: number;
  isOwner: boolean;
  hasPro: boolean;
};

export async function getEntitlementByAccessToken(accessToken: string): Promise<Entitlement | null> {
  if (!accessToken) return null;

  const { data: userData, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !userData?.user?.email) return null;

  return getEntitlementForUser(userData.user.id, userData.user.email);
}

export async function getEntitlementForUser(userId: string, email: string): Promise<Entitlement> {
  const normalized = email.trim().toLowerCase();
  const isOwner = normalized === OWNER_EMAIL;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("plan_tier, subscription_status, max_mt5_slots, email")
    .eq("id", userId)
    .maybeSingle();

  let planTier = (profile?.plan_tier as Entitlement["planTier"]) || "free";
  let subscriptionStatus = profile?.subscription_status || "incomplete";
  let maxMt5Slots = profile?.max_mt5_slots ?? 0;

  if (isOwner) {
    planTier = "studio";
    subscriptionStatus = "active";
    maxMt5Slots = Math.max(maxMt5Slots, OWNER_MAX_MT5_SLOTS);
    await ensureOwnerProfile(userId, normalized);
  }

  const hasPro =
    isOwner ||
    ((planTier === "pro" || planTier === "studio") && subscriptionStatus === "active");

  return {
    email: normalized,
    userId,
    planTier,
    subscriptionStatus,
    maxMt5Slots: hasPro ? Math.max(maxMt5Slots, planTier === "studio" || isOwner ? OWNER_MAX_MT5_SLOTS : PRO_MAX_MT5_SLOTS) : 0,
    isOwner,
    hasPro,
  };
}

export async function ensureOwnerProfile(userId: string, email: string) {
  await supabaseAdmin.from("profiles").upsert(
    {
      id: userId,
      email,
      plan_tier: "studio",
      subscription_status: "active",
      max_mt5_slots: OWNER_MAX_MT5_SLOTS,
      ai_generations_limit: 1000,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
}

/** Activate / refresh Pro Pass after Lemon Squeezy payment */
export async function activateProPass(params: {
  email: string;
  lemonCustomerId?: string | null;
  lemonSubscriptionId?: string | null;
  currentPeriodEnd?: string | null;
  status?: "active" | "past_due" | "canceled" | "incomplete" | "trialing";
}) {
  const email = params.email.trim().toLowerCase();
  const status = params.status || "active";
  const isPaidActive = status === "active" || status === "trialing";

  const planTier = isPaidActive ? "pro" : "free";
  const maxSlots = isPaidActive ? PRO_MAX_MT5_SLOTS : 0;
  const aiLimit = isPaidActive ? 50 : 0;

  // Prefer existing profile by email
  const { data: existingProfile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingProfile?.id) {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        plan_tier: planTier,
        subscription_status: status,
        max_mt5_slots: maxSlots,
        ai_generations_limit: aiLimit,
        lemon_squeezy_customer_id: params.lemonCustomerId || null,
        lemon_squeezy_subscription_id: params.lemonSubscriptionId || null,
        current_period_end: params.currentPeriodEnd || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingProfile.id);

    if (error) return { ok: false as const, reason: error.message, email };
    return { ok: true as const, email, userId: existingProfile.id, plan_tier: planTier };
  }

  // Find auth user without profile yet
  const { data: usersData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
  const users = (usersData?.users || []) as Array<{ id: string; email?: string | null }>;
  const user = users.find((u) => (u.email || "").toLowerCase() === email);

  if (user) {
    const { error } = await supabaseAdmin.from("profiles").upsert(
      {
        id: user.id,
        email,
        plan_tier: planTier,
        subscriptionStatus,
        max_mt5_slots: maxSlots,
        ai_generations_limit: aiLimit,
        lemon_squeezy_customer_id: params.lemonCustomerId || null,
        lemon_squeezy_subscription_id: params.lemonSubscriptionId || null,
        current_period_end: params.currentPeriodEnd || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) return { ok: false as const, reason: error.message, email };
    return { ok: true as const, email, userId: user.id, plan_tier: planTier };
  }

  // Paid before signup — stash until handle_new_user runs
  const { error: pendingError } = await supabaseAdmin.from("pending_entitlements").upsert(
    {
      email,
      plan_tier: planTier,
      subscription_status: status,
      max_mt5_slots: maxSlots,
      ai_generations_limit: aiLimit,
      lemon_squeezy_customer_id: params.lemonCustomerId || null,
      lemon_squeezy_subscription_id: params.lemonSubscriptionId || null,
      current_period_end: params.currentPeriodEnd || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" }
  );

  if (pendingError) return { ok: false as const, reason: pendingError.message, email };
  return { ok: true as const, email, pending: true, plan_tier: planTier };
}

export function extractBearerToken(req: Request): string | null {
  const header = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}
