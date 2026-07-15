ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS is_best_seller boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_products_best_seller_created_at
  ON public.products (is_best_seller, created_at DESC);
