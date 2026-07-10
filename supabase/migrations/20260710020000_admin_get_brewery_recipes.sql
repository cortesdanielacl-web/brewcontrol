-- BrewControl Admin V1: recetas de una cervecería (detalle).
-- RPC SECURITY DEFINER, solo role = 'admin'. RLS de recipes permanece intacto.

CREATE OR REPLACE FUNCTION public.admin_get_brewery_recipes(p_user_id uuid)
RETURNS SETOF public.recipes
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

  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'p_user_id es obligatorio'
      USING ERRCODE = '22023';
  END IF;

  RETURN QUERY
  SELECT r.*
  FROM public.recipes r
  WHERE r.user_id = p_user_id
  ORDER BY r.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_get_brewery_recipes(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_get_brewery_recipes(uuid) TO authenticated;

COMMENT ON FUNCTION public.admin_get_brewery_recipes(uuid) IS
  'Devuelve todas las recetas de una cervecería (user_id). Solo admins.';
