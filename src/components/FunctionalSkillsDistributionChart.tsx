import { MatchResult } from '../types';

interface FunctionalSkillsDistributionChartProps {
  results: MatchResult[];
  onCandidateClick: (candidateId: number) => void;
  selectedCandidateIds: Set<number>;
}

export function FunctionalSkillsDistributionChart({ results, onCandidateClick, selectedCandidateIds }: FunctionalSkillsDistributionChartProps) {
  const parseSkills = (skillString?: string): string[] => {
    if (!skillString) return [];
    return skillString.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  const calculateDistribution = () => {
    const skillsMap = new Map<string, MatchResult[]>();

    results.forEach(result => {
      const skills = parseSkills(result.candidate.past_current_function);

      if (skills.length === 0) {
        if (!skillsMap.has('Not Specified')) {
          skillsMap.set('Not Specified', []);
        }
        skillsMap.get('Not Specified')?.push(result);
      } else {
        skills.forEach(skill => {
          if (!skillsMap.has(skill)) {
            skillsMap.set(skill, []);
          }
          skillsMap.get(skill)?.push(result);
        });
      }
    });

    return Array.from(skillsMap.entries())
      .map(([label, candidates]) => ({
        label,
        count: candidates.length,
        candidates,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const distribution = calculateDistribution();
  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Functional Skills Distribution</h2>

      <div className="bg-slate-50 rounded-lg p-8 border border-slate-200">
        <div className="relative" style={{ height: '500px', paddingBottom: '80px' }}>
          <div className="absolute left-0 top-0 w-12 flex flex-col justify-between text-xs text-slate-600 font-medium" style={{ bottom: '80px' }}>
            {[...Array(maxCount + 1)].map((_, i) => (
              <div key={i} className="text-right pr-2">
                {maxCount - i}
              </div>
            ))}
          </div>

          <div className="absolute left-12 right-0 top-0 border-l-2 border-b-2 border-slate-300" style={{ bottom: '80px' }}>
            <div className="relative h-full flex items-end justify-around px-4 gap-2">
              {distribution.map((bucket, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full relative">
                  <div
                    className="w-full bg-rose-200 rounded-t transition-all duration-300 relative"
                    style={{
                      height: `${(bucket.count / maxCount) * 100}%`,
                      minHeight: bucket.count > 0 ? '20px' : '0px'
                    }}
                  >
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 pb-2" style={{ height: '60px' }}>
                    <div className="flex flex-wrap justify-center items-end gap-1 h-full content-end">
                      {bucket.candidates.map((candidate, dotIndex) => {
                        const isSelected = selectedCandidateIds.has(candidate.candidate.candidate_id);
                        return (
                          <div
                            key={dotIndex}
                            onClick={() => onCandidateClick(candidate.candidate.candidate_id)}
                            className={`w-3 h-3 rounded-full shadow-sm cursor-pointer transition-all hover:scale-125 ${
                              isSelected ? 'bg-yellow-400 ring-2 ring-yellow-300' : 'bg-rose-600 hover:bg-rose-700'
                            }`}
                            title={`${candidate.candidate.first_name} ${candidate.candidate.last_name} - Skills: ${candidate.candidate.past_current_function || 'Not Specified'}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute left-0 right-0 flex justify-around px-4 gap-2" style={{ bottom: '-80px', height: '80px' }}>
              {distribution.map((bucket, index) => (
                <div key={index} className="flex-1 text-center">
                  <div className="text-xs font-medium text-slate-700 break-words leading-tight" style={{ wordBreak: 'break-word' }}>
                    {bucket.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute left-0 top-0 -rotate-90 origin-top-left text-sm font-semibold text-slate-700" style={{ transform: 'rotate(-90deg) translateX(-100%)', transformOrigin: 'top left', left: '20px', top: '50%' }}>
            Candidate Count
          </div>
        </div>

        <div className="text-center mt-4">
          <div className="text-base font-semibold text-slate-800">Functional Skills</div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-rose-50 rounded-lg border border-rose-200">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-rose-600 rounded-full mt-1 flex-shrink-0"></div>
          <div>
            <p className="text-sm font-medium text-slate-800 mb-1">
              Instructions:
            </p>
            <p className="text-xs text-slate-600">
              This histogram shows the distribution of candidates by their functional skills. Multiple skills per candidate are counted separately. Click on any rose dot to view that candidate's details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
