ALTER TABLE public.daily_logs
  ADD COLUMN IF NOT EXISTS anulom_vilom boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS temple_visit boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS fasting boolean NOT NULL DEFAULT false;