import React, { useState } from 'react';
import {
  FileText,
  Mic,
  Sparkles,
  AlertCircle,
  HelpCircle,
  HeartPulse,
  Activity,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import { SocratesPain, Symptom } from '../../types/case';
import { VoiceInput } from '../common/VoiceInput';
import { api } from '../../services/api';

interface Step3HistoryProps {
  hpiNarrative: string;
  onChangeHpiNarrative: (val: string) => void;
  socrates: SocratesPain;
  onChangeSocrates: (val: SocratesPain) => void;
  pastHistory: string;
  onChangePastHistory: (val: string) => void;
  familyHistory: string;
  onChangeFamilyHistory: (val: string) => void;
  personalHistory: {
    diet: string;
    appetite: string;
    sleep: string;
    bowel: string;
    stress: string;
    activity: string;
  };
  onChangePersonalHistory: (val: any) => void;
  symptoms: Symptom[];
}

export const Step3History: React.FC<Step3HistoryProps> = ({
  hpiNarrative,
  onChangeHpiNarrative,
  socrates,
  onChangeSocrates,
  pastHistory,
  onChangePastHistory,
  familyHistory,
  onChangeFamilyHistory,
  personalHistory,
  onChangePersonalHistory,
  symptoms,
}) => {
  const [showSocrates, setShowSocrates] = useState(true);
  const [isStructuring, setIsStructuring] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);

  const handleVoiceTranscript = (text: string) => {
    const updated = hpiNarrative ? `${hpiNarrative} ${text}` : text;
    onChangeHpiNarrative(updated);
  };

  const handleRunAiStructuring = async () => {
    setIsStructuring(true);
    try {
      const res = await api.structureCase({
        raw_notes: hpiNarrative,
        symptoms: symptoms,
        history: {
          past: pastHistory,
          personal: personalHistory,
        },
      });
      setAiResult(res);
    } catch (err) {
      console.error('AI Structuring error:', err);
    } finally {
      setIsStructuring(false);
    }
  };

  const handleApplyAiSummary = () => {
    if (aiResult?.history_summary) {
      onChangeHpiNarrative(aiResult.history_summary);
    }
  };

  const hasPainSymptom = symptoms.some((s) =>
    s.name.toLowerCase().includes('pain') ||
    s.name.toLowerCase().includes('shoola') ||
    s.name.toLowerCase().includes('headache') ||
    s.name.toLowerCase().includes('ache')
  );

  return (
    <div className="space-y-6">
      {/* HPI & Voice Dictation Section */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>History of Present Illness (HPI / Nidana Purvarupa)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Dictate or type clinical conversation narrative. Use AI structuring to check for missing information.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <VoiceInput onTranscript={handleVoiceTranscript} buttonLabel="Dictate HPI" />
            
            <button
              type="button"
              onClick={handleRunAiStructuring}
              disabled={isStructuring || !hpiNarrative.trim()}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{isStructuring ? 'Structuring...' : '✨ AI Structure Case'}</span>
            </button>
          </div>
        </div>

        <div>
          <textarea
            rows={4}
            value={hpiNarrative}
            onChange={(e) => onChangeHpiNarrative(e.target.value)}
            placeholder="Type or voice dictate patient illness narrative: chronological onset, progression, prior consultations, aggravating Ahara/Vihara factors, and subjective sensations..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-sans leading-relaxed"
          />
        </div>

        {/* AI Structuring Feedback Panel */}
        {aiResult && (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Clinical Decision Support Extraction</span>
              </div>
              <button
                type="button"
                onClick={handleApplyAiSummary}
                className="text-[11px] bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-2.5 py-1 rounded transition-colors"
              >
                Use Structured Summary
              </button>
            </div>

            <div className="text-xs text-slate-800 space-y-1.5 bg-white p-3 rounded-lg border border-emerald-100">
              <p><strong>Extracted Chronology:</strong> {aiResult.detected_duration || 'Not specified'}</p>
              <p><strong>Structured Narrative:</strong> {aiResult.history_summary}</p>
            </div>

            {/* Missing Information Alerts */}
            {aiResult.missing_information && aiResult.missing_information.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                <p className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Missing Information Warnings (Practitioner Review Required):</span>
                </p>
                <ul className="list-disc list-inside text-[11px] text-amber-900 space-y-0.5">
                  {aiResult.missing_information.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SOCRATES Pain Assessment Accordion */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSocrates(!showSocrates)}
          className="w-full px-5 py-3.5 bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              SOCRATES Pain & Shoola Evaluation
            </h3>
            {hasPainSymptom && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Pain Symptom Detected
              </span>
            )}
          </div>
          {showSocrates ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showSocrates && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* S - Site */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  <span className="text-emerald-700 font-bold">S</span> — Site (Sthana)
                </label>
                <input
                  type="text"
                  value={socrates.site}
                  onChange={(e) => onChangeSocrates({ ...socrates, site: e.target.value })}
                  placeholder="e.g. Right temporal region, Bilateral knee"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* O - Onset */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  <span className="text-emerald-700 font-bold">O</span> — Onset (Arambha)
                </label>
                <input
                  type="text"
                  value={socrates.onset}
                  onChange={(e) => onChangeSocrates({ ...socrates, onset: e.target.value })}
                  placeholder="e.g. Sudden morning waking, gradual over 3 months"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* C - Character */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  <span className="text-emerald-700 font-bold">C</span> — Character (Rupa / Swarupa)
                </label>
                <input
                  type="text"
                  value={socrates.character}
                  onChange={(e) => onChangeSocrates({ ...socrates, character: e.target.value })}
                  placeholder="e.g. Throbbing (Toda), Burning (Daha), Dull aching"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* R - Radiation */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  <span className="text-emerald-700 font-bold">R</span> — Radiation (Prasarana)
                </label>
                <input
                  type="text"
                  value={socrates.radiation}
                  onChange={(e) => onChangeSocrates({ ...socrates, radiation: e.target.value })}
                  placeholder="e.g. Radiates to eye/occiput, down sciatic nerve"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* A - Associated */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  <span className="text-emerald-700 font-bold">A</span> — Associated Symptoms
                </label>
                <input
                  type="text"
                  value={socrates.associated}
                  onChange={(e) => onChangeSocrates({ ...socrates, associated: e.target.value })}
                  placeholder="e.g. Nausea, photophobia, morning stiffness"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* T - Timing */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  <span className="text-emerald-700 font-bold">T</span> — Timing / Kala
                </label>
                <input
                  type="text"
                  value={socrates.timing}
                  onChange={(e) => onChangeSocrates({ ...socrates, timing: e.target.value })}
                  placeholder="e.g. Aggravated 2 PM to 4 PM, worse early morning"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* E - Exacerbating / Relieving */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  <span className="text-emerald-700 font-bold">E</span> — Exacerbating Factors
                </label>
                <input
                  type="text"
                  value={socrates.exacerbating}
                  onChange={(e) => onChangeSocrates({ ...socrates, exacerbating: e.target.value })}
                  placeholder="e.g. Sunlight, cold breeze, skipped meals"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* S - Severity Slider */}
              <div>
                <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                  <span><span className="text-emerald-700 font-bold">S</span> — Severity Scale</span>
                  <span className="text-emerald-700 font-bold">{socrates.severity} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={socrates.severity}
                  onChange={(e) => onChangeSocrates({ ...socrates, severity: Number(e.target.value) })}
                  className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Personal & Lifestyle History (Ahara / Vihara / Nidra) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Personal & Lifestyle Habits (Swasthavritta / Ahara-Vihara)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Select standard physiological and behavioral characteristics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Diet Ahara */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Diet (Ahara)
            </label>
            <select
              value={personalHistory.diet}
              onChange={(e) => onChangePersonalHistory({ ...personalHistory, diet: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Vegetarian (Shakahari)">Vegetarian (Shakahari)</option>
              <option value="Mixed (Mamsahari)">Mixed / Non-Vegetarian (Mamsahari)</option>
              <option value="Vegan">Vegan</option>
              <option value="Irregular Timings (Vishamashana)">Irregular Timings (Vishamashana)</option>
              <option value="Excess Spicy/Pungent (Katu/Amla)">Excess Spicy/Pungent (Katu/Amla)</option>
            </select>
          </div>

          {/* Appetite Agni */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Appetite & Digestive Fire (Agni)
            </label>
            <select
              value={personalHistory.appetite}
              onChange={(e) => onChangePersonalHistory({ ...personalHistory, appetite: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Samagni (Balanced digestion)">Samagni (Balanced digestion)</option>
              <option value="Vishamagni (Irregular / Bloating - Vata)">Vishamagni (Irregular / Bloating - Vata)</option>
              <option value="Tikshnagni (Sharp / Hyperacidity - Pitta)">Tikshnagni (Sharp / Hyperacidity - Pitta)</option>
              <option value="Mandagni (Sluggish / Low - Kapha)">Mandagni (Sluggish / Low - Kapha)</option>
            </select>
          </div>

          {/* Sleep Nidra */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Sleep Quality (Nidra)
            </label>
            <select
              value={personalHistory.sleep}
              onChange={(e) => onChangePersonalHistory({ ...personalHistory, sleep: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Sound Sleep (6-8 hours)">Sound Sleep (6-8 hours)</option>
              <option value="Disturbed / Interrupted (Anidra - Vata)">Disturbed / Interrupted (Anidra - Vata)</option>
              <option value="Excessive Sleep (Atinidra - Kapha)">Excessive Sleep (Atinidra - Kapha)</option>
              <option value="Late night sleep (Ratri Jagarana)">Late night sleep (Ratri Jagarana)</option>
            </select>
          </div>

          {/* Bowel Purisha */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Bowel Habits (Koshtha)
            </label>
            <select
              value={personalHistory.bowel}
              onChange={(e) => onChangePersonalHistory({ ...personalHistory, bowel: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Madhyama Koshtha (Regular, formed daily)">Madhyama Koshtha (Regular, formed daily)</option>
              <option value="Krura Koshtha (Hard stools / Constipation - Vata)">Krura Koshtha (Hard stools / Constipation - Vata)</option>
              <option value="Mridu Koshtha (Loose stools / Frequent - Pitta)">Mridu Koshtha (Loose stools / Frequent - Pitta)</option>
            </select>
          </div>

          {/* Stress & Manasika */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Stress & Psychological State (Manas)
            </label>
            <select
              value={personalHistory.stress}
              onChange={(e) => onChangePersonalHistory({ ...personalHistory, stress: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Normal / Calm">Normal / Calm</option>
              <option value="Moderate Work Tension">Moderate Work Tension</option>
              <option value="High Anxiety / Restlessness (Chittodvega)">High Anxiety / Restlessness (Chittodvega)</option>
              <option value="Irritability / Anger (Krodha)">Irritability / Anger (Krodha)</option>
            </select>
          </div>

          {/* Physical Activity */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Physical Activity (Vyayama)
            </label>
            <select
              value={personalHistory.activity}
              onChange={(e) => onChangePersonalHistory({ ...personalHistory, activity: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Moderate daily walk / Yoga">Moderate daily walk / Yoga</option>
              <option value="Sedentary (Alpa Vyayama)">Sedentary (Alpa Vyayama)</option>
              <option value="Vigorous gym / athletics">Vigorous gym / athletics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Past & Family History Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Past Medical & Surgical History (Purva Vyadhi Vrittanta)
          </label>
          <textarea
            rows={3}
            value={pastHistory}
            onChange={(e) => onChangePastHistory(e.target.value)}
            placeholder="Record previous hospitalizations, childhood illnesses, or surgeries..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Family History (Kula Vrittanta)
          </label>
          <textarea
            rows={3}
            value={familyHistory}
            onChange={(e) => onChangeFamilyHistory(e.target.value)}
            placeholder="Record hereditary conditions in parents or siblings (Diabetes, Hypertension, Arthropathies)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};
