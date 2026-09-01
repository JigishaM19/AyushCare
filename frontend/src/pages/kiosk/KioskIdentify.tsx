import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  QrCode,
  Phone,
  CheckCircle2,
  ArrowRight,
  User,
  Heart,
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { KioskHeader } from '../../components/kiosk/KioskHeader';
import { api } from '../../services/api';

export const KioskIdentify: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'hi' | 'mr') || 'en';

  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>(lang);
  const [identifier, setIdentifier] = useState('9876543210');
  const [identifiedPatient, setIdentifiedPatient] = useState<any | null>(null);
  const [searching, setSearching] = useState(false);

  const handleLookup = async (lookupVal?: string) => {
    const val = lookupVal || identifier;
    setSearching(true);
    try {
      const res = await api.identifyKioskPatient(val);
      if (res.found) {
        setIdentifiedPatient(res.patient);
      } else {
        alert(res.message || 'Patient not found');
      }
    } catch (err) {
      console.error('Lookup error:', err);
    } finally {
      setSearching(false);
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
        {!identifiedPatient ? (
          /* Step 1: Input Identifier */
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Enter Your Registered Mobile or Patient ID
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Type your 10-digit mobile number, or scan your AyushCare QR code.
              </p>
            </div>

            {/* Input & Keypad / QR */}
            <div className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-teal-400 rounded-2xl pl-12 pr-4 py-4 text-lg font-mono font-bold text-white text-center focus:outline-hidden"
                />
              </div>

              {/* Quick Sample Triggers */}
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('9876543210');
                    handleLookup('9876543210');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700"
                >
                  Demo: Aarav Sharma (9876543210)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('9811223344');
                    handleLookup('9811223344');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700"
                >
                  Demo: Meera Patil (9811223344)
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleLookup()}
                disabled={searching}
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-base py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span>{searching ? 'Looking up record...' : 'Find My Health Record'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Found Patient & Context Confirmation */
          <div className="bg-slate-900 border-2 border-teal-500 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xl">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block">
                  Patient Identified
                </span>
                <h2 className="text-2xl font-black text-white">{identifiedPatient.name}</h2>
                <p className="text-xs text-slate-400 font-mono">
                  {identifiedPatient.patient_code} • {identifiedPatient.age} yrs • {identifiedPatient.gender}
                </p>
              </div>
            </div>

            {/* Checklist of previously stored records */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Previous Medical Records Found on File:
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-teal-300">
                <div className="flex items-center gap-2">✓ Verified Allergies</div>
                <div className="flex items-center gap-2">✓ Current Medications</div>
                <div className="flex items-center gap-2">✓ Previous Consultations ({identifiedPatient.past_encounters_count || 1})</div>
                <div className="flex items-center gap-2">✓ Uploaded Lab Reports</div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-white">
                Would you like to use your previous health records for today's consultation?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => navigate(`/kiosk/assessment?lang=${language}&patient_id=${identifiedPatient.id}&use_records=true`)}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-base py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Yes, Use My Records</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/kiosk/assessment?lang=${language}&patient_id=${identifiedPatient.id}&use_records=false`)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-base py-4 rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Start Fresh Intake</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
        AyushCare Kiosk System • Privacy Protected
      </footer>
    </div>
  );
};
