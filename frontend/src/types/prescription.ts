export interface PrescriptionItem {
  id?: number;
  prescription_id?: number;
  formulation: string;
  form: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: string;
  anupana: string;
  instructions?: string;
}

export interface Prescription {
  id?: number;
  encounter_id: number;
  practitioner_id: number;
  date: string;
  follow_up_date?: string;
  general_advice?: string;
  diet_pathya?: string;
  diet_apathya?: string;
  status: string;
  created_at?: string;
  items: PrescriptionItem[];
}

export interface Formulation {
  id: number;
  name: string;
  form: string;
  category: string;
  standard_dosage: string;
  standard_frequency: string;
  standard_timing: string;
  default_anupana: string;
  indications?: string;
  dosha_karma?: string;
  precautions?: string;
}
