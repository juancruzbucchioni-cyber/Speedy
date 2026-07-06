CREATE TABLE IF NOT EXISTS public.debtors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  debtor_name text NOT NULL,
  phone text,
  dni text,
  product_name text NOT NULL,
  amount_due numeric(10,2) NOT NULL CHECK (amount_due >= 0),
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.debtors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated admins can manage debtors" ON public.debtors;
CREATE POLICY "Authenticated admins can manage debtors"
  ON public.debtors
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
