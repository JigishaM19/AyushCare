import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, User, Globe, FilePlus2 } from 'lucide-react';
import { getActivePatient, setActivePatient } from '../../services/api';

interface PatientTopbarProps {
  title: string;
  subtitle?: string;
}

export const PatientTopbar: React.FC<PatientTopbarProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const currentPatient = getActivePatient();

  const handleSwitchPatient = (patId: number) => {
    if (patId === 1) {
      setActivePatient({ id: 1, name: 'Aarav Sharma', patient_code: 'AYU-2026-001', age: 34, gender: 'Male' });
    } else {
      setActivePatient({ id: 2, name: 'Meera Patil', patient_code: 'AYU-2026-002', age: 42, gender: 'Female' });
    }
    window.location.reload();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 font-sans">
      <div>
        <h1 className="text-base font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Switch Demo Patient Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-700">
          <User className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-[11px] text-slate-400 font-semibold">Demo Patient:</span>
          <select
            value={currentPatient.id}
            onChange={(e) => handleSwitchPatient(Number(e.target.value))}
            className="bg-transparent font-bold text-slate-800 text-xs focus:outline-hidden cursor-pointer"
          >
            <option value={1}>Aarav Sharma (34M)</option>
            <option value={2}>Meera Patil (42F)</option>
          </select>
        </div>

        {/* Share Record Button */}
        <button
          onClick={() => navigate('/patient/share')}
          className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all"
        >
          <QrCode className="w-4 h-4" />
          <span>Share Record</span>
        </button>
      </div>
    </header>
  );
};
