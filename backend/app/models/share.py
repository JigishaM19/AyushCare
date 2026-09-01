from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class ShareSession(Base):
    """
    Temporary secure QR/Access Token for portable record sharing across hospitals.
    Does NOT store raw medical data in token.
    """
    __tablename__ = "share_sessions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    token = Column(String(100), unique=True, index=True, nullable=False)
    access_code = Column(String(10), index=True, nullable=False)  # 6-digit access PIN
    expires_at = Column(DateTime, nullable=False)
    
    # Granular permissions: e.g. {"profile": true, "allergies": true, "medications": true, "consultations": true, "documents": true}
    permissions_json = Column(Text, nullable=False)
    
    status = Column(String(50), default="Active")  # Active, Approved, Expired, Revoked
    created_at = Column(DateTime, default=datetime.utcnow)
    revoked_at = Column(DateTime, nullable=True)

    patient = relationship("Patient")


class AccessLog(Base):
    """
    Access Audit Log: Tracks which hospital/doctor accessed patient records, timestamps, and permissions.
    """
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    organization = Column(String(150), nullable=False)  # e.g. City General Hospital (Hospital B)
    accessor_name = Column(String(100), default="Attending Doctor")
    accessed_data = Column(String(255), nullable=False)  # e.g. "Clinical Summary, Prescriptions, Documents"
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="Authorized")  # Authorized, Denied, Revoked

    patient = relationship("Patient")
