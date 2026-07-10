-- BrewControl Admin: métricas del Dashboard Ejecutivo.
-- Una sola consulta agregada (sin N+1). Solo role = 'admin'.

CREATE OR REPLACE FUNCTION public.admin_get_executive_metrics()
RETURNS TABLE (
  total_breweries bigint,
  active_breweries bigint,
  inactive_breweries bigint,
  founder_breweries bigint,
  beta_breweries bigint,
  pro_breweries bigint,
  active_fundador_count bigint,
  active_pro_count bigint,
  total_recipes bigint,
  latest_brewery_name text,
  latest_brewery_at timestamptz,
  latest_recipe_name text,
  latest_recipe_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles caller
    WHERE caller.id = auth.uid()
      AND caller.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acceso denegado: se requiere rol admin'
      USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  WITH brewery_stats AS (
    SELECT
      COUNT(*) FILTER (WHERE p.role <> 'admin')::bigint AS total_breweries,
      COUNT(*) FILTER (WHERE p.role <> 'admin' AND p.active IS TRUE)::bigint AS active_breweries,
      COUNT(*) FILTER (WHERE p.role <> 'admin' AND p.active IS NOT TRUE)::bigint AS inactive_breweries,
      COUNT(*) FILTER (WHERE p.role <> 'admin' AND p.plan = 'fundador')::bigint AS founder_breweries,
      COUNT(*) FILTER (WHERE p.role <> 'admin' AND p.plan = 'beta')::bigint AS beta_breweries,
      COUNT(*) FILTER (WHERE p.role <> 'admin' AND p.plan = 'pro')::bigint AS pro_breweries,
      COUNT(*) FILTER (WHERE p.role <> 'admin' AND p.active IS TRUE AND p.plan = 'fundador')::bigint AS active_fundador_count,
      COUNT(*) FILTER (WHERE p.role <> 'admin' AND p.active IS TRUE AND p.plan = 'pro')::bigint AS active_pro_count
    FROM public.profiles p
  ),
  recipe_stats AS (
    SELECT COUNT(*)::bigint AS total_recipes
    FROM public.recipes r
  ),
  latest_brewery AS (
    SELECT
      COALESCE(NULLIF(TRIM(p.brewery_name), ''), 'Sin nombre') AS brewery_name,
      p.created_at
    FROM public.profiles p
    WHERE p.role <> 'admin'
    ORDER BY p.created_at DESC
    LIMIT 1
  ),
  latest_recipe AS (
    SELECT
      COALESCE(NULLIF(TRIM(r.nombre), ''), 'Sin nombre') AS recipe_name,
      r.created_at
    FROM public.recipes r
    ORDER BY r.created_at DESC
    LIMIT 1
  )
  SELECT
    bs.total_breweries,
    bs.active_breweries,
    bs.inactive_breweries,
    bs.founder_breweries,
    bs.beta_breweries,
    bs.pro_breweries,
    bs.active_fundador_count,
    bs.active_pro_count,
    rs.total_recipes,
    lb.brewery_name,
    lb.created_at,
    lr.recipe_name,
    lr.created_at
  FROM brewery_stats bs
  CROSS JOIN recipe_stats rs
  LEFT JOIN latest_brewery lb ON TRUE
  LEFT JOIN latest_recipe lr ON TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_get_executive_metrics() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_get_executive_metrics() TO authenticated;

COMMENT ON FUNCTION public.admin_get_executive_metrics() IS
  'Indicadores del Dashboard Ejecutivo (negocio). Solo admins. Excluye perfiles admin del conteo de cervecerías.';
