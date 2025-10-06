/*
  # AI Reporting Platform - Initial Database Schema

  ## Overview
  This migration creates the complete database schema for the AI reporting platform,
  including user management, file storage, column mappings, credit system, and reports.

  ## New Tables

  ### 1. profiles
  Extends auth.users with additional user information
  - id (uuid, FK to auth.users)
  - first_name (text)
  - last_name (text)
  - created_at (timestamptz)
  - updated_at (timestamptz)

  ### 2. uploaded_files
  Stores metadata about uploaded files
  - id (bigserial, PK)
  - user_id (uuid, FK to auth.users)
  - file_name (text)
  - file_type (text) - xlsx, csv, pdf
  - file_size (bigint) - in bytes
  - storage_path (text) - path in Supabase storage
  - status (text) - uploaded, processing, analyzed, error
  - uploaded_at (timestamptz)
  - updated_at (timestamptz)

  ### 3. file_column_mappings
  Maps source columns to target fields
  - id (bigserial, PK)
  - file_id (bigint, FK to uploaded_files)
  - source_column (text) - original column name from file
  - target_field (text) - mapped field name
  - created_at (timestamptz)

  ### 4. credit_transactions
  Tracks credit balance and transactions
  - id (bigserial, PK)
  - user_id (uuid, FK to auth.users)
  - amount (integer) - positive for credit, negative for debit
  - transaction_type (text) - purchase, analysis, refund
  - description (text)
  - created_at (timestamptz)

  ### 5. analysis_reports
  Stores AI analysis results
  - id (bigserial, PK)
  - file_id (bigint, FK to uploaded_files)
  - user_id (uuid, FK to auth.users)
  - report_data (jsonb) - analysis results from AI
  - row_count (integer)
  - column_count (integer)
  - created_at (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated users required for all operations
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create uploaded_files table
CREATE TABLE IF NOT EXISTS uploaded_files (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  storage_path text NOT NULL,
  status text DEFAULT 'uploaded',
  uploaded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create file_column_mappings table
CREATE TABLE IF NOT EXISTS file_column_mappings (
  id bigserial PRIMARY KEY,
  file_id bigint NOT NULL REFERENCES uploaded_files(id) ON DELETE CASCADE,
  source_column text NOT NULL,
  target_field text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  transaction_type text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create analysis_reports table
CREATE TABLE IF NOT EXISTS analysis_reports (
  id bigserial PRIMARY KEY,
  file_id bigint NOT NULL REFERENCES uploaded_files(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_data jsonb DEFAULT '{}',
  row_count integer DEFAULT 0,
  column_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_column_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for uploaded_files
CREATE POLICY "Users can view own files"
  ON uploaded_files FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files"
  ON uploaded_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files"
  ON uploaded_files FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own files"
  ON uploaded_files FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for file_column_mappings
CREATE POLICY "Users can view own file mappings"
  ON file_column_mappings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM uploaded_files
      WHERE uploaded_files.id = file_column_mappings.file_id
      AND uploaded_files.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own file mappings"
  ON file_column_mappings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM uploaded_files
      WHERE uploaded_files.id = file_column_mappings.file_id
      AND uploaded_files.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own file mappings"
  ON file_column_mappings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM uploaded_files
      WHERE uploaded_files.id = file_column_mappings.file_id
      AND uploaded_files.user_id = auth.uid()
    )
  );

-- RLS Policies for credit_transactions
CREATE POLICY "Users can view own credit transactions"
  ON credit_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit transactions"
  ON credit_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for analysis_reports
CREATE POLICY "Users can view own reports"
  ON analysis_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON analysis_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON analysis_reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_uploaded_files_user_id ON uploaded_files(user_id);
CREATE INDEX IF NOT EXISTS idx_file_column_mappings_file_id ON file_column_mappings(file_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_file_id ON analysis_reports(file_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_user_id ON analysis_reports(user_id);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploaded-files', 'uploaded-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'uploaded-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'uploaded-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'uploaded-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', '')
  );
  
  -- Give new users 100 credits
  INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
  VALUES (new.id, 100, 'purchase', 'Welcome bonus');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user credit balance
CREATE OR REPLACE FUNCTION public.get_user_credit_balance(user_uuid uuid)
RETURNS integer AS $$
  SELECT COALESCE(SUM(amount), 0)::integer
  FROM credit_transactions
  WHERE user_id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER;