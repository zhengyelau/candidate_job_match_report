import { MatchResult } from '../types';

interface SalaryDistributionChartProps {
  results: MatchResult[];
  onCandidateClick: (candidateId: number) => void;
  selectedCandidateIds: Set<number>;
}

export function SalaryDistributionChart({ results, onCandidateClick, selectedCandidateIds }: SalaryDistributionChartProps) {
  const calculateDistribution = () => {
    const ranges = [
      { label: '0-2k', min: 0, max: 2000 },
      { label: '2-4k', min: 2000, max: 4000 },
      { label: '4-6k', min: 4000, max: 6000 },
      { label: '6-8k', min: 6000, max: 8000 },
      { label: '8-10k', min: 8000, max: 10000 },
      { label: '10-12k', min: 10000, max: 12000 },
      { label: '12-15k', min: 12000, max: 15000 },
      { label: '15-20k', min: 15000, max: 20000 },
      { label: '20-30k', min: 20000, max: 30000 },
      { label: '30k+', min: 30000, max: Infinity },
    ];

    return ranges.map(range => {
      const candidatesInRange = results.filter(result => {
        const salary = result.candidate.minimum_expected_salary_monthly || 0;
        return salary >= range.min && salary < range.max;
      });

      return {
        label: range.label,
        count: candidatesInRange.length,
        candidates: candidatesInRange,
      };
    });
  };

  const distribution = calculateDistribution();
  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Salary Distribution</h2>

      <div className="bg-slate-50 rounded-lg p-8 border border-slate-200">
        <div className="relative" style={{ height: '400px' }}>
          <div className="absolute left-0 top-0 bottom-12 w-12 flex flex-col justify-between text-xs text-slate-600 font-medium">
            {[...Array(maxCount + 1)].map((_, i) => (
              <div key={i} className="text-right pr-2">
                {maxCount - i}
              </div>
            ))}
          </div>

          <div className="absolute left-12 right-0 top-0 bottom-12 border-l-2 border-b-2 border-slate-300">
            <div className="relative h-full flex items-end justify-around px-4 gap-2">
              {distribution.map((bucket, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full relative">
                  <div
                    className="w-full bg-green-200 rounded-t transition-all duration-300 relative"
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
                              isSelected ? 'bg-yellow-400 ring-2 ring-yellow-300' : 'bg-green-600 hover:bg-green-700'
                            }`}
                            title={`${candidate.candidate.first_name} ${candidate.candidate.last_name} - Salary: $${candidate.candidate.minimum_expected_salary_monthly || 0}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute left-0 right-0 flex justify-around px-4 gap-2" style={{ top: '100%', paddingTop: '8px' }}>
              {distribution.map((bucket, index) => (
                <div key={index} className="flex-1 text-center">
                  <div className="text-xs font-medium text-slate-700">
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

        <div className="text-center mt-8">
          <div className="text-base font-semibold text-slate-800">Expected Monthly Salary Range</div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-green-600 rounded-full mt-1 flex-shrink-0"></div>
          <div>
            <p className="text-sm font-medium text-slate-800 mb-1">
              Instructions:
            </p>
            <p className="text-xs text-slate-600">
              This histogram shows the distribution of candidates by their minimum expected monthly salary. Click on any green dot to view that candidate's details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
