from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    encounter_id = Column(Integer, ForeignKey("encounters.id"), nullable=False)
    practitioner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    follow_up_date = Column(String(50), nullable=True)
    
    general_advice = Column(Text, nullable=True)
    diet_pathya = Column(Text, nullable=True)  # Wholesome foods (Pathya)
    diet_apathya = Column(Text, nullable=True)  # Unwholesome foods to avoid (Apathya)
    status = Column(String(50), default="Active")  # Active, Completed, Cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    encounter = relationship("Encounter", back_populates="prescriptions")
    practitioner = relationship("User")
    items = relationship("PrescriptionItem", back_populates="prescription", cascade="all, delete-orphan")


class PrescriptionItem(Base):
    __tablename__ = "prescription_items"

    id = Column(Integer, primary_key=True, index=True)
    prescription_id = Column(Integer, ForeignKey("prescriptions.id"), nullable=False)
    formulation = Column(String(150), nullable=False)
    form = Column(String(50), default="Vati/Tablet")  # Churna, Vati, Kwatha, Asava, Taila, Ghruta
    dosage = Column(String(50), nullable=False)  # 1 tablet, 5g, 15ml
    frequency = Column(String(50), nullable=False)  # Once daily, Twice daily (BD), Thrice daily (TID)
    duration = Column(String(50), nullable=False)  # 7 days, 15 days, 1 month
    timing = Column(String(50), default="After Food")  # Before food, After food, Empty stomach
    anupana = Column(String(100), default="Warm Water")  # Vehicle: Ushnodaka (Warm water), Ksheera (Milk), Madhu (Honey)
    instructions = Column(Text, nullable=True)

    prescription = relationship("Prescription", back_populates="items")
