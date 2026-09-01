from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database.session import Base

class Encounter(Base):
    __tablename__ = "encounters"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    practitioner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="In Progress")  # In Progress, Completed, Follow-up
    
    # Clinical Case-Taking Fields
    chief_complaint = Column(Text, nullable=True)
    hpi = Column(Text, nullable=True)  # History of Present Illness
    pain_socrates = Column(Text, nullable=True)  # JSON string or structured text
    
    past_history = Column(Text, nullable=True)  # Medical/Surgical/Medication/Allergy
    family_history = Column(Text, nullable=True)  # Grid or JSON
    personal_history = Column(Text, nullable=True)  # Diet, sleep, bowel, appetite, etc.
    
    structured_summary = Column(Text, nullable=True)
    practitioner_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="encounters")
    practitioner = relationship("User")
    symptoms = relationship("Symptom", back_populates="encounter", cascade="all, delete-orphan")
    ashtavidha = relationship("AshtavidhaAssessment", back_populates="encounter", uselist=False, cascade="all, delete-orphan")
    prakriti = relationship("PrakritiAssessment", back_populates="encounter", uselist=False, cascade="all, delete-orphan")
    vikriti = relationship("VikritiAssessment", back_populates="encounter", uselist=False, cascade="all, delete-orphan")
    prescriptions = relationship("Prescription", back_populates="encounter", cascade="all, delete-orphan")


class Symptom(Base):
    __tablename__ = "symptoms"

    id = Column(Integer, primary_key=True, index=True)
    encounter_id = Column(Integer, ForeignKey("encounters.id"), nullable=False)
    name = Column(String(100), nullable=False)
    duration = Column(String(50), nullable=True)
    severity = Column(Integer, default=5)  # 0 to 10 scale
    frequency = Column(String(50), nullable=True)  # Continuous, Intermittent, Episodic
    onset = Column(String(50), nullable=True)  # Sudden, Gradual
    aggravating_factors = Column(String(255), nullable=True)
    relieving_factors = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)

    encounter = relationship("Encounter", back_populates="symptoms")
