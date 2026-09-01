import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  Send,
  Edit3,
  FileText,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { KioskHeader } from '../../components/kiosk/KioskHeader';
import { api } from '../../services/api';

export const KioskReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'hi' | 'mr') || 'en';

  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>(lang);
  const stateData = location.state || {};
  const answers = stateData.answers || {
    q_chief_complaint: 'stomach_pain',
    q_duration: 'few_days',
    q_progression: 'worse',
    q_medical_conditions: 'bp',
    q_medications: 'yes',
    q_allergies: 'no',
    q_lifestyle_habits: 'veg_good_sleep'
  };
  const sessionCode = stateData.sessionCode || 'KIOSK-829104';
  const patientId = stateData.patientId || 1;

  const [submitting, setSubmitting] = useState(false);

  const handleSendToDoctor = async () => {
    setSubmitting(true);
    try {
      const res = await api.completeKioskAssessment({
        session_code: sessionCode,
        patient_id: patientId,
        answers: answers,
        language: language,
      });

      navigate(`/kiosk/complete?token=${res.queue_token}&lang=${language}`);
    } catch (err) {
      console.error('Handoff error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between font-sans select-none">
      <KioskHeader
        language={language}
        onLanguageChange={setLanguage}
        onEmergencyClick={() => alert('Hospital Staff Notified')}
      />

      <main className="max-w-4xl w-full mx-auto my-auto p-6 sm:p-10 space-y-6">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Pre-Consultation Verification
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Please Review Your Information
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Session #{sessionCode}</span>
          </div>

          {/* Structured Clinical Sections Review */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Chief Complaint */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Chief Complaint</span>
                <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                  ✓ Complete
                </span>
              </div>
              <p className="text-sm font-bold text-white capitalize">
                {String(answers.q_chief_complaint || 'Stomach problem / Pain').replace(/_/g, ' ')}
              </p>
            </div>

            {/* Duration & Progression */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Duration & Trend</span>
                <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                  ✓ Complete
                </span>
              </div>
              <p className="text-sm font-bold text-white capitalize">
                {String(answers.q_duration || 'Few days ago').replace(/_/g, ' ')} • {String(answers.q_progression || 'Getting worse').replace(/_/g, ' ')}
              </p>
            </div>

            {/* Medical History */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Past Medical History</span>
                <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                  ✓ Recorded
                </span>
              </div>
              <p className="text-sm font-bold text-white capitalize">
                {String(answers.q_medical_conditions || 'None reported').replace(/_/g, ' ')}
              </p>
            </div>

            {/* Allergies */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Allergies (Safety Alert)</span>
                <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
                  Needs Doctor Review
                </span>
              </div>
              <p className="text-sm font-bold text-white capitalize">
                {String(answers.q_allergies || 'No known allergies reported').replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          {/* Clinical Disclaimer */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-200">Doctor Handoff Notice: </span>
            This structured summary will be instantly transmitted to the attending practitioner's OPD clinical queue with appropriate patient-reported confidence flags.
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-sm py-4 rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Information</span>
            </button>

            <button
              type="button"
              onClick={handleSendToDoctor}
              disabled={submitting}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>{submitting ? 'Transmitting Case...' : 'Send to Doctor / Handoff'}</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="p-4 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
        Hospital OPD Queue Transmission System
      </footer>
    </div>
  );
};
