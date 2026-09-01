import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.encounter import Encounter, Symptom
from app.models.patient import Patient
from app.models.user import User
from app.schemas.encounter import EncounterCreate, EncounterUpdate, EncounterResponse
from app.security.auth import get_current_user

router = APIRouter(prefix="/encounters", tags=["Encounters / Case-Taking"])

@router.get("", response_model=List[EncounterResponse])
def list_encounters(
    patient_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Encounter)
    if patient_id:
        query = query.filter(Encounter.patient_id == patient_id)
    if status:
        query = query.filter(Encounter.status == status)
    return query.order_by(Encounter.date.desc()).all()

@router.post("", response_model=EncounterResponse)
def create_encounter(
    enc_in: EncounterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.id == enc_in.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    encounter = Encounter(
        patient_id=enc_in.patient_id,
        practitioner_id=current_user.id if current_user else 1,
        chief_complaint=enc_in.chief_complaint,
        hpi=enc_in.hpi,
        pain_socrates=enc_in.pain_socrates,
        past_history=enc_in.past_history,
        family_history=enc_in.family_history,
        personal_history=enc_in.personal_history,
        structured_summary=enc_in.structured_summary,
        practitioner_notes=enc_in.practitioner_notes,
        status=enc_in.status or "In Progress"
    )
    db.add(encounter)
    db.commit()
    db.refresh(encounter)

    if enc_in.symptoms:
        for s in enc_in.symptoms:
            sym = Symptom(
                encounter_id=encounter.id,
                name=s.name,
                duration=s.duration,
                severity=s.severity,
                frequency=s.frequency,
                onset=s.onset,
                aggravating_factors=s.aggravating_factors,
                relieving_factors=s.relieving_factors,
                notes=s.notes
            )
            db.add(sym)
        db.commit()
        db.refresh(encounter)

    return encounter

@router.get("/{encounter_id}", response_model=EncounterResponse)
def get_encounter(
    encounter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    encounter = db.query(Encounter).filter(Encounter.id == encounter_id).first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")
    return encounter

@router.put("/{encounter_id}", response_model=EncounterResponse)
def update_encounter(
    encounter_id: int,
    enc_in: EncounterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    encounter = db.query(Encounter).filter(Encounter.id == encounter_id).first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")
    
    update_data = enc_in.dict(exclude_unset=True)
    
    # Handle symptoms separately if provided
    if "symptoms" in update_data:
        new_symptoms = update_data.pop("symptoms")
        if new_symptoms is not None:
            # clear existing symptoms
            db.query(Symptom).filter(Symptom.encounter_id == encounter.id).delete()
            for s_data in new_symptoms:
                sym = Symptom(
                    encounter_id=encounter.id,
                    name=s_data.get("name", ""),
                    duration=s_data.get("duration"),
                    severity=s_data.get("severity", 5),
                    frequency=s_data.get("frequency"),
                    onset=s_data.get("onset"),
                    aggravating_factors=s_data.get("aggravating_factors"),
                    relieving_factors=s_data.get("relieving_factors"),
                    notes=s_data.get("notes")
                )
                db.add(sym)

    for field, value in update_data.items():
        setattr(encounter, field, value)

    db.commit()
    db.refresh(encounter)
    return encounter
