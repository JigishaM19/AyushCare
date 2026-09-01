from fastapi import APIRouter, Depends, Body
from app.services.document_ocr_service import process_medical_document_ocr

router = APIRouter(prefix="/documents", tags=["Medical Document Digitization"])

@router.post("/process")
def process_document(
    file_name: str = Body(..., embed=True),
    document_type: str = Body("Prescription", embed=True),
    raw_text: str = Body(None, embed=True)
):
    return process_medical_document_ocr(file_name, document_type, raw_text)
