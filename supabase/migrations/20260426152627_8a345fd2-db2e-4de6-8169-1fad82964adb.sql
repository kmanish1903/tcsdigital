
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Daily logs (one row per user per date)
CREATE TABLE public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  -- Spiritual / discipline (in order)
  naam_jap_count INT NOT NULL DEFAULT 0,        -- target 108
  naam_jap_done BOOLEAN NOT NULL DEFAULT false,
  hanuman_chalisa_count INT NOT NULL DEFAULT 0, -- target 3
  hanuman_chalisa_done BOOLEAN NOT NULL DEFAULT false,
  meditation BOOLEAN NOT NULL DEFAULT false,
  -- Learning
  dsa_problems INT NOT NULL DEFAULT 0,
  revision BOOLEAN NOT NULL DEFAULT false,
  react_learning BOOLEAN NOT NULL DEFAULT false,
  videos_today INT NOT NULL DEFAULT 0,
  -- Speaking
  mirror_speaking BOOLEAN NOT NULL DEFAULT false,
  jam_speaking BOOLEAN NOT NULL DEFAULT false,
  random_speaking INT NOT NULL DEFAULT 0,
  -- Fitness
  pushups INT NOT NULL DEFAULT 0,
  pullups INT NOT NULL DEFAULT 0,
  -- Notes
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own logs" ON public.daily_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own logs" ON public.daily_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own logs" ON public.daily_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own logs" ON public.daily_logs FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_daily_logs_user_date ON public.daily_logs(user_id, log_date DESC);

-- Curriculum progress
CREATE TABLE public.curriculum_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  percent INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, video_id)
);
ALTER TABLE public.curriculum_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own curriculum" ON public.curriculum_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own curriculum" ON public.curriculum_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own curriculum" ON public.curriculum_progress FOR UPDATE USING (auth.uid() = user_id);

-- Daily video completions log
CREATE TABLE public.daily_video_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  video_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date, video_id)
);
ALTER TABLE public.daily_video_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own video days" ON public.daily_video_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own video days" ON public.daily_video_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Updated-at trigger function
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER set_updated_at_logs BEFORE UPDATE ON public.daily_logs
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER set_updated_at_curr BEFORE UPDATE ON public.curriculum_progress
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
