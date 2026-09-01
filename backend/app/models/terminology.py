from sqlalchemy import Column, Integer, String, Text, Float
from app.database.session import Base

class TerminologyItem(Base):
    """
    Standardized Terminology model abstraction (NAMASTE / AYUSH Morbidity codes).
    Clearly marked for Demo/Research.
    """
    __tablename__ = "terminology_items"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    preferred_term = Column(String(150), index=True, nullable=False)
    ayurvedic_name = Column(String(150), nullable=True)
    category = Column(String(100), index=True, nullable=False)  # Disease, Symptom, Pariksha, Dosha, Srotas
    description = Column(Text, nullable=True)
    dosha_affinity = Column(String(100), nullable=True)


class FormulationItem(Base):
    """
    Ayurvedic Reference Formulations Database.
    Practitioner verification required.
    """
    __tablename__ = "formulation_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), index=True, nullable=False)
    form = Column(String(50), nullable=False)  # Vati, Churna, Kwatha, Asava, Taila, Ghruta, Bhasma
    category = Column(String(100), nullable=False)  # Classical, Proprietary
    standard_dosage = Column(String(100), nullable=False)
    standard_frequency = Column(String(100), default="Twice daily (BD)")
    standard_timing = Column(String(100), default="After Food")
    default_anupana = Column(String(100), default="Warm Water")
    indications = Column(Text, nullable=True)
    dosha_karma = Column(String(100), nullable=True)  # Vata Shamaka, Pitta Shamaka, Kapha Shamaka, Tridosha
    precautions = Column(Text, nullable=True)


class RepertoryRubric(Base):
    """
    Homeopathic Repertorization Rubrics and Remedies dataset.
    Decision-support research module.
    """
    __tablename__ = "repertory_rubrics"

    id = Column(Integer, primary_key=True, index=True)
    chapter = Column(String(50), index=True, nullable=False)  # Mind, Head, Stomach, Extremities, Generalities, Sleep
    rubric = Column(String(200), index=True, nullable=False)
    sub_rubric = Column(String(200), nullable=True)
    remedies = Column(Text, nullable=False)  # JSON or comma-separated list with weights (e.g. Nux-v:3, Bell:2, Bry:1)
