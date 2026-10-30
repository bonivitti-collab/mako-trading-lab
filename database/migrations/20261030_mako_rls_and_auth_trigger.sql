-- RLS + grants + profile auto-create on signup
-- Applied to Supabase project njdbgtnffnuvrosokguy (Mako / antitrader)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mt5_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;
REVOKE ALL ON TABLE public.mt5_accounts FROM anon, authenticated;
REVOKE ALL ON TABLE public.products FROM anon, authenticated;
REVOKE ALL ON TABLE public.validation_logs FROM anon, authenticated;
REVOKE ALL ON TABLE public.ai_generations FROM anon, authenticated;

GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile safe fields"
  ON public.profiles FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.mt5_accounts TO authenticated;

CREATE POLICY "Users can read own mt5 accounts"
  ON public.mt5_accounts FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own mt5 accounts"
  ON public.mt5_accounts FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own mt5 accounts"
  ON public.mt5_accounts FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own mt5 accounts"
  ON public.mt5_accounts FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

GRANT SELECT ON TABLE public.products TO anon, authenticated;

CREATE POLICY "Anyone can read published products"
  ON public.products FOR SELECT TO anon, authenticated
  USING (is_published = TRUE);

-- validation_logs: service_role only (RLS on, no client policies)

GRANT SELECT, INSERT ON TABLE public.ai_generations TO authenticated;

CREATE POLICY "Users can read own ai generations"
  ON public.ai_generations FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own ai generations"
  ON public.ai_generations FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, plan_tier, subscription_status, max_mt5_slots, ai_generations_limit)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, NEW.id::text || '@users.local'),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    'free',
    'incomplete',
    0,
    0
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS products_set_updated_at ON public.products;
CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role, supabase_auth_admin;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO postgres, service_role;
