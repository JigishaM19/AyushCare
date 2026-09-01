from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class KioskSession(Base):
    """
    Hospital Kiosk Pre-Consultation Session state and doctor handoff package.
    """
    __tablename__ = "kiosk_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_code = Column(String(50), unique=True, index=True, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True, index=True)
    language = Column(String(10), default="en")  # en, hi, mr
    chief_complaint = Column(String(200), nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="Active")  # Active, Completed, Handoff to Doctor, Cancelled
    
    # Structured Pre-Consultation Package for Doctor OPD Queue
    summary_json = Column(Text, nullable=True)
    ai_confidence_flag = Column(String(50), default="Needs Doctor Review")

    patient = relationship("Patient")
