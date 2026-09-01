import json
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.patient import Patient
from app.models.encounter import Encounter, Symptom
from app.models.ashtavidha import AshtavidhaAssessment
from app.models.prakriti import PrakritiAssessment, VikritiAssessment
from app.models.prescription import Prescription, PrescriptionItem
from app.models.terminology import TerminologyItem, FormulationItem, RepertoryRubric
from app.security.auth import get_password_hash
from app.services.repertory_engine import DEMO_REPERTORY_DATABASE

def seed_database(db: Session):
    from app.models.document import MedicalDocument
    from app.models.share import ShareSession, AccessLog

    # If users exist but documents are empty, seed the documents and shares
    if db.query(User).first():
        if db.query(MedicalDocument).count() == 0:
            p1 = db.query(Patient).filter(Patient.patient_code == "AYU-2026-001").first()
            p2 = db.query(Patient).filter(Patient.patient_code == "AYU-2026-002").first()
            if p1 and p2:
                doc1 = MedicalDocument(
                    patient_id=p1.id,
                    document_type="Blood Report",
                    file_name="Complete_Blood_Count_Aug2026.pdf",
                    file_size_kb=245,
                    uploaded_at=datetime.utcnow() - timedelta(days=25),
                    ocr_text="CBC Diagnostic Report. Hb: 13.8 g/dL (Normal). Fasting Glucose: 98 mg/dL. Normal hemogram.",
                    key_info_json=json.dumps([{"parameter": "Test", "value": "CBC & FBS"}, {"parameter": "Status", "value": "Normal Limits"}]),
                    processing_status="Processed",
                    verified=True,
                    hospital_source="City General Hospital"
                )
                doc2 = MedicalDocument(
                    patient_id=p1.id,
                    document_type="Previous Prescription",
                    file_name="Rx_HospitalB_Jul2026.jpg",
                    file_size_kb=180,
                    uploaded_at=datetime.utcnow() - timedelta(days=40),
                    ocr_text="Rx: Pantoprazole 40mg OD x 14 days. Paracetamol 650mg SOS. Dr. S. K. Mehta, City General Hospital.",
                    key_info_json=json.dumps([{"parameter": "Facility", "value": "City General Hospital"}, {"parameter": "Doctor", "value": "Dr. S. K. Mehta"}]),
                    processing_status="Needs Review",
                    verified=False,
                    hospital_source="City General Hospital (Hospital B)"
                )
                doc3 = MedicalDocument(
                    patient_id=p2.id,
                    document_type="Imaging Report",
                    file_name="XRay_Bilateral_Knee_Jun2026.pdf",
                    file_size_kb=420,
                    uploaded_at=datetime.utcnow() - timedelta(days=60),
                    ocr_text="X-Ray Bilateral Knees AP/Lateral. Mild medial joint space narrowing. Osteoarthritic changes.",
                    key_info_json=json.dumps([{"parameter": "Test", "value": "Bilateral Knee X-Ray"}, {"parameter": "Impression", "value": "Mild Osteoarthritis"}]),
                    processing_status="Processed",
                    verified=True,
                    hospital_source="Ayush Wellness Hospital"
                )
                db.add_all([doc1, doc2, doc3])

                share1 = ShareSession(
                    patient_id=p1.id,
                    token="SHARE-8F29A100",
                    access_code="492811",
                    expires_at=datetime.utcnow() + timedelta(hours=4),
                    permissions_json=json.dumps({
                        "profile": True,
                        "allergies": True,
                        "medications": True,
                        "consultations": True,
                        "investigations": True,
                        "prescriptions": True,
                        "documents": True
                    }),
                    status="Active"
                )
                db.add(share1)

                log1 = AccessLog(
                    patient_id=p1.id,
                    organization="City General Hospital (Hospital B)",
                    accessor_name="Dr. S. K. Mehta (MBBS, MD)",
                    accessed_data="Clinical Summary, Prescriptions, Documents",
                    timestamp=datetime.utcnow() - timedelta(days=1),
                    status="Authorized"
                )
                db.add(log1)
                db.commit()
        return

    # 1. Create Users
    doc_user = User(
        name="Dr. Rajesh Varma",
        email="doctor@ayushcare.in",
        password_hash=get_password_hash("password123"),
        role="practitioner",
        registration_no="AYU-DEL-2018-4912",
        clinic_name="All India Institute of Ayurveda Clinical OPD"
    )
    admin_user = User(
        name="Admin Operations",
        email="admin@ayushcare.in",
        password_hash=get_password_hash("admin123"),
        role="admin",
        registration_no="AYU-ADM-2024-001",
        clinic_name="AyushCare National EHR Hub"
    )
    db.add(doc_user)
    db.add(admin_user)
    db.commit()
    db.refresh(doc_user)

    # 2. Terminology Items (NAMASTE Demo)
    terms = [
        TerminologyItem(code="NAM-SHIR-01", preferred_term="Headache (Shirahshoola)", ayurvedic_name="Shirahshoola", category="Symptom", description="Cephalalgia caused by Vata-Pitta provocation in Siras", dosha_affinity="Vata-Pitta"),
        TerminologyItem(code="NAM-AMLA-02", preferred_term="Hyperacidity (Amlapitta)", ayurvedic_name="Amlapitta", category="Disease", description="Acid peptic disorder due to Vidagdha Pitta accumulation", dosha_affinity="Pitta"),
        TerminologyItem(code="NAM-SANDHI-03", preferred_term="Osteoarthritis (Sandhigata Vata)", ayurvedic_name="Sandhigata Vata", category="Disease", description="Degenerative joint disease with Shoola and Shotha", dosha_affinity="Vata"),
        TerminologyItem(code="NAM-KASA-04", preferred_term="Cough (Kasa)", ayurvedic_name="Kasa", category="Symptom", description="Respiratory reflex caused by Prana and Udana Vayu obstruction", dosha_affinity="Vata-Kapha"),
        TerminologyItem(code="NAM-ANIDRA-05", preferred_term="Insomnia (Anidra)", ayurvedic_name="Anidra", category="Symptom", description="Sleep disturbance due to elevated Rajas and Vata", dosha_affinity="Vata-Manasika"),
        TerminologyItem(code="NAM-VIBANDHA-06", preferred_term="Constipation (Vibandha)", ayurvedic_name="Vibandha", category="Symptom", description="Difficulty in bowel evacuation due to Apana Vata Vaigunya", dosha_affinity="Vata"),
        TerminologyItem(code="NAM-TWAK-07", preferred_term="Eczema / Skin Dermatitis (Kushtha/Vicharchika)", ayurvedic_name="Vicharchika", category="Disease", description="Chronic skin condition with Kandu (itching) and Srava", dosha_affinity="Pitta-Kapha")
    ]
    db.add_all(terms)

    # 3. Reference Ayurvedic Formulations
    formulations = [
        FormulationItem(name="Saraswatarishta", form="Asava/Arishta", category="Classical", standard_dosage="20 ml", standard_frequency="Twice daily (BD)", standard_timing="After Food", default_anupana="Equal parts warm water", indications="Memory enhancement, stress, insomnia, anxiety", dosha_karma="Vata-Pitta Shamaka"),
        FormulationItem(name="Ashwagandhadi Lehya", form="Avaleha", category="Classical", standard_dosage="10 g", standard_frequency="Twice daily (BD)", standard_timing="After Food", default_anupana="Warm Cow's Milk", indications="General debility, stress, fatigue, neuromuscular weakness", dosha_karma="Vata-Kapha Shamaka"),
        FormulationItem(name="Yograj Guggulu", form="Vati/Tablet", category="Classical", standard_dosage="2 tablets (500mg each)", standard_frequency="Twice daily (BD)", standard_timing="After Food", default_anupana="Warm Water / Rasnadi Kwatha", indications="Joint pain, stiffness, rheumatoid complaints, Vata disorders", dosha_karma="Vata Shamaka"),
        FormulationItem(name="Avipattikar Churna", form="Churna", category="Classical", standard_dosage="3-5 g", standard_frequency="Twice daily (BD)", standard_timing="Before Food", default_anupana="Warm Water / Coconut Water", indications="Hyperacidity, heartburn, gastritis, sour belching", dosha_karma="Pitta Shamaka"),
        FormulationItem(name="Triphala Churna", form="Churna", category="Classical", standard_dosage="5 g", standard_frequency="Once daily at bedtime (HS)", standard_timing="Bedtime", default_anupana="Warm Water", indications="Constipation, eye health, mild detox, digestive regulation", dosha_karma="Tridosha Shamaka"),
        FormulationItem(name="Brahmi Vati", form="Vati/Tablet", category="Classical", standard_dosage="1 tablet (250mg)", standard_frequency="Twice daily (BD)", standard_timing="After Food", default_anupana="Milk or Warm Water", indications="Mental fatigue, headache, anxiety, insomnia", dosha_karma="Vata-Pitta Shamaka"),
        FormulationItem(name="Maharasnadi Kwatha", form="Kwatha", category="Classical", standard_dosage="20 ml", standard_frequency="Twice daily (BD)", standard_timing="Before Food", default_anupana="Warm Water", indications="Sciatica, osteoarthritis, musculoskeletal pain", dosha_karma="Vata Shamaka"),
        FormulationItem(name="Sitopaladi Churna", form="Churna", category="Classical", standard_dosage="3 g", standard_frequency="Thrice daily (TID)", standard_timing="After Food", default_anupana="Honey & Ghee (unequal)", indications="Cough, bronchitis, respiratory congestion, low appetite", dosha_karma="Kapha-Pitta Shamaka")
    ]
    db.add_all(formulations)

    # 4. Homeopathic Repertory Rubrics
    for r in DEMO_REPERTORY_DATABASE:
        db.add(RepertoryRubric(
            id=r["id"],
            chapter=r["chapter"],
            rubric=r["rubric"],
            remedies=json.dumps(r["remedies"])
        ))

    # 5. Fictional Demo Patients
    p1 = Patient(
        patient_code="AYU-2026-001",
        name="Aarav Sharma",
        dob=date(1990, 5, 14),
        age=34,
        gender="Male",
        phone="9811223344",
        email="aarav.sharma@example.com",
        address="B-42, Vasant Kunj",
        city="New Delhi",
        state="Delhi",
        emergency_contact="Pooja Sharma (Wife)",
        emergency_relationship="Spouse",
        abha_id="91-4920-1928-3341@abdm",
        abha_status="Linked",
        allergies="Dust, Sulfa drugs",
        medical_history="Frequent tension headaches, episodic acidity",
        current_medications="Paracetamol SOS"
    )
    p2 = Patient(
        patient_code="AYU-2026-002",
        name="Meera Patil",
        dob=date(1982, 9, 21),
        age=42,
        gender="Female",
        phone="9822334455",
        email="meera.patil@example.com",
        address="Flat 402, Shivajinagar",
        city="Pune",
        state="Maharashtra",
        emergency_contact="Suresh Patil",
        emergency_relationship="Brother",
        abha_id="91-8833-2211-5509@abdm",
        abha_status="Linked",
        allergies="None reported",
        medical_history="Bilateral knee stiffness, morning pain",
        current_medications="Calcium supplements"
    )
    p3 = Patient(
        patient_code="AYU-2026-003",
        name="Rohan Deshmukh",
        dob=date(1995, 3, 11),
        age=29,
        gender="Male",
        phone="9833445566",
        email="rohan.d@example.com",
        address="12, Koramangala 4th Block",
        city="Bengaluru",
        state="Karnataka",
        emergency_contact="Nitin Deshmukh",
        emergency_relationship="Father",
        abha_id="91-7722-1100-9944@abdm",
        abha_status="Unlinked",
        allergies="Peanuts",
        medical_history="Chronic GERD, retrosternal burning",
        current_medications="Antacids"
    )
    p4 = Patient(
        patient_code="AYU-2026-004",
        name="Sunita Verma",
        dob=date(1966, 11, 4),
        age=58,
        gender="Female",
        phone="9844556677",
        email="sunita.v@example.com",
        address="C-19, Sector 15",
        city="Noida",
        state="Uttar Pradesh",
        emergency_contact="Amit Verma",
        emergency_relationship="Son",
        abha_id="91-3344-5566-7788@abdm",
        abha_status="Linked",
        allergies="Penicillin",
        medical_history="Hypertension (controlled), lumbar spondylosis",
        current_medications="Telmisartan 40mg"
    )
    p5 = Patient(
        patient_code="AYU-2026-005",
        name="Vikram Singhania",
        dob=date(1979, 7, 18),
        age=45,
        gender="Male",
        phone="9855667788",
        email="vikram.s@example.com",
        address="Tower 3, Hiranandani Estate",
        city="Thane",
        state="Maharashtra",
        emergency_contact="Neeta Singhania",
        emergency_relationship="Spouse",
        abha_id="91-1122-3344-5566@abdm",
        abha_status="Unlinked",
        allergies="None",
        medical_history="Insomnia, high occupational stress, dry cough",
        current_medications="None"
    )

    db.add_all([p1, p2, p3, p4, p5])
    db.commit()
    db.refresh(p1)
    db.refresh(p2)
    db.refresh(p3)

    # 6. Sample Completed Encounter for Aarav Sharma (Patient 1)
    enc1 = Encounter(
        patient_id=p1.id,
        practitioner_id=doc_user.id,
        date=datetime.utcnow() - timedelta(days=2),
        status="Completed",
        chief_complaint="Throbbing right-sided headache (Shirahshoola) with temporal pulsation and mild nausea for 3 weeks.",
        hpi="Patient has experienced recurring episodes of throbbing right temporal headache triggered by irregular sleep and prolonged screen exposure. Relieved temporarily by dark room and resting.",
        pain_socrates=json.dumps({
            "site": "Right temporal region",
            "onset": "Gradual in the morning",
            "character": "Throbbing, pulsating",
            "radiation": "Radiates towards right eye and occiput",
            "associated": "Nausea, photophobia, mild neck tightness",
            "timing": "Aggravated post-midday",
            "exacerbating": "Bright sunlight, loud sound, missed lunch",
            "severity": 7
        }),
        past_history="History of episodic acidity and irregular meal timings.",
        family_history="Mother had migraine history.",
        personal_history=json.dumps({
            "diet": "Vegetarian, irregular timings, spicy food fondness",
            "appetite": "Irregular (Vishamagni)",
            "sleep": "Disturbed (5-6 hours/night)",
            "bowel": "Tendency to dry stools / mild constipation",
            "stress": "Moderate to high software development workload"
        }),
        structured_summary="34-year-old male presenting with Shirahshoola (Vata-Pitta dominant headache) aggravated by screen time and irregular Ahara. Ashtavidha reveals Sarpa-Manduka Nadi and Sama Jihva. Prakriti: Vata-Pitta (48% V, 37% P, 15% K).",
        practitioner_notes="Advised Shiroabhyanga with Ksheerabala Taila at night and regularizing meal sleep rhythm."
    )
    db.add(enc1)
    db.commit()
    db.refresh(enc1)

    # Symptoms for Enc 1
    sym1 = Symptom(
        encounter_id=enc1.id,
        name="Throbbing Headache",
        duration="3 weeks",
        severity=7,
        frequency="Intermittent",
        onset="Gradual",
        aggravating_factors="Sunlight, screen glare, stress",
        relieving_factors="Dark quiet room, forehead massage"
    )
    sym2 = Symptom(
        encounter_id=enc1.id,
        name="Mild Nausea & Acidity",
        duration="10 days",
        severity=4,
        frequency="Episodic",
        onset="Gradual",
        aggravating_factors="Empty stomach",
        relieving_factors="Warm milk"
    )
    db.add_all([sym1, sym2])

    # Ashtavidha for Enc 1
    ash1 = AshtavidhaAssessment(
        encounter_id=enc1.id,
        nadi=json.dumps({"rate": "74 bpm", "rhythm": "Regular", "dominant_dosha": "Vata-Pitta", "gati": "Sarpa-Manduka (Wavy & Leaping)"}),
        mutra=json.dumps({"color": "Pale Yellow (Peeta)", "frequency": "4-5 times/day", "burning": "Mild on late afternoons"}),
        mala=json.dumps({"consistency": "Dry / Hard", "frequency": "Once daily", "regularity": "Irregular"}),
        jihva=json.dumps({"color": "Pink with mild white coating (Sama)", "coating": "Posterior third", "moisture": "Dry"}),
        shabda=json.dumps({"quality": "Clear, fast-paced", "voice": "Normal"}),
        sparsha=json.dumps({"temperature": "Warm forehead, cool extremities", "texture": "Dry skin"}),
        druk=json.dumps({"appearance": "Mild conjunctival congestion", "vision": "Normal"}),
        akruti=json.dumps({"build": "Madhyama (Medium/Slender)", "posture": "Erect, slight neck stiffness"}),
        notes="Vata-Pitta provocation evident in Nadi and Twak."
    )
    db.add(ash1)

    # Prakriti for Enc 1
    prak1 = PrakritiAssessment(
        encounter_id=enc1.id,
        vata_score=15.0,
        pitta_score=12.0,
        kapha_score=5.0,
        vata_percent=46.9,
        pitta_percent=37.5,
        kapha_percent=15.6,
        primary_prakriti="Vata-Pitta (Dwandvaja)",
        secondary_prakriti="Kapha Anubandha",
        responses_json=json.dumps({"body_frame": "v1", "skin_nature": "p2", "hair_type": "v3", "appetite": "v4", "sleep_pattern": "v5", "bowel_habit": "v6", "weather_tolerance": "v7", "mind_decision": "v8", "stress_response": "v9", "memory_pattern": "p10"}),
        notes="Characteristic Vata-Pitta constitution."
    )
    db.add(prak1)

    # Vikriti for Enc 1
    vik1 = VikritiAssessment(
        encounter_id=enc1.id,
        vata_score=45.0,
        pitta_score=35.0,
        kapha_score=15.0,
        vata_percent=47.4,
        pitta_percent=36.8,
        kapha_percent=15.8,
        dominant_pattern="Vata-Pitta Samsarga",
        responses_json=json.dumps({}),
        notes="Active Vata aggravation with Pitta association."
    )
    db.add(vik1)

    # Prescription for Enc 1
    rx1 = Prescription(
        encounter_id=enc1.id,
        practitioner_id=doc_user.id,
        date=datetime.utcnow() - timedelta(days=2),
        follow_up_date="14 days (After two weeks)",
        general_advice="Strict sleep routine by 10:30 PM. Limit screen exposure after 9 PM. Shiroabhyanga with Ksheerabala taila.",
        diet_pathya="Warm light khichdi, pomegranate, soaked raisins, ghee.",
        diet_apathya="Avoid direct sunlight, excess tea/coffee, fermented bakery items, skipping meals.",
        status="Active"
    )
    db.add(rx1)
    db.commit()
    db.refresh(rx1)

    rx_item1 = PrescriptionItem(
        prescription_id=rx1.id,
        formulation="Saraswatarishta",
        form="Asava/Arishta",
        dosage="20 ml",
        frequency="Twice daily (BD)",
        duration="14 days",
        timing="After Food",
        anupana="Equal parts warm water",
        instructions="Take 20ml mixed with 20ml warm water after lunch and dinner."
    )
    rx_item2 = PrescriptionItem(
        prescription_id=rx1.id,
        formulation="Brahmi Vati",
        form="Vati/Tablet",
        dosage="1 tablet (250mg)",
        frequency="Twice daily (BD)",
        duration="14 days",
        timing="After Food",
        anupana="Warm Water",
        instructions="For mental soothing and alleviating headache tension."
    )
    rx_item3 = PrescriptionItem(
        prescription_id=rx1.id,
        formulation="Avipattikar Churna",
        form="Churna",
        dosage="3 g",
        frequency="Twice daily (BD)",
        duration="14 days",
        timing="Before Food",
        anupana="Warm Water",
        instructions="Take 3g with warm water 20 mins before meals to balance Pitta."
    )
    db.add_all([rx_item1, rx_item2, rx_item3])

    # 7. Add a few more in-progress encounters for Meera Patil and Rohan Deshmukh
    enc2 = Encounter(
        patient_id=p2.id,
        practitioner_id=doc_user.id,
        date=datetime.utcnow() - timedelta(hours=3),
        status="In Progress",
        chief_complaint="Bilateral knee joint pain (Sandhishoola) with morning stiffness lasting 30 minutes for 6 months.",
        hpi="42-year-old female presenting with progressive knee joint pain worse on climbing stairs and during cold weather. Relieved by hot fomentation."
    )
    enc3 = Encounter(
        patient_id=p3.id,
        practitioner_id=doc_user.id,
        date=datetime.utcnow() - timedelta(days=1),
        status="Follow-up",
        chief_complaint="Sour belching, retrosternal burning sensation (Amlapitta) after meals for 2 months."
    )
    db.add_all([enc2, enc3])

    # 8. Seed Sample Medical Documents for Longitudinal Record
    doc1 = MedicalDocument(
        patient_id=p1.id,
        document_type="Blood Report",
        file_name="Complete_Blood_Count_Aug2026.pdf",
        file_size_kb=245,
        uploaded_at=datetime.utcnow() - timedelta(days=25),
        ocr_text="CBC Diagnostic Report. Hb: 13.8 g/dL (Normal). Fasting Glucose: 98 mg/dL. Normal hemogram.",
        key_info_json=json.dumps([{"parameter": "Test", "value": "CBC & FBS"}, {"parameter": "Status", "value": "Normal Limits"}]),
        processing_status="Processed",
        verified=True,
        hospital_source="City General Hospital"
    )
    doc2 = MedicalDocument(
        patient_id=p1.id,
        document_type="Previous Prescription",
        file_name="Rx_HospitalB_Jul2026.jpg",
        file_size_kb=180,
        uploaded_at=datetime.utcnow() - timedelta(days=40),
        ocr_text="Rx: Pantoprazole 40mg OD x 14 days. Paracetamol 650mg SOS. Dr. S. K. Mehta, City General Hospital.",
        key_info_json=json.dumps([{"parameter": "Facility", "value": "City General Hospital"}, {"parameter": "Doctor", "value": "Dr. S. K. Mehta"}]),
        processing_status="Needs Review",
        verified=False,
        hospital_source="City General Hospital (Hospital B)"
    )
    doc3 = MedicalDocument(
        patient_id=p2.id,
        document_type="Imaging Report",
        file_name="XRay_Bilateral_Knee_Jun2026.pdf",
        file_size_kb=420,
        uploaded_at=datetime.utcnow() - timedelta(days=60),
        ocr_text="X-Ray Bilateral Knees AP/Lateral. Mild medial joint space narrowing. No gross bony erosion. Osteoarthritic changes.",
        key_info_json=json.dumps([{"parameter": "Test", "value": "Bilateral Knee X-Ray"}, {"parameter": "Impression", "value": "Mild Osteoarthritis"}]),
        processing_status="Processed",
        verified=True,
        hospital_source="Ayush Wellness Hospital"
    )
    db.add_all([doc1, doc2, doc3])

    # 9. Seed Active Demo Share Session for Cross-Hospital Testing
    share1 = ShareSession(
        patient_id=p1.id,
        token="SHARE-8F29A100",
        access_code="492811",
        expires_at=datetime.utcnow() + timedelta(hours=2),
        permissions_json=json.dumps({
            "profile": True,
            "allergies": True,
            "medications": True,
            "consultations": True,
            "investigations": True,
            "prescriptions": True,
            "documents": True
        }),
        status="Active"
    )
    db.add(share1)

    # 10. Seed Access Audit Logs
    log1 = AccessLog(
        patient_id=p1.id,
        organization="City General Hospital (Hospital B)",
        accessor_name="Dr. S. K. Mehta (MBBS, MD)",
        accessed_data="Clinical Summary, Prescriptions, Documents",
        timestamp=datetime.utcnow() - timedelta(days=1),
        status="Authorized"
    )
    log2 = AccessLog(
        patient_id=p1.id,
        organization="Ayush Wellness Hospital (Hospital A)",
        accessor_name="Dr. Rajesh Varma (BAMS, MD)",
        accessed_data="Full Case Record, Ashtavidha, Prakriti Radar",
        timestamp=datetime.utcnow() - timedelta(days=2),
        status="Authorized"
    )
    db.add_all([log1, log2])
    db.commit()

