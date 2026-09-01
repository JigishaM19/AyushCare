import React, { useState, useEffect } from 'react';
import {
  Share2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Building2,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';

export const AbdmIntegration: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number>(1);
  const [linking, setLinking] = useState(false);
  const [linkedResult, setLinkedResult] = useState<any | null>(null);
  const [fhirPreview, setFhirPreview] = useState<any | null>(null);
  const [loadingFhir, setLoadingFhir] = useState(false);

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await api.getPatients();
        setPatients(data);
        if (data.length > 0) {
          setSelectedPatientId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load patients for ABDM demo:', err);
      }
    }
    loadPatients();
  }, []);

  const handleSimulateLinking = async () => {
    setLinking(true);
    try {
      const res = await api.linkAbhaDemo({
        patient_id: selectedPatientId,
        consent_granted: true,
      });
      setLinkedResult(res);

      // Refresh patients list
      const updatedList = await api.getPatients();
      setPatients(updatedList);
    } catch (err) {
      console.error('Simulated link error:', err);
    } finally {
      setLinking(false);
    }
  };

  const handleLoadFhirPreview = async () => {
    setLoadingFhir(true);
    try {
      // Use encounter 1 as sample
      const res = await api.getFhirPreview(1);
      setFhirPreview(res);
    } catch (err) {
      console.error('FHIR preview error:', err);
    } finally {
      setLoadingFhir(false);
    }
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-teal-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
              DEMO / SIMULATED INTEGRATION
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mt-2 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-teal-400" />
            <span>ABDM / ABHA Interoperability Gateway</span>
          </h1>
          <p className="text-xs sm:text-sm text-teal-200/90 mt-0.5 max-w-2xl">
            Simulate patient demographic linking, consent artifact creation, and FHIR R4 clinical bundle export.
          </p>
        </div>

        <button
          onClick={handleSimulateLinking}
          disabled={linking}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{linking ? 'Linking ABHA...' : 'Link Active Demo ABHA'}</span>
        </button>
      </div>

      {/* Workflow Stepper Diagram */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-emerald-800">
          Simulated ABDM Consent Workflow Architecture
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs mb-2">
              1
            </span>
            <p className="font-bold text-slate-900">Patient Identification</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Lookup via ABHA Number / Health ID address.</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs mb-2">
              2
            </span>
            <p className="font-bold text-slate-900">Consent Request</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Electronic HIP consent pin sent to mobile.</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs mb-2">
              3
            </span>
            <p className="font-bold text-slate-900">Patient Grants Consent</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Signed cryptographic consent artifact returned.</p>
          </div>

          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2">
              4
            </span>
            <p className="font-bold text-emerald-950">Record Linked</p>
            <p className="text-[11px] text-emerald-800 mt-0.5">Encrypted FHIR R4 clinical consultation synced.</p>
          </div>
        </div>
      </div>

      {/* Patient ABHA Linking Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Simulate Patient ABHA Linking</h3>
              {selectedPatient && (
                <Badge variant={selectedPatient.abha_status === 'Linked' ? 'emerald' : 'slate'} dot>
                  {selectedPatient.abha_status}
                </Badge>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Patient to Link
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.patient_code}) — {p.abha_status || 'Unlinked'}
                  </option>
                ))}
              </select>
            </div>

            {selectedPatient && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <p><strong>Name:</strong> {selectedPatient.name}</p>
                <p><strong>ABHA ID:</strong> {selectedPatient.abha_id || 'Not linked yet'}</p>
                <p><strong>Registered Phone:</strong> {selectedPatient.phone}</p>
                <p><strong>City / State:</strong> {selectedPatient.city}, {selectedPatient.state}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSimulateLinking}
              disabled={linking}
              className="w-full inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{linking ? 'Executing Simulated Link...' : 'Execute Demo ABHA Linking'}</span>
            </button>
          </div>
        </div>

        {/* Right: FHIR R4 Bundle Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span>FHIR R4 Resource Preview</span>
              </h3>
              <button
                type="button"
                onClick={handleLoadFhirPreview}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                {loadingFhir ? 'Generating...' : 'Refresh Bundle'}
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Structured FHIR Document Bundle mapping Patient, Practitioner, and Encounter resources.
            </p>

            <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-800">
              {fhirPreview
                ? JSON.stringify(fhirPreview, null, 2)
                : `// Click "Refresh Bundle" to generate live FHIR R4 schema`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
