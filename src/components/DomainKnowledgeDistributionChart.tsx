import { MatchResult } from '../types';

interface DomainKnowledgeDistributionChartProps {
  results: MatchResult[];
  onCandidateClick: (candidateId: number) => void;
  selectedCandidateIds: Set<number>;
}

export function DomainKnowledgeDistributionChart({ results, onCandidateClick, selectedCandidateIds }: DomainKnowledgeDistributionChartProps) {
  const parseDomains = (domainString?: string): string[] => {
    if (!domainString) return [];
    return domainString.split(',').map(d => d.trim()).filter(d => d.length > 0);
  };

  const calculateDistribution = () => {
    const domainsMap = new Map<string, MatchResult[]>();

    results.forEach(result => {
      const domains = parseDomains(result.candidate.past_current_domain);

      if (domains.length === 0) {
        if (!domainsMap.has('Not Specified')) {
          domainsMap.set('Not Specified', []);
        }
        domainsMap.get('Not Specified')?.push(result);
      } else {
        domains.forEach(domain => {
          if (!domainsMap.has(domain)) {
            domainsMap.set(domain, []);
          }
          domainsMap.get(domain)?.push(result);
        });
      }
    });

    return Array.from(domainsMap.entries())
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
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Domain Knowledge Distribution</h2>

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
                    className="w-full bg-amber-200 rounded-t transition-all duration-300 relative"
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
                              isSelected ? 'bg-yellow-400 ring-2 ring-yellow-300' : 'bg-amber-600 hover:bg-amber-700'
                            }`}
                            title={`${candidate.candidate.first_name} ${candidate.candidate.last_name} - Domain: ${candidate.candidate.past_current_domain || 'Not Specified'}`}
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
          <div className="text-base font-semibold text-slate-800">Domain Knowledge</div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-amber-600 rounded-full mt-1 flex-shrink-0"></div>
          <div>
            <p className="text-sm font-medium text-slate-800 mb-1">
              Instructions:
            </p>
            <p className="text-xs text-slate-600">
              This histogram shows the distribution of candidates by their domain knowledge. Multiple domains per candidate are counted separately. Click on any amber dot to view that candidate's details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
