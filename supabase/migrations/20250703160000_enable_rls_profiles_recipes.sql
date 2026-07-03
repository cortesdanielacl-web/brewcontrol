-- BrewControl: habilitar Row Level Security (RLS) en profiles y recipes.
-- Garantiza que cada usuario autenticado solo accede a sus propios registros.

-- =============================================================================
-- public.profiles
-- Propiedad: profiles.id = auth.users.id = auth.uid()
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
DROP POLICY IF EXISTS profiles_delete_own ON public.profiles;

CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY profiles_insert_own
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_update_own
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_delete_own
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- =============================================================================
-- public.recipes
-- Propiedad: recipes.user_id = auth.users.id = auth.uid()
-- =============================================================================

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS recipes_select_own ON public.recipes;
DROP POLICY IF EXISTS recipes_insert_own ON public.recipes;
DROP POLICY IF EXISTS recipes_update_own ON public.recipes;
DROP POLICY IF EXISTS recipes_delete_own ON public.recipes;

CREATE POLICY recipes_select_own
  ON public.recipes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY recipes_insert_own
  ON public.recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY recipes_update_own
  ON public.recipes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY recipes_delete_own
  ON public.recipes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
