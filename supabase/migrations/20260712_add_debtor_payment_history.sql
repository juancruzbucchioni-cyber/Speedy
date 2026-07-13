ALTER TABLE public.debtors
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

UPDATE public.debtors
SET status = 'pending'
WHERE status IS NULL OR status = '';

CREATE INDEX IF NOT EXISTS idx_debtors_status_created_at
  ON public.debtors (status, created_at DESC);
