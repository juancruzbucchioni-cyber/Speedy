ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS motorcycle_model text;

CREATE INDEX IF NOT EXISTS idx_products_motorcycle_model
  ON public.products (motorcycle_model);
