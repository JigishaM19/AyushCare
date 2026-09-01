from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel

class SymptomCreate(BaseModel):
    name: str
    duration: Optional[str] = None
    severity: Optional[int] = 5
    frequency: Optional[str] = "Intermittent"
    onset: Optional[str] = "Gradual"
    aggravating_factors: Optional[str] = None
    relieving_factors: Optional[str] = None
    notes: Optional[str] = None

class SymptomResponse(SymptomCreate):
    id: int
    encounter_id: int

    class Config:
        from_attributes = True

class EncounterCreate(BaseModel):
    patient_id: int
    chief_complaint: Optional[str] = None
    hpi: Optional[str] = None
    pain_socrates: Optional[str] = None
    past_history: Optional[str] = None
    family_history: Optional[str] = None
    personal_history: Optional[str] = None
    structured_summary: Optional[str] = None
    practitioner_notes: Optional[str] = None
    status: Optional[str] = "In Progress"
    symptoms: Optional[List[SymptomCreate]] = None

class EncounterUpdate(BaseModel):
    chief_complaint: Optional[str] = None
    hpi: Optional[str] = None
    pain_socrates: Optional[str] = None
    past_history: Optional[str] = None
    family_history: Optional[str] = None
    personal_history: Optional[str] = None
    structured_summary: Optional[str] = None
    practitioner_notes: Optional[str] = None
    status: Optional[str] = None
    symptoms: Optional[List[SymptomCreate]] = None

class EncounterResponse(BaseModel):
    id: int
    patient_id: int
    practitioner_id: int
    date: datetime
    status: str
    chief_complaint: Optional[str] = None
    hpi: Optional[str] = None
    pain_socrates: Optional[str] = None
    past_history: Optional[str] = None
    family_history: Optional[str] = None
    personal_history: Optional[str] = None
    structured_summary: Optional[str] = None
    practitioner_notes: Optional[str] = None
    symptoms: List[SymptomResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True
