BEGIN;

-- Tabla de categorias (idempotente)
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  image_url text,
  activo boolean NOT NULL DEFAULT true,
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Lectura publica
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

-- Gestion para usuarios autenticados (crear/editar/borrar)
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

-- Categorias base para tienda de motos
INSERT INTO public.categories (name, description, image_url, activo, orden)
SELECT * FROM (
  VALUES
    ('Accesorios', 'Accesorios para personalizar y proteger tu moto', '/branding/logo.png', true, 1),
    ('Escapes', 'Escapes deportivos y de alto rendimiento', '/branding/logo.png', true, 2),
    ('Plasticos', 'Plasticos, kits y tapas para tu moto', '/branding/logo.png', true, 3),
    ('Transmision', 'Piñon, corona, cadena y componentes', '/branding/logo.png', true, 4),
    ('Electronica', 'CDI, ECU, bobinas, estatores y mas', '/branding/logo.png', true, 5),
    ('Frenos', 'Pastillas, discos y componentes de freno', '/branding/logo.png', true, 6),
    ('Iluminacion', 'Luces, faros, giros y accesorios', '/branding/logo.png', true, 7),
    ('Indumentaria', 'Guantes, cascos e indumentaria', '/branding/logo.png', true, 8)
) AS seed(name, description, image_url, activo, orden)
ON CONFLICT (name) DO UPDATE
SET
  description = EXCLUDED.description,
  image_url = COALESCE(categories.image_url, EXCLUDED.image_url),
  activo = EXCLUDED.activo,
  orden = EXCLUDED.orden;

COMMIT;
