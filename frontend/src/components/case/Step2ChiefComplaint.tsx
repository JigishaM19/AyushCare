import React, { useState } from 'react';
import { Plus, X, AlertCircle, Sparkles, Sliders, Activity, Clock, ShieldCheck } from 'lucide-react';
import { Symptom } from '../../types/case';
import { TerminologySelect } from '../common/TerminologySelect';
import { TerminologyItem } from '../../types/terminology';

interface Step2ChiefComplaintProps {
  symptoms: Symptom[];
  onChangeSymptoms: (symptoms: Symptom[]) => void;
  chiefComplaintSummary: string;
  onChangeSummary: (summary: string) => void;
}

const COMMON_SYMPTOMS = [
  'Headache (Shirahshoola)',
  'Acidity / Heartburn (Amlapitta)',
  'Joint Pain (Sandhishoola)',
  'Low Back Pain (Katishoola)',
  'Cough (Kasa)',
  'Fever (Jwara)',
  'Indigestion (Ajirna)',
  'Constipation (Vibandha)',
  'Insomnia (Anidra)',
  'Fatigue / Weakness (Klama)',
  'Anxiety / Stress (Chittodvega)',
  'Skin Eruptions (Twak Vikara)',
  'Bloating & Gas (Adhmana)',
  'Neck Stiffness (Manyastambha)'
];

export const Step2ChiefComplaint: React.FC<Step2ChiefComplaintProps> = ({
  symptoms,
  onChangeSymptoms,
  chiefComplaintSummary,
  onChangeSummary,
}) => {
  const [customInput, setCustomInput] = useState('');

  const handleToggleCommonSymptom = (name: string) => {
    const exists = symptoms.find((s) => s.name === name);
    if (exists) {
      onChangeSymptoms(symptoms.filter((s) => s.name !== name));
    } else {
      const newSymptom: Symptom = {
        name,
        duration: '2 weeks',
        severity: 6,
        frequency: 'Intermittent',
        onset: 'Gradual',
        aggravating_factors: '',
        relieving_factors: '',
        notes: ''
      };
      onChangeSymptoms([...symptoms, newSymptom]);
    }
  };

  const handleAddCustom = () => {
    if (!customInput.trim()) return;
    if (!symptoms.some((s) => s.name.toLowerCase() === customInput.trim().toLowerCase())) {
      const newSymptom: Symptom = {
        name: customInput.trim(),
        duration: '1 week',
        severity: 5,
        frequency: 'Intermittent',
        onset: 'Gradual',
        aggravating_factors: '',
        relieving_factors: '',
      };
      onChangeSymptoms([...symptoms, newSymptom]);
    }
    setCustomInput('');
  };

  const handleSelectTerminology = (term: TerminologyItem) => {
    const termLabel = `${term.preferred_term} (${term.code})`;
    if (!symptoms.some((s) => s.name.includes(term.preferred_term))) {
      const newSymptom: Symptom = {
        name: termLabel,
        duration: '2 weeks',
        severity: 6,
        frequency: 'Intermittent',
        onset: 'Gradual',
        aggravating_factors: '',
        relieving_factors: '',
      };
      onChangeSymptoms([...symptoms, newSymptom]);
    }
  };

  const handleUpdateSymptom = (index: number, field: keyof Symptom, value: any) => {
    const updated = [...symptoms];
    updated[index] = { ...updated[index], [field]: value };
    onChangeSymptoms(updated);
  };

  const handleRemoveSymptom = (index: number) => {
    onChangeSymptoms(symptoms.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6">
      {/* Rapid Selection Chips */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Chief Complaints (Pradhana Vedana)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Click to rapidly toggle frequent clinical presentations or search standardized terminology.
          </p>
        </div>

        {/* Common Chips Grid */}
        <div className="flex flex-wrap gap-2 pt-1">
          {COMMON_SYMPTOMS.map((name) => {
            const isSelected = symptoms.some((s) => s.name === name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => handleToggleCommonSymptom(name)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{name}</span>
                {isSelected ? (
                  <X className="w-3.5 h-3.5 opacity-80" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Custom Input Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Terminology Search */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Search Standardized NAMASTE Morbidity Directory
            </label>
            <TerminologySelect onSelectTerm={handleSelectTerminology} />
          </div>

          {/* Custom Symptom Input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Add Custom Practitioner Symptom
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustom())}
                placeholder="Enter custom complaint & press enter..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddCustom}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Complaints Structured Attributes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>Detailed Complaint Evaluation</span>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              {symptoms.length} Active
            </span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Configure severity slider & aggravating factors
          </span>
        </div>

        {symptoms.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
            <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No complaints selected yet</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Select one or more symptom chips above or type a custom complaint to configure duration and severity.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {symptoms.map((symptom, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{symptom.name}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSymptom(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                    title="Remove complaint"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Structured Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Duration */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Duration (Kala)
                    </label>
                    <input
                      type="text"
                      value={symptom.duration || ''}
                      onChange={(e) => handleUpdateSymptom(idx, 'duration', e.target.value)}
                      placeholder="e.g. 3 weeks, 5 days"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Frequency (Vega)
                    </label>
                    <select
                      value={symptom.frequency || 'Intermittent'}
                      onChange={(e) => handleUpdateSymptom(idx, 'frequency', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="Continuous">Continuous (Satata)</option>
                      <option value="Intermittent">Intermittent (Santata / Vega)</option>
                      <option value="Episodic">Episodic / Attacks</option>
                      <option value="Diurnal">Diurnal / Night-time</option>
                    </select>
                  </div>

                  {/* Onset */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Onset (Arambha)
                    </label>
                    <select
                      value={symptom.onset || 'Gradual'}
                      onChange={(e) => handleUpdateSymptom(idx, 'onset', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="Gradual">Gradual (Manda Arambha)</option>
                      <option value="Sudden">Sudden / Acute (Aashu Arambha)</option>
                      <option value="Post-traumatic">Post-exertion / Traumatic</option>
                    </select>
                  </div>

                  {/* Severity Slider */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Severity (Teevrita: 0–10)</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                        (symptom.severity || 5) >= 7
                          ? 'bg-rose-100 text-rose-800'
                          : (symptom.severity || 5) >= 4
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {symptom.severity || 5} / 10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={symptom.severity || 5}
                      onChange={(e) => handleUpdateSymptom(idx, 'severity', Number(e.target.value))}
                      className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Aggravating & Relieving Factors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Aggravating Factors (Upashaya / Hetu / Prakopa)
                    </label>
                    <input
                      type="text"
                      value={symptom.aggravating_factors || ''}
                      onChange={(e) => handleUpdateSymptom(idx, 'aggravating_factors', e.target.value)}
                      placeholder="e.g. Sunlight, cold wind, skipped meal, stress"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Relieving Factors (Anupashaya / Shamana)
                    </label>
                    <input
                      type="text"
                      value={symptom.relieving_factors || ''}
                      onChange={(e) => handleUpdateSymptom(idx, 'relieving_factors', e.target.value)}
                      placeholder="e.g. Dark quiet room, hot water, rest, massage"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
