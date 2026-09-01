from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.patient import Patient
from app.models.encounter import Encounter
from app.models.user import User
from app.security.auth import get_current_user

router = APIRouter(prefix="/abdm", tags=["ABDM / ABHA Interoperability"])

@router.post("/demo-link")
def demo_link_abha(
    patient_id: int = Body(..., embed=True),
    abha_id: Optional[str] = Body(None, embed=True),
    consent_granted: bool = Body(True, embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    generated_abha = abha_id or f"91-{patient.phone[:4]}-{patient.phone[4:8]}-8821@abdm"
    patient.abha_id = generated_abha
    patient.abha_status = "Linked"
    db.commit()
    db.refresh(patient)

    return {
        "status": "success",
        "message": "Demo ABHA record successfully linked with simulated patient consent.",
        "is_simulated": True,
        "disclaimer": "DEMO / SIMULATED INTEGRATION — No live connection to NHA/ABDM gateway.",
        "patient": {
            "id": patient.id,
            "patient_code": patient.patient_code,
            "name": patient.name,
            "abha_id": patient.abha_id,
            "abha_status": patient.abha_status,
            "linked_at": datetime.utcnow().isoformat()
        },
        "consent_artifact": {
            "consent_id": f"CONSENT-{patient.id}-2026-X89",
            "purpose": "CAREGIVING / OPD CASE TAKING",
            "hip_id": "IN-AIIMS-AYUSH-DELHI-01",
            "status": "GRANTED",
            "expiry": "2027-09-01T23:59:59Z"
        }
    }

@router.get("/fhir-preview/{encounter_id}")
def preview_fhir_bundle(
    encounter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    encounter = db.query(Encounter).filter(Encounter.id == encounter_id).first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")
    
    patient = encounter.patient
    practitioner = encounter.practitioner or current_user

    # Structure FHIR Bundle schema representation
    fhir_bundle = {
        "resourceType": "Bundle",
        "type": "document",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "meta": {
            "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/OPConsultRecord"]
        },
        "disclaimer": "FHIR R4 Schema mapping prototype for AyushCare ABDM export.",
        "entry": [
            {
                "fullUrl": f"urn:uuid:patient-{patient.id}",
                "resource": {
                    "resourceType": "Patient",
                    "id": f"patient-{patient.id}",
                    "identifier": [
                        {"system": "https://healthid.ndhm.gov.in", "value": patient.abha_id or "Unlinked"},
                        {"system": "https://ayushcare.in/patient-code", "value": patient.patient_code}
                    ],
                    "name": [{"text": patient.name}],
                    "gender": patient.gender.lower(),
                    "birthDate": patient.dob.isoformat() if patient.dob else "1990-01-01",
                    "telecom": [{"system": "phone", "value": patient.phone}]
                }
            },
            {
                "fullUrl": f"urn:uuid:practitioner-{practitioner.id}",
                "resource": {
                    "resourceType": "Practitioner",
                    "id": f"practitioner-{practitioner.id}",
                    "identifier": [{"system": "https://ayush.gov.in/registry", "value": practitioner.registration_no}],
                    "name": [{"text": practitioner.name}]
                }
            },
            {
                "fullUrl": f"urn:uuid:encounter-{encounter.id}",
                "resource": {
                    "resourceType": "Encounter",
                    "id": f"encounter-{encounter.id}",
                    "status": "finished" if encounter.status == "Completed" else "in-progress",
                    "class": {"system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "AMB", "display": "Ambulatory"},
                    "subject": {"reference": f"urn:uuid:patient-{patient.id}"},
                    "reasonCode": [{"text": encounter.chief_complaint or "General Consultation"}]
                }
            }
        ]
    }
    return fhir_bundle
