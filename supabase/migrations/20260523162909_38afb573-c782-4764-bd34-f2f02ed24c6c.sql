
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS goal_title text,
  ADD COLUMN IF NOT EXISTS goal_description text,
  ADD COLUMN IF NOT EXISTS goal_image_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('goal-images', 'goal-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Goal images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'goal-images');

CREATE POLICY "Users upload own goal image"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'goal-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own goal image"
ON storage.objects FOR UPDATE
USING (bucket_id = 'goal-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own goal image"
ON storage.objects FOR DELETE
USING (bucket_id = 'goal-images' AND auth.uid()::text = (storage.foldername(name))[1]);
