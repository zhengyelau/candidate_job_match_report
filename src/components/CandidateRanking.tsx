import { useState, useEffect } from 'react';
import { MatchResult, Employer } from '../types';
import { ChevronRight, ChevronDown, User, CheckCircle2, ShoppingCart } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';
import { CandidateDistributionChart } from './CandidateDistributionChart';
import { SalaryDistributionChart } from './SalaryDistributionChart';
import { AgeDistributionChart } from './AgeDistributionChart';
import { AvailabilityDistributionChart } from './AvailabilityDistributionChart';
import { EducationDistributionChart } from './EducationDistributionChart';
import { UniversityMajorDistributionChart } from './UniversityMajorDistributionChart';
import { FunctionalSkillsDistributionChart } from './FunctionalSkillsDistributionChart';
import { DomainKnowledgeDistributionChart } from './DomainKnowledgeDistributionChart';

interface CandidateRankingProps {
  results: MatchResult[];
  employer: Employer;
}

export function CandidateRanking({ results, employer }: CandidateRankingProps) {
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<number>>(new Set());
  const [selectedCandidatesForCheckout, setSelectedCandidatesForCheckout] = useState<Set<number>>(new Set());
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCandidateClick = (candidateId: number) => {
    const newSelected = new Set(selectedCandidateIds);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      newSelected.add(candidateId);
    }
    setSelectedCandidateIds(newSelected);
  };

  const toggleCandidateForCheckout = (candidateId: number) => {
    const newSelected = new Set(selectedCandidatesForCheckout);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      newSelected.add(candidateId);
    }
    setSelectedCandidatesForCheckout(newSelected);
  };

  const getSelectedCandidateResults = () => {
    return results.filter(result => selectedCandidatesForCheckout.has(result.candidate.candidate_id));
  };

  const getSelectedCandidatesDetails = () => {
    return results.filter(result => selectedCandidateIds.has(result.candidate.candidate_id));
  };

  // Rest of your existing code remains the same...
  const parseFieldValues = (field?: string): string[] => {
    if (!field) return [];
    return field.split(',').map(v => v.trim()).filter(v => v.length > 0);
  };

  const calculateCategoryScore = (
    candidatePastCurrent: string | undefined,
    candidatePreferred: string | undefined,
    criteriaField: string | undefined
  ): number => {
    if (!criteriaField) return 0;

    const countMatches = (candidateValues: string[], requiredValues: string[]): number => {
      if (requiredValues.length === 0) return 0;
      const candidateLower = candidateValues.map(v => v.toLowerCase());
      const requiredLower = requiredValues.map(v => v.toLowerCase());
      return requiredLower.filter(req => candidateLower.includes(req)).length;
    };

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
  };

  const findMatches = (candidateValues: string[], requiredValues: string[]): string[] => {
    if (requiredValues.length === 0 || candidateValues.length === 0) return [];
    const candidateLower = candidateValues.map(v => v.toLowerCase());
    const requiredLower = requiredValues.map(v => v.toLowerCase());
    return requiredValues.filter((req, idx) => candidateLower.includes(requiredLower[idx]));
  };

  const calculateMaxPossibleScore = () => {
    const rmc = employer.required_matching_criteria;
    let maxScore = 0;

    const calculateCategoryMaxScore = (criteriaFields?: { field1?: string; field2?: string; field3?: string }) => {
      if (!criteriaFields) return 0;

      const allCriteriaFields = [criteriaFields.field1, criteriaFields.field2, criteriaFields.field3].filter(Boolean) as string[];
      const allCriteriaValues = allCriteriaFields.flatMap(field => parseFieldValues(field));

      return allCriteriaValues.length * 3;
    };

    maxScore += calculateCategoryMaxScore(rmc.motivation);
    maxScore += calculateCategoryMaxScore(rmc.values);
    maxScore += calculateCategoryMaxScore(rmc.hobbies);
    maxScore += calculateCategoryMaxScore(rmc.talents);
    maxScore += calculateCategoryMaxScore(rmc.education_subject);
    maxScore += calculateCategoryMaxScore(rmc.university_major);
    maxScore += calculateCategoryMaxScore(rmc.university_ranking);
    maxScore += calculateCategoryMaxScore(rmc.role);
    maxScore += calculateCategoryMaxScore(rmc.domain);
    maxScore += calculateCategoryMaxScore(rmc.function);
    maxScore += calculateCategoryMaxScore(rmc.structural_skills);
    maxScore += calculateCategoryMaxScore(rmc.system);
    maxScore += calculateCategoryMaxScore(rmc.hierarchy);

    return maxScore;
  };

  const getDetailedMatches = (result: MatchResult) => {
    const rmc = employer.required_matching_criteria;
    const groupedMatches: { pastCurrent: Array<{ category: string; matchedItems: string[]; score: number }>; preferred: Array<{ category: string; matchedItems: string[]; score: number }> } = {
      pastCurrent: [],
      preferred: []
    };

    const processCategory = (categoryName: string, candidatePast?: string, candidatePreferred?: string, criteriaFields?: { field1?: string; field2?: string; field3?: string }) => {
      if (!criteriaFields) return;

      const allCriteriaFields = [criteriaFields.field1, criteriaFields.field2, criteriaFields.field3].filter(Boolean) as string[];
      const allCriteriaValues = allCriteriaFields.flatMap(field => parseFieldValues(field));

      if (candidatePast) {
        const pastMatches = findMatches(parseFieldValues(candidatePast), allCriteriaValues);
        if (pastMatches.length > 0) {
          groupedMatches.pastCurrent.push({
            category: categoryName,
            matchedItems: pastMatches,
            score: pastMatches.length * 3
          });
        }
      }

      if (candidatePreferred) {
        const preferredMatches = findMatches(parseFieldValues(candidatePreferred), allCriteriaValues);
        if (preferredMatches.length > 0) {
          groupedMatches.preferred.push({
            category: categoryName,
            matchedItems: preferredMatches,
            score: preferredMatches.length * 1
          });
        }
      }
    };

    processCategory('Motivation', result.candidate.past_current_motivation, result.candidate.preferred_motivation, rmc.motivation);
    processCategory('Values', result.candidate.past_current_values, result.candidate.preferred_values, rmc.values);
    processCategory('Hobbies', result.candidate.past_current_hobbies, result.candidate.preferred_hobbies, rmc.hobbies);
    processCategory('Talents', result.candidate.past_current_talents, result.candidate.preferred_talents, rmc.talents);
    processCategory('Education Subject', result.candidate.past_current_education_subject, undefined, rmc.education_subject);
    processCategory('University Major', result.candidate.past_current_university_major, undefined, rmc.university_major);
    processCategory('University Ranking', result.candidate.past_current_university_ranking, undefined, rmc.university_ranking);
    processCategory('Role', result.candidate.past_current_role, result.candidate.preferred_role, rmc.role);
    processCategory('Domain', result.candidate.past_current_domain, result.candidate.preferred_domain, rmc.domain);
    processCategory('Function', result.candidate.past_current_function, result.candidate.preferred_function, rmc.function);
    processCategory('Structural Skills', result.candidate.past_current_structural_skills, result.candidate.preferred_structural_skills, rmc.structural_skills);
    processCategory('System', result.candidate.past_current_system, result.candidate.preferred_system, rmc.system);
    processCategory('Hierarchy', result.candidate.past_current_hierarchy, result.candidate.preferred_hierarchy, rmc.hierarchy);

    return groupedMatches;
  };

  const maxPossibleScore = calculateMaxPossibleScore();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <CandidateDistributionChart
          results={results}
          maxPossibleScore={maxPossibleScore}
          onCandidateClick={handleCandidateClick}
          selectedCandidateIds={selectedCandidateIds}
        />
  
        <SalaryDistributionChart
          results={results}
          onCandidateClick={handleCandidateClick}
          selectedCandidateIds={selectedCandidateIds}
        />
  
        <AgeDistributionChart
          results={results}
          onCandidateClick={handleCandidateClick}
          selectedCandidateIds={selectedCandidateIds}
        />
  
        <AvailabilityDistributionChart
          results={results}
          onCandidateClick={handleCandidateClick}
          selectedCandidateIds={selectedCandidateIds}
        />
  
        <EducationDistributionChart
          results={results}
          onCandidateClick={handleCandidateClick}
          selectedCandidateIds={selectedCandidateIds}
        />
  
        <UniversityMajorDistributionChart
          results={results}
          onCandidateClick={handleCandidateClick}
          selectedCandidateIds={selectedCandidateIds}
        />
  
        <FunctionalSkillsDistributionChart
          results={results}
          onCandidateClick={handleCandidateClick}
          selectedCandidateIds={selectedCandidateIds}
        />
  
        <DomainKnowledgeDistributionChart
          results={results}
          onCandidateClick={handleCandidateClick}
          selectedCandidateIds={selectedCandidateIds}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        {selectedCandidateIds.size === 0 ? (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">
              <User className="w-8 h-8 mx-auto opacity-50" />
            </div>
            <p className="text-slate-600 text-sm">Click on the dots in any histogram above to view candidate details</p>
          </div>
        ) : (
          <div>
            <div className="space-y-3 mt-4">
              {getSelectedCandidatesDetails().map((result) => (
                <div key={result.candidate.candidate_id} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-md border border-slate-200 overflow-hidden">
                  <div className="p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">{result.candidate.first_name} {result.candidate.last_name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600 text-sm font-medium">Rank:</span>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                              {result.rank}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCandidateClick(result.candidate.candidate_id)}
                        className="px-3 py-1 text-slate-700 hover:bg-slate-200 rounded transition-colors font-medium text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="bg-purple-50 rounded-md p-3 border border-purple-200">
                      <h4 className="text-base font-bold text-slate-900 mb-2">Matching Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-slate-600 text-xs mb-1">Match Score</div>
                            <div className="text-xl font-bold text-purple-600">{result.matchingScore} / {maxPossibleScore}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-600 text-xs mb-1">Percentage</div>
                            <div className="text-xl font-bold text-purple-600">{((result.matchingScore / maxPossibleScore) * 100).toFixed(1)}%</div>
                          </div>
                        </div>

                        <div className="border-t border-purple-200 pt-2">
                          <div className="text-slate-700 font-semibold text-xs mb-2">What Matched</div>
                          <div>
                            {(() => {
                              const matches = getDetailedMatches(result);
                              const hasPastCurrent = matches.pastCurrent.length > 0;
                              const hasPreferred = matches.preferred.length > 0;

                              if (!hasPastCurrent && !hasPreferred) {
                                return <div className="text-slate-500 text-xs">No matches found</div>;
                              }

                              return (
                                <div className="space-y-2">
                                  {hasPastCurrent && (
                                    <div>
                                      <div className="text-xs font-semibold text-slate-600 uppercase mb-1">Past & Current</div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                                        {matches.pastCurrent.map((match, idx) => (
                                          <div key={idx} className="bg-white rounded p-2 border border-purple-100">
                                            <div className="flex items-start justify-between mb-1">
                                              <div className="flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-800 font-semibold text-xs">{match.category}</span>
                                              </div>
                                              <span className="bg-purple-100 text-purple-700 px-1 py-0.5 rounded text-xs font-semibold">{match.score}</span>
                                            </div>
                                            <div className="space-y-0.5">
                                              {match.matchedItems.map((item, itemIdx) => (
                                                <div key={itemIdx} className="bg-green-50 text-green-700 px-1 py-0.5 rounded text-xs border border-green-200">
                                                  {item}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {hasPreferred && (
                                    <div>
                                      <div className="text-xs font-semibold text-slate-600 uppercase mb-1">Preferred</div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                                        {matches.preferred.map((match, idx) => (
                                          <div key={idx} className="bg-white rounded p-2 border border-purple-100">
                                            <div className="flex items-start justify-between mb-1">
                                              <div className="flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-800 font-semibold text-xs">{match.category}</span>
                                              </div>
                                              <span className="bg-purple-100 text-purple-700 px-1 py-0.5 rounded text-xs font-semibold">{match.score}</span>
                                            </div>
                                            <div className="space-y-0.5">
                                              {match.matchedItems.map((item, itemIdx) => (
                                                <div key={itemIdx} className="bg-green-50 text-green-700 px-1 py-0.5 rounded text-xs border border-green-200">
                                                  {item}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-md p-3 border border-orange-200">
                      <h4 className="text-base font-bold text-slate-900 mb-2">Elimination Criteria</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Age</span>
                          <span className="text-slate-900">{result.candidate.age || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Gender</span>
                          <span className="text-slate-900">{result.candidate.gender || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">DOB</span>
                          <span className="text-slate-900">{result.candidate.date_of_birth || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Ethnicity</span>
                          <span className="text-slate-900">{result.candidate.ethnicity || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Race</span>
                          <span className="text-slate-900">{result.candidate.race || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Religion</span>
                          <span className="text-slate-900">{result.candidate.religion || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Nationality</span>
                          <span className="text-slate-900">{result.candidate.nationality || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Birth Country</span>
                          <span className="text-slate-900">{result.candidate.country_of_birth || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Current Country</span>
                          <span className="text-slate-900">{result.candidate.current_country || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Min Salary</span>
                          <span className="text-slate-900">{result.candidate.minimum_expected_salary_monthly ? `$${result.candidate.minimum_expected_salary_monthly.toLocaleString()}` : 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Availability</span>
                          <span className="text-slate-900">{result.candidate.availability || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Visa Status</span>
                          <span className="text-slate-900">{result.candidate.visa_status || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Job Type</span>
                          <span className="text-slate-900">{result.candidate.desired_type_of_job_arrangement || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Email</span>
                          <span className="text-slate-900">{result.candidate.email || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium block mb-0.5">Phone</span>
                          <span className="text-slate-900">{result.candidate.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="checkbox"
                        checked={selectedCandidatesForCheckout.has(result.candidate.candidate_id)}
                        onChange={() => toggleCandidateForCheckout(result.candidate.candidate_id)}
                        id={`checkout-${result.candidate.candidate_id}`}
                        className="w-4 h-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`checkout-${result.candidate.candidate_id}`} className="text-slate-700 font-medium cursor-pointer text-sm">
                        Select for checkout
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCandidatesForCheckout.size > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowCheckoutModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Proceed to Checkout ({selectedCandidatesForCheckout.size} {selectedCandidatesForCheckout.size === 1 ? 'Candidate' : 'Candidates'})
            </button>
          </div>
        )}

        {showCheckoutModal && (
          <CheckoutModal
            selectedCandidates={getSelectedCandidateResults()}
            onClose={() => setShowCheckoutModal(false)}
            onCheckout={() => {
              alert(`Processing checkout for ${selectedCandidatesForCheckout.size} candidate(s)...`);
              setShowCheckoutModal(false);
            }}
          />
        )}
    </div>
    </>
  );
}