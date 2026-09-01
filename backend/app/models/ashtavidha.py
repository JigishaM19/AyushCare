from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class AshtavidhaAssessment(Base):
    __tablename__ = "ashtavidha_assessments"

    id = Column(Integer, primary_key=True, index=True)
    encounter_id = Column(Integer, ForeignKey("encounters.id"), unique=True, nullable=False)
    
    # 1. Nadi (Pulse) - rate, rhythm, dosha dominance (Vata/Pitta/Kapha/Vata-Pitta etc.), speed/movement (Sarpa, Manduka, Hamsa)
    nadi = Column(Text, nullable=True)  # JSON or structured string
    
    # 2. Mutra (Urine) - frequency, color, quantity, odor, burning, urgency
    mutra = Column(Text, nullable=True)
    
    # 3. Mala (Stool) - frequency, consistency, color, regularity, constipation, diarrhea
    mala = Column(Text, nullable=True)
    
    # 4. Jihva (Tongue) - color, coating, moisture, texture, cracks, Ama presence
    jihva = Column(Text, nullable=True)
    
    # 5. Shabda (Voice/Sound) - voice quality, speech pattern, respiratory sounds
    shabda = Column(Text, nullable=True)
    
    # 6. Sparsha (Touch/Skin) - temperature, texture, moisture, tenderness
    sparsha = Column(Text, nullable=True)
    
    # 7. Druk (Eyes/Vision) - eye appearance, color, vision complaint
    druk = Column(Text, nullable=True)
    
    # 8. Akruti (Build/Gait) - body build, general appearance, posture, gait
    akruti = Column(Text, nullable=True)
    
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    encounter = relationship("Encounter", back_populates="ashtavidha")
