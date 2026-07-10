-- BrewControl Admin V1: listado de cervecerías para el Programa Fundadores.
-- Expone una RPC SECURITY DEFINER que solo pueden invocar usuarios con role = 'admin'.
-- Incluye email desde auth.users y el conteo de recetas por cervecería en una sola consulta.

CREATE OR REPLACE FUNCTION public.admin_list_breweries()
RETURNS TABLE (
  id uuid,
  brewery_name text,
  master_brewer text,
  email text,
  role text,
  active boolean,
  created_at timestamptz,
  recipe_count bigint
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
  SELECT
    p.id,
    p.brewery_name,
    p.master_brewer,
    u.email::text,
    p.role,
    p.active,
    p.created_at,
    COUNT(r.id)::bigint AS recipe_count
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  LEFT JOIN public.recipes r ON r.user_id = p.id
  GROUP BY
    p.id,
    p.brewery_name,
    p.master_brewer,
    u.email,
    p.role,
    p.active,
    p.created_at
  ORDER BY p.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_breweries() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_breweries() TO authenticated;

COMMENT ON FUNCTION public.admin_list_breweries() IS
  'Lista todas las cervecerías (profiles) con email y cantidad de recetas. Solo admins.';
