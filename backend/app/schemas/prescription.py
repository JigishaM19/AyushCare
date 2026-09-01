from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class PrescriptionItemBase(BaseModel):
    formulation: str
    form: Optional[str] = "Vati/Tablet"
    dosage: str
    frequency: str
    duration: str
    timing: Optional[str] = "After Food"
    anupana: Optional[str] = "Warm Water"
    instructions: Optional[str] = None

class PrescriptionItemCreate(PrescriptionItemBase):
    pass

class PrescriptionItemResponse(PrescriptionItemBase):
    id: int
    prescription_id: int

    class Config:
        from_attributes = True

class PrescriptionCreate(BaseModel):
    encounter_id: int
    follow_up_date: Optional[str] = None
    general_advice: Optional[str] = None
    diet_pathya: Optional[str] = None
    diet_apathya: Optional[str] = None
    status: Optional[str] = "Active"
    items: List[PrescriptionItemCreate] = []

class PrescriptionResponse(BaseModel):
    id: int
    encounter_id: int
    practitioner_id: int
    date: datetime
    follow_up_date: Optional[str] = None
    general_advice: Optional[str] = None
    diet_pathya: Optional[str] = None
    diet_apathya: Optional[str] = None
    status: str
    created_at: datetime
    items: List[PrescriptionItemResponse] = []

    class Config:
        from_attributes = True
