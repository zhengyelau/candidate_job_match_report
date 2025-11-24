import { Candidate, Employer } from '../types';

function parseAgeRange(ageRange?: string): { min: number; max: number } | null {
  if (!ageRange) return null;
  const parts = ageRange.split('-');
  if (parts.length === 2) {
    return { min: parseInt(parts[0]), max: parseInt(parts[1]) };
  }
  return null;
}

function getAvailabilityHierarchy(availability: string): number {
  const hierarchy: { [key: string]: number } = {
    'immediate': 0,
    '1 week': 1,
    '2 weeks': 2,
    '1 month': 3,
    '2 months': 4,
    '3 months': 5,
  };
  return hierarchy[availability.toLowerCase()] ?? -1;
}

export function filterCandidates(
  candidates: Candidate[],
  selectedJob: Employer
): Candidate[] {
  return candidates.filter(candidate => {
    const ec = selectedJob.elimination_criteria;

    if (ec.age) {
      const ageRange = parseAgeRange(ec.age);
      if (ageRange && (candidate.age < ageRange.min || candidate.age > ageRange.max)) {
        return false;
      }
    }

    if (ec.ethnicity && ec.ethnicity !== 'Any' && candidate.ethnicity !== ec.ethnicity) {
      return false;
    }

    if (ec.race && ec.race !== 'Any' && candidate.race !== ec.race) {
      return false;
    }

    if (ec.religion && ec.religion !== 'Any' && candidate.religion !== ec.religion) {
      return false;
    }

    if (ec.nationality && ec.nationality !== 'Any' && candidate.nationality !== ec.nationality) {
      return false;
    }

    if (ec.country_of_birth && ec.country_of_birth !== 'Any' && candidate.country_of_birth !== ec.country_of_birth) {
      return false;
    }

    if (ec.current_country && ec.current_country !== 'Any' && candidate.current_country !== ec.current_country) {
      return false;
    }

    if (ec.salary_monthly && candidate.minimum_expected_salary_monthly > ec.salary_monthly) {
      return false;
    }

    if (ec.availability && ec.availability !== 'Any') {
      const requiredAvailability = getAvailabilityHierarchy(ec.availability);
      const candidateAvailability = getAvailabilityHierarchy(candidate.availability);
      if (candidateAvailability > requiredAvailability) {
        return false;
      }
    }

    if (ec.visa_status && ec.visa_status !== 'Any' && ec.visa_status.toLowerCase() !== 'work permit') {
      if (candidate.visa_status !== ec.visa_status) {
        return false;
      }
    }

    if (ec.job_arrangement && ec.job_arrangement !== 'Any' && candidate.desired_type_of_job_arrangement !== ec.job_arrangement) {
      return false;
    }

    return true;
  });
}
