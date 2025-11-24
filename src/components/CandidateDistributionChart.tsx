import { MatchResult } from '../types';

interface CandidateDistributionChartProps {
  results: MatchResult[];
  maxPossibleScore: number;
  onCandidateClick: (candidateId: number) => void;
  selectedCandidateIds: Set<number>;
}

export function CandidateDistributionChart({ results, maxPossibleScore, onCandidateClick, selectedCandidateIds }: CandidateDistributionChartProps) {
  const calculateDistribution = () => {
    const ranges = [
      { label: '0-10%', min: 0, max: 0.1 },
      { label: '10-20%', min: 0.1, max: 0.2 },
      { label: '20-30%', min: 0.2, max: 0.3 },
      { label: '30-40%', min: 0.3, max: 0.4 },
      { label: '40-50%', min: 0.4, max: 0.5 },
      { label: '50-60%', min: 0.5, max: 0.6 },
      { label: '60-70%', min: 0.6, max: 0.7 },
      { label: '70-80%', min: 0.7, max: 0.8 },
      { label: '80-90%', min: 0.8, max: 0.9 },
      { label: '90-100%', min: 0.9, max: 1.0 },
    ];

    return ranges.map(range => {
      const candidatesInRange = results.filter(result => {
        const percentage = result.matchingScore / maxPossibleScore;
        return percentage >= range.min && percentage < range.max;
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
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Candidate Distribution</h2>

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
                    className="w-full bg-blue-200 rounded-t transition-all duration-300 relative"
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
                              isSelected ? 'bg-yellow-400 ring-2 ring-yellow-300' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            title={`${candidate.candidate.first_name} ${candidate.candidate.last_name} - Score: ${candidate.matchingScore}`}
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
          <div className="text-base font-semibold text-slate-800">Overall Match Score Range</div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-blue-600 rounded-full mt-1 flex-shrink-0"></div>
          <div>
            <p className="text-sm font-medium text-slate-800 mb-1">
              Instructions:
            </p>
            <p className="text-xs text-slate-600">
              This histogram shows the distribution of candidates across different match score ranges. Click on any blue dot to view that candidate's details. You can select multiple candidates, and they will appear as cards below.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
