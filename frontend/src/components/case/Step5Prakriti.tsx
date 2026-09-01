import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Info,
  ShieldCheck,
  Flame,
  Wind,
  Droplet
} from 'lucide-react';
import { PrakritiResult, PrakritiQuestion } from '../../types/prakriti';
import { PrakritiRadarChart } from '../charts/PrakritiRadarChart';
import { api } from '../../services/api';

interface Step5PrakritiProps {
  responses: Record<string, string>;
  onChangeResponses: (responses: Record<string, string>) => void;
  result: PrakritiResult | null;
  onChangeResult: (result: PrakritiResult) => void;
  encounterId?: number;
}

export const Step5Prakriti: React.FC<Step5PrakritiProps> = ({
  responses,
  onChangeResponses,
  result,
  onChangeResult,
  encounterId,
}) => {
  const [questions, setQuestions] = useState<PrakritiQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Physical' | 'Physiological' | 'Psychological'>('All');

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await api.getPrakritiQuestions();
        if (data && data.questions) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error('Failed to load Prakriti questions:', err);
      }
    }
    loadQuestions();
  }, []);

  const handleSelectOption = async (questionId: string, optionId: string) => {
    const updatedResponses = { ...responses, [questionId]: optionId };
    onChangeResponses(updatedResponses);

    // Recalculate Prakriti scores in real-time
    try {
      const calcResult = await api.calculatePrakriti({
        encounter_id: encounterId,
        responses: updatedResponses,
      });
      onChangeResult(calcResult);
    } catch (err) {
      console.error('Prakriti calculation error:', err);
    }
  };

  const handleQuickPreset = async (type: 'vata-pitta' | 'pitta-kapha' | 'kapha-vata') => {
    let preset: Record<string, string> = {};
    if (type === 'vata-pitta') {
      preset = {
        body_frame: 'v1',
        skin_nature: 'p2',
        hair_type: 'v3',
        appetite: 'v4',
        sleep_pattern: 'v5',
        bowel_habit: 'v6',
        weather_tolerance: 'v7',
        mind_decision: 'v8',
        stress_response: 'v9',
        memory_pattern: 'p10'
      };
    } else if (type === 'pitta-kapha') {
      preset = {
        body_frame: 'p1',
        skin_nature: 'p2',
        hair_type: 'k3',
        appetite: 'p4',
        sleep_pattern: 'p5',
        bowel_habit: 'p6',
        weather_tolerance: 'p7',
        mind_decision: 'p8',
        stress_response: 'p9',
        memory_pattern: 'k10'
      };
    } else {
      preset = {
        body_frame: 'k1',
        skin_nature: 'k2',
        hair_type: 'k3',
        appetite: 'k4',
        sleep_pattern: 'k5',
        bowel_habit: 'k6',
        weather_tolerance: 'v7',
        mind_decision: 'k8',
        stress_response: 'k9',
        memory_pattern: 'k10'
      };
    }
    onChangeResponses(preset);
    try {
      const res = await api.calculatePrakriti({
        encounter_id: encounterId,
        responses: preset,
      });
      onChangeResult(res);
    } catch (err) {
      console.error('Preset calculation error:', err);
    }
  };

  const filteredQuestions =
    activeCategory === 'All'
      ? questions
      : questions.filter((q) => q.category === activeCategory);

  const answeredCount = Object.keys(responses).length;
  const totalCount = questions.length || 10;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-600" />
            <span>Prakriti Assessment (प्रकृति परीक्षण)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Questionnaire-based anatomical, physiological and mental constitution assessment engine.
          </p>
        </div>

        {/* Quick Demo Presets */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">Presets:</span>
          <button
            type="button"
            onClick={() => handleQuickPreset('vata-pitta')}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition-colors"
          >
            Vata-Pitta
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('pitta-kapha')}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            Pitta-Kapha
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('kapha-vata')}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            Kapha-Vata
          </button>
        </div>
      </div>

      {/* Main Interactive Grid: Questions (Left) & Real-time Radar Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Questionnaire */}
        <div className="lg:col-span-7 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 text-xs">
            <div className="flex gap-1">
              {(['All', 'Physical', 'Physiological', 'Psychological'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-500 pr-2">
              {answeredCount} of {totalCount} Answered
            </span>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {filteredQuestions.map((q, qIndex) => {
              const selectedOptId = responses[q.id];
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2.5 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">
                        {qIndex + 1}
                      </span>
                      <span>{q.title}</span>
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {q.category}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-1.5">
                    {q.options.map((opt) => {
                      const isSelected = selectedOptId === opt.id;
                      const doshaBadge =
                        opt.vata > 0 ? 'Vata (वात)' : opt.pitta > 0 ? 'Pitta (पित्त)' : 'Kapha (कफ)';
                      const doshaColor =
                        opt.vata > 0
                          ? 'text-purple-700'
                          : opt.pitta > 0
                          ? 'text-rose-700'
                          : 'text-emerald-700';

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.id)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-emerald-50/90 border-emerald-500 text-slate-900 font-semibold ring-1 ring-emerald-400/50'
                              : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </span>
                            <span className="truncate">{opt.text}</span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold shrink-0 ${doshaColor}`}>
                            {doshaBadge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Radar Chart & Scoreboard */}
        <div className="lg:col-span-5 sticky top-36 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Primary Constitution
                </span>
                <h3 className="text-xl font-extrabold text-emerald-800 leading-tight">
                  {result?.primary_prakriti || 'Vata-Pitta'}
                </h3>
              </div>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-full">
                {result?.secondary_prakriti || 'Balanced Anubandha'}
              </span>
            </div>

            {/* Radar Chart Visualizer */}
            <PrakritiRadarChart
              data={result?.radar_data || []}
              vataPercent={result?.vata_percent || 45}
              pittaPercent={result?.pitta_percent || 38}
              kaphaPercent={result?.kapha_percent || 17}
            />

            {/* Dosha Percentage Cards */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
              {/* Vata */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5">
                <div className="flex items-center justify-center gap-1 text-purple-800 text-xs font-bold mb-0.5">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Vata</span>
                </div>
                <p className="text-xl font-extrabold text-purple-900">
                  {result?.vata_percent !== undefined ? `${result.vata_percent}%` : '46.9%'}
                </p>
                <span className="text-[10px] text-purple-700">Air & Ether</span>
              </div>

              {/* Pitta */}
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                <div className="flex items-center justify-center gap-1 text-rose-800 text-xs font-bold mb-0.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Pitta</span>
                </div>
                <p className="text-xl font-extrabold text-rose-900">
                  {result?.pitta_percent !== undefined ? `${result.pitta_percent}%` : '37.5%'}
                </p>
                <span className="text-[10px] text-rose-700">Fire & Water</span>
              </div>

              {/* Kapha */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                <div className="flex items-center justify-center gap-1 text-emerald-800 text-xs font-bold mb-0.5">
                  <Droplet className="w-3.5 h-3.5" />
                  <span>Kapha</span>
                </div>
                <p className="text-xl font-extrabold text-emerald-900">
                  {result?.kapha_percent !== undefined ? `${result.kapha_percent}%` : '15.6%'}
                </p>
                <span className="text-[10px] text-emerald-700">Earth & Water</span>
              </div>
            </div>

            {/* Disclaimer Box */}
            <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                This score is generated from the questionnaire responses and should be reviewed by the practitioner.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
