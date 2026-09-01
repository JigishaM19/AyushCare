from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.share import ShareSession, AccessLog
from app.services.cross_hospital_service import resolve_shared_record

router = APIRouter(tags=["Cross-Hospital Portable Record Sharing"])

@router.get("/api/shared-record/{token}")
def get_cross_hospital_shared_record(
    token: str,
    organization: str = "City General Hospital (Hospital B)",
    db: Session = Depends(get_db)
):
    result = resolve_shared_record(db, token, organization)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/api/share/request")
def request_shared_record_access(
    token: str = Body(..., embed=True),
    requesting_hospital: str = Body("City General Hospital", embed=True),
    db: Session = Depends(get_db)
):
    session = db.query(ShareSession).filter(ShareSession.token == token).first()
    if not session:
        session = db.query(ShareSession).filter(ShareSession.access_code == token).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Invalid share token or access code")

    return {
        "status": "pending_consent",
        "session_id": session.id,
        "token": session.token,
        "patient_name": session.patient.name,
        "patient_code": session.patient.patient_code,
        "requesting_hospital": requesting_hospital,
        "message": "Patient consent authorization required to view longitudinal records."
    }

@router.post("/api/share/approve")
def approve_shared_record_access(
    token: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    session = db.query(ShareSession).filter(ShareSession.token == token).first()
    if not session:
        raise HTTPException(status_code=404, detail="Share session not found")
    session.status = "Approved"
    db.commit()
    return {"status": "approved", "token": session.token, "message": "Access granted to requesting hospital."}

@router.post("/api/share/deny")
def deny_shared_record_access(
    token: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    session = db.query(ShareSession).filter(ShareSession.token == token).first()
    if not session:
        raise HTTPException(status_code=404, detail="Share session not found")
    session.status = "Revoked"
    db.commit()
    return {"status": "denied", "message": "Access denied by patient."}
