-- BrewControl Admin V1: plan de cuenta + RPC para administrar estado/plan.
-- Reutiliza profiles.active (boolean) como estado Activo/Inactivo.
-- Añade profiles.plan: beta | fundador | pro.

-- =============================================================================
-- Columna plan
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'beta';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_plan_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_plan_check
      CHECK (plan IN ('beta', 'fundador', 'pro'));
  END IF;
END $$;

COMMENT ON COLUMN public.profiles.plan IS
  'Plan de la cuenta: beta | fundador | pro (Programa Fundadores).';

-- =============================================================================
-- Actualizar listado admin para incluir plan
-- =============================================================================

DROP FUNCTION IF EXISTS public.admin_list_breweries();

CREATE OR REPLACE FUNCTION public.admin_list_breweries()
RETURNS TABLE (
  id uuid,
  brewery_name text,
  master_brewer text,
  email text,
  role text,
  active boolean,
  plan text,
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
    p.plan,
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
    p.plan,
    p.created_at
  ORDER BY p.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_breweries() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_breweries() TO authenticated;

COMMENT ON FUNCTION public.admin_list_breweries() IS
  'Lista cervecerías con email, plan, estado y cantidad de recetas. Solo admins.';

-- =============================================================================
-- Actualizar estado (active) y/o plan de una cervecería
-- =============================================================================

CREATE OR REPLACE FUNCTION public.admin_update_brewery_account(
  p_user_id uuid,
  p_active boolean DEFAULT NULL,
  p_plan text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  brewery_name text,
  master_brewer text,
  email text,
  role text,
  active boolean,
  plan text,
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

  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'p_user_id es obligatorio'
      USING ERRCODE = '22023';
  END IF;

  IF p_active IS NULL AND p_plan IS NULL THEN
    RAISE EXCEPTION 'Debe indicar p_active y/o p_plan'
      USING ERRCODE = '22023';
  END IF;

  IF p_plan IS NOT NULL AND p_plan NOT IN ('beta', 'fundador', 'pro') THEN
    RAISE EXCEPTION 'plan inválido: %', p_plan
      USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = p_user_id) THEN
    RAISE EXCEPTION 'Cervecería no encontrada'
      USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.profiles AS target
  SET
    active = COALESCE(p_active, target.active),
    plan = COALESCE(p_plan, target.plan)
  WHERE target.id = p_user_id;

  RETURN QUERY
  SELECT
    p.id,
    p.brewery_name,
    p.master_brewer,
    u.email::text,
    p.role,
    p.active,
    p.plan,
    p.created_at,
    COUNT(r.id)::bigint AS recipe_count
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  LEFT JOIN public.recipes r ON r.user_id = p.id
  WHERE p.id = p_user_id
  GROUP BY
    p.id,
    p.brewery_name,
    p.master_brewer,
    u.email,
    p.role,
    p.active,
    p.plan,
    p.created_at;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_brewery_account(uuid, boolean, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_brewery_account(uuid, boolean, text) TO authenticated;

COMMENT ON FUNCTION public.admin_update_brewery_account(uuid, boolean, text) IS
  'Actualiza active y/o plan de una cervecería. Solo admins. RLS intacto.';
