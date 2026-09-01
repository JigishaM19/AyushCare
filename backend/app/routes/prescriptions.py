from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.prescription import Prescription, PrescriptionItem
from app.models.terminology import FormulationItem
from app.models.encounter import Encounter
from app.models.user import User
from app.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionResponse,
    PrescriptionItemResponse
)
from app.schemas.terminology import FormulationResponse
from app.security.auth import get_current_user

router = APIRouter(prefix="/prescriptions", tags=["Digital Prescriptions"])

@router.get("/formulations", response_model=List[FormulationResponse])
def search_formulations(
    q: Optional[str] = Query(None, description="Search formulation by name or indication"),
    db: Session = Depends(get_db)
):
    query = db.query(FormulationItem)
    if q:
        query = query.filter(FormulationItem.name.ilike(f"%{q}%"))
    return query.limit(20).all()

@router.get("/{encounter_id}", response_model=PrescriptionResponse)
def get_prescription_by_encounter(
    encounter_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    rx = db.query(Prescription).filter(Prescription.encounter_id == encounter_id).first()
    if not rx:
        raise HTTPException(status_code=404, detail="Prescription not found for this encounter")
    return rx

@router.post("", response_model=PrescriptionResponse)
def create_or_update_prescription(
    rx_in: PrescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    encounter = db.query(Encounter).filter(Encounter.id == rx_in.encounter_id).first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")

    rx = db.query(Prescription).filter(Prescription.encounter_id == rx_in.encounter_id).first()
    if not rx:
        rx = Prescription(
            encounter_id=rx_in.encounter_id,
            practitioner_id=current_user.id if current_user else 1,
            follow_up_date=rx_in.follow_up_date,
            general_advice=rx_in.general_advice,
            diet_pathya=rx_in.diet_pathya,
            diet_apathya=rx_in.diet_apathya,
            status=rx_in.status or "Active"
        )
        db.add(rx)
        db.commit()
        db.refresh(rx)
    else:
        rx.follow_up_date = rx_in.follow_up_date
        rx.general_advice = rx_in.general_advice
        rx.diet_pathya = rx_in.diet_pathya
        rx.diet_apathya = rx_in.diet_apathya
        rx.status = rx_in.status or "Active"
        # delete existing items
        db.query(PrescriptionItem).filter(PrescriptionItem.prescription_id == rx.id).delete()
        db.commit()

    # Add items
    for item in rx_in.items:
        rx_item = PrescriptionItem(
            prescription_id=rx.id,
            formulation=item.formulation,
            form=item.form,
            dosage=item.dosage,
            frequency=item.frequency,
            duration=item.duration,
            timing=item.timing,
            anupana=item.anupana,
            instructions=item.instructions
        )
        db.add(rx_item)
    
    db.commit()
    db.refresh(rx)
    return rx
