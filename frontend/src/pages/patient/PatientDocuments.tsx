import React, { useState, useEffect } from 'react';
import {
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  FileCode,
  ShieldCheck,
  Eye,
  Trash2,
  Building2,
  FolderOpen
} from 'lucide-react';
import { getActivePatient, api } from '../../services/api';
import { MedicalDocItem } from '../../types/portal';
import { Badge } from '../../components/common/Badge';

export const PatientDocuments: React.FC = () => {
  const activePatient = getActivePatient();
  const [documents, setDocuments] = useState<MedicalDocItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload Form State
  const [docType, setDocType] = useState('Previous Prescription');
  const [fileName, setFileName] = useState('');
  const [hospitalSource, setHospitalSource] = useState('City General Hospital (Hospital B)');
  const [ocrPreview, setOcrPreview] = useState<any | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadDocs();
  }, [activePatient.id]);

  async function loadDocs() {
    setLoading(true);
    try {
      const data = await api.getPatientDocuments(activePatient.id);
      setDocuments(data);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSimulateUpload = async (type: string, name: string) => {
    setProcessing(true);
    try {
      // 1. Process OCR
      const ocrResult = await api.processDocumentOcr({
        file_name: name,
        document_type: type
      });
      setOcrPreview(ocrResult);

      // 2. Save document record
      await api.uploadPatientDocument({
        patient_id: activePatient.id,
        document_type: type,
        file_name: name,
        ocr_text: ocrResult.extracted_text,
        hospital_source: hospitalSource
      });

      // Reload list
      await loadDocs();
    } catch (err) {
      console.error('Document processing error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-teal-600" />
            <span>My Medical Documents & OCR Digitization</span>
          </h1>
          <p className="text-xs text-slate-500">
            Digitize prescriptions, lab blood reports, and discharge summaries for your longitudinal record.
          </p>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Clinical Extraction Notice: </span>
          OCR extracted information is presented for review and requires practitioner confirmation before clinical decision making.
        </div>
      </div>

      {/* Main Grid: Upload Dropzone & Live OCR Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Upload Dropzone */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Upload className="w-4 h-4 text-teal-600" />
              <span>Upload or Scan Medical Document</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Document Category</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                >
                  <option value="Previous Prescription">Previous Prescription</option>
                  <option value="Blood Report">Blood / Biochemistry Report</option>
                  <option value="Imaging Report">Imaging / X-Ray / MRI Report</option>
                  <option value="Discharge Summary">Hospital Discharge Summary</option>
                  <option value="Other Medical Document">Other Medical Document</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Source Hospital / Clinic</label>
                <input
                  type="text"
                  value={hospitalSource}
                  onChange={(e) => setHospitalSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                />
              </div>

              {/* Large Drop Zone Area */}
              <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 text-center space-y-3 bg-slate-50/60 transition-colors">
                <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Drag & Drop your document here, or choose file
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Accepted formats: PDF, JPG, PNG (Max 10MB)
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateUpload(docType, `Document_${docType.replace(/\s+/g, '_')}_2026.pdf`)}
                    disabled={processing}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all"
                  >
                    {processing ? 'Processing OCR...' : 'Choose File & Extract'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateUpload(docType, `Camera_Scan_${Date.now()}.jpg`)}
                    disabled={processing}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Scan with Camera</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-time OCR & AI Extraction Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>AI / OCR Extraction Review</span>
              </h2>
              {ocrPreview && (
                <Badge variant="amber" dot>
                  {ocrPreview.processing_status}
                </Badge>
              )}
            </div>

            {!ocrPreview ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Upload or scan a document on the left to inspect extracted clinical parameters.
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900 mb-1">Extracted Key Parameters:</p>
                  <div className="space-y-1">
                    {ocrPreview.key_information.map((k: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-0.5">
                        <span className="text-slate-500">{k.parameter}:</span>
                        <span className="font-bold text-slate-900">{k.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-700">Raw OCR Text:</span>
                  <pre className="bg-slate-900 text-teal-400 p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-40 whitespace-pre-wrap">
                    {ocrPreview.extracted_text}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Archive Timeline Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Stored Medical Document History</h3>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            {documents.length} Records on File
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3.5">Document Name & Date</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Hospital / Facility</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">Loading documents...</td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">No documents uploaded yet.</td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{doc.file_name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(doc.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {doc.file_size_kb} KB
                      </p>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded">
                        {doc.document_type}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">
                      {doc.hospital_source}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={doc.processing_status === 'Processed' ? 'emerald' : 'amber'} dot>
                        {doc.processing_status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setOcrPreview({
                          extracted_text: doc.ocr_text,
                          key_information: doc.key_info_json ? JSON.parse(doc.key_info_json) : [],
                          processing_status: doc.processing_status
                        })}
                        className="text-xs text-teal-700 font-bold hover:underline"
                      >
                        Inspect OCR →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
