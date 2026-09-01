export interface MedicalDocItem {
  id: number;
  patient_id: number;
  document_type: string;
  file_name: string;
  file_size_kb: number;
  uploaded_at: string;
  ocr_text?: string;
  key_info_json?: string;
  processing_status: 'Uploading' | 'Processing' | 'Processed' | 'Needs Review';
  verified: boolean;
  hospital_source: string;
}

export interface PatientHealthSummary {
  patient: {
    id: number;
    patient_code: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    city: string;
    state: string;
    abha_id?: string;
    abha_status?: string;
  };
  allergies: string;
  medical_history: string;
  current_medications: string;
  recent_consultation: string;
  total_consultations: number;
  total_prescriptions: number;
  total_documents: number;
  timeline: Array<{
    id: string;
    type: 'Consultation' | 'Document' | 'Prescription' | 'Assessment';
    title: string;
    date: string;
    status: string;
    facility: string;
  }>;
  history_entries: Array<{
    category: string;
    condition: string;
    details?: string;
    source: string;
  }>;
}

export interface ShareSessionInfo {
  token: string;
  access_code: string;
  expires_at: string;
  expires_in_minutes: number;
  permissions: Record<string, boolean>;
  qr_payload: string;
}

export interface AccessLogItem {
  id: number;
  patient_id: number;
  organization: string;
  accessor_name: string;
  accessed_data: string;
  timestamp: string;
  status: string;
}

export interface KioskQuestionOption {
  id: string;
  labels: {
    en: string;
    hi: string;
    mr: string;
  };
}

export interface KioskQuestion {
  id: string;
  category: string;
  input_type: string;
  translations: {
    en: { text: string; hint: string };
    hi: { text: string; hint: string };
    mr: { text: string; hint: string };
  };
  options?: KioskQuestionOption[];
  trigger?: string;
  next_default?: string;
}
