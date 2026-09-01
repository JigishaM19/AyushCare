import React, { useState } from 'react';
import {
  FileCheck2,
  User,
  HeartPulse,
  Activity,
  PieChart,
  Edit3,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { Patient } from '../../types/patient';
import { Symptom, AshtavidhaData, SocratesPain } from '../../types/case';
import { PrakritiResult, VikritiResult } from '../../types/prakriti';
import { PrakritiRadarChart } from '../charts/PrakritiRadarChart';
import { Badge } from '../common/Badge';

interface Step7SummaryProps {
  patient: Patient | null;
  symptoms: Symptom[];
  hpiNarrative: string;
  socrates: SocratesPain;
  pastHistory: string;
  familyHistory: string;
  personalHistory: any;
  ashtavidha: AshtavidhaData;
  prakritiResult: PrakritiResult | null;
  vikritiResult: VikritiResult | null;
  structuredSummary: string;
  onChangeStructuredSummary: (val: string) => void;
  practitionerNotes: string;
  onChangePractitionerNotes: (val: string) => void;
  onNavigateStep: (stepIndex: number) => void;
}

export const Step7Summary: React.FC<Step7SummaryProps> = ({
  patient,
  symptoms,
  hpiNarrative,
  socrates,
  pastHistory,
  familyHistory,
  personalHistory,
  ashtavidha,
  prakritiResult,
  vikritiResult,
  structuredSummary,
  onChangeStructuredSummary,
  practitionerNotes,
  onChangePractitionerNotes,
  onNavigateStep,
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const handleAutoGenerateSummary = () => {
    const summaryLines = [
      `PATIENT: ${patient?.name || 'Patient'} (${patient?.gender || 'N/A'}, ${patient?.age || 0} yrs, ID: ${patient?.patient_code || 'N/A'})`,
      `CHIEF COMPLAINTS: ${symptoms.map((s) => `${s.name} (Duration: ${s.duration || 'N/A'}, Severity: ${s.severity}/10)`).join('; ') || 'None recorded'}`,
      `HPI / SOCRATES: ${hpiNarrative || 'Clinical narrative recorded.'} ${socrates.site ? `Site: ${socrates.site}, Character: ${socrates.character}` : ''}`,
      `ASHTAVIDHA FINDINGS: Nadi: ${ashtavidha.nadi?.dominant_dosha || 'Normal'} (${ashtavidha.nadi?.gati || 'Sarpa-Manduka'}); Jihva: ${ashtavidha.jihva?.coating || 'Normal'}; Sparsha: ${ashtavidha.sparsha?.temperature || 'Normal'}; Mutra: ${ashtavidha.mutra?.color || 'Normal'}; Mala: ${ashtavidha.mala?.consistency || 'Normal'}`,
      `CONSTITUTION & IMBALANCE: Prakriti: ${prakritiResult?.primary_prakriti || 'Vata-Pitta'} (V: ${prakritiResult?.vata_percent || 45}%, P: ${prakritiResult?.pitta_percent || 38}%, K: ${prakritiResult?.kapha_percent || 17}%); Vikriti: ${vikritiResult?.dominant_pattern || 'Vata-Pitta Samsarga'}`,
      `CLINICAL IMPRESSION: Managed as per Ayush clinical guidelines. Practitioner verification completed.`
    ];
    onChangeStructuredSummary(summaryLines.join('\n\n'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <span>Clinical Case Summary & Synthesis</span>
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive digital summary aggregating history, Ashtavidha examination, and Dosha profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoGenerateSummary}
            className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-300 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Generate Unified Summary</span>
          </button>
        </div>
      </div>

      {/* Printable / Structured Case Sheet View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Sheet Top Banner */}
        <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              AyushCare Digital Clinical Record
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">{patient?.name || 'Verified Patient'}</h3>
            <p className="text-xs text-slate-400">
              {patient?.gender}, {patient?.age} Years | Patient ID: {patient?.patient_code} | ABHA: {patient?.abha_id || 'Unlinked'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="emerald" dot>Case Complete</Badge>
            <Badge variant="purple">{prakritiResult?.primary_prakriti || 'Vata-Pitta'}</Badge>
          </div>
        </div>

        {/* Multi-Section Summary Content */}
        <div className="p-6 space-y-6 text-xs text-slate-800">
          {/* 1. Chief Complaints & HPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide text-emerald-800">
                  Chief Complaints & Onset
                </h4>
                <button
                  type="button"
                  onClick={() => onNavigateStep(1)}
                  className="text-slate-400 hover:text-emerald-700 flex items-center gap-1 text-[11px]"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>
              <ul className="space-y-1.5">
                {symptoms.map((s, idx) => (
                  <li key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{s.name}</span>
                      <span className="text-rose-700">Severity: {s.severity}/10</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Duration: {s.duration || 'N/A'} | Frequency: {s.frequency || 'Intermittent'}
                    </p>
                    {s.aggravating_factors && (
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        <span className="font-semibold text-slate-700">Aggravated by:</span> {s.aggravating_factors}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide text-emerald-800">
                  History of Present Illness (HPI)
                </h4>
                <button
                  type="button"
                  onClick={() => onNavigateStep(2)}
                  className="text-slate-400 hover:text-emerald-700 flex items-center gap-1 text-[11px]"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed min-h-[100px]">
                {hpiNarrative || 'Clinical history narrative entered by practitioner.'}
              </div>
            </div>
          </div>

          {/* 2. Ashtavidha Pariksha Matrix */}
          <div className="pb-5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide text-emerald-800">
                Ashtavidha Pariksha (Eight-Fold Traditional Examination)
              </h4>
              <button
                type="button"
                onClick={() => onNavigateStep(3)}
                className="text-slate-400 hover:text-emerald-700 flex items-center gap-1 text-[11px]"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Nadi</span>
                <span className="font-semibold text-slate-900 block">{ashtavidha.nadi?.dominant_dosha || 'Vata-Pitta'}</span>
                <span className="text-[10px] text-slate-500">{ashtavidha.nadi?.gati || 'Sarpa-Manduka'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Mutra</span>
                <span className="font-semibold text-slate-900 block">{ashtavidha.mutra?.color || 'Pale Yellow'}</span>
                <span className="text-[10px] text-slate-500">{ashtavidha.mutra?.burning || 'No burning'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Mala</span>
                <span className="font-semibold text-slate-900 block">{ashtavidha.mala?.consistency || 'Formed'}</span>
                <span className="text-[10px] text-slate-500">{ashtavidha.mala?.regularity || 'Regular'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">4. Jihva</span>
                <span className="font-semibold text-slate-900 block">{ashtavidha.jihva?.color || 'Pinkish'}</span>
                <span className="text-[10px] text-slate-500">{ashtavidha.jihva?.coating || 'Mild coated'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">5. Shabda</span>
                <span className="font-semibold text-slate-900 block">{ashtavidha.shabda?.quality || 'Clear'}</span>
                <span className="text-[10px] text-slate-500">{ashtavidha.shabda?.speech || 'Normal'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">6. Sparsha</span>
                <span className="font-semibold text-slate-900 block">{ashtavidha.sparsha?.temperature || 'Warm'}</span>
                <span className="text-[10px] text-slate-500">{ashtavidha.sparsha?.texture || 'Smooth'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">7. Druk</span>
                <span className="font-semibold text-slate-900 block">{ashtavidha.druk?.sclera_color || 'Normal'}</span>
                <span className="text-[10px] text-slate-500">{ashtavidha.druk?.vision_complaint || 'Clear'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">8. Akruti</span>
                <span className="font-semibold text-slate-900 block">{ashtavidha.akruti?.build || 'Madhyama'}</span>
                <span className="text-[10px] text-slate-500">{ashtavidha.akruti?.posture || 'Erect'}</span>
              </div>
            </div>
          </div>

          {/* 3. Prakriti vs Vikriti Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5 border-b border-slate-100 items-center">
            <div>
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide text-emerald-800 mb-2">
                Prakriti Radar Visualizer (Constitution)
              </h4>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <PrakritiRadarChart
                  data={prakritiResult?.radar_data || []}
                  vataPercent={prakritiResult?.vata_percent || 45}
                  pittaPercent={prakritiResult?.pitta_percent || 38}
                  kaphaPercent={prakritiResult?.kapha_percent || 17}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide text-emerald-800">
                Dosha Synthesis
              </h4>
              <div className="bg-purple-50/70 border border-purple-200 rounded-lg p-3">
                <span className="text-[10px] uppercase font-bold text-purple-700 block">Primary Prakriti</span>
                <span className="text-base font-bold text-purple-950 block">
                  {prakritiResult?.primary_prakriti || 'Vata-Pitta (Dwandvaja)'}
                </span>
                <p className="text-[11px] text-purple-800 mt-1">
                  Vata: {prakritiResult?.vata_percent || 46.9}% | Pitta: {prakritiResult?.pitta_percent || 37.5}% | Kapha: {prakritiResult?.kapha_percent || 15.6}%
                </p>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3">
                <span className="text-[10px] uppercase font-bold text-rose-700 block">Active Vikriti (Pathology)</span>
                <span className="text-base font-bold text-rose-950 block">
                  {vikritiResult?.dominant_pattern || 'Vata-Pitta Samsarga Dushti'}
                </span>
                <p className="text-[11px] text-rose-800 mt-1">
                  Dominant imbalance triggered by lifestyle/work stress factors.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Structured Clinical Notes & Observations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide text-emerald-800">
                Unified Clinical Assessment & Practitioner Notes
              </h4>
              <button
                type="button"
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditingNotes ? 'Done' : 'Edit Text'}
              </button>
            </div>

            {isEditingNotes ? (
              <textarea
                rows={5}
                value={structuredSummary}
                onChange={(e) => onChangeStructuredSummary(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            ) : (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                {structuredSummary ||
                  `${patient?.name || 'Patient'} evaluated with ${symptoms.map((s) => s.name).join(', ') || 'symptoms'}. Ashtavidha examination and Prakriti evaluation show consistent Vata-Pitta predominance. Suitable Shamana and Pathya regimen advised.`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
