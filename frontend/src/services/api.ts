const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('ayushcare_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('ayushcare_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('ayushcare_token');
  localStorage.removeItem('ayushcare_user');
  localStorage.removeItem('ayushcare_active_patient');
}

export function getSavedUser() {
  const user = localStorage.getItem('ayushcare_user');
  return user ? JSON.parse(user) : null;
}

export function setSavedUser(user: any): void {
  localStorage.setItem('ayushcare_user', JSON.stringify(user));
}

export function getActivePatient() {
  const p = localStorage.getItem('ayushcare_active_patient');
  return p ? JSON.parse(p) : { id: 1, name: 'Aarav Sharma', patient_code: 'AYU-2026-001', age: 34, gender: 'Male' };
}

export function setActivePatient(patient: any): void {
  localStorage.setItem('ayushcare_active_patient', JSON.stringify(patient));
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<any>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  
  demoLogin: (role: 'practitioner' | 'admin' = 'practitioner') =>
    request<any>(`/auth/demo-login?role=${role}`, { method: 'POST' }),
  
  getMe: () => request<any>('/auth/me'),

  // Dashboard
  getDashboardStats: () => request<any>('/dashboard/stats'),

  // Patients
  getPatients: (params?: { q?: string; gender?: string }) => {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.gender) query.append('gender', params.gender);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<any[]>(`/patients${queryString}`);
  },

  getPatient: (id: number) => request<any>(`/patients/${id}`),

  createPatient: (patient: any) =>
    request<any>('/patients', { method: 'POST', body: JSON.stringify(patient) }),

  updatePatient: (id: number, patient: any) =>
    request<any>(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(patient) }),

  // Encounters
  getEncounters: (params?: { patient_id?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.patient_id) query.append('patient_id', String(params.patient_id));
    if (params?.status) query.append('status', params.status);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<any[]>(`/encounters${queryString}`);
  },

  getEncounter: (id: number) => request<any>(`/encounters/${id}`),

  createEncounter: (encounter: any) =>
    request<any>('/encounters', { method: 'POST', body: JSON.stringify(encounter) }),

  updateEncounter: (id: number, encounter: any) =>
    request<any>(`/encounters/${id}`, { method: 'PUT', body: JSON.stringify(encounter) }),

  // Ashtavidha
  getAshtavidha: (encounterId: number) => request<any>(`/ashtavidha/${encounterId}`),

  saveAshtavidha: (data: any) =>
    request<any>('/ashtavidha', { method: 'POST', body: JSON.stringify(data) }),

  // Prakriti & Vikriti
  getPrakritiQuestions: () => request<any>('/prakriti/questions'),

  calculatePrakriti: (data: { encounter_id?: number; responses: Record<string, string>; notes?: string }) =>
    request<any>('/prakriti/calculate', { method: 'POST', body: JSON.stringify(data) }),

  getPrakriti: (encounterId: number) => request<any>(`/prakriti/${encounterId}`),

  calculateVikriti: (data: { encounter_id?: number; symptoms?: any[]; ashtavidha?: any; notes?: string }) =>
    request<any>('/vikriti/calculate', { method: 'POST', body: JSON.stringify(data) }),

  getVikriti: (encounterId: number) => request<any>(`/vikriti/${encounterId}`),

  // AI Structuring
  structureCase: (data: { raw_notes: string; symptoms?: any[]; history?: any }) =>
    request<any>('/ai/structure-case', { method: 'POST', body: JSON.stringify(data) }),

  // Prescriptions
  getPrescription: (encounterId: number) => request<any>(`/prescriptions/${encounterId}`),

  savePrescription: (data: any) =>
    request<any>('/prescriptions', { method: 'POST', body: JSON.stringify(data) }),

  searchFormulations: (q?: string) =>
    request<any[]>(`/prescriptions/formulations${q ? `?q=${encodeURIComponent(q)}` : ''}`),

  // Terminology
  searchTerminology: (q?: string, category?: string) => {
    const query = new URLSearchParams();
    if (q) query.append('q', q);
    if (category) query.append('category', category);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<any[]>(`/terminology/search${queryString}`);
  },

  // ABDM
  linkAbhaDemo: (data: { patient_id: number; abha_id?: string; consent_granted?: boolean }) =>
    request<any>('/abdm/demo-link', { method: 'POST', body: JSON.stringify(data) }),

  getFhirPreview: (encounterId: number) => request<any>(`/abdm/fhir-preview/${encounterId}`),

  // Repertorization
  getRepertoryRubrics: (chapter?: string, q?: string) => {
    const query = new URLSearchParams();
    if (chapter) query.append('chapter', chapter);
    if (q) query.append('q', q);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<any[]>(`/repertorization/rubrics${queryString}`);
  },

  calculateRepertorization: (rubricIds: number[]) =>
    request<any>('/repertorization/calculate', {
      method: 'POST',
      body: JSON.stringify({ rubric_ids: rubricIds }),
    }),

  // ==========================================
  // PATIENT PORTAL EXTENSIONS
  // ==========================================
  getPatientPortalProfile: (patientId: number) =>
    request<any>(`/patient/profile/${patientId}`),

  getPatientHealthSummary: (patientId: number) =>
    request<any>(`/patient/health-summary/${patientId}`),

  getPatientDocuments: (patientId: number) =>
    request<any[]>(`/patient/documents/${patientId}`),

  uploadPatientDocument: (data: {
    patient_id: number;
    document_type: string;
    file_name: string;
    ocr_text?: string;
    hospital_source?: string;
  }) => request<any>('/patient/documents', { method: 'POST', body: JSON.stringify(data) }),

  createShareToken: (data: { patient_id: number; duration_minutes?: number; permissions?: Record<string, boolean> }) =>
    request<any>('/patient/share/create', { method: 'POST', body: JSON.stringify(data) }),

  revokeShareToken: (token: string) =>
    request<any>('/patient/share/revoke', { method: 'POST', body: JSON.stringify({ token }) }),

  getPatientAccessHistory: (patientId: number) =>
    request<any[]>(`/patient/access-history/${patientId}`),

  savePatientOnboarding: (data: { patient_id: number; answers: Record<string, any> }) =>
    request<any>('/patient/assessment/save', { method: 'POST', body: JSON.stringify(data) }),

  // ==========================================
  // HOSPITAL RECEPTION KIOSK EXTENSIONS
  // ==========================================
  identifyKioskPatient: (identifier: string) =>
    request<any>('/kiosk/identify', { method: 'POST', body: JSON.stringify({ identifier }) }),

  createKioskSession: (data: { patient_id?: number; language?: string }) =>
    request<any>('/kiosk/session', { method: 'POST', body: JSON.stringify(data) }),

  fetchKioskQuestion: (data: { current_question_id?: string; answers?: Record<string, any> }) =>
    request<any>('/kiosk/question', { method: 'POST', body: JSON.stringify(data) }),

  completeKioskAssessment: (data: {
    session_code: string;
    patient_id?: number;
    answers: Record<string, any>;
    language?: string;
  }) => request<any>('/kiosk/complete', { method: 'POST', body: JSON.stringify(data) }),

  // ==========================================
  // DOCUMENT OCR & EXTRACTION
  // ==========================================
  processDocumentOcr: (data: { file_name: string; document_type?: string; raw_text?: string }) =>
    request<any>('/documents/process', { method: 'POST', body: JSON.stringify(data) }),

  // ==========================================
  // CROSS-HOSPITAL RECORD SHARING
  // ==========================================
  getSharedRecord: (token: string, organization?: string) =>
    request<any>(`/shared-record/${encodeURIComponent(token)}${organization ? `?organization=${encodeURIComponent(organization)}` : ''}`),

  requestSharedRecordAccess: (data: { token: string; requesting_hospital?: string }) =>
    request<any>('/share/request', { method: 'POST', body: JSON.stringify(data) }),

  approveSharedRecordAccess: (token: string) =>
    request<any>('/share/approve', { method: 'POST', body: JSON.stringify({ token }) }),

  denySharedRecordAccess: (token: string) =>
    request<any>('/share/deny', { method: 'POST', body: JSON.stringify({ token }) }),
};
