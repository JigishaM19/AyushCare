import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.patient import Patient
from app.models.encounter import Encounter
from app.models.prescription import Prescription
from app.models.document import MedicalDocument
from app.models.history import HealthHistory, PatientAssessment
from app.models.share import ShareSession, AccessLog
from app.services.cross_hospital_service import create_secure_share_session

router = APIRouter(prefix="/patient", tags=["Patient Portal"])

@router.get("/profile/{patient_id}")
def get_patient_portal_profile(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found")
    return patient

@router.get("/health-summary/{patient_id}")
def get_patient_health_summary(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found")

    encounters = db.query(Encounter).filter(Encounter.patient_id == patient_id).order_by(Encounter.date.desc()).all()
    prescriptions = db.query(Prescription).join(Encounter).filter(Encounter.patient_id == patient_id).order_by(Prescription.date.desc()).all()
    documents = db.query(MedicalDocument).filter(MedicalDocument.patient_id == patient_id).order_by(MedicalDocument.uploaded_at.desc()).all()
    history = db.query(HealthHistory).filter(HealthHistory.patient_id == patient_id).all()

    # Timeline of activity
    timeline = []
    for enc in encounters:
        timeline.append({
            "id": f"enc-{enc.id}",
            "type": "Consultation",
            "title": f"OPD Consultation - {enc.chief_complaint or 'Checkup'}",
            "date": enc.date.strftime("%d %b %Y"),
            "status": enc.status,
            "facility": "AIIA Ayush OPD"
        })
    for doc in documents:
        timeline.append({
            "id": f"doc-{doc.id}",
            "type": "Document",
            "title": f"Uploaded: {doc.file_name} ({doc.document_type})",
            "date": doc.uploaded_at.strftime("%d %b %Y"),
            "status": doc.processing_status,
            "facility": doc.hospital_source
        })
    for rx in prescriptions:
        timeline.append({
            "id": f"rx-{rx.id}",
            "type": "Prescription",
            "title": f"Digital Prescription ({len(rx.items)} items)",
            "date": rx.date.strftime("%d %b %Y"),
            "status": rx.status,
            "facility": "Ayush Care Clinic"
        })

    timeline.sort(key=lambda x: x["date"], reverse=True)

    return {
        "patient": {
            "id": patient.id,
            "patient_code": patient.patient_code,
            "name": patient.name,
            "age": patient.age,
            "gender": patient.gender,
            "phone": patient.phone,
            "city": patient.city,
            "state": patient.state,
            "abha_id": patient.abha_id,
            "abha_status": patient.abha_status
        },
        "allergies": patient.allergies or "No known allergies reported (NKA)",
        "medical_history": patient.medical_history or "No chronic co-morbidities recorded",
        "current_medications": patient.current_medications or "None on record",
        "recent_consultation": encounters[0].chief_complaint if encounters else "None yet",
        "total_consultations": len(encounters),
        "total_prescriptions": len(prescriptions),
        "total_documents": len(documents),
        "timeline": timeline,
        "history_entries": [
            {"category": h.category, "condition": h.condition, "details": h.details, "source": h.source}
            for h in history
        ]
    }

@router.get("/documents/{patient_id}")
def list_patient_documents(patient_id: int, db: Session = Depends(get_db)):
    docs = db.query(MedicalDocument).filter(MedicalDocument.patient_id == patient_id).order_by(MedicalDocument.uploaded_at.desc()).all()
    return docs

@router.post("/documents")
def upload_patient_document(
    patient_id: int = Body(..., embed=True),
    document_type: str = Body(..., embed=True),
    file_name: str = Body(..., embed=True),
    ocr_text: Optional[str] = Body(None, embed=True),
    hospital_source: Optional[str] = Body("City General Hospital", embed=True),
    db: Session = Depends(get_db)
):
    doc = MedicalDocument(
        patient_id=patient_id,
        document_type=document_type,
        file_name=file_name,
        file_size_kb=180,
        ocr_text=ocr_text or f"Digitized record of {file_name} from {hospital_source}",
        processing_status="Needs Review",
        hospital_source=hospital_source
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.post("/share/create")
def create_patient_share_token(
    patient_id: int = Body(..., embed=True),
    duration_minutes: int = Body(30, embed=True),
    permissions: Optional[Dict[str, bool]] = Body(None, embed=True),
    db: Session = Depends(get_db)
):
    return create_secure_share_session(db, patient_id, duration_minutes, permissions)

@router.post("/share/revoke")
def revoke_patient_share_token(
    token: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    session = db.query(ShareSession).filter(ShareSession.token == token).first()
    if not session:
        raise HTTPException(status_code=404, detail="Share session not found")
    session.status = "Revoked"
    session.revoked_at = datetime.utcnow()
    db.commit()
    return {"status": "success", "message": "Share token revoked successfully"}

@router.get("/access-history/{patient_id}")
def get_patient_access_logs(patient_id: int, db: Session = Depends(get_db)):
    logs = db.query(AccessLog).filter(AccessLog.patient_id == patient_id).order_by(AccessLog.timestamp.desc()).all()
    return logs

@router.post("/assessment/save")
def save_patient_onboarding_assessment(
    patient_id: int = Body(..., embed=True),
    answers: Dict[str, Any] = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    session_id = f"ONBOARD-{patient_id}-{datetime.utcnow().strftime('%Y%m%d%H%M')}"
    
    for q_id, ans in answers.items():
        db.add(PatientAssessment(
            patient_id=patient_id,
            session_id=session_id,
            question_id=q_id,
            answer=str(ans),
            source="Patient Portal"
        ))

    # Update patient allergies and conditions if provided in questionnaire
    if "q_allergies" in answers:
        patient.allergies = str(answers["q_allergies"])
    if "q_medical_conditions" in answers:
        patient.medical_history = str(answers["q_medical_conditions"])
    if "q_medications" in answers:
        patient.current_medications = str(answers["q_medications"])

    db.commit()
    return {"status": "success", "session_id": session_id, "message": "Initial health assessment saved."}
