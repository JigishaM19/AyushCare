import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
  steps: Array<{ label: string; shortLabel: string }>;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  onStepClick,
  steps,
}) => {
  const percentage = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-16 z-20 shadow-2xs">
      <div className="max-w-7xl mx-auto">
        {/* Step Numbers / Icons bar */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <button
                key={step.label}
                type="button"
                onClick={() => onStepClick(idx)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isCurrent
                      ? 'bg-white text-emerald-800'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                </span>
                <span className="hidden md:inline">{step.label}</span>
                <span className="inline md:hidden">{step.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
