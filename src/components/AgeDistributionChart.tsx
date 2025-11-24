import { MatchResult } from '../types';

interface AgeDistributionChartProps {
  results: MatchResult[];
  onCandidateClick: (candidateId: number) => void;
  selectedCandidateIds: Set<number>;
}

export function AgeDistributionChart({ results, onCandidateClick, selectedCandidateIds }: AgeDistributionChartProps) {
  const calculateDistribution = () => {
    const ranges = [
      { label: '18-22', min: 18, max: 22 },
      { label: '23-27', min: 23, max: 27 },
      { label: '28-32', min: 28, max: 32 },
      { label: '33-37', min: 33, max: 37 },
      { label: '38-42', min: 38, max: 42 },
      { label: '43-47', min: 43, max: 47 },
      { label: '48-52', min: 48, max: 52 },
      { label: '53-57', min: 53, max: 57 },
      { label: '58-62', min: 58, max: 62 },
      { label: '63+', min: 63, max: Infinity },
    ];

    return ranges.map(range => {
      const candidatesInRange = results.filter(result => {
        const age = result.candidate.age || 0;
        return age >= range.min && age <= range.max;
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
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Age Distribution</h2>

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
                    className="w-full bg-orange-200 rounded-t transition-all duration-300 relative"
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
                              isSelected ? 'bg-yellow-400 ring-2 ring-yellow-300' : 'bg-orange-600 hover:bg-orange-700'
                            }`}
                            title={`${candidate.candidate.first_name} ${candidate.candidate.last_name} - Age: ${candidate.candidate.age}`}
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
          <div className="text-base font-semibold text-slate-800">Age Range</div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-orange-600 rounded-full mt-1 flex-shrink-0"></div>
          <div>
            <p className="text-sm font-medium text-slate-800 mb-1">
              Instructions:
            </p>
            <p className="text-xs text-slate-600">
              This histogram shows the distribution of candidates by age groups. Click on any orange dot to view that candidate's details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
