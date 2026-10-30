-- Pending Lemon purchases before signup + owner studio backfill

CREATE TABLE IF NOT EXISTS public.pending_entitlements (
  email TEXT PRIMARY KEY,
  plan_tier user_plan_tier NOT NULL DEFAULT 'pro',
  subscription_status subscription_status NOT NULL DEFAULT 'active',
  max_mt5_slots INT NOT NULL DEFAULT 3,
  ai_generations_limit INT NOT NULL DEFAULT 50,
  lemon_squeezy_customer_id TEXT,
  lemon_squeezy_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pending_entitlements ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.pending_entitlements FROM anon, authenticated;
