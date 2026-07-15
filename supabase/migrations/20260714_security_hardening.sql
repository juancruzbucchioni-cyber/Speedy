BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_admin = true
  );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debtors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF to_regclass('public.offers') IS NOT NULL THEN
    ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated admins can manage products" ON public.products;
CREATE POLICY "Authenticated admins can manage products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
CREATE POLICY "Anyone can view product images"
  ON public.product_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated admins can manage product images" ON public.product_images;
CREATE POLICY "Authenticated admins can manage product images"
  ON public.product_images
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
CREATE POLICY "Anyone can view active categories"
  ON public.categories
  FOR SELECT
  TO anon, authenticated
  USING (activo = true OR public.is_admin());

CREATE POLICY "Authenticated admins can manage categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated admins can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can view testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON public.testimonials;
CREATE POLICY "Anyone can view active testimonials"
  ON public.testimonials
  FOR SELECT
  TO anon, authenticated
  USING (activo = true OR public.is_admin());

CREATE POLICY "Authenticated admins can manage testimonials"
  ON public.testimonials
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated admins can manage debtors" ON public.debtors;
CREATE POLICY "Authenticated admins can manage debtors"
  ON public.debtors
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DO $$
BEGIN
  IF to_regclass('public.offers') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Authenticated users can manage offers" ON public.offers;
    DROP POLICY IF EXISTS "Authenticated admins can manage offers" ON public.offers;
    DROP POLICY IF EXISTS "Anyone can view offers" ON public.offers;
    DROP POLICY IF EXISTS "Anyone can view active offers" ON public.offers;

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
  END IF;
END
$$;

DROP POLICY IF EXISTS "Users can manage their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated admins can view all orders" ON public.orders;
CREATE POLICY "Authenticated admins can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Authenticated admins can view all order items" ON public.order_items;
CREATE POLICY "Authenticated admins can view all order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

DROP POLICY IF EXISTS "Anyone can view product image files" ON storage.objects;
CREATE POLICY "Anyone can view product image files"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated admins can upload product image files" ON storage.objects;
CREATE POLICY "Authenticated admins can upload product image files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Authenticated admins can update product image files" ON storage.objects;
CREATE POLICY "Authenticated admins can update product image files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Authenticated admins can delete product image files" ON storage.objects;
CREATE POLICY "Authenticated admins can delete product image files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());

DO $$
BEGIN
  IF to_regclass('public.product_details') IS NOT NULL THEN
    EXECUTE 'ALTER VIEW public.product_details SET (security_invoker = true)';
  END IF;
END
$$;

COMMIT;
