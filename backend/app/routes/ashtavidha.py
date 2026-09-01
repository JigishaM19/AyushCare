from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.ashtavidha import AshtavidhaAssessment
from app.schemas.ashtavidha import AshtavidhaCreateOrUpdate, AshtavidhaResponse
from app.security.auth import get_current_user

router = APIRouter(prefix="/ashtavidha", tags=["Ashtavidha Pariksha"])

@router.get("/{encounter_id}", response_model=AshtavidhaResponse)
def get_ashtavidha(
    encounter_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    assessment = db.query(AshtavidhaAssessment).filter(AshtavidhaAssessment.encounter_id == encounter_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Ashtavidha assessment not found for this encounter")
    return assessment

@router.post("", response_model=AshtavidhaResponse)
def save_ashtavidha(
    ash_in: AshtavidhaCreateOrUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    assessment = db.query(AshtavidhaAssessment).filter(AshtavidhaAssessment.encounter_id == ash_in.encounter_id).first()
    if not assessment:
        assessment = AshtavidhaAssessment(
            encounter_id=ash_in.encounter_id,
            nadi=ash_in.nadi,
            mutra=ash_in.mutra,
            mala=ash_in.mala,
            jihva=ash_in.jihva,
            shabda=ash_in.shabda,
            sparsha=ash_in.sparsha,
            druk=ash_in.druk,
            akruti=ash_in.akruti,
            notes=ash_in.notes
        )
        db.add(assessment)
    else:
        assessment.nadi = ash_in.nadi
        assessment.mutra = ash_in.mutra
        assessment.mala = ash_in.mala
        assessment.jihva = ash_in.jihva
        assessment.shabda = ash_in.shabda
        assessment.sparsha = ash_in.sparsha
        assessment.druk = ash_in.druk
        assessment.akruti = ash_in.akruti
        assessment.notes = ash_in.notes
    
    db.commit()
    db.refresh(assessment)
    return assessment
