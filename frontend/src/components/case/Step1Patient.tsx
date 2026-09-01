import React from 'react';
import { User, Phone, MapPin, AlertTriangle, ShieldCheck, Heart, FileText, CheckCircle2 } from 'lucide-react';
import { Patient } from '../../types/patient';
import { Badge } from '../common/Badge';

interface Step1PatientProps {
  patient: Patient | null;
  allPatients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onOpenNewPatientModal: () => void;
}

export const Step1Patient: React.FC<Step1PatientProps> = ({
  patient,
  allPatients,
  onSelectPatient,
  onOpenNewPatientModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Patient Selection Dropdown / Quick Switcher */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Select Active Patient for Case-Taking</span>
            </h2>
            <p className="text-xs text-slate-500">
              Verify patient baseline identification and medical safety alerts before recording symptoms.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenNewPatientModal}
            className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-lg border border-emerald-300 transition-colors"
          >
            <span>+ Register New Patient</span>
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Patient from OPD Queue
          </label>
          <select
            value={patient?.id || ''}
            onChange={(e) => {
              const selected = allPatients.find((p) => p.id === Number(e.target.value));
              if (selected) onSelectPatient(selected);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            {allPatients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.gender}, {p.age} yrs ({p.patient_code}) — Phone: {p.phone}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Verified Patient Profile Card */}
      {patient && (
        <div className="bg-gradient-to-br from-white to-slate-50/60 rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-950/20">
                {patient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{patient.name}</h3>
                  <Badge variant={patient.gender === 'Male' ? 'blue' : 'purple'}>
                    {patient.gender}, {patient.age} yrs
                  </Badge>
                  <Badge variant={patient.abha_status === 'Linked' ? 'emerald' : 'amber'} dot>
                    ABHA: {patient.abha_status || 'Unlinked'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {patient.patient_code}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Phone</span>
                <span className="font-semibold text-slate-800">{patient.phone}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">City / State</span>
                <span className="font-semibold text-slate-800">{patient.city}, {patient.state}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">ABHA ID</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {patient.abha_id || 'Not linked'}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Safety & Baseline Tags */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            {/* Allergies */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3.5">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Known Drug / Food Allergies</span>
              </div>
              <p className="text-xs text-rose-900 font-medium">
                {patient.allergies || 'No known allergies reported (NKA)'}
              </p>
            </div>

            {/* Medical History */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-1">
                <Heart className="w-3.5 h-3.5 text-amber-700" />
                <span>Existing Medical Conditions</span>
              </div>
              <p className="text-xs text-amber-950 font-medium">
                {patient.medical_history || 'No chronic co-morbidities recorded'}
              </p>
            </div>

            {/* Current Medications */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3.5">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs mb-1">
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                <span>Current Routine Medications</span>
              </div>
              <p className="text-xs text-blue-950 font-medium">
                {patient.current_medications || 'None on record'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
