export interface TerminologyItem {
  id: number;
  code: string;
  preferred_term: string;
  ayurvedic_name?: string;
  category: string;
  description?: string;
  dosha_affinity?: string;
}

export interface RepertoryRubric {
  id: number;
  chapter: string;
  rubric: string;
  sub_rubric?: string;
}

export interface RemedyMatch {
  remedy: string;
  total_score: number;
  rubrics_covered: number;
  coverage_percentage: number;
  match_score: number;
  covered_rubrics: string[];
}
