-- Add distraction & deep work columns to daily_logs
ALTER TABLE public.daily_logs
  ADD COLUMN IF NOT EXISTS instagram_minutes integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS youtube_minutes integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS phone_pickups integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deep_work_blocks integer NOT NULL DEFAULT 0;

-- AI reflections table
CREATE TABLE IF NOT EXISTS public.ai_reflections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  log_date date NOT NULL,
  feedback_te text,
  feedback_hi text,
  feedback_en text,
  focus_question text,
  daily_score integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);

ALTER TABLE public.ai_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own reflections"
  ON public.ai_reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own reflections"
  ON public.ai_reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own reflections"
  ON public.ai_reflections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own reflections"
  ON public.ai_reflections FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_ai_reflections_updated_at
  BEFORE UPDATE ON public.ai_reflections
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();