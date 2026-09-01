import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Heart,
  Pill,
  AlertTriangle,
  Calendar,
  History,
  FolderOpen,
  QrCode,
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { getActivePatient, api } from '../../services/api';
import { PatientHealthSummary as PatientHealthSummaryType } from '../../types/portal';
import { Badge } from '../../components/common/Badge';

export const PatientHealthSummary: React.FC = () => {
  const navigate = useNavigate();
  const activePatient = getActivePatient();
  const [summary, setSummary] = useState<PatientHealthSummaryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.getPatientHealthSummary(activePatient.id);
        setSummary(data);
      } catch (err) {
        console.error('Failed to load summary:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activePatient.id]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <span>Longitudinal Health Record & EHR Summary</span>
          </h1>
          <p className="text-xs text-slate-500">
            Unified portable health history combining consultations, prescriptions, reports, and digitized documents.
          </p>
        </div>

        <button
          onClick={() => navigate('/patient/share')}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <QrCode className="w-4 h-4" />
          <span>Generate Share QR</span>
        </button>
      </div>

      {/* Patient Profile Card */}
      {summary && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-teal-600/20">
              {summary.patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{summary.patient.name}</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-mono font-bold text-slate-800">{summary.patient.patient_code}</span>
                <span>•</span>
                <span>{summary.patient.age} yrs, {summary.patient.gender}</span>
                <span>•</span>
                <span>{summary.patient.city}, {summary.patient.state}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Consultations</span>
              <span className="text-sm font-bold text-slate-800">{summary.total_consultations}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Prescriptions</span>
              <span className="text-sm font-bold text-slate-800">{summary.total_prescriptions}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Documents</span>
              <span className="text-sm font-bold text-slate-800">{summary.total_documents}</span>
            </div>
          </div>
        </div>
      )}

      {/* Critical Health Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Allergies */}
        <div className="bg-white p-5 rounded-xl border border-red-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-red-900 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Known Allergies</span>
            </h3>
            <Badge variant="rose">Safety Alert</Badge>
          </div>
          <p className="text-xs text-slate-800 font-medium">
            {summary?.allergies || 'No known drug or food allergies on record.'}
          </p>
        </div>

        {/* Current Medications */}
        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>Current Medications</span>
            </h3>
            <Badge variant="emerald">Active</Badge>
          </div>
          <p className="text-xs text-slate-800 font-medium">
            {summary?.current_medications || 'None recorded'}
          </p>
        </div>

        {/* Diagnosed Conditions */}
        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Heart className="w-4 h-4 text-amber-600" />
              <span>Medical History</span>
            </h3>
            <Badge variant="amber">Co-morbidities</Badge>
          </div>
          <p className="text-xs text-slate-800 font-medium">
            {summary?.medical_history || 'No chronic co-morbidities recorded'}
          </p>
        </div>
      </div>

      {/* Longitudinal Timeline Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <History className="w-4 h-4 text-teal-600" />
          <span>Longitudinal Event Chronology (2026)</span>
        </h3>

        {loading ? (
          <p className="text-xs text-slate-400 py-6 text-center">Loading timeline...</p>
        ) : !summary || summary.timeline.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No longitudinal records found.</p>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {summary.timeline.map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-4 pl-1">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 ring-4 ring-white z-10">
                  {idx + 1}
                </span>
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{item.title}</span>
                    <Badge variant={item.type === 'Consultation' ? 'blue' : 'slate'} dot>
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{item.facility}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
