from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.terminology import RepertoryRubric
from app.schemas.terminology import RepertorizationRequest, RepertoryRubricResponse
from app.services.repertory_engine import calculate_repertorization, DEMO_REPERTORY_DATABASE

router = APIRouter(prefix="/repertorization", tags=["Homeopathic Repertorization Module"])

@router.get("/rubrics", response_model=List[RepertoryRubricResponse])
def list_rubrics(
    chapter: Optional[str] = Query(None, description="Filter by chapter: Mind, Head, Stomach, Extremities, Generalities"),
    q: Optional[str] = Query(None, description="Search rubric text")
):
    rubrics = DEMO_REPERTORY_DATABASE
    if chapter:
        rubrics = [r for r in rubrics if r["chapter"].lower() == chapter.lower()]
    if q:
        rubrics = [r for r in rubrics if q.lower() in r["rubric"].lower() or q.lower() in r["chapter"].lower()]
    
    return [
        {
            "id": r["id"],
            "chapter": r["chapter"],
            "rubric": r["rubric"],
            "sub_rubric": r.get("sub_rubric")
        }
        for r in rubrics
    ]

@router.post("/calculate")
def calculate_remedy_matches(req: RepertorizationRequest):
    return calculate_repertorization(req.rubric_ids)
