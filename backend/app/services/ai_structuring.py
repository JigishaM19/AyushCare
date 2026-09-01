import re
from typing import Dict, List, Any

def structure_clinical_case(raw_notes: str, symptoms: List[Dict[str, Any]] = None, history: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    AI-Assisted Clinical Case Structuring Service.
    Transforms unstructured doctor narrative or speech transcripts into a structured
    clinical format with missing information alerts and Ayurvedic Samprapti alignment.
    Never fabricates findings.
    """
    text = (raw_notes or "").strip()
    symptoms = symptoms or []
    history = history or {}

    extracted_complaints = []
    associated_symptoms = []
    missing_info = []

    # Common clinical entities detection
    keywords_map = {
        "headache": {"name": "Shirahshoola (Headache)", "dosha": "Vata-Pitta"},
        "migraine": {"name": "Ardhavabhedaka (Migraine)", "dosha": "Vata-Pitta"},
        "fever": {"name": "Jwara (Fever)", "dosha": "Pitta-Vata"},
        "cough": {"name": "Kasa (Cough)", "dosha": "Vata-Kapha"},
        "joint pain": {"name": "Sandhigata Vata (Osteoarthritis / Joint Pain)", "dosha": "Vata"},
        "back pain": {"name": "Katishoola (Low Back Pain)", "dosha": "Vata"},
        "acidity": {"name": "Amlapitta (Hyperacidity)", "dosha": "Pitta"},
        "indigestion": {"name": "Ajirna (Dyspepsia/Indigestion)", "dosha": "Kapha-Vata"},
        "constipation": {"name": "Vibandha (Constipation)", "dosha": "Vata"},
        "insomnia": {"name": "Anidra (Sleep Disturbance)", "dosha": "Vata-Pitta"},
        "skin": {"name": "Twak Vikara (Skin Disorder/Kushtha)", "dosha": "Pitta-Kapha"},
        "anxiety": {"name": "Chittodvega (Anxiety / Stress)", "dosha": "Vata-Manasika"},
        "fatigue": {"name": "Daurbalya / Klama (General Fatigue)", "dosha": "Kapha-Vata"}
    }

    lower_text = text.lower()
    for kw, val in keywords_map.items():
        if kw in lower_text:
            extracted_complaints.append({
                "name": val["name"],
                "detected_keyword": kw,
                "suggested_dosha": val["dosha"]
            })

    # Combine with existing symptoms if any
    for s in symptoms:
        s_name = s.get("name", "")
        if s_name and not any(c["name"] == s_name for c in extracted_complaints):
            extracted_complaints.append({
                "name": s_name,
                "duration": s.get("duration", "Not specified"),
                "severity": s.get("severity", 5)
            })

    # Detect Duration / Onset in notes
    duration_match = re.search(r"(\d+)\s*(days|weeks|months|years|day|week|month|year)", lower_text)
    detected_duration = duration_match.group(0) if duration_match else "Duration not explicitly stated in notes."

    # Identify Missing Information Warnings for safe clinical decision support
    if not duration_match and not any(s.get("duration") for s in symptoms):
        missing_info.append("Duration & onset timeline is not recorded.")
    
    if not history.get("allergies") and "allergy" not in lower_text:
        missing_info.append("Drug/Food allergy verification is pending.")
        
    if not history.get("diet") and "diet" not in lower_text:
        missing_info.append("Personal Ahara (Dietary habits & Appetite) is not specified.")
        
    if not history.get("bowel") and "bowel" not in lower_text and "stool" not in lower_text:
        missing_info.append("Bowel regularity (Koshtha state) is not recorded.")

    # Formulate Structured HPI
    hpi_paragraphs = []
    if text:
        hpi_paragraphs.append(f"Patient reports: {text}")
    if duration_match:
        hpi_paragraphs.append(f"Chronology: Symptoms present for approximately {detected_duration}.")
    if extracted_complaints:
        complaint_names = ", ".join([c["name"] for c in extracted_complaints])
        hpi_paragraphs.append(f"Identified Symptom Cluster: {complaint_names}.")

    hpi_summary = " ".join(hpi_paragraphs) if hpi_paragraphs else "Clinical narrative not yet recorded."

    return {
        "chief_complaints": extracted_complaints,
        "history_summary": hpi_summary,
        "associated_symptoms": associated_symptoms,
        "missing_information": missing_info,
        "detected_duration": detected_duration,
        "structured_notes": (
            f"--- CLINICAL DECISION SUPPORT SUMMARY ---\n"
            f"HPI: {hpi_summary}\n\n"
            f"Primary Entities: {', '.join([c['name'] for c in extracted_complaints]) if extracted_complaints else 'None recorded'}\n"
            f"Review Status: Practitioner verification required."
        )
    }
