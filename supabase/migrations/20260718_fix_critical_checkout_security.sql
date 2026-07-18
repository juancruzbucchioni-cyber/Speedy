BEGIN;

CREATE OR REPLACE FUNCTION public.protect_profile_admin_flag()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.is_admin := false;
    ELSIF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
      RAISE EXCEPTION 'No tenes permisos para modificar el rol administrador';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_profile_admin_flag() FROM PUBLIC;

DROP TRIGGER IF EXISTS protect_profile_admin_flag ON public.profiles;
CREATE TRIGGER protect_profile_admin_flag
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_admin_flag();

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
  product_group record;
  order_id uuid;
  current_product public.products%ROWTYPE;
  requested_quantity integer;
  line_price numeric(10,2);
  total_amount numeric(10,2) := 0;
  has_pending_price boolean := false;
  safe_payment_method text;
BEGIN
  IF items IS NULL OR jsonb_typeof(items) <> 'array' OR jsonb_array_length(items) = 0 THEN
    RAISE EXCEPTION 'El pedido no tiene items';
  END IF;

  safe_payment_method := CASE
    WHEN payment_method IN ('efectivo', 'transferencia') THEN payment_method
    ELSE 'transferencia'
  END;

  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    IF NULLIF(item ->> 'product_id', '') IS NULL THEN
      RAISE EXCEPTION 'Falta el producto en uno de los items';
    END IF;

    requested_quantity := COALESCE((item ->> 'quantity')::integer, 0);
    IF requested_quantity <= 0 THEN
      RAISE EXCEPTION 'Cantidad invalida para uno de los items';
    END IF;
  END LOOP;

  FOR product_group IN
    SELECT
      (entry ->> 'product_id')::uuid AS product_id,
      SUM((entry ->> 'quantity')::integer)::integer AS quantity
    FROM jsonb_array_elements(items) AS entry
    GROUP BY (entry ->> 'product_id')::uuid
  LOOP
    SELECT *
    INTO current_product
    FROM public.products
    WHERE id = product_group.product_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Producto no encontrado: %', product_group.product_id;
    END IF;

    IF current_product.stock < product_group.quantity THEN
      RAISE EXCEPTION 'Stock insuficiente para %', current_product.name;
    END IF;

    line_price := current_product.price;
    has_pending_price := has_pending_price OR line_price <= 0;
    total_amount := total_amount + (line_price * product_group.quantity);
  END LOOP;

  INSERT INTO public.orders (user_id, total_price, status, payment_method, source)
  VALUES (
    auth.uid(),
    total_amount,
    CASE WHEN has_pending_price THEN 'pending' ELSE 'completed' END,
    safe_payment_method,
    'web'
  )
  RETURNING id INTO order_id;

  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    requested_quantity := (item ->> 'quantity')::integer;

    SELECT price
    INTO line_price
    FROM public.products
    WHERE id = (item ->> 'product_id')::uuid;

    INSERT INTO public.order_items (order_id, product_id, quantity, price)
    VALUES (
      order_id,
      (item ->> 'product_id')::uuid,
      requested_quantity,
      line_price
    );
  END LOOP;

  FOR product_group IN
    SELECT
      (entry ->> 'product_id')::uuid AS product_id,
      SUM((entry ->> 'quantity')::integer)::integer AS quantity
    FROM jsonb_array_elements(items) AS entry
    GROUP BY (entry ->> 'product_id')::uuid
  LOOP
    UPDATE public.products
    SET stock = stock - product_group.quantity
    WHERE id = product_group.product_id;
  END LOOP;

  RETURN order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_order_with_items(jsonb, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order_with_items(jsonb, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.create_order_with_items(jsonb, text, text) TO authenticated;

COMMIT;
