from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class TerminologyResponse(BaseModel):
    id: int
    code: str
    preferred_term: str
    ayurvedic_name: Optional[str] = None
    category: str
    description: Optional[str] = None
    dosha_affinity: Optional[str] = None

    class Config:
        from_attributes = True

class FormulationResponse(BaseModel):
    id: int
    name: str
    form: str
    category: str
    standard_dosage: str
    standard_frequency: str
    standard_timing: str
    default_anupana: str
    indications: Optional[str] = None
    dosha_karma: Optional[str] = None
    precautions: Optional[str] = None

    class Config:
        from_attributes = True

class RepertorizationRequest(BaseModel):
    rubric_ids: List[int]

class RepertoryRubricResponse(BaseModel):
    id: int
    chapter: str
    rubric: str
    sub_rubric: Optional[str] = None

    class Config:
        from_attributes = True

class AIStructuringRequest(BaseModel):
    raw_notes: str
    symptoms: Optional[List[Dict[str, Any]]] = []
    history: Optional[Dict[str, Any]] = {}

class AIStructuringResponse(BaseModel):
    chief_complaints: List[Dict[str, Any]]
    history_summary: str
    associated_symptoms: List[str]
    missing_information: List[str]
    detected_duration: Optional[str] = None
    structured_notes: str
