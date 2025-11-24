import { supabase } from '../lib/supabase';
import { MatchResult, Employer } from '../types';

export interface MatchRecord {
  job_id: number;
  job_title: string;
  employer_name: string;
  salary_monthly: number;
  candidate_id: number;
  rank: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  age: number;
  gender: string;
  race: string;
  ethnicity: string;
  dialect: string;
  current_country: string;
  current_city: string;
  nationality: string;
  country_of_birth: string;
  month_and_year_moved_to_current_country: string;
  minimum_expected_salary_monthly: number;
  visa_status: string;
  availability: string;
  desired_type_of_job_arrangement: string;
  desired_job_hierarchy_in_title: string;
  desired_employer: string;
  desired_domain: string;
  desired_role?: string;
  desired_function?: string;
  desired_structure?: string;
  desired_system?: string;
}

export async function saveMatchesToDatabase(
  matchResults: MatchResult[],
  selectedJob: Employer
): Promise<{ success: boolean; error?: string }> {
  try {
    const matchRecords: MatchRecord[] = matchResults.map((result) => ({
      job_id: selectedJob.job_id,
      job_title: selectedJob.job_title,
      employer_name: selectedJob.employer_name,
      salary_monthly: selectedJob.elimination_criteria.salary_monthly || 0,
      candidate_id: result.candidate.candidate_id,
      rank: result.rank,
      first_name: result.candidate.first_name,
      last_name: result.candidate.last_name,
      email: result.candidate.email,
      phone: result.candidate.phone,
      date_of_birth: result.candidate.date_of_birth,
      age: result.candidate.age,
      gender: result.candidate.gender,
      race: result.candidate.race,
      ethnicity: result.candidate.ethnicity,
      dialect: result.candidate.dialect,
      current_country: result.candidate.current_country,
      current_city: result.candidate.current_city,
      nationality: result.candidate.nationality,
      country_of_birth: result.candidate.country_of_birth,
      month_and_year_moved_to_current_country: result.candidate.month_and_year_moved_to_current_country,
      minimum_expected_salary_monthly: result.candidate.minimum_expected_salary_monthly,
      visa_status: result.candidate.visa_status,
      availability: result.candidate.availability,
      desired_type_of_job_arrangement: result.candidate.desired_type_of_job_arrangement,
      desired_job_hierarchy_in_title: result.candidate.desired_job_hierarchy_in_title,
      desired_employer: result.candidate.desired_employer,
      desired_domain: result.candidate.desired_domain,
      desired_role: result.candidate.desired_role,
      desired_function: result.candidate.desired_function,
      desired_structure: result.candidate.desired_structural_skills,
      desired_system: result.candidate.desired_system,
    }));

    const { error } = await supabase
      .from('matches')
      .insert(matchRecords);

    if (error) {
      console.error('Error saving matches:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving matches:', error);
    return { success: false, error: String(error) };
  }
}

export async function getMatchesForJob(jobId: number): Promise<MatchResult[]> {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('job_id', jobId)
      .order('rank', { ascending: true });

    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    return data.map((match) => ({
      candidate: {
        candidate_id: match.candidate_id,
        first_name: match.first_name,
        last_name: match.last_name,
        email: match.email,
        phone: match.phone,
        date_of_birth: match.date_of_birth,
        age: match.age,
        gender: match.gender,
        race: match.race,
        ethnicity: match.ethnicity,
        dialect: match.dialect,
        current_country: match.current_country,
        current_city: match.current_city,
        nationality: match.nationality,
        country_of_birth: match.country_of_birth,
        month_and_year_moved_to_current_country: match.month_and_year_moved_to_current_country,
        minimum_expected_salary_monthly: match.minimum_expected_salary_monthly,
        visa_status: match.visa_status,
        availability: match.availability,
        desired_type_of_job_arrangement: match.desired_type_of_job_arrangement,
        desired_job_hierarchy_in_title: match.desired_job_hierarchy_in_title,
        desired_employer: match.desired_employer,
        desired_domain: match.desired_domain,
        desired_role: match.desired_role,
        desired_function: match.desired_function,
        desired_structural_skills: match.desired_structure,
        desired_system: match.desired_system,
      },
      rank: match.rank,
    }));
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

export async function deleteMatchesForJob(jobId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('job_id', jobId);

    if (error) {
      console.error('Error deleting matches:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting matches:', error);
    return { success: false, error: String(error) };
  }
}

export async function getAllMatches(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('matched_at', { ascending: false });

    if (error) {
      console.error('Error fetching all matches:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all matches:', error);
    return [];
  }
}
