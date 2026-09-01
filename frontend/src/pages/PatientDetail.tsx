import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  ArrowLeft,
  FilePlus2,
  History,
  Share2,
  Calendar,
  AlertTriangle,
  Heart,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PieChart
} from 'lucide-react';
import { Patient } from '../types/patient';
import { Encounter } from '../types/case';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';

export const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'prescriptions' | 'abha'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const pData = await api.getPatient(Number(id));
        setPatient(pData);
        const encData = await api.getEncounters({ patient_id: Number(id) });
        setEncounters(encData);
      } catch (err) {
        console.error('Failed to load patient detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading patient record...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-xs text-rose-600 font-bold">Patient record not found.</p>
        <button
          onClick={() => navigate('/patients')}
          className="text-xs text-emerald-700 underline font-semibold"
        >
          Return to Patients Directory
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Navigation & Profile Header */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/patients')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patients Directory</span>
        </button>

        {/* Patient Hero Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-emerald-950/20">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{patient.name}</h1>
                <Badge variant={patient.gender === 'Male' ? 'blue' : 'purple'}>
                  {patient.gender}, {patient.age} yrs
                </Badge>
                <Badge variant={patient.abha_status === 'Linked' ? 'emerald' : 'amber'} dot>
                  ABHA: {patient.abha_status || 'Unlinked'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Patient Code: <span className="font-semibold text-slate-700">{patient.patient_code}</span> | Phone: {patient.phone} | {patient.city}, {patient.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate(`/cases/new?patientId=${patient.id}`)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>+ Start New Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Clinical Overview
        </button>
        <button
          onClick={() => setActiveTab('cases')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'cases'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Cases & Encounters ({encounters.length})
        </button>
        <button
          onClick={() => setActiveTab('abha')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'abha'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          ABDM / ABHA Status
        </button>
      </div>

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Allergies & Baseline */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-emerald-800 border-b border-slate-100 pb-2">
              Clinical Baseline Safety
            </h3>

            <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3">
              <span className="text-[11px] font-bold text-rose-800 block mb-0.5">Known Allergies</span>
              <p className="text-xs text-rose-950">{patient.allergies || 'No known allergies reported (NKA)'}</p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3">
              <span className="text-[11px] font-bold text-amber-800 block mb-0.5">Chronic Co-morbidities</span>
              <p className="text-xs text-amber-950">{patient.medical_history || 'No chronic history recorded'}</p>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3">
              <span className="text-[11px] font-bold text-blue-800 block mb-0.5">Current Medications</span>
              <p className="text-xs text-blue-950">{patient.current_medications || 'None on record'}</p>
            </div>
          </div>

          {/* Recent Case Card */}
          <div className="md:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-emerald-800">
                Most Recent Clinical Case
              </h3>
              {encounters.length > 0 && (
                <Badge variant="emerald" dot>{encounters[0].status}</Badge>
              )}
            </div>

            {encounters.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No past consultations found for this patient. Click "+ Start New Case" above.
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-800">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">Chief Complaint:</span>
                  <p className="text-slate-700 mt-0.5">{encounters[0].chief_complaint || 'General consultation'}</p>
                </div>

                {encounters[0].hpi && (
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block text-xs">HPI Summary:</span>
                    <p className="text-slate-700 mt-0.5">{encounters[0].hpi}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    Consultation Date: {new Date(encounters[0].date).toLocaleDateString('en-IN')}
                  </span>
                  <button
                    onClick={() => navigate(`/cases/${encounters[0].id}`)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
                  >
                    Open Full Case Sheet →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Cases */}
      {activeTab === 'cases' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase">
            All Clinical Encounters ({encounters.length})
          </div>
          <div className="divide-y divide-slate-100">
            {encounters.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No encounters recorded yet.
              </div>
            ) : (
              encounters.map((enc) => (
                <div key={enc.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Encounter #{enc.id}</span>
                      <Badge variant={enc.status === 'Completed' ? 'emerald' : 'amber'} dot>
                        {enc.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600 font-medium mt-1">
                      {enc.chief_complaint || 'No complaint specified'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      Date: {new Date(enc.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/cases/${enc.id}`)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors shrink-0"
                  >
                    Open Case Sheet
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content: ABDM / ABHA */}
      {activeTab === 'abha' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-teal-600" />
                <span>ABDM / ABHA Digital Record Status</span>
              </h3>
              <p className="text-xs text-slate-500">
                Simulated NHA interoperability consent artifact
              </p>
            </div>
            <Badge variant={patient.abha_status === 'Linked' ? 'emerald' : 'amber'} dot>
              {patient.abha_status || 'Unlinked'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">ABHA Address ID</span>
              <span className="text-sm font-bold text-slate-900 font-mono">{patient.abha_id || 'Not linked'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Registered Mobile</span>
              <span className="text-sm font-bold text-slate-900 font-mono">{patient.phone}</span>
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Simulated Consent Artifact</span>
            </p>
            <p className="text-[11px] text-emerald-900">
              Consent ID: CONSENT-{patient.id}-2026-X89 | Status: GRANTED | Purpose: OPD Case Taking & Caregiving
            </p>
            <p className="text-[10px] text-emerald-800">
              FHIR R4 standard data modeling active for OP consultation bundles.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
