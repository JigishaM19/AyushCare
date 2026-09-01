export interface Symptom {
  id?: number;
  encounter_id?: number;
  name: string;
  duration?: string;
  severity?: number; // 0 to 10
  frequency?: string;
  onset?: string;
  aggravating_factors?: string;
  relieving_factors?: string;
  notes?: string;
}

export interface SocratesPain {
  site: string;
  onset: string;
  character: string;
  radiation: string;
  associated: string;
  timing: string;
  exacerbating: string;
  severity: number;
}

export interface AshtavidhaData {
  nadi?: {
    rate?: string;
    rhythm?: string;
    dominant_dosha?: string;
    gati?: string;
    notes?: string;
  };
  mutra?: {
    color?: string;
    frequency?: string;
    quantity?: string;
    odor?: string;
    burning?: string;
    urgency?: string;
    notes?: string;
  };
  mala?: {
    consistency?: string;
    frequency?: string;
    color?: string;
    regularity?: string;
    constipation?: boolean;
    diarrhea?: boolean;
    notes?: string;
  };
  jihva?: {
    color?: string;
    coating?: string;
    moisture?: string;
    texture?: string;
    cracks?: string;
    ama_presence?: string;
    notes?: string;
  };
  shabda?: {
    quality?: string;
    speech?: string;
    respiratory_sound?: string;
    notes?: string;
  };
  sparsha?: {
    temperature?: string;
    texture?: string;
    moisture?: string;
    tenderness?: string;
    notes?: string;
  };
  druk?: {
    appearance?: string;
    sclera_color?: string;
    vision_complaint?: string;
    notes?: string;
  };
  akruti?: {
    build?: string;
    general_appearance?: string;
    posture?: string;
    gait?: string;
    notes?: string;
  };
  notes?: string;
}

export interface Encounter {
  id: number;
  patient_id: number;
  practitioner_id: number;
  date: string;
  status: 'In Progress' | 'Completed' | 'Follow-up';
  chief_complaint?: string;
  hpi?: string;
  pain_socrates?: string;
  past_history?: string;
  family_history?: string;
  personal_history?: string;
  structured_summary?: string;
  practitioner_notes?: string;
  symptoms: Symptom[];
  created_at: string;
}
