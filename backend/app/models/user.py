from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="practitioner")  # practitioner, admin
    registration_no = Column(String(50), default="AYU-REG-2024-8842")
    clinic_name = Column(String(150), default="AyushCare Integrative Wellness Clinic")
    created_at = Column(DateTime, default=datetime.utcnow)
