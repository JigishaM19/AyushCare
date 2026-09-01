import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  ShieldCheck,
  Share2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Heart,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/common/Modal';

export const PatientNew: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    city: 'New Delhi',
    state: 'Delhi',
    emergency_contact: '',
    emergency_relationship: '',
    abha_id: '',
    abha_status: 'Unlinked',
    allergies: '',
    medical_history: '',
    current_medications: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAbhaModal, setShowAbhaModal] = useState(false);
  const [linkingAbha, setLinkingAbha] = useState(false);

  const handleChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSimulateAbhaLink = () => {
    setLinkingAbha(true);
    setTimeout(() => {
      const generatedAbha = `91-${formData.phone || '9876'}-2026-4491@abdm`;
      setFormData((prev) => ({
        ...prev,
        abha_id: generatedAbha,
        abha_status: 'Linked',
      }));
      setLinkingAbha(false);
      setShowAbhaModal(false);
    }, 900);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.age || !formData.phone.trim()) {
      setError('Please provide patient name, age, and phone number.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const created = await api.createPatient({
        ...formData,
        age: Number(formData.age),
      });
      navigate(`/cases/new?patientId=${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to register patient.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoValues = () => {
    setFormData({
      name: 'Priyanka Sen',
      dob: '1992-08-14',
      age: '32',
      gender: 'Female',
      phone: '9876543210',
      email: 'priyanka.sen@example.com',
      address: 'A-14, Green Park Extension',
      city: 'New Delhi',
      state: 'Delhi',
      emergency_contact: 'Subhash Sen (Father)',
      emergency_relationship: 'Parent',
      abha_id: '91-9876-5432-1099@abdm',
      abha_status: 'Linked',
      allergies: 'Penicillin, Shellfish',
      medical_history: 'Tension headaches, mild episodic acidity',
      current_medications: 'Occasional antacids',
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-600" />
              <span>Register New Patient</span>
            </h1>
            <p className="text-xs text-slate-500">
              Create electronic health record with baseline allergies and simulated ABHA linking.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFillDemoValues}
          className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-lg border border-emerald-300 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pre-fill Sample Patient</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Demographics */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-emerald-800 border-b border-slate-100 pb-2">
            1. Primary Demographic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Priyanka Sen"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Age (Years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                max="130"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="e.g. 32"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g. patient@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Residential address"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City & State</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="City"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                />
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="State"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Baseline & Safety Alerts */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-emerald-800 border-b border-slate-100 pb-2">
            2. Clinical Safety & Baseline Health
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-rose-800 mb-1">
                Known Drug / Food Allergies
              </label>
              <textarea
                rows={3}
                value={formData.allergies}
                onChange={(e) => handleChange('allergies', e.target.value)}
                placeholder="e.g. Sulfa drugs, Peanuts, Dust..."
                className="w-full bg-rose-50/50 border border-rose-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-amber-900 mb-1">
                Existing Chronic Medical Conditions
              </label>
              <textarea
                rows={3}
                value={formData.medical_history}
                onChange={(e) => handleChange('medical_history', e.target.value)}
                placeholder="e.g. Hypertension, Hypothyroidism, GERD..."
                className="w-full bg-amber-50/50 border border-amber-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-blue-900 mb-1">
                Current Routine Medications
              </label>
              <textarea
                rows={3}
                value={formData.current_medications}
                onChange={(e) => handleChange('current_medications', e.target.value)}
                placeholder="e.g. Daily vitamin supplements, SOS analgesics..."
                className="w-full bg-blue-50/50 border border-blue-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: ABDM / ABHA Linking */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-emerald-800">
                3. Ayushman Bharat Digital Mission (ABHA) Linking
              </h2>
              <p className="text-[11px] text-slate-500">
                Simulated interoperability linking workflow for demonstration.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAbhaModal(true)}
              className="inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-teal-300 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{formData.abha_status === 'Linked' ? 'ABHA Linked' : 'Link Demo ABHA'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ABHA Health Address ID</label>
              <input
                type="text"
                value={formData.abha_id}
                onChange={(e) => handleChange('abha_id', e.target.value)}
                placeholder="e.g. 91-9876-5432-1099@abdm"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <input
                type="text"
                readOnly
                value={formData.abha_status}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? 'Creating Patient...' : 'Register & Start Case-Taking'}</span>
          </button>
        </div>
      </form>

      {/* Simulated ABHA Consent Modal */}
      <Modal
        isOpen={showAbhaModal}
        onClose={() => setShowAbhaModal(false)}
        title="Simulated ABDM / ABHA Consent Gateway"
        subtitle="DEMO / SIMULATED INTEGRATION — National Health Authority Mockup"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 text-[11px] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              This is a simulated ABDM consent artifact for demonstration. No real government servers or OTPs are invoked.
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
            <p><strong>Patient Name:</strong> {formData.name || 'Priyanka Sen'}</p>
            <p><strong>Phone:</strong> {formData.phone || '9876543210'}</p>
            <p><strong>HIP Name:</strong> All India Institute of Ayurveda OPD</p>
            <p><strong>Purpose of Access:</strong> Care Management / Digital Case-Taking (FHIR R4)</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAbhaModal(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSimulateAbhaLink}
              disabled={linkingAbha}
              className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-lg"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{linkingAbha ? 'Verifying OTP...' : 'Grant Simulated Consent & Link'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
