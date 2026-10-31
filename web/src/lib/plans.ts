/**
 * Single commercial plan: Mako Pro Pass — billed via Hotmart (international checkout).
 * In-app CTAs go to `/checkout` (bridge). The Hotmart payment link is only used on that page
 * via NEXT_PUBLIC_HOTMART_CHECKOUT_URL.
 */
export const PRO_CHECKOUT_URL = "/checkout";

export const PRO_PRICE_LABEL = "$19/mo";
export const PRO_PRICE_AMOUNT = 19;
export const PRO_PRICE_DISPLAY = "$19";
export const PRO_MAX_MT5_SLOTS = 3;
export const OWNER_MAX_MT5_SLOTS = 5;

export type PlanTier = "free" | "pro" | "studio" | "starter" | "pending";

/** Paid / privileged access that unlocks the full catalog + AI */
export function hasProAccess(role?: string | null, planTier?: string | null, simulatedRole?: string | null): boolean {
  const effective = simulatedRole || (role === "owner" ? "owner" : planTier);
  return effective === "owner" || effective === "pro" || effective === "studio";
}

export function slotsForPlan(roleOrTier: string | null | undefined): number {
  if (roleOrTier === "owner" || roleOrTier === "studio") return OWNER_MAX_MT5_SLOTS;
  if (roleOrTier === "pro") return PRO_MAX_MT5_SLOTS;
  return 0;
}
