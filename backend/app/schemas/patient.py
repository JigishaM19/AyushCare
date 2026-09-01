from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class PatientBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    dob: Optional[date] = None
    age: int = Field(..., ge=0, le=130)
    gender: str = Field(..., pattern="^(Male|Female|Other)$")
    phone: str = Field(..., min_length=7, max_length=20)
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = "New Delhi"
    state: Optional[str] = "Delhi"
    emergency_contact: Optional[str] = None
    emergency_relationship: Optional[str] = None
    abha_id: Optional[str] = None
    abha_status: Optional[str] = "Unlinked"
    allergies: Optional[str] = None
    medical_history: Optional[str] = None
    current_medications: Optional[str] = None

class PatientCreate(PatientBase):
    patient_code: Optional[str] = None

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    dob: Optional[date] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_relationship: Optional[str] = None
    abha_id: Optional[str] = None
    abha_status: Optional[str] = None
    allergies: Optional[str] = None
    medical_history: Optional[str] = None
    current_medications: Optional[str] = None

class PatientResponse(PatientBase):
    id: int
    patient_code: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
