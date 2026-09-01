import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  UserCheck,
  MonitorCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  QrCode,
  HeartPulse,
  Share2,
  FileSpreadsheet
} from 'lucide-react';

export const LandingRoleSelect: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white flex flex-col justify-between p-6 sm:p-10 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <HeartPulse className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
              <span>AyushCare</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                SIH PS 26047
              </span>
            </h1>
            <p className="text-[11px] text-teal-300/80 font-medium">
              Ministry of Ayush / All India Institute of Ayurveda
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 border border-slate-700/60 px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Unified Clinical & Patient Ecosystem</span>
        </div>
      </header>

      {/* Main Role Selection Area */}
      <main className="max-w-5xl w-full mx-auto my-auto py-10 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
            Who are you today?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Select your portal mode to begin. The AyushCare ecosystem bridges patient pre-consultation, hospital reception kiosks, structured doctor case-taking, and portable longitudinal health records.
          </p>
        </div>

        {/* 3 Major Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Doctor / Practitioner */}
          <button
            onClick={() => navigate('/login')}
            className="group relative bg-slate-800/70 hover:bg-slate-800 border-2 border-slate-700/70 hover:border-emerald-500/80 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Practitioner Portal
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Doctor / Practitioner
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Clinical OPD dashboard, Ashtavidha Pariksha, Prakriti-Vikriti radar analytics, AI case structuring, and digital prescriptions.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Open Doctor Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Patient Portal */}
          <button
            onClick={() => navigate('/patient/dashboard')}
            className="group relative bg-slate-800/70 hover:bg-slate-800 border-2 border-slate-700/70 hover:border-teal-500/80 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
                  Patient Experience
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                  Patient Portal
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  First-time health assessment, document digitization (OCR), longitudinal health history, and secure temporary QR record sharing.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-teal-400">
              <span>Open Patient Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Hospital Kiosk */}
          <button
            onClick={() => navigate('/kiosk')}
            className="group relative bg-slate-800/70 hover:bg-slate-800 border-2 border-slate-700/70 hover:border-amber-500/80 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MonitorCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Reception / Waiting Area
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  Hospital Reception Kiosk
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Large touch & voice interface in English, Hindi & Marathi. AI adaptive questioning, document camera scan, and doctor handoff.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Launch Kiosk Mode</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Cross Hospital Record Sharing Preview Trigger */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="font-bold text-white">Cross-Hospital Record Access (Hospital B Demo): </span>
              <span className="text-slate-300">Simulate scanning a patient's QR code at another hospital with consent authorization.</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/hospital/shared-record')}
            className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 font-bold px-3 py-1.5 rounded-lg border border-cyan-700/60 shrink-0 transition-colors"
          >
            Test Hospital B View →
          </button>
        </div>
      </main>

      {/* Footer & Research Innovation Statement */}
      <footer className="max-w-5xl w-full mx-auto border-t border-slate-800 pt-6 space-y-3 text-center sm:text-left">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-[11px] text-slate-400 leading-relaxed">
          <span className="font-bold text-slate-200">Research & Product Innovation Context: </span>
          Existing research has demonstrated AI-assisted history-taking, voice-enabled patient interaction, adaptive questioning, multimodal clinical information processing, and automated summarization. This project combines patient-facing pre-consultation, structured AYUSH case-taking, medical document digitization, longitudinal health records, and standards-oriented interoperability into a workflow designed specifically for Indian healthcare environments.
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>Smart India Hackathon 2026 | Problem Statement 26047</span>
          <span>AyushCare Unified Ecosystem — Prototype Demonstration</span>
        </div>
      </footer>
    </div>
  );
};
