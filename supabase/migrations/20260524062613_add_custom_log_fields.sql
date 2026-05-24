/*
  # Add custom log field definitions and storage

  1. New Tables
    - `custom_log_fields`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `field_key` (text, unique per user — slug-style identifier)
      - `label` (text — display name)
      - `field_type` (text — 'checkbox' | 'number' | 'text')
      - `unit` (text, nullable — e.g. 'min', 'reps', 'pages')
      - `target` (integer, nullable — target value for number fields)
      - `priority` (text, nullable — 'HIGH' | 'SADHANA' | null)
      - `sort_order` (integer — for ordering fields in the UI)
      - `section` (text — grouping section like 'Learning', 'Fitness', etc.)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Modified Tables
    - `daily_logs`
      - Add `custom_values` column (jsonb, default '{}')
        Stores arbitrary key-value pairs for custom fields, e.g.
        {"leetcode_streak": 5, "reading_pages": 12, "cold_shower": true}

  3. Security
    - Enable RLS on `custom_log_fields`
    - Users can only CRUD their own custom fields
    - `daily_logs.custom_values` is already protected by existing RLS
*/

-- Custom field definitions table
CREATE TABLE IF NOT EXISTS custom_log_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  field_key text NOT NULL,
  label text NOT NULL,
  field_type text NOT NULL DEFAULT 'checkbox' CHECK (field_type IN ('checkbox', 'number', 'text')),
  unit text,
  target integer,
  priority text CHECK (priority IS NULL OR priority IN ('HIGH', 'SADHANA')),
  sort_order integer NOT NULL DEFAULT 0,
  section text NOT NULL DEFAULT 'Custom',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, field_key)
);

ALTER TABLE custom_log_fields ENABLE ROW LEVEL SECURITY;

-- Users can manage their own custom fields
CREATE POLICY "Users can view own custom fields"
  ON custom_log_fields FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custom fields"
  ON custom_log_fields FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom fields"
  ON custom_log_fields FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom fields"
  ON custom_log_fields FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add custom_values column to daily_logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_logs' AND column_name = 'custom_values'
  ) THEN
    ALTER TABLE daily_logs ADD COLUMN custom_values jsonb DEFAULT '{}';
  END IF;
END $$;
