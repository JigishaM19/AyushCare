from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.session import get_db
from app.models.patient import Patient
from app.models.encounter import Encounter
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from app.security.auth import get_current_user

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("", response_model=List[PatientResponse])
def list_patients(
    q: Optional[str] = Query(None, description="Search by name, ID, phone, ABHA"),
    gender: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Patient)
    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            or_(
                Patient.name.ilike(search_pattern),
                Patient.patient_code.ilike(search_pattern),
                Patient.phone.ilike(search_pattern),
                Patient.abha_id.ilike(search_pattern),
            )
        )
    if gender:
        query = query.filter(Patient.gender == gender)
    
    return query.order_by(Patient.created_at.desc()).all()

@router.post("", response_model=PatientResponse)
def create_patient(
    patient_in: PatientCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Auto-generate Patient Code if not provided
    if not patient_in.patient_code:
        count = db.query(Patient).count() + 1
        patient_code = f"AYU-2026-{count:03d}"
    else:
        patient_code = patient_in.patient_code

    patient = Patient(
        patient_code=patient_code,
        name=patient_in.name,
        dob=patient_in.dob,
        age=patient_in.age,
        gender=patient_in.gender,
        phone=patient_in.phone,
        email=patient_in.email,
        address=patient_in.address,
        city=patient_in.city or "New Delhi",
        state=patient_in.state or "Delhi",
        emergency_contact=patient_in.emergency_contact,
        emergency_relationship=patient_in.emergency_relationship,
        abha_id=patient_in.abha_id,
        abha_status=patient_in.abha_status or "Unlinked",
        allergies=patient_in.allergies,
        medical_history=patient_in.medical_history,
        current_medications=patient_in.current_medications,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    patient_in: PatientUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    update_data = patient_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)
    
    db.commit()
    db.refresh(patient)
    return patient
