import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Globe, AlertOctagon, RotateCcw, Home } from 'lucide-react';

interface KioskHeaderProps {
  language: 'en' | 'hi' | 'mr';
  onLanguageChange: (lang: 'en' | 'hi' | 'mr') => void;
  onEmergencyClick: () => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({
  language,
  onLanguageChange,
  onEmergencyClick
}) => {
  const navigate = useNavigate();

  return (
    <header className="h-20 bg-slate-900 border-b-2 border-amber-500/40 px-6 sm:px-10 flex items-center justify-between text-white shrink-0 select-none shadow-md">
      {/* Brand & Kiosk Mode Badge */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
          <HeartPulse className="w-7 h-7 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span>AyushCare</span>
            <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase tracking-wider">
              KIOSK
            </span>
          </h1>
          <p className="text-xs text-amber-200/90 font-medium">Hospital OPD Self-Service Intake</p>
        </div>
      </div>

      {/* Center/Right Controls: Multilingual Selector & Emergency */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-2xl border border-slate-700">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              language === 'en' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => onLanguageChange('hi')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              language === 'hi' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => onLanguageChange('mr')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              language === 'mr' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            मराठी
          </button>
        </div>

        {/* Emergency Staff Escalation Button */}
        <button
          type="button"
          onClick={onEmergencyClick}
          className="bg-red-600 hover:bg-red-500 text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 animate-pulse"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Call Staff</span>
        </button>

        {/* Exit Kiosk Button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white p-2.5 rounded-2xl border border-slate-700 transition-colors"
          title="Exit Kiosk Mode"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
