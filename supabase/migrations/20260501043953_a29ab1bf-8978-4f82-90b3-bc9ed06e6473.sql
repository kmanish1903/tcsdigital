
CREATE TABLE public.saved_academy_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  section TEXT NOT NULL CHECK (section IN ('business', 'influence', 'conversation')),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_academy_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own saved items"
  ON public.saved_academy_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own saved items"
  ON public.saved_academy_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own saved items"
  ON public.saved_academy_items FOR DELETE
  USING (auth.uid() = user_id);
