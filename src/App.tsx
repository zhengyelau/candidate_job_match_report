import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CandidateRanking } from './components/CandidateRanking';
import { Candidate, Employer, MatchResult } from './types';
import {
  loadCandidates,
  loadEmployers,
  importCandidatesFromJSON,
  importEmployersFromJSON,
  saveCandidatesToDatabase,
  saveEmployersToDatabase,
} from './utils/dataManager';
import { filterCandidates } from './utils/filterCandidates';
import { calculateMatchingScore } from './utils/matchingScore';
import { saveMatchesToDatabase } from './utils/matchesManager';
import { Upload, FileJson, Briefcase, Users, ArrowLeft, Database } from 'lucide-react';

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(-1);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSavingCandidates, setIsSavingCandidates] = useState<boolean>(false);
  const [isSavingEmployers, setIsSavingEmployers] = useState<boolean>(false);
  const candidatesInputRef = useRef<HTMLInputElement>(null);
  const employersInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadedCandidates = loadCandidates();
    const loadedEmployers = loadEmployers();
    setCandidates(loadedCandidates);
    setEmployers(loadedEmployers);
  }, []);

  useEffect(() => {
    if (selectedJobIndex >= 0 && candidates.length > 0) {
      const selectedJob = employers[selectedJobIndex];
      const filteredCandidates = filterCandidates(candidates, selectedJob);
      const resultsWithScores: MatchResult[] = filteredCandidates.map((candidate) => ({
        candidate,
        matchingScore: calculateMatchingScore(candidate, selectedJob),
      })).sort((a, b) => b.matchingScore - a.matchingScore);

      const results: MatchResult[] = resultsWithScores.map((result, index) => ({
        ...result,
        rank: index + 1,
      }));
      setMatchResults(results);
    } else {
      setMatchResults([]);
    }
  }, [selectedJobIndex, candidates, employers]);

  const handleCandidatesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          let jsonData = JSON.parse(event.target?.result as string);
          if (!Array.isArray(jsonData)) {
            alert('Error: Candidates file must contain an array of candidate objects.');
            return;
          }
          if (importCandidatesFromJSON(jsonData)) {
            setCandidates(jsonData);
            alert(`Candidates imported successfully! (${jsonData.length} candidates loaded)`);
          } else {
            alert('Error importing candidates. Please check the file format.');
          }
        } catch (error) {
          alert(`Error parsing JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleEmployersUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          let jsonData = JSON.parse(event.target?.result as string);
          if (!Array.isArray(jsonData)) {
            alert('Error: Employers file must contain an array of employer objects.');
            return;
          }
          if (importEmployersFromJSON(jsonData)) {
            setEmployers(jsonData);
            alert(`Employers imported successfully! (${jsonData.length} job roles loaded)`);
          } else {
            alert('Error importing employers. Please check the file format.');
          }
        } catch (error) {
          alert(`Error parsing JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleJobSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value, 10);
    if (!isNaN(index) && index >= -1) {
      setSelectedJobIndex(index);
    }
  };

  const handleBackToData = () => {
    setSelectedJobIndex(-1);
    setMatchResults([]);
  };

  const handleSaveMatches = async () => {
    if (selectedJobIndex < 0 || matchResults.length === 0) {
      alert('No matches to save. Please select a job role first.');
      return;
    }

    setIsSaving(true);
    const selectedJob = employers[selectedJobIndex];
    const result = await saveMatchesToDatabase(matchResults, selectedJob);
    setIsSaving(false);

    if (result.success) {
      alert(`Successfully saved ${matchResults.length} matches to the database!`);
    } else {
      alert(`Error saving matches: ${result.error}`);
    }
  };

  const handleSaveCandidatesToDB = async () => {
    if (candidates.length === 0) {
      alert('No candidates to save.');
      return;
    }

    setIsSavingCandidates(true);
    const result = await saveCandidatesToDatabase(candidates);
    setIsSavingCandidates(false);

    if (result.success) {
      alert(`Successfully saved ${result.count} candidates to the database!`);
    } else {
      alert(`Error saving candidates: ${result.error}`);
    }
  };

  const handleSaveEmployersToDb = async () => {
    if (employers.length === 0) {
      alert('No employers to save.');
      return;
    }

    setIsSavingEmployers(true);
    const result = await saveEmployersToDatabase(employers);
    setIsSavingEmployers(false);

    if (result.success) {
      alert(`Successfully saved ${result.count} job roles to the database!`);
    } else {
      alert(`Error saving employers: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {candidates.length === 0 || employers.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Import Data to Get Started
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-green-500 transition-colors">
                  <div className="text-center">
                    <Briefcase className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      Import Job Roles
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Upload a JSON file with employer requirements
                    </p>
                    <button
                      onClick={() => employersInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Employers JSON
                    </button>
                    <input
                      ref={employersInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleEmployersUpload}
                      className="hidden"
                    />
                    {/* {employers.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-green-600 font-medium mb-2">
                          ✓ {employers.length} job roles loaded
                        </p>
                        <button
                          onClick={handleSaveEmployersToDb}
                          disabled={isSavingEmployers}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors mx-auto disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                          <Database className="w-4 h-4" />
                          {isSavingEmployers ? 'Saving...' : 'Save to Database'}
                        </button>
                      </div>
                    )} */}
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      Import Candidates
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Upload a JSON file with candidate data
                    </p>
                    <button
                      onClick={() => candidatesInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Candidates JSON
                    </button>
                    <input
                      ref={candidatesInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleCandidatesUpload}
                      className="hidden"
                    />
                    {/* {candidates.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-green-600 font-medium mb-2">
                          ✓ {candidates.length} candidates loaded
                        </p>
                        <button
                          onClick={handleSaveCandidatesToDB}
                          disabled={isSavingCandidates}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors mx-auto disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                          <Database className="w-4 h-4" />
                          {isSavingCandidates ? 'Saving...' : 'Save to Database'}
                        </button>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <FileJson className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-800 mb-1">
                      Expected JSON Format
                    </p>
                    <p className="text-xs text-slate-600">
                      Candidates: Array with candidate_id, first_name, last_name, email, phone, and other profile fields.
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Employers: Array with "Job Title" field.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4">
                Job Candidate Match Report
              </h1>

              <button
                onClick={handleBackToData}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Data
              </button>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Job Role
                  </label>
                  <select
                    value={selectedJobIndex}
                    onChange={handleJobSelect}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="-1">Choose a job role...</option>
                    {employers.map((employer, index) => (
                      <option key={index} value={index}>
                        {employer.job_title} - {employer.employer_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {selectedJobIndex >= 0 && selectedJobIndex < employers.length && matchResults.length > 0 && (
              <>
                {/* <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">
                        Save Matches to Database
                      </h3>
                      <p className="text-sm text-slate-600">
                        Save {matchResults.length} candidate matches for this job role to Supabase
                      </p>
                    </div>
                    <button
                      onClick={handleSaveMatches}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      <Database className="w-5 h-5" />
                      {isSaving ? 'Saving...' : 'Save to Database'}
                    </button>
                  </div>
                </div> */}

                <CandidateRanking
                  results={matchResults}
                  employer={employers[selectedJobIndex]}
                />
              </>
            )}

            {selectedJobIndex >= 0 && matchResults.length === 0 && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-slate-500 text-lg">
                  No candidates found for this job role.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;