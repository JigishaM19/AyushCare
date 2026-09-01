from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class PrakritiCalculateRequest(BaseModel):
    encounter_id: Optional[int] = None
    responses: Dict[str, str]  # question_id -> option_id
    notes: Optional[str] = None

class PrakritiResponse(BaseModel):
    id: Optional[int] = None
    encounter_id: Optional[int] = None
    vata_score: float
    pitta_score: float
    kapha_score: float
    vata_percent: float
    pitta_percent: float
    kapha_percent: float
    primary_prakriti: str
    secondary_prakriti: Optional[str] = None
    radar_data: Optional[List[Dict[str, Any]]] = None
    responses_json: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class VikritiCalculateRequest(BaseModel):
    encounter_id: Optional[int] = None
    symptoms: Optional[List[Dict[str, Any]]] = []
    ashtavidha: Optional[Dict[str, Any]] = {}
    notes: Optional[str] = None

class VikritiResponse(BaseModel):
    id: Optional[int] = None
    encounter_id: Optional[int] = None
    vata_score: float
    pitta_score: float
    kapha_score: float
    vata_percent: float
    pitta_percent: float
    kapha_percent: float
    dominant_pattern: str
    dosha_distribution: Optional[List[Dict[str, Any]]] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True
