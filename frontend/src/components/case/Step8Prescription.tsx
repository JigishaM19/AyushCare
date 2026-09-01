import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  Search,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { PrescriptionItem, Formulation } from '../../types/prescription';
import { Patient } from '../../types/patient';
import { api, getSavedUser } from '../../services/api';
import { Modal } from '../common/Modal';

interface Step8PrescriptionProps {
  patient: Patient | null;
  encounterId?: number;
  items: PrescriptionItem[];
  onChangeItems: (items: PrescriptionItem[]) => void;
  generalAdvice: string;
  onChangeGeneralAdvice: (val: string) => void;
  dietPathya: string;
  onChangeDietPathya: (val: string) => void;
  dietApathya: string;
  onChangeDietApathya: (val: string) => void;
  followUpDate: string;
  onChangeFollowUpDate: (val: string) => void;
  onSaveCase: () => void;
  isSaving?: boolean;
}

export const Step8Prescription: React.FC<Step8PrescriptionProps> = ({
  patient,
  encounterId,
  items,
  onChangeItems,
  generalAdvice,
  onChangeGeneralAdvice,
  dietPathya,
  onChangeDietPathya,
  dietApathya,
  onChangeDietApathya,
  followUpDate,
  onChangeFollowUpDate,
  onSaveCase,
  isSaving = false,
}) => {
  const [formulations, setFormulations] = useState<Formulation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const practitioner = getSavedUser() || {
    name: 'Dr. Rajesh Varma',
    registration_no: 'AYU-DEL-2018-4912',
    clinic_name: 'All India Institute of Ayurveda Clinical OPD',
  };

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  useEffect(() => {
    async function loadFormulations() {
      try {
        const data = await api.searchFormulations(searchQuery);
        setFormulations(data);
      } catch (err) {
        console.error('Failed to search formulations:', err);
      }
    }
    loadFormulations();
  }, [searchQuery]);

  const handleAddBlankItem = () => {
    const newItem: PrescriptionItem = {
      formulation: '',
      form: 'Vati/Tablet',
      dosage: '1 tablet (250mg)',
      frequency: 'Twice daily (BD)',
      duration: '14 days',
      timing: 'After Food',
      anupana: 'Warm Water',
      instructions: 'Take with warm water after meals',
    };
    onChangeItems([...items, newItem]);
  };

  const handleSelectFormulation = (formulation: Formulation) => {
    const newItem: PrescriptionItem = {
      formulation: formulation.name,
      form: formulation.form,
      dosage: formulation.standard_dosage,
      frequency: formulation.standard_frequency || 'Twice daily (BD)',
      duration: '14 days',
      timing: formulation.standard_timing || 'After Food',
      anupana: formulation.default_anupana || 'Warm Water',
      instructions: formulation.indications ? `For ${formulation.indications.split(',')[0]}` : '',
    };
    onChangeItems([...items, newItem]);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const handleUpdateItem = (index: number, field: keyof PrescriptionItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChangeItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    onChangeItems(items.filter((_, idx) => idx !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>Digital Prescription & Chikitsa Generator</span>
          </h2>
          <p className="text-xs text-slate-500">
            Select standard formulations, adjust dosage & Anupana, and generate printable prescription slip.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Preview & Print PDF</span>
          </button>

          <button
            type="button"
            onClick={onSaveCase}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Saving Record...' : 'Complete & Save Case'}</span>
          </button>
        </div>
      </div>

      {/* Formulation Search & Quick Add */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold text-slate-800">
            Search Ayurvedic Reference Formulations (Classical / Proprietary)
          </label>
          <button
            type="button"
            onClick={handleAddBlankItem}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Row</span>
          </button>
        </div>

        <div className="relative">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              placeholder="Search formulation (e.g., Saraswatarishta, Yograj Guggulu, Brahmi Vati, Avipattikar Churna)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && formulations.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-56 overflow-y-auto">
              {formulations.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleSelectFormulation(f)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50 border-b border-slate-50 last:border-0 flex items-center justify-between gap-3 group text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-emerald-900">
                      {f.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {f.form} • Std Dose: {f.standard_dosage} • Anupana: {f.default_anupana}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    + Add
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescription Items Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Prescription Schedule ({items.length} Formulations)
          </h3>
          <span className="text-[11px] text-slate-500">
            Practitioner verification required
          </span>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No medications added yet. Search or add a formulation above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3 min-w-[180px]">Medicine / Formulation</th>
                  <th className="p-3 min-w-[110px]">Dosage</th>
                  <th className="p-3 min-w-[130px]">Frequency</th>
                  <th className="p-3 min-w-[100px]">Duration</th>
                  <th className="p-3 min-w-[120px]">Timing</th>
                  <th className="p-3 min-w-[140px]">Anupana (Vehicle)</th>
                  <th className="p-3 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.formulation}
                        onChange={(e) => handleUpdateItem(idx, 'formulation', e.target.value)}
                        placeholder="Formulation name"
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-900 focus:bg-white"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.dosage}
                        onChange={(e) => handleUpdateItem(idx, 'dosage', e.target.value)}
                        placeholder="e.g. 20 ml, 2 tabs"
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:bg-white"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={item.frequency}
                        onChange={(e) => handleUpdateItem(idx, 'frequency', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:bg-white"
                      >
                        <option value="Once daily (OD)">Once daily (OD)</option>
                        <option value="Twice daily (BD)">Twice daily (BD)</option>
                        <option value="Thrice daily (TID)">Thrice daily (TID)</option>
                        <option value="Bedtime (HS)">Bedtime (HS)</option>
                        <option value="As needed (SOS)">As needed (SOS)</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.duration}
                        onChange={(e) => handleUpdateItem(idx, 'duration', e.target.value)}
                        placeholder="e.g. 14 days"
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:bg-white"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={item.timing}
                        onChange={(e) => handleUpdateItem(idx, 'timing', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:bg-white"
                      >
                        <option value="After Food">After Food (Adhobhakta)</option>
                        <option value="Before Food">Before Food (Pragbhakta)</option>
                        <option value="With Food">With Food (Samabhakta)</option>
                        <option value="Empty Stomach">Empty Stomach (Abhakta)</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.anupana}
                        onChange={(e) => handleUpdateItem(idx, 'anupana', e.target.value)}
                        placeholder="e.g. Warm water, Milk"
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:bg-white"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove medication"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pathya / Apathya & Clinical Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-emerald-800">
            Wholesome Diet (Pathya Ahara / Vihara)
          </label>
          <textarea
            rows={3}
            value={dietPathya}
            onChange={(e) => onChangeDietPathya(e.target.value)}
            placeholder="e.g. Warm mung dal khichdi, pomegranate, soaked raisins, regular sleep..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-rose-800">
            Unwholesome Foods to Avoid (Apathya)
          </label>
          <textarea
            rows={3}
            value={dietApathya}
            onChange={(e) => onChangeDietApathya(e.target.value)}
            placeholder="e.g. Skipping breakfast, cold carbonated drinks, excess deep-fried food..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            Follow-Up Schedule & General Advice
          </label>
          <input
            type="text"
            value={followUpDate}
            onChange={(e) => onChangeFollowUpDate(e.target.value)}
            placeholder="e.g. 14 days (After two weeks)"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 mb-2"
          />
          <textarea
            rows={2}
            value={generalAdvice}
            onChange={(e) => onChangeGeneralAdvice(e.target.value)}
            placeholder="e.g. Nightly Shiroabhyanga with Ksheerabala taila..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Printable Prescription Modal Preview */}
      <Modal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        title="Official Clinical Prescription Slip"
        subtitle="Printable AYUSH OPD Consultation Record"
        maxWidth="2xl"
      >
        <div className="space-y-6 print:p-0">
          {/* Printable Layout Container */}
          <div className="border border-slate-300 rounded-xl p-6 bg-white space-y-6 print:border-none print:p-0">
            {/* Clinic Letterhead */}
            <div className="flex items-start justify-between pb-4 border-b-2 border-emerald-700">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-emerald-950 uppercase tracking-tight">
                  {practitioner.clinic_name || 'All India Institute of Ayurveda OPD'}
                </h2>
                <p className="text-xs text-slate-600">Ministry of Ayush / Central Clinical Services</p>
                <p className="text-[11px] text-slate-500">New Delhi, India | Phone: +91-11-2999-7700</p>
              </div>

              <div className="text-right space-y-0.5 text-xs">
                <p className="font-bold text-slate-900">{practitioner.name}</p>
                <p className="text-slate-600 text-[11px]">BAMS, MD (Ayurveda)</p>
                <p className="text-emerald-800 font-mono text-[10px] font-bold">
                  Reg: {practitioner.registration_no}
                </p>
              </div>
            </div>

            {/* Patient Demographics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">PATIENT NAME</span>
                <span className="font-bold text-slate-900">{patient?.name || 'Verified Patient'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">AGE / GENDER</span>
                <span className="font-bold text-slate-900">{patient?.age} Yrs / {patient?.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">PATIENT ID / ABHA</span>
                <span className="font-bold text-slate-900 truncate block">{patient?.patient_code}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">DATE OF VISIT</span>
                <span className="font-bold text-slate-900">{todayFormatted}</span>
              </div>
            </div>

            {/* Rx Symbol & Medication Table */}
            <div className="space-y-2">
              <div className="text-xl font-serif font-black text-emerald-900">℞</div>
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-[11px] font-bold text-slate-700 uppercase">
                    <th className="pb-2">Medicine / Formulation</th>
                    <th className="pb-2">Dose</th>
                    <th className="pb-2">Frequency</th>
                    <th className="pb-2">Duration</th>
                    <th className="pb-2">Timing & Anupana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((it, i) => (
                    <tr key={i}>
                      <td className="py-2.5 font-bold text-slate-900">
                        {it.formulation}
                        <span className="block text-[10px] font-normal text-slate-500">{it.form}</span>
                      </td>
                      <td className="py-2.5 text-slate-800">{it.dosage}</td>
                      <td className="py-2.5 text-slate-800">{it.frequency}</td>
                      <td className="py-2.5 text-slate-800">{it.duration}</td>
                      <td className="py-2.5 text-slate-800">
                        {it.timing} with {it.anupana}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Dietary Pathya & Instructions */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
              <div className="bg-emerald-50/70 p-2.5 rounded border border-emerald-200">
                <span className="font-bold text-emerald-900 block text-[11px]">Pathya (Advised):</span>
                <p className="text-[11px] text-emerald-950 mt-0.5">{dietPathya || 'Warm light diet.'}</p>
              </div>
              <div className="bg-rose-50/70 p-2.5 rounded border border-rose-200">
                <span className="font-bold text-rose-900 block text-[11px]">Apathya (To Avoid):</span>
                <p className="text-[11px] text-rose-950 mt-0.5">{dietApathya || 'Heavy, cold foods.'}</p>
              </div>
            </div>

            {/* Follow-up & Signature Section */}
            <div className="flex items-end justify-between pt-8 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-semibold">Next Follow-Up: </span>
                <span className="font-bold text-slate-900">{followUpDate || '14 days'}</span>
              </div>

              <div className="text-right">
                <div className="w-36 border-b border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-900">{practitioner.name}</p>
                <p className="text-[10px] text-slate-500">Authorized Medical Officer</p>
              </div>
            </div>

            {/* Regulatory Disclaimer */}
            <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
              Clinical Decision Support System — Final clinical assessment and prescription remain the responsibility of the qualified practitioner.
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 print:hidden">
            <button
              type="button"
              onClick={() => setShowPrintModal(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Prescription Slip</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
