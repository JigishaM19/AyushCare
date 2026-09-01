import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FilePlus2,
  History,
  Binary,
  Share2,
  Settings,
  LogOut,
  Stethoscope,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { removeAuthToken, getSavedUser } from '../../services/api';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();
  const user = getSavedUser() || {
    name: 'Dr. Rajesh Varma',
    role: 'practitioner',
    clinic_name: 'AIIA Clinical OPD',
    registration_no: 'AYU-DEL-2018-4912'
  };

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patients', label: 'Patients Directory', icon: Users },
    { to: '/patients/new', label: 'Register Patient', icon: UserPlus },
    { to: '/cases/new', label: 'New Case-Taking', icon: FilePlus2, highlight: true },
    { to: '/history', label: 'Case History', icon: History },
    { to: '/repertorization', label: 'Repertorization', icon: Binary, badge: 'Demo' },
    { to: '/abdm', label: 'ABDM / ABHA', icon: Share2, badge: 'Interoperable' },
    { to: '/settings', label: 'Settings & Terminology', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col h-screen border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-950">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-white tracking-tight text-base truncate">AyushCare EHR</h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-emerald-500/30">
              SIH
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">MoA / AIIA Case-Taking</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Clinical Workflow
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950 font-semibold'
                    : item.highlight
                    ? 'text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-slate-800 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded font-mono">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Doctor / Practitioner Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-xs">
              {user.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'DR'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.registration_no || 'Ayush Practitioner'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit / Log Out</span>
        </button>
      </div>
    </aside>
  );
};
