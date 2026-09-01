from typing import Optional
from pydantic import BaseModel

class AshtavidhaCreateOrUpdate(BaseModel):
    encounter_id: int
    nadi: Optional[str] = None  # JSON string
    mutra: Optional[str] = None
    mala: Optional[str] = None
    jihva: Optional[str] = None
    shabda: Optional[str] = None
    sparsha: Optional[str] = None
    druk: Optional[str] = None
    akruti: Optional[str] = None
    notes: Optional[str] = None

class AshtavidhaResponse(AshtavidhaCreateOrUpdate):
    id: int

    class Config:
        from_attributes = True
