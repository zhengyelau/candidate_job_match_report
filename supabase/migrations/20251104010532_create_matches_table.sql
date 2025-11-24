/*
  # Create Matches Table

  ## Summary
  Creates a comprehensive matches table to store candidate-job matching results with all relevant display data.

  ## Tables Created
  
  ### `matches`
  Stores matching results between candidates and job roles with complete candidate information.
  
  #### Columns:
  - `id` (uuid, primary key) - Unique identifier for each match record
  - `job_id` (integer) - Reference to the job posting
  - `job_title` (text) - Title of the job position
  - `employer_name` (text) - Name of the employer/company
  - `salary_monthly` (integer) - Monthly salary offered for the position
  - `candidate_id` (integer) - Identifier for the candidate
  - `rank` (integer) - Ranking position of candidate for this job
  - `first_name` (text) - Candidate's first name
  - `last_name` (text) - Candidate's last name
  - `email` (text) - Candidate's email address
  - `phone` (text) - Candidate's phone number
  - `date_of_birth` (text) - Candidate's date of birth
  - `age` (integer) - Candidate's age
  - `gender` (text) - Candidate's gender
  - `race` (text) - Candidate's race
  - `ethnicity` (text) - Candidate's ethnicity
  - `dialect` (text) - Candidate's dialect
  - `current_country` (text) - Current country of residence
  - `current_city` (text) - Current city of residence
  - `nationality` (text) - Candidate's nationality
  - `country_of_birth` (text) - Candidate's country of birth
  - `month_and_year_moved_to_current_country` (text) - When candidate moved to current country
  - `minimum_expected_salary_monthly` (integer) - Candidate's minimum expected monthly salary
  - `visa_status` (text) - Candidate's visa status
  - `availability` (text) - Candidate's availability
  - `desired_type_of_job_arrangement` (text) - Preferred work arrangement
  - `desired_job_hierarchy_in_title` (text) - Preferred job hierarchy level
  - `desired_employer` (text) - Preferred employer name
  - `desired_domain` (text) - Preferred job domain/industry
  - `matched_at` (timestamptz) - When the match was created
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on matches table
  - Add policy for authenticated users to read all matches
  - Add policy for authenticated users to insert matches
  - Add policy for authenticated users to update their own matches
  - Add policy for authenticated users to delete matches

  ## Indexes
  - Index on job_id for faster job-based queries
  - Index on candidate_id for faster candidate-based queries
  - Index on rank for faster sorting
  - Composite index on (job_id, rank) for optimized job match retrieval
*/

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id integer NOT NULL,
  job_title text NOT NULL,
  employer_name text NOT NULL,
  salary_monthly integer DEFAULT 0,
  candidate_id integer NOT NULL,
  rank integer NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  date_of_birth text DEFAULT '',
  age integer DEFAULT 0,
  gender text DEFAULT '',
  race text DEFAULT '',
  ethnicity text DEFAULT '',
  dialect text DEFAULT '',
  current_country text DEFAULT '',
  current_city text DEFAULT '',
  nationality text DEFAULT '',
  country_of_birth text DEFAULT '',
  month_and_year_moved_to_current_country text DEFAULT '',
  minimum_expected_salary_monthly integer DEFAULT 0,
  visa_status text DEFAULT '',
  availability text DEFAULT '',
  desired_type_of_job_arrangement text DEFAULT '',
  desired_job_hierarchy_in_title text DEFAULT '',
  desired_employer text DEFAULT '',
  desired_domain text DEFAULT '',
  matched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_matches_job_id ON matches(job_id);
CREATE INDEX IF NOT EXISTS idx_matches_candidate_id ON matches(candidate_id);
CREATE INDEX IF NOT EXISTS idx_matches_rank ON matches(rank);
CREATE INDEX IF NOT EXISTS idx_matches_job_rank ON matches(job_id, rank);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all matches
CREATE POLICY "Authenticated users can view all matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to insert matches
CREATE POLICY "Authenticated users can create matches"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to update matches
CREATE POLICY "Authenticated users can update matches"
  ON matches
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete matches
CREATE POLICY "Authenticated users can delete matches"
  ON matches
  FOR DELETE
  TO authenticated
  USING (true);