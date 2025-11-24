import { Candidate, Employer } from '../types';

function parseFieldValues(field?: string): string[] {
  if (!field) return [];
  return field.split(',').map(v => v.trim()).filter(v => v.length > 0);
}

function countMatches(candidateValues: string[], requiredValues: string[]): number {
  if (requiredValues.length === 0) return 0;

  const candidateLower = candidateValues.map(v => v.toLowerCase());
  const requiredLower = requiredValues.map(v => v.toLowerCase());

  return requiredLower.filter(req => candidateLower.includes(req)).length;
}

function calculateCategoryScore(
  candidatePastCurrent: string | undefined,
  candidatePreferred: string | undefined,
  criteriaField: string | undefined
): number {
  if (!criteriaField) return 0;

  let score = 0;

  const pastMatches = countMatches(
    parseFieldValues(candidatePastCurrent),
    parseFieldValues(criteriaField)
  );
  score += pastMatches * 3;

  const preferredMatches = countMatches(
    parseFieldValues(candidatePreferred),
    parseFieldValues(criteriaField)
  );
  score += preferredMatches * 1;

  return score;
}

export function calculateMatchingScore(candidate: Candidate, employer: Employer): number {
  let score = 0;
  const rmc = employer.required_matching_criteria;

  if (rmc.motivation) {
    score += calculateCategoryScore(candidate.past_current_motivation, candidate.preferred_motivation, rmc.motivation.field1);
    score += calculateCategoryScore(candidate.past_current_motivation, candidate.preferred_motivation, rmc.motivation.field2);
    score += calculateCategoryScore(candidate.past_current_motivation, candidate.preferred_motivation, rmc.motivation.field3);
  }

  if (rmc.values) {
    score += calculateCategoryScore(candidate.past_current_values, candidate.preferred_values, rmc.values.field1);
    score += calculateCategoryScore(candidate.past_current_values, candidate.preferred_values, rmc.values.field2);
    score += calculateCategoryScore(candidate.past_current_values, candidate.preferred_values, rmc.values.field3);
  }

  if (rmc.hobbies) {
    score += calculateCategoryScore(candidate.past_current_hobbies, candidate.preferred_hobbies, rmc.hobbies.field1);
    score += calculateCategoryScore(candidate.past_current_hobbies, candidate.preferred_hobbies, rmc.hobbies.field2);
    score += calculateCategoryScore(candidate.past_current_hobbies, candidate.preferred_hobbies, rmc.hobbies.field3);
  }

  if (rmc.talents) {
    score += calculateCategoryScore(candidate.past_current_talents, candidate.preferred_talents, rmc.talents.field1);
    score += calculateCategoryScore(candidate.past_current_talents, candidate.preferred_talents, rmc.talents.field2);
    score += calculateCategoryScore(candidate.past_current_talents, candidate.preferred_talents, rmc.talents.field3);
  }

  if (rmc.education_subject) {
    score += calculateCategoryScore(candidate.past_current_education_subject, candidate.preferred_role, rmc.education_subject.field1);
    score += calculateCategoryScore(candidate.past_current_education_subject, candidate.preferred_role, rmc.education_subject.field2);
    score += calculateCategoryScore(candidate.past_current_education_subject, candidate.preferred_role, rmc.education_subject.field3);
  }

  if (rmc.university_major) {
    score += calculateCategoryScore(candidate.past_current_university_major, candidate.preferred_domain, rmc.university_major.field1);
    score += calculateCategoryScore(candidate.past_current_university_major, candidate.preferred_domain, rmc.university_major.field2);
    score += calculateCategoryScore(candidate.past_current_university_major, candidate.preferred_domain, rmc.university_major.field3);
  }

  if (rmc.university_ranking) {
    score += calculateCategoryScore(candidate.past_current_university_ranking, candidate.preferred_function, rmc.university_ranking.field1);
    score += calculateCategoryScore(candidate.past_current_university_ranking, candidate.preferred_function, rmc.university_ranking.field2);
    score += calculateCategoryScore(candidate.past_current_university_ranking, candidate.preferred_function, rmc.university_ranking.field3);
  }

  if (rmc.role) {
    score += calculateCategoryScore(candidate.past_current_role, candidate.preferred_role, rmc.role.field1);
    score += calculateCategoryScore(candidate.past_current_role, candidate.preferred_role, rmc.role.field2);
    score += calculateCategoryScore(candidate.past_current_role, candidate.preferred_role, rmc.role.field3);
  }

  if (rmc.domain) {
    score += calculateCategoryScore(candidate.past_current_domain, candidate.preferred_domain, rmc.domain.field1);
    score += calculateCategoryScore(candidate.past_current_domain, candidate.preferred_domain, rmc.domain.field2);
    score += calculateCategoryScore(candidate.past_current_domain, candidate.preferred_domain, rmc.domain.field3);
  }

  if (rmc.function) {
    score += calculateCategoryScore(candidate.past_current_function, candidate.preferred_function, rmc.function.field1);
    score += calculateCategoryScore(candidate.past_current_function, candidate.preferred_function, rmc.function.field2);
    score += calculateCategoryScore(candidate.past_current_function, candidate.preferred_function, rmc.function.field3);
  }

  if (rmc.structural_skills) {
    score += calculateCategoryScore(candidate.past_current_structural_skills, candidate.preferred_structural_skills, rmc.structural_skills.field1);
    score += calculateCategoryScore(candidate.past_current_structural_skills, candidate.preferred_structural_skills, rmc.structural_skills.field2);
    score += calculateCategoryScore(candidate.past_current_structural_skills, candidate.preferred_structural_skills, rmc.structural_skills.field3);
  }

  if (rmc.system) {
    score += calculateCategoryScore(candidate.past_current_system, candidate.preferred_system, rmc.system.field1);
    score += calculateCategoryScore(candidate.past_current_system, candidate.preferred_system, rmc.system.field2);
    score += calculateCategoryScore(candidate.past_current_system, candidate.preferred_system, rmc.system.field3);
  }

  if (rmc.hierarchy) {
    score += calculateCategoryScore(candidate.past_current_hierarchy, candidate.preferred_hierarchy, rmc.hierarchy.field1);
    score += calculateCategoryScore(candidate.past_current_hierarchy, candidate.preferred_hierarchy, rmc.hierarchy.field2);
    score += calculateCategoryScore(candidate.past_current_hierarchy, candidate.preferred_hierarchy, rmc.hierarchy.field3);
  }

  return score;
}
