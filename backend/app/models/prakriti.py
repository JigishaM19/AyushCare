from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database.session import Base

class PrakritiAssessment(Base):
    __tablename__ = "prakriti_assessments"

    id = Column(Integer, primary_key=True, index=True)
    encounter_id = Column(Integer, ForeignKey("encounters.id"), unique=True, nullable=False)
    
    vata_score = Column(Float, default=0.0)
    pitta_score = Column(Float, default=0.0)
    kapha_score = Column(Float, default=0.0)
    
    vata_percent = Column(Float, default=0.0)
    pitta_percent = Column(Float, default=0.0)
    kapha_percent = Column(Float, default=0.0)
    
    primary_prakriti = Column(String(50), default="Vata-Pitta")
    secondary_prakriti = Column(String(50), nullable=True)
    
    responses_json = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    encounter = relationship("Encounter", back_populates="prakriti")


class VikritiAssessment(Base):
    __tablename__ = "vikriti_assessments"

    id = Column(Integer, primary_key=True, index=True)
    encounter_id = Column(Integer, ForeignKey("encounters.id"), unique=True, nullable=False)
    
    vata_score = Column(Float, default=0.0)
    pitta_score = Column(Float, default=0.0)
    kapha_score = Column(Float, default=0.0)
    
    vata_percent = Column(Float, default=0.0)
    pitta_percent = Column(Float, default=0.0)
    kapha_percent = Column(Float, default=0.0)
    
    dominant_pattern = Column(String(50), default="Vata Dushti")
    responses_json = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    encounter = relationship("Encounter", back_populates="vikriti")
