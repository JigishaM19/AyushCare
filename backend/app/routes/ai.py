from fastapi import APIRouter, Depends
from app.schemas.terminology import AIStructuringRequest, AIStructuringResponse
from app.services.ai_structuring import structure_clinical_case
from app.security.auth import get_current_user

router = APIRouter(prefix="/ai", tags=["AI Clinical Assistant"])

@router.post("/structure-case", response_model=AIStructuringResponse)
def ai_structure_case(
    req: AIStructuringRequest,
    current_user = Depends(get_current_user)
):
    result = structure_clinical_case(
        raw_notes=req.raw_notes,
        symptoms=req.symptoms,
        history=req.history
    )
    return result
