import secrets
import json
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.share import ShareSession, AccessLog
from app.models.patient import Patient
from app.models.encounter import Encounter
from app.models.prescription import Prescription
from app.models.document import MedicalDocument

def create_secure_share_session(
    db: Session,
    patient_id: int,
    duration_minutes: int = 30,
    permissions: Dict[str, bool] = None
) -> Dict[str, Any]:
    """
    Creates a temporary cryptographically secure record-sharing token & 6-digit access code.
    Medical records are NOT embedded in the token or QR.
    """
    token = f"SHARE-{secrets.token_hex(8).upper()}"
    access_code = f"{secrets.randbelow(900000) + 100000}"  # 6-digit PIN
    expires_at = datetime.utcnow() + timedelta(minutes=duration_minutes)

    perms = permissions or {
        "profile": True,
        "allergies": True,
        "medications": True,
        "consultations": True,
        "investigations": True,
        "prescriptions": True,
        "documents": True
    }

    share_session = ShareSession(
        patient_id=patient_id,
        token=token,
        access_code=access_code,
        expires_at=expires_at,
        permissions_json=json.dumps(perms),
        status="Active"
    )
    db.add(share_session)
    db.commit()
    db.refresh(share_session)

    return {
        "token": share_session.token,
        "access_code": share_session.access_code,
        "expires_at": share_session.expires_at.isoformat(),
        "expires_in_minutes": duration_minutes,
        "permissions": perms,
        "qr_payload": f"ayushcare://share?token={share_session.token}&code={access_code}"
    }

def resolve_shared_record(db: Session, token: str, organization: str = "City General Hospital (Hospital B)") -> Dict[str, Any]:
    """
    Resolves temporary token, verifies expiry & status, logs access audit, and filters records according to patient granted permissions.
    """
    session = db.query(ShareSession).filter(ShareSession.token == token).first()
    if not session:
        # Check if code match
        session = db.query(ShareSession).filter(ShareSession.access_code == token).first()

    if not session:
        return {"error": "Invalid or expired share token / access code", "status": "Not Found"}

    if session.status == "Revoked":
        return {"error": "Access was revoked by the patient", "status": "Revoked"}

    if datetime.utcnow() > session.expires_at:
        session.status = "Expired"
        db.commit()
        return {"error": "Access session has expired", "status": "Expired"}

    patient = session.patient
    permissions = json.loads(session.permissions_json) if session.permissions_json else {}

    # Fetch longitudinal data masked by granted permissions
    result: Dict[str, Any] = {
        "status": "Authorized",
        "share_token": session.token,
        "expires_at": session.expires_at.isoformat(),
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
        "allergies": patient.allergies if permissions.get("allergies", True) else "[Restricted]",
        "medical_history": patient.medical_history if permissions.get("profile", True) else "[Restricted]",
        "current_medications": patient.current_medications if permissions.get("medications", True) else "[Restricted]",
        "consultations": [],
        "prescriptions": [],
        "documents": []
    }

    if permissions.get("consultations", True):
        encounters = db.query(Encounter).filter(Encounter.patient_id == patient.id).order_by(Encounter.date.desc()).all()
        result["consultations"] = [
            {
                "id": e.id,
                "date": e.date.strftime("%d %b %Y"),
                "status": e.status,
                "chief_complaint": e.chief_complaint,
                "hpi": e.hpi,
                "structured_summary": e.structured_summary,
                "practitioner_notes": e.practitioner_notes
            }
            for e in encounters
        ]

    if permissions.get("prescriptions", True):
        prescriptions = db.query(Prescription).join(Encounter).filter(Encounter.patient_id == patient.id).order_by(Prescription.date.desc()).all()
        result["prescriptions"] = [
            {
                "id": rx.id,
                "date": rx.date.strftime("%d %b %Y"),
                "general_advice": rx.general_advice,
                "diet_pathya": rx.diet_pathya,
                "diet_apathya": rx.diet_apathya,
                "items": [
                    {
                        "formulation": it.formulation,
                        "dosage": it.dosage,
                        "frequency": it.frequency,
                        "duration": it.duration,
                        "timing": it.timing,
                        "anupana": it.anupana
                    }
                    for it in rx.items
                ]
            }
            for rx in prescriptions
        ]

    if permissions.get("documents", True):
        docs = db.query(MedicalDocument).filter(MedicalDocument.patient_id == patient.id).order_by(MedicalDocument.uploaded_at.desc()).all()
        result["documents"] = [
            {
                "id": d.id,
                "file_name": d.file_name,
                "document_type": d.document_type,
                "uploaded_at": d.uploaded_at.strftime("%d %b %Y"),
                "ocr_summary": d.ocr_text[:120] + "..." if d.ocr_text else "",
                "hospital_source": d.hospital_source
            }
            for d in docs
        ]

    # Log access audit trail
    log = AccessLog(
        patient_id=patient.id,
        organization=organization,
        accessor_name="Hospital B Attending Physician",
        accessed_data=", ".join([k for k, v in permissions.items() if v]),
        status="Authorized"
    )
    db.add(log)
    db.commit()

    return result
