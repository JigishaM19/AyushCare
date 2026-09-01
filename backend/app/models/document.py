from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class MedicalDocument(Base):
    __tablename__ = "medical_documents"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    document_type = Column(String(100), nullable=False)  # Prescription, Blood Report, Lab Report, Discharge Summary, Imaging Report, Other
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    file_size_kb = Column(Integer, default=120)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    # OCR & AI Extraction
    ocr_text = Column(Text, nullable=True)
    key_info_json = Column(Text, nullable=True)  # Structured extracted parameters (doctor, hospital, medicine, tests)
    processing_status = Column(String(50), default="Processed")  # Uploading, Processing, Processed, Needs Review
    verified = Column(Boolean, default=False)
    hospital_source = Column(String(150), default="Ayush Wellness Hospital")

    # Relationships
    patient = relationship("Patient")
