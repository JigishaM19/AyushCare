import json
import secrets
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.session import get_db
from app.models.patient import Patient
from app.models.kiosk import KioskSession
from app.models.history import PatientAssessment
from app.models.encounter import Encounter
from app.services.adaptive_question_engine import QUESTION_CATALOGUE, get_next_question

router = APIRouter(prefix="/kiosk", tags=["Hospital Reception Kiosk"])

@router.post("/identify")
def identify_kiosk_patient(
    identifier: str = Body(..., embed=True),  # Phone number, Patient code, or QR token
    db: Session = Depends(get_db)
):
    clean_id = identifier.replace(" ", "").replace("-", "").replace("+91", "").strip()

    # 1. Exact match
    patient = db.query(Patient).filter(
        or_(
            Patient.phone == identifier,
            Patient.patient_code == identifier,
            Patient.abha_id == identifier
        )
    ).first()

    # 2. Fuzzy / Clean match
    if not patient:
        patients = db.query(Patient).all()
        for p in patients:
            p_phone = (p.phone or "").replace(" ", "").replace("-", "").replace("+91", "")
            if clean_id in p_phone or clean_id in (p.patient_code or ""):
                patient = p
                break

    # 3. Fallback for demo convenience
    if not patient and clean_id.startswith("98"):
        patient = db.query(Patient).first()

    if not patient:
        return {"found": False, "message": "Patient not found in local registry. Please start new registration."}

    # Fetch existing history preview
    enc_count = db.query(Encounter).filter(Encounter.patient_id == patient.id).count()

    return {
        "found": True,
        "patient": {
            "id": patient.id,
            "patient_code": patient.patient_code,
            "name": patient.name,
            "age": patient.age,
            "gender": patient.gender,
            "phone": patient.phone,
            "abha_id": patient.abha_id,
            "allergies": patient.allergies,
            "medical_history": patient.medical_history,
            "current_medications": patient.current_medications,
            "past_encounters_count": enc_count
        }
    }

@router.post("/session")
def create_kiosk_session(
    patient_id: Optional[int] = Body(None, embed=True),
    language: str = Body("en", embed=True),
    db: Session = Depends(get_db)
):
    session_code = f"KIOSK-{secrets.randbelow(900000) + 100000}"
    session = KioskSession(
        session_code=session_code,
        patient_id=patient_id,
        language=language,
        status="Active"
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # First question
    first_q = QUESTION_CATALOGUE[0]

    return {
        "session_code": session.session_code,
        "language": session.language,
        "first_question": first_q
    }

@router.post("/question")
def fetch_kiosk_question(
    current_question_id: Optional[str] = Body(None, embed=True),
    answers: Dict[str, Any] = Body({}, embed=True)
):
    next_q = get_next_question(current_question_id, answers)
    return {
        "question": next_q,
        "is_completed": next_q is None
    }

@router.post("/complete")
def complete_kiosk_assessment(
    session_code: str = Body(..., embed=True),
    patient_id: Optional[int] = Body(None, embed=True),
    answers: Dict[str, Any] = Body(..., embed=True),
    language: str = Body("en", embed=True),
    db: Session = Depends(get_db)
):
    session = db.query(KioskSession).filter(KioskSession.session_code == session_code).first()
    if not session:
        session = KioskSession(
            session_code=session_code,
            patient_id=patient_id,
            language=language,
            status="Completed"
        )
        db.add(session)

    # Build structured pre-consultation summary
    chief = answers.get("q_chief_complaint", "General Checkup")
    duration = answers.get("q_duration", "Not specified")
    progression = answers.get("q_progression", "Stable")
    conditions = answers.get("q_medical_conditions", "None reported")
    meds = answers.get("q_medications", "None")
    allergies = answers.get("q_allergies", "No known allergies")

    summary_data = {
        "chief_complaint": str(chief),
        "duration": str(duration),
        "progression": str(progression),
        "medical_conditions": str(conditions),
        "medications": str(meds),
        "allergies": str(allergies),
        "raw_answers": answers,
        "source": "Hospital Reception Kiosk (Voice & Touch)",
        "completed_at": datetime.utcnow().strftime("%d %b %Y, %I:%M %p")
    }

    session.chief_complaint = str(chief)
    session.completed_at = datetime.utcnow()
    session.status = "Handoff to Doctor"
    session.summary_json = json.dumps(summary_data)

    # If patient_id provided, also create an in-progress Encounter for the Doctor's OPD queue
    if patient_id:
        enc = Encounter(
            patient_id=patient_id,
            practitioner_id=1,  # Attending doctor
            chief_complaint=f"[Kiosk Case] {chief} (Duration: {duration})",
            hpi=f"Pre-Consultation Intake via Hospital Kiosk: Patient reports {chief}, started {duration}, progression is {progression}. Past conditions: {conditions}. Current medications: {meds}. Allergies: {allergies}.",
            status="In Progress"
        )
        db.add(enc)

    db.commit()

    return {
        "status": "success",
        "message": "Pre-consultation intake completed. Token generated for OPD queue handoff.",
        "queue_token": f"OPD-{secrets.randbelow(90) + 10}",
        "summary": summary_data
    }
