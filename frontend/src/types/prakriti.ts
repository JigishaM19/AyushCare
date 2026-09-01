export interface PrakritiOption {
  id: string;
  text: string;
  vata: number;
  pitta: number;
  kapha: number;
}

export interface PrakritiQuestion {
  id: string;
  category: 'Physical' | 'Physiological' | 'Psychological';
  title: string;
  options: PrakritiOption[];
}

export interface RadarDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

export interface PrakritiResult {
  id?: number;
  encounter_id?: number;
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
  vata_percent: number;
  pitta_percent: number;
  kapha_percent: number;
  primary_prakriti: string;
  secondary_prakriti?: string;
  radar_data?: RadarDataPoint[];
  responses_json?: string;
  notes?: string;
}

export interface VikritiResult {
  id?: number;
  encounter_id?: number;
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
  vata_percent: number;
  pitta_percent: number;
  kapha_percent: number;
  dominant_pattern: string;
  dosha_distribution?: Array<{ name: string; percentage: number; fill: string }>;
  notes?: string;
}
