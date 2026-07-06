ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS source text DEFAULT 'web';

CREATE OR REPLACE FUNCTION public.create_order_with_items(
  items jsonb,
  payment_method text DEFAULT 'transferencia',
  order_source text DEFAULT 'web'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item jsonb;
  order_id uuid;
  current_product public.products%ROWTYPE;
  requested_quantity integer;
  line_price numeric(10,2);
  total_amount numeric(10,2) := 0;
BEGIN
  IF items IS NULL OR jsonb_typeof(items) <> 'array' OR jsonb_array_length(items) = 0 THEN
    RAISE EXCEPTION 'El pedido no tiene items';
  END IF;

  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    requested_quantity := GREATEST(COALESCE((item ->> 'quantity')::integer, 0), 0);

    IF requested_quantity <= 0 THEN
      RAISE EXCEPTION 'Cantidad invalida para uno de los items';
    END IF;

    SELECT *
    INTO current_product
    FROM public.products
    WHERE id = (item ->> 'product_id')::uuid
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Producto no encontrado: %', item ->> 'product_id';
    END IF;

    IF current_product.stock < requested_quantity THEN
      RAISE EXCEPTION 'Stock insuficiente para %', current_product.name;
    END IF;

    line_price := COALESCE((item ->> 'price')::numeric, current_product.price);
    total_amount := total_amount + (line_price * requested_quantity);
  END LOOP;

  INSERT INTO public.orders (user_id, total_price, status, payment_method, source)
  VALUES (auth.uid(), total_amount, 'completed', payment_method, order_source)
  RETURNING id INTO order_id;

  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    requested_quantity := (item ->> 'quantity')::integer;
    line_price := COALESCE((item ->> 'price')::numeric, 0);

    INSERT INTO public.order_items (order_id, product_id, quantity, price)
    VALUES (
      order_id,
      (item ->> 'product_id')::uuid,
      requested_quantity,
      line_price
    );
  END LOOP;

  RETURN order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order_with_items(jsonb, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.create_order_with_items(jsonb, text, text) TO authenticated;

DROP POLICY IF EXISTS "Authenticated admins can view all orders" ON public.orders;
CREATE POLICY "Authenticated admins can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated admins can view all order items" ON public.order_items;
CREATE POLICY "Authenticated admins can view all order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (public.is_admin());
