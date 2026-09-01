import React from 'react';
import { AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface DemoBannerProps {
  onQuickDemoClick?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onQuickDemoClick }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white px-4 py-2 text-xs sm:text-sm font-medium flex flex-wrap items-center justify-between gap-2 shadow-inner border-b border-emerald-700/50">
      <div className="flex items-center gap-2">
        <span className="bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded text-[11px] tracking-wide uppercase shadow-sm">
          DEMO MODE
        </span>
        <span className="text-emerald-100 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          Fictional patient data for SIH PS 26047 evaluation.
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden md:flex items-center gap-1 text-emerald-200 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
          Clinical Decision Support — Final assessment remains with qualified practitioner.
        </span>

        {onQuickDemoClick && (
          <button
            onClick={onQuickDemoClick}
            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold px-2.5 py-1 rounded text-xs transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            4-Min Demo Flow
          </button>
        )}
      </div>
    </div>
  );
};
