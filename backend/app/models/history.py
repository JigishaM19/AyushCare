from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship as orm_relationship
from app.database.session import Base

class HealthHistory(Base):
    """
    Longitudinal Health History entries (Diagnosed conditions, surgeries, family history).
    """
    __tablename__ = "health_history"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    category = Column(String(50), nullable=False)  # Medical Condition, Surgery, Allergy, Family History, Medication
    condition = Column(String(150), nullable=False)
    family_relation = Column(String(50), nullable=True)  # Self, Father, Mother, Sibling
    details = Column(Text, nullable=True)
    source = Column(String(50), default="Patient Portal")  # Patient Portal, Kiosk, Doctor Consultation, OCR Document
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = orm_relationship("Patient")


class PatientAssessment(Base):
    """
    Answers to first-time health profile and pre-consultation questionnaires.
    """
    __tablename__ = "patient_assessments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    session_id = Column(String(100), nullable=True)
    question_id = Column(String(100), nullable=False)
    question_text = Column(String(255), nullable=True)
    answer = Column(Text, nullable=False)
    source = Column(String(50), default="Patient Portal")  # Patient Portal, Kiosk Voice, Kiosk Touch
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = orm_relationship("Patient")
