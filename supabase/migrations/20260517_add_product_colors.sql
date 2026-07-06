/*
Add product color variants support.

This migration:
1. Adds `colors` column to public.products.
2. Fills existing products with default color arrays when empty.
3. Adds a simple check constraint so colors is always an array (when provided).
*/

BEGIN;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS colors text[];

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_colors_is_array'
  ) THEN
    ALTER TABLE public.products
    ADD CONSTRAINT products_colors_is_array
    CHECK (colors IS NULL OR array_ndims(colors) = 1);
  END IF;
END $$;

UPDATE public.products
SET colors = ARRAY['Black', 'White', 'Gray']
WHERE colors IS NULL OR cardinality(colors) = 0;

COMMIT;

-- Verification queries (optional)
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'colors';
-- SELECT id, name, colors FROM public.products LIMIT 20;
