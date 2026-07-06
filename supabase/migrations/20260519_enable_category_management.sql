-- Habilita gestión de categorías con foto y orden manual
BEGIN;

-- Asegurar columnas útiles para administrar categorías
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS orden integer NOT NULL DEFAULT 0;

-- Asegurar que RLS esté activo
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Lectura pública de categorías activas/inactivas (la web filtra según necesite)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'categories'
      AND policyname = 'Anyone can view categories'
  ) THEN
    CREATE POLICY "Anyone can view categories"
      ON public.categories
      FOR SELECT
      USING (true);
  END IF;
END
$$;

-- Gestión para usuarios autenticados (crear/editar/borrar categorías y foto)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'categories'
      AND policyname = 'Authenticated users can manage categories'
  ) THEN
    CREATE POLICY "Authenticated users can manage categories"
      ON public.categories
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_categories_activo_orden
  ON public.categories (activo, orden, created_at DESC);

COMMIT;
