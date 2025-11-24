/*
  # Update Employers Table for New JSON Format

  1. Changes
    - Add job_id column (integer)
    - Add logo_url column (text)
    - Add elimination_criteria column (jsonb) to store elimination criteria
    - Add required_matching_criteria column (jsonb) to store matching criteria
    - Keep existing columns for backward compatibility

  2. Purpose
    - Support the new employer JSON format with elimination_criteria and required_matching_criteria
    - Enable flexible filtering based on multiple criteria fields
    - Maintain data integrity with proper column types

  3. Notes
    - job_id is added for easier identification
    - elimination_criteria stores age, ethnicity, race, religion, nationality, etc.
    - required_matching_criteria stores motivation, values, hobbies, talents, education, etc.
*/

-- Add new columns to employers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'employers' AND column_name = 'job_id'
  ) THEN
    ALTER TABLE employers ADD COLUMN job_id integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'employers' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE employers ADD COLUMN logo_url text DEFAULT ''::text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'employers' AND column_name = 'elimination_criteria'
  ) THEN
    ALTER TABLE employers ADD COLUMN elimination_criteria jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'employers' AND column_name = 'required_matching_criteria'
  ) THEN
    ALTER TABLE employers ADD COLUMN required_matching_criteria jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create index on job_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_employers_job_id ON employers(job_id);

-- Create index on elimination_criteria for faster jsonb queries
CREATE INDEX IF NOT EXISTS idx_employers_elimination_criteria ON employers USING gin(elimination_criteria);

-- Create index on required_matching_criteria for faster jsonb queries
CREATE INDEX IF NOT EXISTS idx_employers_required_matching_criteria ON employers USING gin(required_matching_criteria);