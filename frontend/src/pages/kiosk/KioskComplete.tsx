import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  Ticket,
  Clock,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { KioskHeader } from '../../components/kiosk/KioskHeader';

export const KioskComplete: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'OPD-42';
  const lang = (searchParams.get('lang') as 'en' | 'hi' | 'mr') || 'en';

  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>(lang);
  const [countdown, setCountdown] = useState<number>(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/kiosk');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between font-sans select-none">
      <KioskHeader
        language={language}
        onLanguageChange={setLanguage}
        onEmergencyClick={() => alert('Hospital Staff Notified')}
      />

      <main className="max-w-2xl w-full mx-auto my-auto p-6 text-center space-y-8">
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl">
          {/* Success Check Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3.5 py-1 rounded-full border border-emerald-500/30 inline-block">
              Case Transmitted to Doctor
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Intake Completed Successfully
            </h2>
            <p className="text-sm text-slate-300">
              Your structured health history and pre-consultation summary have been delivered to the doctor's OPD console.
            </p>
          </div>

          {/* Queue Token Badge */}
          <div className="bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Your OPD Queue Token Number
            </span>
            <div className="text-5xl sm:text-6xl font-black text-amber-400 font-mono tracking-widest">
              {token}
            </div>
            <p className="text-xs text-slate-400">
              Please proceed to <strong>Ayurveda OPD Consultation Room 4</strong>.
            </p>
          </div>

          {/* Auto Reset Timer */}
          <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Session will automatically reset in <strong>{countdown} seconds</strong> for privacy.</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/kiosk')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm py-4 rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Finish & Return to Kiosk Home</span>
          </button>
        </div>
      </main>

      <footer className="p-4 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
        Hospital Reception Kiosk System • Privacy Assured
      </footer>
    </div>
  );
};
