-- BrewControl: asociar recetas al usuario autenticado (sin RLS por ahora)

ALTER TABLE public.recipes
ADD COLUMN IF NOT EXISTS user_id uuid;

ALTER TABLE public.recipes
DROP CONSTRAINT IF EXISTS recipes_user_id_fkey;

ALTER TABLE public.recipes
ADD CONSTRAINT recipes_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users (id)
ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS recipes_user_id_idx ON public.recipes (user_id);

COMMENT ON COLUMN public.recipes.user_id IS 'Propietario de la receta (auth.users.id).';
