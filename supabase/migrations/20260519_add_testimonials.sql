-- Tabla de reseñas/testimonios para home
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  mensaje text NOT NULL,
  foto_url text,
  activo boolean NOT NULL DEFAULT true,
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Lectura pública para mostrar en home
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'testimonials'
      AND policyname = 'Anyone can view testimonials'
  ) THEN
    CREATE POLICY "Anyone can view testimonials"
      ON public.testimonials
      FOR SELECT
      USING (true);
  END IF;
END
$$;

-- Gestión autenticada para que puedas administrarlas desde panel/herramienta SQL
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'testimonials'
      AND policyname = 'Authenticated users can manage testimonials'
  ) THEN
    CREATE POLICY "Authenticated users can manage testimonials"
      ON public.testimonials
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_testimonials_activo_orden
  ON public.testimonials (activo, orden, created_at DESC);

-- Seed mínimo solo si no hay datos
INSERT INTO public.testimonials (nombre, mensaje, foto_url, activo, orden)
SELECT * FROM (
  VALUES
    ('Franco G.', 'Le puse escape y manubrio a mi XR, quedo una locura. Excelente atencion.', '/branding/logo.png', true, 1),
    ('Micaela R.', 'Compre plasticos y llegaron rapidisimo. Calidad de primera.', '/branding/logo.png', true, 2),
    ('Nico T.', 'Me asesoraron por WhatsApp y me pasaron justo el repuesto correcto.', '/branding/logo.png', true, 3)
) AS seed(nombre, mensaje, foto_url, activo, orden)
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials);
