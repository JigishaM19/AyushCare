import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sparkles, Calendar, HeartPulse, User } from 'lucide-react';
import { getSavedUser } from '../../services/api';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
  onDemoPresetTrigger?: (presetId: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  subtitle,
  onSearch,
  onDemoPresetTrigger,
}) => {
  const navigate = useNavigate();
  const user = getSavedUser();
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const handleStartDemoFlow = () => {
    if (onDemoPresetTrigger) {
      onDemoPresetTrigger('case-shirahshoola');
    } else {
      navigate('/cases/new?demo=case-shirahshoola');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Title & Context */}
      <div>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      {/* Center Search / Action Bar */}
      <div className="flex-1 max-w-md hidden lg:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient by name, ID (e.g. AYU-2026-001), phone, or ABHA..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* 4-Minute Presentation Quick Demo Button */}
        <button
          onClick={handleStartDemoFlow}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm shadow-emerald-900/10 transition-all hover:scale-[1.02]"
          title="Preload complete fictional case for 4-minute presentation"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
          <span>Launch 4-Min Demo</span>
        </button>

        {/* Date Display */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{todayFormatted}</span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-300">
            {user?.name ? user.name[0] : 'U'}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name || 'Practitioner'}</p>
            <p className="text-[10px] text-emerald-600 font-medium leading-none mt-1">Ayush OPD</p>
          </div>
        </div>
      </div>
    </header>
  );
};
