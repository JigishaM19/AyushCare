import React, { useState, useEffect } from 'react';
import {
  Binary,
  Search,
  Plus,
  X,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Award
} from 'lucide-react';
import { RepertoryRubric, RemedyMatch } from '../types/terminology';
import { api } from '../services/api';

const CHAPTERS = ['All', 'Mind', 'Head', 'Stomach', 'Extremities', 'Generalities'] as const;

export const Repertorization: React.FC = () => {
  const [rubrics, setRubrics] = useState<RepertoryRubric[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRubricIds, setSelectedRubricIds] = useState<number[]>([1, 5, 9]); // Default sample selected
  const [results, setResults] = useState<{ remedies: RemedyMatch[]; disclaimer: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRubrics() {
      try {
        const data = await api.getRepertoryRubrics(
          selectedChapter === 'All' ? undefined : selectedChapter,
          searchQuery
        );
        setRubrics(data);
      } catch (err) {
        console.error('Failed to load rubrics:', err);
      }
    }
    loadRubrics();
  }, [selectedChapter, searchQuery]);

  // Recalculate remedies when selected rubric IDs change
  useEffect(() => {
    async function calculateMatches() {
      if (selectedRubricIds.length === 0) {
        setResults(null);
        return;
      }
      setLoading(true);
      try {
        const data = await api.calculateRepertorization(selectedRubricIds);
        setResults(data);
      } catch (err) {
        console.error('Repertorization error:', err);
      } finally {
        setLoading(false);
      }
    }
    calculateMatches();
  }, [selectedRubricIds]);

  const toggleRubric = (id: number) => {
    if (selectedRubricIds.includes(id)) {
      setSelectedRubricIds(selectedRubricIds.filter((rId) => rId !== id));
    } else {
      setSelectedRubricIds([...selectedRubricIds, id]);
    }
  };

  const handleSelectSampleScenario = (scenario: 'migraine' | 'gastritis' | 'arthritis') => {
    if (scenario === 'migraine') {
      setSelectedRubricIds([1, 5, 6, 8]); // Anxiety + throbbing right headache + motion agg + pressure amel
    } else if (scenario === 'gastritis') {
      setSelectedRubricIds([2, 9, 10, 11]); // Irritable + heartburn spicy food + bloating 4-8pm + burning warm drinks amel
    } else {
      setSelectedRubricIds([13, 14, 16]); // Joint pain first motion agg + better continuous + cold damp agg
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-sm border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/30 text-indigo-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-indigo-400/30">
              Research & Decision-Support Module
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mt-2 flex items-center gap-2">
            <Binary className="w-6 h-6 text-indigo-400" />
            <span>Homeopathic Repertorization Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
            Symptom totality rubric selection & weighted remedy totality matching calculation.
          </p>
        </div>

        {/* Preset scenario triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-300 font-semibold">Demo Scenarios:</span>
          <button
            onClick={() => handleSelectSampleScenario('migraine')}
            className="bg-indigo-950 hover:bg-indigo-900 text-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-700/60"
          >
            Migraine Rubrics
          </button>
          <button
            onClick={() => handleSelectSampleScenario('gastritis')}
            className="bg-indigo-950 hover:bg-indigo-900 text-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-700/60"
          >
            Gastritis Rubrics
          </button>
          <button
            onClick={() => handleSelectSampleScenario('arthritis')}
            className="bg-indigo-950 hover:bg-indigo-900 text-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-700/60"
          >
            Rheumatic Rubrics
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Medical Product Boundary: </span>
          Educational/research decision-support module. Final remedy selection and potencies remain the responsibility of the qualified homeopathic practitioner.
        </div>
      </div>

      {/* Main Grid: Rubric Selector (Left) vs Remedy Rankings (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Rubric Search & Chapter Filter */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Repertory Rubrics Library</span>
              </h2>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                {selectedRubricIds.length} Rubrics Selected
              </span>
            </div>

            {/* Chapter Chips */}
            <div className="flex flex-wrap gap-1.5">
              {CHAPTERS.map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChapter(ch)}
                  className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                    selectedChapter === ch
                      ? 'bg-indigo-700 text-white font-bold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rubrics by sensation, location, or modality..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Rubrics Checklist */}
          <div className="space-y-2">
            {rubrics.map((r) => {
              const isSelected = selectedRubricIds.includes(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggleRubric(r.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-400 text-indigo-950 font-semibold shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{r.rubric}</p>
                      <span className="text-[10px] text-slate-500 font-mono uppercase bg-slate-100 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                        {r.chapter}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-indigo-700 shrink-0">
                    {isSelected ? 'Selected' : '+ Select'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Calculated Remedy Match Totals */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Remedy Totality Match Rankings</span>
              </h3>
              {loading && <span className="text-xs text-slate-400 animate-pulse">Calculating...</span>}
            </div>

            {!results || results.remedies.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Select one or more rubrics on the left to compute remedy totality scores.
              </div>
            ) : (
              <div className="space-y-3">
                {results.remedies.map((match, idx) => (
                  <div
                    key={match.remedy}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/50 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900">{match.remedy}</h4>
                      </div>
                      <span className="text-xs font-black text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full">
                        {match.match_score}% Match
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${match.match_score}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Rubrics Covered: <strong>{match.rubrics_covered}</strong> of {selectedRubricIds.length}</span>
                      <span>Grading Points: <strong>{match.total_score}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
