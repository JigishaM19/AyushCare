import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  ClipboardList,
  Upload,
  FileText,
  Pill,
  FileCheck2,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Activity,
  History
} from 'lucide-react';
import { getActivePatient, api } from '../../services/api';
import { PatientHealthSummary } from '../../types/portal';
import { Badge } from '../../components/common/Badge';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const activePatient = getActivePatient();
  const [summary, setSummary] = useState<PatientHealthSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.getPatientHealthSummary(activePatient.id);
        setSummary(data);
      } catch (err) {
        console.error('Failed to load patient summary:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activePatient.id]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-teal-700/60 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-teal-400/30">
              Personal Health Dashboard
            </span>
            <span className="text-xs text-teal-200/80">ABHA: {summary?.patient.abha_id || '91-9876-5432-1001'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {activePatient.name}
          </h1>
          <p className="text-xs sm:text-sm text-teal-200/90 font-mono">
            Patient ID: {activePatient.patient_code || 'AYU-2026-001'} • Age: {activePatient.age} yrs • Gender: {activePatient.gender}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 relative z-10">
          <button
            onClick={() => navigate('/patient/onboarding')}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Start Health Assessment</span>
          </button>
          <button
            onClick={() => navigate('/patient/share')}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
          >
            <QrCode className="w-4 h-4 text-teal-300" />
            <span>Share My Records</span>
          </button>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => navigate('/patient/onboarding')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs text-left transition-all space-y-2 group"
        >
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ClipboardList className="w-5 h-5" />
          </div>
          <p className="font-bold text-xs text-slate-800">Health Assessment</p>
          <p className="text-[10px] text-slate-500">First-time profile</p>
        </button>

        <button
          onClick={() => navigate('/patient/documents')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs text-left transition-all space-y-2 group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <p className="font-bold text-xs text-slate-800">Upload Documents</p>
          <p className="text-[10px] text-slate-500">Scan prescriptions</p>
        </button>

        <button
          onClick={() => navigate('/patient/health-summary')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs text-left transition-all space-y-2 group"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <p className="font-bold text-xs text-slate-800">Health History</p>
          <p className="text-[10px] text-slate-500">Longitudinal EHR</p>
        </button>

        <button
          onClick={() => navigate('/patient/health-summary')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs text-left transition-all space-y-2 group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Pill className="w-5 h-5" />
          </div>
          <p className="font-bold text-xs text-slate-800">My Prescriptions</p>
          <p className="text-[10px] text-slate-500">{summary?.total_prescriptions || 0} active</p>
        </button>

        <button
          onClick={() => navigate('/patient/documents')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs text-left transition-all space-y-2 group"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <p className="font-bold text-xs text-slate-800">Lab Reports</p>
          <p className="text-[10px] text-slate-500">{summary?.total_documents || 0} files</p>
        </button>

        <button
          onClick={() => navigate('/patient/share')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs text-left transition-all space-y-2 group"
        >
          <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <p className="font-bold text-xs text-slate-800">Share QR Code</p>
          <p className="text-[10px] text-slate-500">Cross-hospital</p>
        </button>
      </div>

      {/* Main Grid: Health Summary (Left) & Recent Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Health Summary Overview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>My Active Health Summary</span>
              </h2>
              <button
                onClick={() => navigate('/patient/health-summary')}
                className="text-xs text-teal-600 font-bold hover:underline"
              >
                Full Record →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Allergies */}
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
                <span className="font-bold text-red-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>Allergies</span>
                </span>
                <p className="text-slate-800 font-medium">
                  {summary?.allergies || 'No known allergies reported (NKA)'}
                </p>
              </div>

              {/* Current Medications */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Current Medications</span>
                </span>
                <p className="text-slate-800 font-medium">
                  {summary?.current_medications || 'None on record'}
                </p>
              </div>

              {/* Medical Conditions */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-600" />
                  <span>Existing Conditions</span>
                </span>
                <p className="text-slate-800 font-medium">
                  {summary?.medical_history || 'No chronic conditions recorded'}
                </p>
              </div>

              {/* Last Consultation */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Last Consultation</span>
                </span>
                <p className="text-slate-800 font-medium line-clamp-1">
                  {summary?.recent_consultation || 'Checkup (12 Aug 2026)'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Timeline Activity */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <History className="w-4 h-4 text-teal-600" />
              <span>Recent Longitudinal Activity</span>
            </h2>

            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading activity...</p>
            ) : !summary || summary.timeline.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No recent records found.</p>
            ) : (
              <div className="space-y-3">
                {summary.timeline.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {item.type === 'Consultation' ? 'OPD' : item.type === 'Document' ? 'DOC' : 'RX'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-900 truncate">{item.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{item.facility}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
