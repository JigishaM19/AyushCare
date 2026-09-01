import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  RefreshCw,
  XCircle,
  Share2,
  KeyRound,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { getActivePatient, api } from '../../services/api';
import { ShareSessionInfo } from '../../types/portal';

export const PatientShare: React.FC = () => {
  const navigate = useNavigate();
  const activePatient = getActivePatient();

  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    profile: true,
    allergies: true,
    medications: true,
    consultations: true,
    investigations: true,
    prescriptions: true,
    documents: true,
  });

  const [activeSession, setActiveSession] = useState<ShareSessionInfo | null>({
    token: 'SHARE-8F29A100',
    access_code: '492811',
    expires_at: new Date(Date.now() + 30 * 60000).toISOString(),
    expires_in_minutes: 30,
    permissions: permissions,
    qr_payload: 'ayushcare://share?token=SHARE-8F29A100&code=492811',
  });

  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const togglePermission = (key: string) => {
    setPermissions({ ...permissions, [key]: !permissions[key] });
  };

  const handleGenerateShareToken = async () => {
    setLoading(true);
    try {
      const res = await api.createShareToken({
        patient_id: activePatient.id,
        duration_minutes: durationMinutes,
        permissions: permissions,
      });
      setActiveSession(res);
    } catch (err) {
      console.error('Failed to generate share token:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeShare = async () => {
    if (!activeSession) return;
    setRevoking(true);
    try {
      await api.revokeShareToken(activeSession.token);
      setActiveSession(null);
    } catch (err) {
      console.error('Revocation failed:', err);
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-teal-600" />
            <span>Share My Records (Portable Health Record)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Generate a secure, temporary QR token and 6-digit access code for doctors at other hospitals.
          </p>
        </div>

        <button
          onClick={() => navigate('/patient/access-history')}
          className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-xl border border-teal-200 transition-colors"
        >
          View Access History →
        </button>
      </div>

      {/* Security Architecture Principle Notice */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs text-teal-950 space-y-1">
        <div className="flex items-center gap-2 font-bold text-teal-900">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Patient-Controlled Cross-Hospital Interoperability</span>
        </div>
        <p className="text-teal-800 leading-relaxed">
          No medical records are embedded inside the QR code or URL. The server resolves this temporary token only after hospital authentication and your explicit consent.
        </p>
      </div>

      {/* Main Grid: Permissions & QR Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Granular Data Checkboxes & Duration */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>1. Select Information to Share</span>
            </h2>

            <div className="space-y-2 text-xs">
              {[
                { key: 'profile', label: 'Patient Demographics & Co-morbidities' },
                { key: 'allergies', label: 'Known Drug & Food Allergies (Safety Critical)' },
                { key: 'medications', label: 'Active Current Medications' },
                { key: 'consultations', label: 'Previous Doctor Consultation Notes' },
                { key: 'investigations', label: 'Lab Reports & Blood Work' },
                { key: 'prescriptions', label: 'Previous Prescriptions' },
                { key: 'documents', label: 'Digitized & Scanned Documents' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={permissions[item.key] || false}
                    onChange={() => togglePermission(item.key)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <span className="font-medium text-slate-800">{item.label}</span>
                </label>
              ))}
            </div>

            {/* Expiry Selector */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-900 block mb-2">
                2. Set Temporary Access Duration
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[15, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`py-2 px-3 rounded-xl border font-bold transition-all ${
                      durationMinutes === mins
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateShareToken}
              disabled={loading}
              className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{loading ? 'Generating...' : 'Generate New Share Token'}</span>
            </button>
          </div>
        </div>

        {/* Right: Generated QR Code & 6-Digit Access Code */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 text-center">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Temporary Share Authorization
            </h2>

            {!activeSession ? (
              <div className="py-12 text-xs text-slate-400">
                No active share token. Click "Generate New Share Token" to create one.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual QR Simulation */}
                <div className="w-48 h-48 mx-auto bg-slate-900 p-3 rounded-2xl border-4 border-teal-500/30 flex flex-col items-center justify-center relative shadow-lg">
                  <div className="grid grid-cols-4 gap-2 w-full h-full p-2 bg-white rounded-xl">
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="bg-slate-200 rounded-sm" />
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="bg-slate-200 rounded-sm" />
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="bg-slate-200 rounded-sm" />
                    <div className="bg-slate-200 rounded-sm" />
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="bg-slate-200 rounded-sm" />
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="bg-slate-200 rounded-sm" />
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="bg-slate-900 rounded-sm" />
                  </div>
                </div>

                {/* 6-Digit Access Code */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-semibold">6-Digit Temporary Access PIN</span>
                  <span className="font-mono font-black text-2xl text-teal-700 tracking-widest">
                    {activeSession.access_code}
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <p>Token: <span className="font-mono font-bold text-slate-800">{activeSession.token}</span></p>
                  <p className="flex items-center justify-center gap-1 text-emerald-700 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Valid for {activeSession.expires_in_minutes} minutes</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/hospital/shared-record?token=${activeSession.token}`)}
                    className="flex-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-bold py-2 rounded-xl border border-cyan-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Test Hospital B View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleRevokeShare}
                    disabled={revoking}
                    className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-4 py-2 rounded-xl border border-red-200 transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Revoke</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
