/*
  # DataFlow AI Initial Schema

  1. New Tables
    - `profiles` - Extended user information linked to auth.users
      - `id` (uuid, primary key, references auth.users)
      - `company_id` (uuid, references companies)
      - `full_name` (text)
      - `role` (text, enum: admin, supervisor, worker)
      - `avatar_url` (text)
      - `created_at`, `updated_at` (timestamps)
    
    - `companies` - Enterprise accounts
      - `id` (uuid, primary key)
      - `name` (text)
      - `plan` (text: free, pro, enterprise)
      - `max_automations` (integer)
      - `max_employees` (integer)
      - `settings` (jsonb)
      - `created_at`, `updated_at` (timestamps)
    
    - `documents` - Uploaded documents for processing
      - `id` (uuid, primary key)
      - `company_id` (uuid, references companies)
      - `uploaded_by` (uuid, references profiles)
      - `filename` (text)
      - `file_type` (text: pdf, image, excel, csv, other)
      - `file_size` (bigint)
      - `file_url` (text)
      - `status` (text: pending, processing, completed, error)
      - `extracted_data` (jsonb)
      - `ai_summary` (text)
      - `created_at` (timestamp)
    
    - `automations` - Automation tasks and history
      - `id` (uuid, primary key)
      - `company_id` (uuid, references companies)
      - `created_by` (uuid, references profiles)
      - `type` (text: ocr_extract, form_fill, invoice_process, email_organize, document_classify, data_convert)
      - `name` (text)
      - `description` (text)
      - `status` (text: pending, running, completed, failed)
      - `input_data` (jsonb)
      - `output_data` (jsonb)
      - `documents_processed` (integer)
      - `time_saved_seconds` (integer)
      - `error_message` (text)
      - `started_at`, `completed_at`, `created_at` (timestamps)
    
    - `activities` - System activity log
      - `id` (uuid, primary key)
      - `company_id` (uuid, references companies)
      - `user_id` (uuid, references profiles)
      - `type` (text)
      - `description` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Policies restrict access to company members only
    - Admins have full access, supervisors can manage, workers have limited access
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  max_automations integer DEFAULT 100,
  max_employees integer DEFAULT 5,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  full_name text DEFAULT '',
  role text NOT NULL DEFAULT 'worker' CHECK (role IN ('admin', 'supervisor', 'worker')),
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  filename text NOT NULL,
  file_type text NOT NULL DEFAULT 'other' CHECK (file_type IN ('pdf', 'image', 'excel', 'csv', 'other')),
  file_size bigint DEFAULT 0,
  file_url text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  extracted_data jsonb DEFAULT '{}'::jsonb,
  ai_summary text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create automations table
CREATE TABLE IF NOT EXISTS automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('ocr_extract', 'form_fill', 'invoice_process', 'email_organize', 'document_classify', 'data_convert', 'report_generate')),
  name text NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  input_data jsonb DEFAULT '{}'::jsonb,
  output_data jsonb DEFAULT '{}'::jsonb,
  documents_processed integer DEFAULT 0,
  time_saved_seconds integer DEFAULT 0,
  error_message text DEFAULT '',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  type text NOT NULL,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's company
CREATE OR REPLACE FUNCTION get_user_company()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid();
$$;

-- Helper function to check if user is company member
CREATE OR REPLACE FUNCTION is_company_member(company_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND profiles.company_id = company_id
  );
$$;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION has_role(required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND (
      (required_role = 'supervisor' AND role IN ('admin', 'supervisor'))
      OR (required_role = 'admin' AND role = 'admin')
      OR (required_role = 'worker' AND role IN ('admin', 'supervisor', 'worker'))
    )
  );
$$;

-- Companies RLS policies
CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  TO authenticated
  USING (id = get_user_company());

CREATE POLICY "Admins can update own company"
  ON companies FOR UPDATE
  TO authenticated
  USING (id = get_user_company() AND has_role('admin'))
  WITH CHECK (id = get_user_company() AND has_role('admin'));

-- Profiles RLS policies
CREATE POLICY "Users can view profiles in own company"
  ON profiles FOR SELECT
  TO authenticated
  USING (company_id = get_user_company());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Documents RLS policies
CREATE POLICY "Company members can view documents"
  ON documents FOR SELECT
  TO authenticated
  USING (is_company_member(company_id));

CREATE POLICY "Company workers can insert documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (is_company_member(company_id));

CREATE POLICY "Company members can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (is_company_member(company_id))
  WITH CHECK (is_company_member(company_id));

CREATE POLICY "Admins and supervisors can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (is_company_member(company_id) AND has_role('supervisor'));

-- Automations RLS policies
CREATE POLICY "Company members can view automations"
  ON automations FOR SELECT
  TO authenticated
  USING (is_company_member(company_id));

CREATE POLICY "Company workers can create automations"
  ON automations FOR INSERT
  TO authenticated
  WITH CHECK (is_company_member(company_id));

CREATE POLICY "Company members can update automations"
  ON automations FOR UPDATE
  TO authenticated
  USING (is_company_member(company_id))
  WITH CHECK (is_company_member(company_id));

CREATE POLICY "Admins can delete automations"
  ON automations FOR DELETE
  TO authenticated
  USING (is_company_member(company_id) AND has_role('admin'));

-- Activities RLS policies
CREATE POLICY "Company members can view activities"
  ON activities FOR SELECT
  TO authenticated
  USING (is_company_member(company_id));

CREATE POLICY "Company members can create activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (is_company_member(company_id));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_company_id ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_automations_company_id ON automations(company_id);
CREATE INDEX IF NOT EXISTS idx_automations_status ON automations(status);
CREATE INDEX IF NOT EXISTS idx_automations_created_at ON automations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_company_id ON activities(company_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_companies_updated_at') THEN
    CREATE TRIGGER update_companies_updated_at
      BEFORE UPDATE ON companies
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;