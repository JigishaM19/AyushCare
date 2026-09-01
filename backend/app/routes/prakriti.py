import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.prakriti import PrakritiAssessment, VikritiAssessment
from app.schemas.prakriti import (
    PrakritiCalculateRequest,
    PrakritiResponse,
    VikritiCalculateRequest,
    VikritiResponse
)
from app.services.prakriti_engine import (
    PRAKRITI_QUESTIONS,
    calculate_prakriti_scores,
    calculate_vikriti_scores
)
from app.security.auth import get_current_user

router = APIRouter(tags=["Prakriti & Vikriti Assessment"])

@router.get("/prakriti/questions")
def get_prakriti_questions():
    """Return standard Prakriti assessment questionnaire"""
    return {
        "questions": PRAKRITI_QUESTIONS,
        "disclaimer": "Questionnaire-based constitution assessment. Results are intended as practitioner decision support."
    }

@router.post("/prakriti/calculate", response_model=PrakritiResponse)
def calculate_prakriti(
    req: PrakritiCalculateRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = calculate_prakriti_scores(req.responses)
    
    # If encounter_id is supplied, persist or update in database
    if req.encounter_id:
        assessment = db.query(PrakritiAssessment).filter(PrakritiAssessment.encounter_id == req.encounter_id).first()
        if not assessment:
            assessment = PrakritiAssessment(
                encounter_id=req.encounter_id,
                vata_score=result["vata_score"],
                pitta_score=result["pitta_score"],
                kapha_score=result["kapha_score"],
                vata_percent=result["vata_percent"],
                pitta_percent=result["pitta_percent"],
                kapha_percent=result["kapha_percent"],
                primary_prakriti=result["primary_prakriti"],
                secondary_prakriti=result["secondary_prakriti"],
                responses_json=json.dumps(req.responses),
                notes=req.notes
            )
            db.add(assessment)
        else:
            assessment.vata_score = result["vata_score"]
            assessment.pitta_score = result["pitta_score"]
            assessment.kapha_score = result["kapha_score"]
            assessment.vata_percent = result["vata_percent"]
            assessment.pitta_percent = result["pitta_percent"]
            assessment.kapha_percent = result["kapha_percent"]
            assessment.primary_prakriti = result["primary_prakriti"]
            assessment.secondary_prakriti = result["secondary_prakriti"]
            assessment.responses_json = json.dumps(req.responses)
            assessment.notes = req.notes
        
        db.commit()
        db.refresh(assessment)
        result["id"] = assessment.id
        result["encounter_id"] = assessment.encounter_id
        result["responses_json"] = assessment.responses_json
        result["notes"] = assessment.notes

    return result

@router.get("/prakriti/{encounter_id}", response_model=PrakritiResponse)
def get_prakriti_assessment(
    encounter_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    assessment = db.query(PrakritiAssessment).filter(PrakritiAssessment.encounter_id == encounter_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Prakriti assessment not found for this encounter")
    
    radar_data = [
        {"subject": "Vata (Air/Ether)", "A": assessment.vata_percent, "fullMark": 100},
        {"subject": "Pitta (Fire/Water)", "A": assessment.pitta_percent, "fullMark": 100},
        {"subject": "Kapha (Water/Earth)", "A": assessment.kapha_percent, "fullMark": 100},
    ]

    return {
        "id": assessment.id,
        "encounter_id": assessment.encounter_id,
        "vata_score": assessment.vata_score,
        "pitta_score": assessment.pitta_score,
        "kapha_score": assessment.kapha_score,
        "vata_percent": assessment.vata_percent,
        "pitta_percent": assessment.pitta_percent,
        "kapha_percent": assessment.kapha_percent,
        "primary_prakriti": assessment.primary_prakriti,
        "secondary_prakriti": assessment.secondary_prakriti,
        "radar_data": radar_data,
        "responses_json": assessment.responses_json,
        "notes": assessment.notes
    }

@router.post("/vikriti/calculate", response_model=VikritiResponse)
def calculate_vikriti(
    req: VikritiCalculateRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = calculate_vikriti_scores(req.symptoms or [], req.ashtavidha or {})

    if req.encounter_id:
        assessment = db.query(VikritiAssessment).filter(VikritiAssessment.encounter_id == req.encounter_id).first()
        if not assessment:
            assessment = VikritiAssessment(
                encounter_id=req.encounter_id,
                vata_score=result["vata_score"],
                pitta_score=result["pitta_score"],
                kapha_score=result["kapha_score"],
                vata_percent=result["vata_percent"],
                pitta_percent=result["pitta_percent"],
                kapha_percent=result["kapha_percent"],
                dominant_pattern=result["dominant_pattern"],
                responses_json=json.dumps({"symptoms": req.symptoms, "ashtavidha": req.ashtavidha}),
                notes=req.notes
            )
            db.add(assessment)
        else:
            assessment.vata_score = result["vata_score"]
            assessment.pitta_score = result["pitta_score"]
            assessment.kapha_score = result["kapha_score"]
            assessment.vata_percent = result["vata_percent"]
            assessment.pitta_percent = result["pitta_percent"]
            assessment.kapha_percent = result["kapha_percent"]
            assessment.dominant_pattern = result["dominant_pattern"]
            assessment.responses_json = json.dumps({"symptoms": req.symptoms, "ashtavidha": req.ashtavidha})
            assessment.notes = req.notes
        
        db.commit()
        db.refresh(assessment)
        result["id"] = assessment.id
        result["encounter_id"] = assessment.encounter_id
        result["notes"] = assessment.notes

    return result

@router.get("/vikriti/{encounter_id}", response_model=VikritiResponse)
def get_vikriti_assessment(
    encounter_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    assessment = db.query(VikritiAssessment).filter(VikritiAssessment.encounter_id == encounter_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Vikriti assessment not found for this encounter")
    
    dosha_dist = [
        {"name": "Vata", "percentage": assessment.vata_percent, "fill": "#8B5CF6"},
        {"name": "Pitta", "percentage": assessment.pitta_percent, "fill": "#EF4444"},
        {"name": "Kapha", "percentage": assessment.kapha_percent, "fill": "#10B981"}
    ]

    return {
        "id": assessment.id,
        "encounter_id": assessment.encounter_id,
        "vata_score": assessment.vata_score,
        "pitta_score": assessment.pitta_score,
        "kapha_score": assessment.kapha_score,
        "vata_percent": assessment.vata_percent,
        "pitta_percent": assessment.pitta_percent,
        "kapha_percent": assessment.kapha_percent,
        "dominant_pattern": assessment.dominant_pattern,
        "dosha_distribution": dosha_dist,
        "notes": assessment.notes
    }
