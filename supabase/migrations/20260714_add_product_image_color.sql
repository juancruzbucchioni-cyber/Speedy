ALTER TABLE public.product_images
  ADD COLUMN IF NOT EXISTS color text;

CREATE INDEX IF NOT EXISTS idx_product_images_product_color
  ON public.product_images (product_id, color);
