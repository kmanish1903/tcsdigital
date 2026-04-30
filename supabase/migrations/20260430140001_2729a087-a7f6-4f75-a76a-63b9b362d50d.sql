
-- Brahmacharya journey (one row per user)
CREATE TABLE public.brahmacharya_journey (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  started_on DATE NOT NULL DEFAULT CURRENT_DATE,
  current_phase INTEGER NOT NULL DEFAULT 1,
  phase1_target INTEGER NOT NULL DEFAULT 30,
  phase2_target INTEGER NOT NULL DEFAULT 45,
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  total_clean_days INTEGER NOT NULL DEFAULT 0,
  total_slips INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.brahmacharya_journey ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own journey" ON public.brahmacharya_journey FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own journey" ON public.brahmacharya_journey FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own journey" ON public.brahmacharya_journey FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own journey" ON public.brahmacharya_journey FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER brahmacharya_journey_updated BEFORE UPDATE ON public.brahmacharya_journey FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Brahmacharya per-day log
CREATE TABLE public.brahmacharya_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  log_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'clean',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, log_date)
);
ALTER TABLE public.brahmacharya_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own b-days" ON public.brahmacharya_days FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own b-days" ON public.brahmacharya_days FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own b-days" ON public.brahmacharya_days FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own b-days" ON public.brahmacharya_days FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER brahmacharya_days_updated BEFORE UPDATE ON public.brahmacharya_days FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Coach chat messages
CREATE TABLE public.coach_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  coach_mode TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own coach msgs" ON public.coach_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own coach msgs" ON public.coach_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own coach msgs" ON public.coach_messages FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX coach_messages_user_created ON public.coach_messages(user_id, created_at);

-- Extend daily_logs
ALTER TABLE public.daily_logs
  ADD COLUMN IF NOT EXISTS energy INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS focus INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS urges INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pillar_wealth BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pillar_communication BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pillar_ethics BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pillar_influence BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pillar_power BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS evening_reflection JSONB;
