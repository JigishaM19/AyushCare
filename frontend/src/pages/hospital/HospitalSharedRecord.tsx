import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Share2,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Pill,
  History,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Search,
  PlusCircle,
  FilePlus2
} from 'lucide-react';
import { api } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const HospitalSharedRecord: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token') || 'SHARE-8F29A100';

  const [shareInput, setShareInput] = useState(tokenParam);
  const [hospitalName, setHospitalName] = useState('City General Hospital (Hospital B)');
  const [consentGranted, setConsentGranted] = useState(true);
  const [sharedData, setSharedData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tokenParam) {
      handleResolveRecord(tokenParam);
    }
  }, [tokenParam]);

  const handleResolveRecord = async (tokenVal?: string) => {
    const val = tokenVal || shareInput;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSharedRecord(val, hospitalName);
      setSharedData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to resolve shared record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Cross-Hospital Demo Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-cyan-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/30 text-cyan-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-cyan-400/30">
              Cross-Hospital Interoperability Demo
            </span>
            <span className="text-xs text-slate-300">Viewing as: <strong>{hospitalName}</strong></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mt-2 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-cyan-400" />
            <span>Authorized Longitudinal Health Record</span>
          </h1>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-0.5">
            Patient records retrieved via secure temporary token with explicit patient consent authorization.
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
        >
          ← Return to Doctor OPD
        </button>
      </div>

      {/* Token Input Bar & Hospital Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex-1 flex items-center gap-2 w-full">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={shareInput}
            onChange={(e) => setShareInput(e.target.value)}
            placeholder="Enter Share Token (e.g. SHARE-8F29A100) or 6-digit access PIN..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono font-bold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium"
          >
            <option value="City General Hospital (Hospital B)">City General Hospital (Hospital B)</option>
            <option value="Demo Integrative Care Centre">Demo Integrative Care Centre</option>
            <option value="Ayush Wellness Hospital">Ayush Wellness Hospital</option>
          </select>

          <button
            type="button"
            onClick={() => handleResolveRecord()}
            disabled={loading}
            className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition-all shrink-0"
          >
            {loading ? 'Resolving...' : 'Lookup Shared Record'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {sharedData && (
        <div className="space-y-6">
          {/* Patient Overview Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-800 text-white flex items-center justify-center font-bold text-xl shadow-md">
                {sharedData.patient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{sharedData.patient.name}</h2>
                  <Badge variant="emerald" dot>Consent Verified</Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {sharedData.patient.patient_code} • {sharedData.patient.age} yrs • {sharedData.patient.gender} • {sharedData.patient.city}
                </p>
              </div>
            </div>

            {/* Start New Case Button */}
            <button
              onClick={() => navigate(`/cases/new?patient_id=${sharedData.patient.id}&context=cross_hospital`)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-sm transition-all"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>+ Start New Case at {hospitalName.split(' ')[0]}</span>
            </button>
          </div>

          {/* Safety Critical Baseline: Allergies & Medications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-red-200 shadow-xs space-y-1.5">
              <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Recorded Allergies</span>
              </h3>
              <p className="text-xs font-semibold text-slate-800">{sharedData.allergies}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-xs space-y-1.5">
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>Current Medications</span>
              </h3>
              <p className="text-xs font-semibold text-slate-800">{sharedData.current_medications}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-xs space-y-1.5">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Medical History</span>
              </h3>
              <p className="text-xs font-semibold text-slate-800">{sharedData.medical_history}</p>
            </div>
          </div>

          {/* Consultations History */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <History className="w-4 h-4 text-cyan-700" />
              <span>Previous Consultations History</span>
            </h3>

            {sharedData.consultations.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No previous consultations recorded.</p>
            ) : (
              <div className="space-y-3">
                {sharedData.consultations.map((c: any) => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{c.chief_complaint || 'OPD Consultation'}</span>
                      <span className="text-slate-500">{c.date}</span>
                    </div>
                    {c.hpi && <p className="text-slate-600 leading-relaxed">{c.hpi}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Previous Prescriptions */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Pill className="w-4 h-4 text-cyan-700" />
              <span>Previous Prescriptions & Formulations</span>
            </h3>

            {sharedData.prescriptions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No prescriptions on record.</p>
            ) : (
              <div className="space-y-4">
                {sharedData.prescriptions.map((rx: any) => (
                  <div key={rx.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Prescription Date: {rx.date}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {rx.items.map((item: any, i: number) => (
                        <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
                          <p className="font-bold text-emerald-800">{item.formulation}</p>
                          <p className="text-slate-500 text-[11px]">{item.dosage} • {item.frequency} • {item.duration}</p>
                          <p className="text-slate-500 text-[11px]">Vehicle (Anupana): {item.anupana}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
