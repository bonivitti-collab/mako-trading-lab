-- ====================================================================
-- MAKO TRADING LAB - PRODUCTION DATABASE SCHEMA (PostgreSQL / Supabase)
-- Pro Pass only commercial model (free/starter no longer entitles downloads)
-- ====================================================================

-- 1. ENUMS
CREATE TYPE user_plan_tier AS ENUM ('free', 'pro', 'studio');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'incomplete', 'trialing');
CREATE TYPE product_category AS ENUM (
    'risk_utilities',
    'volume_orderflow',
    'trend_oscillators',
    'price_action_smc',
    'expert_advisors'
);
CREATE TYPE product_type AS ENUM ('indicator', 'ea', 'script', 'utility');

-- 2. USERS PROFILE TABLE (Linked to auth.users in Supabase)
-- plan_tier 'free' = account exists but NO catalog/license entitlements until Pro Pass is active
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    plan_tier user_plan_tier DEFAULT 'free' NOT NULL,
    subscription_status subscription_status DEFAULT 'incomplete' NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    lemon_squeezy_customer_id TEXT,
    lemon_squeezy_subscription_id TEXT,
    current_period_end TIMESTAMPTZ,
    max_mt5_slots INT DEFAULT 0 NOT NULL, -- 0 until Pro; 3 for pro; 5 for studio/owner
    ai_generations_used INT DEFAULT 0 NOT NULL,
    ai_generations_limit INT DEFAULT 0 NOT NULL, -- 0 for free; unlimited/high for pro
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. MT5 ACCOUNTS LINKED SLOTS
CREATE TABLE IF NOT EXISTS public.mt5_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    account_login BIGINT NOT NULL,
    broker_server TEXT,
    label TEXT,
    slot_index INT NOT NULL CHECK (slot_index BETWEEN 1 AND 5),
    cooldown_until TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, slot_index),
    UNIQUE(account_login)
);

-- 4. PRODUCTS CATALOG (entire catalog is Pro Pass)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category product_category NOT NULL,
    type product_type NOT NULL,
    is_pro BOOLEAN DEFAULT TRUE NOT NULL,
    version TEXT DEFAULT '1.00' NOT NULL,
    short_desc TEXT NOT NULL,
    full_desc TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    inputs_documentation JSONB DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT '{}',
    download_count INT DEFAULT 0 NOT NULL,
    ex5_storage_path TEXT,
    preview_image_url TEXT,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. VALIDATION LOGS
CREATE TABLE IF NOT EXISTS public.validation_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_login BIGINT NOT NULL,
    product_slug TEXT NOT NULL,
    is_pro BOOLEAN NOT NULL,
    client_version TEXT,
    authorized BOOLEAN NOT NULL,
    reason TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. AI STUDIO GENERATIONS LOG
CREATE TABLE IF NOT EXISTS public.ai_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    prompt TEXT NOT NULL,
    generated_code TEXT NOT NULL,
    product_type product_type DEFAULT 'ea' NOT NULL,
    tokens_used INT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mt5_accounts_login ON public.mt5_accounts(account_login);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_validation_logs_created ON public.validation_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_plan_tier ON public.profiles(plan_tier);
