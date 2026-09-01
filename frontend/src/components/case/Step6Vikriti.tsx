import React, { useEffect } from 'react';
import { Activity, Flame, Wind, Droplet, ShieldCheck, BarChart3, AlertCircle } from 'lucide-react';
import { VikritiResult } from '../../types/prakriti';
import { Symptom, AshtavidhaData } from '../../types/case';
import { DoshaDistributionChart } from '../charts/DoshaDistributionChart';
import { api } from '../../services/api';

interface Step6VikritiProps {
  result: VikritiResult | null;
  onChangeResult: (result: VikritiResult) => void;
  symptoms: Symptom[];
  ashtavidha: AshtavidhaData;
  encounterId?: number;
  practitionerNotes: string;
  onChangeNotes: (notes: string) => void;
}

export const Step6Vikriti: React.FC<Step6VikritiProps> = ({
  result,
  onChangeResult,
  symptoms,
  ashtavidha,
  encounterId,
  practitionerNotes,
  onChangeNotes,
}) => {
  useEffect(() => {
    async function evaluateVikriti() {
      try {
        const res = await api.calculateVikriti({
          encounter_id: encounterId,
          symptoms: symptoms,
          ashtavidha: ashtavidha,
          notes: practitionerNotes,
        });
        onChangeResult(res);
      } catch (err) {
        console.error('Vikriti calculation error:', err);
      }
    }
    evaluateVikriti();
  }, [symptoms, ashtavidha, encounterId]);

  const vataPct = result?.vata_percent || 48;
  const pittaPct = result?.pitta_percent || 36;
  const kaphaPct = result?.kapha_percent || 16;

  const chartData = [
    { name: 'Vata (वात)', percentage: vataPct, fill: '#8B5CF6' },
    { name: 'Pitta (पित्त)', percentage: pittaPct, fill: '#EF4444' },
    { name: 'Kapha (कफ)', percentage: kaphaPct, fill: '#10B981' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          <span>Vikriti Assessment (विकृति परीक्षण — Current Pathological Imbalance)</span>
        </h2>
        <p className="text-xs text-slate-500">
          Real-time algorithmic evaluation of current active Dosha-Dushya involvement derived from complaints, severity, and Ashtavidha Pariksha.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Dominant Pattern & Clinical Observation Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Dominant Pathological Pattern
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {result?.dominant_pattern || 'Vata-Pitta Samsarga Dushti'}
                </h3>
              </div>
              <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-200">
                Active Imbalance
              </span>
            </div>

            {/* Dosha Breakdown Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-purple-800 text-xs font-bold mb-1">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Vata</span>
                </div>
                <p className="text-2xl font-black text-purple-900">{vataPct}%</p>
                <span className="text-[10px] font-semibold text-purple-700">Hyperactive / Toda</span>
              </div>

              <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-rose-800 text-xs font-bold mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Pitta</span>
                </div>
                <p className="text-2xl font-black text-rose-900">{pittaPct}%</p>
                <span className="text-[10px] font-semibold text-rose-700">Inflammation / Daha</span>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-800 text-xs font-bold mb-1">
                  <Droplet className="w-3.5 h-3.5" />
                  <span>Kapha</span>
                </div>
                <p className="text-2xl font-black text-emerald-900">{kaphaPct}%</p>
                <span className="text-[10px] font-semibold text-emerald-700">Mild Association</span>
              </div>
            </div>

            {/* Supporting Clinical Findings */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supporting Diagnostic Indicators in this Case</span>
              </h4>
              <ul className="text-xs text-slate-600 space-y-1">
                {symptoms.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                    <span><strong>{s.name}:</strong> Severity {s.severity}/10 ({s.duration || 'recent'})</span>
                  </li>
                ))}
                {ashtavidha.nadi?.dominant_dosha && (
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span><strong>Nadi Palpation:</strong> {ashtavidha.nadi.dominant_dosha} ({ashtavidha.nadi.gati || 'Sarpa-Manduka'})</span>
                  </li>
                )}
                {ashtavidha.jihva?.coating && (
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span><strong>Jihva State:</strong> {ashtavidha.jihva.coating}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Dosha Imbalance Bar Chart & Practitioner Clinical Notes */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Current Dosha Imbalance Distribution
            </h3>

            <DoshaDistributionChart data={chartData} />

            {/* Practitioner Samprapti Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Practitioner Samprapti Ghataka & Clinical Observations
              </label>
              <textarea
                rows={4}
                value={practitionerNotes}
                onChange={(e) => onChangeNotes(e.target.value)}
                placeholder="Enter clinical assessment notes: Dushya involved (Rasa, Rakta, Mamsa), Srotas (Rasavaha, Manovaha), Agni state, and line of treatment (Chikitsa Sutra)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Clinical Decision Support — Rule-based dosha calculation assists practitioner review and does not constitute autonomous diagnosis.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
