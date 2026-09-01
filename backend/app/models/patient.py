from datetime import datetime, date
from sqlalchemy import Column, Integer, String, DateTime, Date, Text
from sqlalchemy.orm import relationship
from app.database.session import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    dob = Column(Date, nullable=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)  # Male, Female, Other
    phone = Column(String(20), nullable=False, index=True)
    email = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(100), default="New Delhi")
    state = Column(String(100), default="Delhi")
    
    # Emergency Information
    emergency_contact = Column(String(100), nullable=True)
    emergency_relationship = Column(String(50), nullable=True)

    # ABHA & Consent (Simulated for Demo)
    abha_id = Column(String(50), nullable=True, index=True)
    abha_status = Column(String(50), default="Unlinked")  # Linked, Unlinked, Pending

    # Clinical Baseline Information
    allergies = Column(Text, nullable=True)
    medical_history = Column(Text, nullable=True)
    current_medications = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    encounters = relationship("Encounter", back_populates="patient", cascade="all, delete-orphan")
