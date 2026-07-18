BEGIN;

CREATE TABLE IF NOT EXISTS public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Oferta especial',
  badge text NOT NULL DEFAULT 'SALE',
  offer_price numeric(10,2),
  activo boolean NOT NULL DEFAULT true,
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view offers" ON public.offers;
DROP POLICY IF EXISTS "Authenticated users can manage offers" ON public.offers;
DROP POLICY IF EXISTS "Anyone can view active offers" ON public.offers;
DROP POLICY IF EXISTS "Authenticated admins can manage offers" ON public.offers;

CREATE POLICY "Anyone can view active offers"
  ON public.offers
  FOR SELECT
  TO anon, authenticated
  USING (activo = true OR public.is_admin());

CREATE POLICY "Authenticated admins can manage offers"
  ON public.offers
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_offers_activo_orden
  ON public.offers (activo, orden, created_at DESC);

DELETE FROM public.product_images
WHERE btrim(image_url) IN ('Rojo -', 'Blanco -');

COMMIT;
