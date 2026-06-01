CREATE TABLE public.custom_log_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  field_key TEXT NOT NULL,
  label TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'checkbox',
  unit TEXT,
  target INTEGER,
  priority TEXT,
  section TEXT NOT NULL DEFAULT 'Custom',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, field_key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_log_fields TO authenticated;
GRANT ALL ON public.custom_log_fields TO service_role;

ALTER TABLE public.custom_log_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own custom fields" ON public.custom_log_fields
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own custom fields" ON public.custom_log_fields
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own custom fields" ON public.custom_log_fields
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own custom fields" ON public.custom_log_fields
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_custom_log_fields_updated_at
  BEFORE UPDATE ON public.custom_log_fields
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

ALTER TABLE public.daily_logs
  ADD COLUMN IF NOT EXISTS custom_values JSONB NOT NULL DEFAULT '{}'::jsonb;