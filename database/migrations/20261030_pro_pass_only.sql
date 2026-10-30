-- Migration: retire Starter / free entitlements — Pro Pass only
-- Safe to re-run on existing Supabase projects.

-- 1) Entire product catalog becomes Pro-gated
UPDATE public.products
SET is_pro = TRUE,
    updated_at = NOW()
WHERE is_pro IS DISTINCT FROM TRUE;

-- 2) Legacy free/starter profiles lose download slots until they subscribe
UPDATE public.profiles
SET max_mt5_slots = 0,
    ai_generations_limit = 0,
    subscription_status = CASE
      WHEN plan_tier IN ('pro', 'studio') THEN subscription_status
      ELSE 'incomplete'
    END,
    updated_at = NOW()
WHERE plan_tier = 'free'
   OR plan_tier::text = 'starter';

-- 3) Ensure Pro / Studio entitlements remain correct
UPDATE public.profiles
SET max_mt5_slots = GREATEST(max_mt5_slots, 3),
    ai_generations_limit = GREATEST(ai_generations_limit, 50),
    updated_at = NOW()
WHERE plan_tier = 'pro'
  AND subscription_status = 'active';

UPDATE public.profiles
SET max_mt5_slots = GREATEST(max_mt5_slots, 5),
    ai_generations_limit = GREATEST(ai_generations_limit, 200),
    updated_at = NOW()
WHERE plan_tier = 'studio'
  AND subscription_status = 'active';

-- 4) Optional Lemon Squeezy columns (ignore if already present)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS lemon_squeezy_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS lemon_squeezy_subscription_id TEXT;
