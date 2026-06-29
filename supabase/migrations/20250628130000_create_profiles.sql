-- BrewControl: perfiles de usuario (1:1 con auth.users, sin RLS por ahora)

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  brewery_name text,
  master_brewer text,
  role text NOT NULL DEFAULT 'user',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Perfil de cervecería asociado 1:1 a auth.users.';
COMMENT ON COLUMN public.profiles.id IS 'Identificador del usuario (auth.users.id).';
COMMENT ON COLUMN public.profiles.brewery_name IS 'Nombre de la cervecería.';
COMMENT ON COLUMN public.profiles.master_brewer IS 'Nombre del maestro cervecero.';
COMMENT ON COLUMN public.profiles.role IS 'Rol del usuario (user, admin, etc.).';
COMMENT ON COLUMN public.profiles.active IS 'Indica si el usuario está activo.';

-- Eliminar trigger/función si existían de una versión anterior (creación vía app, no trigger)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
