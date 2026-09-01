import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  FolderOpen,
  QrCode,
  History,
  HeartPulse,
  LogOut,
  Stethoscope,
  MonitorCheck,
  User
} from 'lucide-react';
import { getActivePatient } from '../../services/api';

export const PatientSidebar: React.FC = () => {
  const navigate = useNavigate();
  const patient = getActivePatient();

  const navItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Health Assessment', path: '/patient/onboarding', icon: ClipboardList },
    { name: 'Longitudinal Record', path: '/patient/health-summary', icon: FileText },
    { name: 'My Documents & OCR', path: '/patient/documents', icon: FolderOpen },
    { name: 'Share Records (QR)', path: '/patient/share', icon: QrCode },
    { name: 'Access Audit History', path: '/patient/access-history', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 border-r border-slate-800 font-sans select-none">
      {/* Top Header */}
      <div className="p-5 border-b border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-teal-500/20">
            <HeartPulse className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              <span>AyushCare</span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-1.5 py-0.2 rounded border border-teal-500/30">
                PATIENT
              </span>
            </h1>
            <p className="text-[10px] text-teal-300/80 font-medium">Personal Health Portal</p>
          </div>
        </div>

        {/* Patient Profile Card */}
        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
            {patient.name?.charAt(0) || 'P'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{patient.name}</p>
            <p className="text-[10px] text-teal-400 font-mono">{patient.patient_code || 'PAT-000124'}</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="p-3 space-y-1 overflow-y-auto flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Switcher */}
      <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 rounded-xl transition-colors text-[11px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Ecosystem Role</span>
        </button>
      </div>
    </aside>
  );
};
