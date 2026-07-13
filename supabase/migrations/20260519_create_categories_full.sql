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
    ('Repuestos', 'Para todo lo mecánico y de mantenimiento.', '/branding/speedy-logo-final.png', true, 1),
    ('Accesorios', 'Cosas extra para la moto o el conductor.', '/branding/speedy-logo-final.png', true, 2),
    ('Cascos e indumentaria', 'Cascos, guantes, camperas, antiparras, etc.', '/branding/speedy-logo-final.png', true, 3),
    ('Cubiertas y cámaras', 'Cubiertas, cámaras, parches, válvulas.', '/branding/speedy-logo-final.png', true, 4),
    ('Aceites y lubricantes', 'Aceite motor, grasa cadena, lubricantes, líquidos.', '/branding/speedy-logo-final.png', true, 5),
    ('Transmisión', 'Kit transmisión, cadenas, coronas, piñones.', '/branding/speedy-logo-final.png', true, 6),
    ('Frenos', 'Pastillas, cintas, discos, manijas, líquido de freno.', '/branding/speedy-logo-final.png', true, 7),
    ('Electricidad', 'Baterías, luces, lámparas, guiños, CDI, bobinas, bujías.', '/branding/speedy-logo-final.png', true, 8),
    ('Estética y tuning', 'Stickers, plásticos, puños, espejos, cubre rayos, luces LED.', '/branding/speedy-logo-final.png', true, 9)
) AS seed(name, description, image_url, activo, orden)
ON CONFLICT (name) DO UPDATE
SET
  description = EXCLUDED.description,
  image_url = COALESCE(categories.image_url, EXCLUDED.image_url),
  activo = EXCLUDED.activo,
  orden = EXCLUDED.orden;

COMMIT;
