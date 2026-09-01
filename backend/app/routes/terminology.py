from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.session import get_db
from app.models.terminology import TerminologyItem
from app.schemas.terminology import TerminologyResponse

router = APIRouter(prefix="/terminology", tags=["NAMASTE Standardized Terminology"])

@router.get("/search", response_model=List[TerminologyResponse])
def search_terminology(
    q: Optional[str] = Query(None, description="Search term or code"),
    category: Optional[str] = Query(None, description="Filter by category (Disease, Symptom, etc.)"),
    db: Session = Depends(get_db)
):
    query = db.query(TerminologyItem)
    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            or_(
                TerminologyItem.preferred_term.ilike(search_pattern),
                TerminologyItem.code.ilike(search_pattern),
                TerminologyItem.ayurvedic_name.ilike(search_pattern),
                TerminologyItem.description.ilike(search_pattern)
            )
        )
    if category:
        query = query.filter(TerminologyItem.category.ilike(category))
    
    return query.limit(25).all()

@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(TerminologyItem.category).distinct().all()
    return [c[0] for c in categories if c[0]]
