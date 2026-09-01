export interface Patient {
  id: number;
  patient_code: string;
  name: string;
  dob?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  emergency_contact?: string;
  emergency_relationship?: string;
  abha_id?: string;
  abha_status?: 'Linked' | 'Unlinked' | 'Pending';
  allergies?: string;
  medical_history?: string;
  current_medications?: string;
  created_at: string;
  updated_at?: string;
}

export interface PatientCreate {
  name: string;
  dob?: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  emergency_contact?: string;
  emergency_relationship?: string;
  abha_id?: string;
  abha_status?: string;
  allergies?: string;
  medical_history?: string;
  current_medications?: string;
}
