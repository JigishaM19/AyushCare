import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Building2,
  ShieldCheck,
  Zap,
  Sparkles,
  Database,
  Mic,
  Share2,
  Lock,
  Search,
  CheckCircle2
} from 'lucide-react';
import { getSavedUser, api } from '../services/api';
import { TerminologyItem } from '../types/terminology';

export const Settings: React.FC = () => {
  const user = getSavedUser() || {
    name: 'Dr. Rajesh Varma',
    email: 'doctor@ayushcare.in',
    role: 'practitioner',
    registration_no: 'AYU-DEL-2018-4912',
    clinic_name: 'All India Institute of Ayurveda Clinical OPD',
  };

  const [terminologyList, setTerminologyList] = useState<TerminologyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadTerms() {
      try {
        const terms = await api.searchTerminology(searchTerm);
        setTerminologyList(terms);
      } catch (err) {
        console.error('Error loading terminology in settings:', err);
      }
    }
    loadTerms();
  }, [searchTerm]);

  const differentiators = [
    {
      title: '⚡ Rapid Case-Taking',
      desc: 'Structured symptom selection and quick qualitative chips reduce repetitive typing by over 70%.',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    },
    {
      title: '🪷 Ashtavidha Pariksha',
      desc: 'Digital eight-fold traditional Ayurvedic clinical examination with intuitive pulse & dosha matrices.',
      color: 'bg-teal-50 border-teal-200 text-teal-950',
    },
    {
      title: '📊 Prakriti Analytics',
      desc: 'Transparent questionnaire-based scoring with real-time Recharts Radar Chart visualization.',
      color: 'bg-purple-50 border-purple-200 text-purple-950',
    },
    {
      title: '🎤 Voice Assisted',
      desc: 'Web Speech API dictation supporting Hindi and English for hands-free clinical notes entry.',
      color: 'bg-blue-50 border-blue-200 text-blue-950',
    },
    {
      title: '🔗 ABDM Ready',
      desc: 'Interoperable data architecture with FHIR R4 document mapping and simulated ABHA consent.',
      color: 'bg-cyan-50 border-cyan-200 text-cyan-950',
    },
    {
      title: '🔎 NAMASTE Terminology',
      desc: 'Standardized AYUSH disease and morbidity lookup layer embedded throughout case-taking.',
      color: 'bg-amber-50 border-amber-200 text-amber-950',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-emerald-600" />
          <span>System Settings & Architecture Overview</span>
        </h1>
        <p className="text-xs text-slate-500">
          Practitioner credentials, clinical decision support rules, and standardized NAMASTE terminology.
        </p>
      </div>

      {/* Grid: Practitioner Profile & Differentiator Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Practitioner Profile */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Practitioner Profile & Registration</span>
            </h2>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {user.name?.charAt(0) || 'D'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                  Role: {user.role?.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Registration Number</span>
                <span className="font-mono font-bold text-slate-900">{user.registration_no || 'AYU-DEL-2018-4912'}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Associated Healthcare Facility</span>
                <span className="font-bold text-slate-900">{user.clinic_name || 'All India Institute of Ayurveda'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Key Innovation Differentiators */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Key Architectural Differentiators (SIH PS 26047)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {differentiators.map((d, i) => (
                <div key={i} className={`p-3.5 rounded-xl border ${d.color} space-y-1`}>
                  <h3 className="font-bold text-xs text-slate-900">{d.title}</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Standardized NAMASTE Terminology Explorer */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Standardized NAMASTE AYUSH Terminology Library</span>
            </h2>
            <p className="text-xs text-slate-500">
              Reference morbidity codes and Ayurvedic diagnostic classifications.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search terminology..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {terminologyList.map((term) => (
            <div
              key={term.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                  {term.code}
                </span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                  {term.dosha_affinity || term.category}
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 pt-0.5">{term.preferred_term}</h4>
              {term.description && (
                <p className="text-[11px] text-slate-500 line-clamp-2">{term.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
