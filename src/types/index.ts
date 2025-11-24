export interface Candidate {
  id?: string;
  candidate_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  age: number;
  race: string;
  ethnicity: string;
  dialect: string;
  religion?: string;
  country_of_birth: string;
  nationality: string;
  current_country: string;
  current_city: string;
  visa_status: string;
  month_and_year_moved_to_current_country: string;
  months_in_current_country?: number;
  availability: string;
  minimum_expected_salary_monthly: number;
  desired_type_of_job_arrangement: string;
  desired_job_hierarchy_in_title: string;
  desired_employer: string;
  desired_role?: string;
  desired_domain: string;
  desired_function?: string;
  desired_structural_skills?: string;
  desired_system?: string;
  profile_picture_url?: string;
  height_cm?: number;
  weight_kg?: number;
  fitness_level?: string;
  past_current_title?: string;
  past_current_motivation?: string;
  past_current_values?: string;
  past_current_hobbies?: string;
  past_current_talents?: string;
  past_current_education_subject?: string;
  past_current_university_major?: string;
  past_current_university_ranking?: string;
  past_current_role?: string;
  past_current_domain?: string;
  past_current_function?: string;
  past_current_structural_skills?: string;
  past_current_system?: string;
  past_current_hierarchy?: string;
  past_current_work_arrangement?: string;
  preferred_title?: string;
  preferred_motivation?: string;
  preferred_values?: string;
  preferred_hobbies?: string;
  preferred_talents?: string;
  preferred_role?: string;
  preferred_domain?: string;
  preferred_function?: string;
  preferred_structural_skills?: string;
  preferred_system?: string;
  preferred_hierarchy?: string;
  preferred_work_arrangement?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EliminationCriteria {
  age?: string;
  ethnicity?: string;
  race?: string;
  religion?: string;
  nationality?: string;
  country_of_birth?: string;
  current_country?: string;
  salary_monthly?: number;
  availability?: string;
  visa_status?: string;
  job_arrangement?: string;
}

export interface MatchingCriteriaFields {
  field1?: string;
  field2?: string;
  field3?: string;
}

export interface RequiredMatchingCriteria {
  motivation?: MatchingCriteriaFields;
  values?: MatchingCriteriaFields;
  hobbies?: MatchingCriteriaFields;
  talents?: MatchingCriteriaFields;
  education_subject?: MatchingCriteriaFields;
  university_major?: MatchingCriteriaFields;
  university_ranking?: MatchingCriteriaFields;
  role?: MatchingCriteriaFields;
  domain?: MatchingCriteriaFields;
  function?: MatchingCriteriaFields;
  structural_skills?: MatchingCriteriaFields;
  system?: MatchingCriteriaFields;
  hierarchy?: MatchingCriteriaFields;
}

export interface Employer {
  id?: string;
  job_id: number;
  logo_url?: string;
  job_title: string;
  employer_name: string;
  elimination_criteria: EliminationCriteria;
  required_matching_criteria: RequiredMatchingCriteria;
}

export interface MatchResult {
  candidate: Candidate;
  rank: number;
  matchingScore: number;
}
