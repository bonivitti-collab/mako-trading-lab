-- Public-safe license check for MT5 (same surface as /api/v1/verify).
-- SECURITY DEFINER so it works without exposing service_role to Vercel.

CREATE OR REPLACE FUNCTION public.mako_verify_mt5_license(
  p_account_login BIGINT,
  p_product_slug TEXT,
  p_client_version TEXT DEFAULT '1.00',
  p_ip_address TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan TEXT;
  v_status TEXT;
  v_authorized BOOLEAN := FALSE;
  v_reason TEXT := '';
BEGIN
  IF p_account_login IS NULL OR p_product_slug IS NULL OR length(trim(p_product_slug)) = 0 THEN
    RETURN jsonb_build_object(
      'authorized', false,
      'status', 'unauthorized',
      'message', 'Missing account_login or product_slug'
    );
  END IF;

  SELECT p.plan_tier::text, p.subscription_status::text
  INTO v_plan, v_status
  FROM public.mt5_accounts m
  JOIN public.profiles p ON p.id = m.user_id
  WHERE m.account_login = p_account_login
  LIMIT 1;

  IF NOT FOUND THEN
    v_reason := format(
      'MT5 Account #%s is not linked to any active Mako Trading Lab profile. Please link this slot in your dashboard.',
      p_account_login
    );
  ELSIF v_status IS DISTINCT FROM 'active' THEN
    v_reason := format(
      'Your subscription is currently %s. Please update your payment method at https://makotradinglab.com/#pricing',
      v_status
    );
  ELSIF v_plan NOT IN ('pro', 'studio') THEN
    v_reason := format(
      'An active Mako Pro Pass is required to run ''%s''. Subscribe at https://makotradinglab.com/#pricing',
      p_product_slug
    );
  ELSE
    v_authorized := TRUE;
  END IF;

  INSERT INTO public.validation_logs (
    account_login, product_slug, is_pro, client_version, authorized, reason, ip_address
  ) VALUES (
    p_account_login,
    p_product_slug,
    TRUE,
    COALESCE(p_client_version, '1.00'),
    v_authorized,
    COALESCE(NULLIF(v_reason, ''), 'OK'),
    p_ip_address
  );

  IF v_authorized THEN
    RETURN jsonb_build_object(
      'authorized', true,
      'status', 'authorized',
      'account_login', p_account_login,
      'product_slug', p_product_slug,
      'plan_tier', v_plan,
      'expires_in', 86400,
      'message', 'License validated successfully. Mako LicenseGuard protection active.'
    );
  END IF;

  RETURN jsonb_build_object(
    'authorized', false,
    'status', 'unauthorized',
    'message', v_reason
  );
END;
$$;

REVOKE ALL ON FUNCTION public.mako_verify_mt5_license(BIGINT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mako_verify_mt5_license(BIGINT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
