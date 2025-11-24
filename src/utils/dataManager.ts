import { Candidate, Employer } from '../types';
import { supabase } from '../lib/supabase';

const CANDIDATES_KEY = 'hr_match_candidates';
const EMPLOYERS_KEY = 'hr_match_employers';

export function saveCandidates(candidates: Candidate[]): void {
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));
}

export function loadCandidates(): Candidate[] {
  const data = localStorage.getItem(CANDIDATES_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

export function saveEmployers(employers: Employer[]): void {
  localStorage.setItem(EMPLOYERS_KEY, JSON.stringify(employers));
}

export function loadEmployers(): Employer[] {
  const data = localStorage.getItem(EMPLOYERS_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

export async function saveCandidatesToDatabase(candidates: Candidate[]): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    const candidateRecords = candidates.map((candidate) => ({
      candidate_id: candidate.candidate_id,
      first_name: candidate.first_name,
      last_name: candidate.last_name,
      email: candidate.email,
      phone: candidate.phone,
      date_of_birth: candidate.date_of_birth,
      age: candidate.age,
      gender: candidate.gender,
      race: candidate.race,
      ethnicity: candidate.ethnicity,
      dialect: candidate.dialect,
      current_country: candidate.current_country,
      current_city: candidate.current_city,
      nationality: candidate.nationality,
      country_of_birth: candidate.country_of_birth,
      month_and_year_moved_to_current_country: candidate.month_and_year_moved_to_current_country,
      minimum_expected_salary_monthly: candidate.minimum_expected_salary_monthly,
      visa_status: candidate.visa_status,
      availability: candidate.availability,
      desired_type_of_job_arrangement: candidate.desired_type_of_job_arrangement,
      desired_job_hierarchy_in_title: candidate.desired_job_hierarchy_in_title,
      desired_employer: candidate.desired_employer,
      desired_domain: candidate.desired_domain,
    }));

    const { error } = await supabase
      .from('candidates')
      .insert(candidateRecords);

    if (error) {
      console.error('Error saving candidates to database:', error);
      return { success: false, error: error.message };
    }

    return { success: true, count: candidates.length };
  } catch (error) {
    console.error('Error saving candidates to database:', error);
    return { success: false, error: String(error) };
  }
}

export async function saveEmployersToDatabase(employers: Employer[]): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    const employerRecords = employers.map((employer) => ({
      job_id: employer.job_id,
      job_title: employer.job_title,
      employer_name: employer.employer_name,
      logo_url: employer.logo_url,
      elimination_criteria: employer.elimination_criteria,
      required_matching_criteria: employer.required_matching_criteria,
    }));

    const { error } = await supabase
      .from('employers')
      .insert(employerRecords);

    if (error) {
      console.error('Error saving employers to database:', error);
      return { success: false, error: error.message };
    }

    return { success: true, count: employers.length };
  } catch (error) {
    console.error('Error saving employers to database:', error);
    return { success: false, error: String(error) };
  }
}

export function importCandidatesFromJSON(jsonData: Candidate[]): boolean {
  try {
    if (!Array.isArray(jsonData)) {
      throw new Error('Invalid candidates data format');
    }
    saveCandidates(jsonData);
    return true;
  } catch (error) {
    console.error('Error importing candidates:', error);
    return false;
  }
}

export function importEmployersFromJSON(jsonData: Employer[]): boolean {
  try {
    if (!Array.isArray(jsonData)) {
      throw new Error('Invalid employers data format');
    }
    saveEmployers(jsonData);
    return true;
  } catch (error) {
    console.error('Error importing employers:', error);
    return false;
  }
}

export function clearAllData(): void {
  localStorage.removeItem(CANDIDATES_KEY);
  localStorage.removeItem(EMPLOYERS_KEY);
}
