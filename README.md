# AyushCare — Unified Clinical Case-Taking & Portable Health Record Ecosystem

**Smart India Hackathon (SIH) Problem Statement ID:** 26047  
**Title:** Patient Case-Taking Software  
**Organization:** Ministry of Ayush / All India Institute of Ayurveda (AIIA)  
**Category:** Software | **Domain:** Healthcare & Biomedical Devices  

> **Core Value Proposition:** *"From patient-facing conversational AI and reception kiosk pre-consultation, to structured AYUSH case-taking and cross-hospital portable longitudinal health records."*

---

## 1. System Ecosystem Overview

AyushCare is a single connected healthcare ecosystem designed specifically for Indian healthcare environments, uniting three core operational modes:

1. **🧑‍⚕️ Doctor / Practitioner Clinical Portal (`/dashboard`)**:
   - OPD Queue & Case Dashboard.
   - 8-Step Rapid Clinical Case-Taking Wizard (*Pradhana Vedana*, SOCRATES pain grid).
   - Digital **Ashtavidha Pariksha Matrix** (*Nadi, Mutra, Mala, Jihva, Shabda, Sparsha, Druk, Akruti*).
   - Real-time **Prakriti & Vikriti Radar Analytics** (Recharts Radar Chart).
   - AI Clinical Structuring, Missing Info Alerts & Web Speech Bilingual Dictation (Hindi / English).
   - Classical & Proprietary Ayurvedic Formulation Prescription Generator with printable consultation slip.

2. **👤 Patient Personal Health Portal (`/patient/dashboard`)**:
   - First-time 8-step health profile questionnaire with simple, accessible language.
   - Medical Document Digitization (Upload & Camera scan with OCR entity extraction review).
   - **Longitudinal Health Record & EHR Summary** (Chronological history across hospital visits).
   - Patient-controlled **Secure Temporary QR & 6-Digit PIN Generator** (15m, 30m, 1h expiry with granular data masking).
   - **Access Audit Trail & Security Log** (Tracks which hospitals accessed records with timestamps).

3. **🏥 Hospital Reception Kiosk Mode (`/kiosk`)**:
   - High-contrast, large touch targets designed for hospital reception/waiting areas.
   - **Trilingual support**: English, Hindi (हिंदी), and Marathi (मराठी).
   - **AI-Based Pre-Consultation Adaptive Questioning Engine** (Dynamically branches questions based on reported symptoms like Headache, Stomach Pain, Joint Pain, Cough).
   - Voice-first interaction with microphone dictation (*🎤 Tap to Speak*) & confirmation (*Confirm / Try Again / Edit*).
   - Pre-consultation summary review & instant OPD doctor handoff with token generation (`OPD-42`).
   - Inactivity auto-reset countdown for kiosk privacy.
   - Neutral emergency safety escalation (*"Call Hospital Staff"*).

4. **🌐 Cross-Hospital Portable Record Sharing (`/hospital/shared-record`)**:
   - Hospital B scans patient's temporary QR / enters 6-digit access code.
   - Explicit patient consent verification.
   - Authorized view of previous Hospital A consultations, prescriptions, and lab reports.
   - One-Click **"+ Start New Case at Hospital B"** without overwriting previous hospital records.

---

## 2. Technology Stack

- **Frontend**: React 19 / TypeScript / Vite / Tailwind CSS v4 / Recharts / Lucide React / React Router v6 / React Hook Form / Zod / Web Speech API
- **Backend**: Python 3.14 / FastAPI / Pydantic v2 / SQLAlchemy 2.0 / Uvicorn / Bcrypt / Python-Jose
- **Database**: SQLite (Zero-config instant demo portability) + PostgreSQL compatibility via `DATABASE_URL`
- **Containerization**: Multi-stage Docker & Docker Compose

---

## 3. Quick Start & Installation

### Local Development

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1 | Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Backend API will be live at `http://127.0.0.1:8000` (Swagger docs at `http://127.0.0.1:8000/docs`).

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend application will be live at `http://localhost:5173`.

---

## 4. Demo Accounts & Credentials

### Doctor Portal
- **Doctor / Practitioner**: `doctor@ayushcare.in` / `password123` (or click **"Demo Doctor"** on login)
- **Admin Operations**: `admin@ayushcare.in` / `admin123` (or click **"Demo Admin"** on login)

### Patient Portal & Kiosk Demo Records
- **Demo Patient 1**: *Aarav Sharma* (34M) | Phone: `9876543210` | ID: `AYU-2026-001` (Active share code: `492811`)
- **Demo Patient 2**: *Meera Patil* (42F) | Phone: `9811223344` | ID: `AYU-2026-002`

---

## 5. Demonstration Flow for Judges

### Story A: The Doctor OPD Experience (4 Minutes)
1. Open `http://localhost:5173` -> Click **"Doctor / Practitioner"**.
2. Click **"Demo Doctor"** to log in to the Clinical Dashboard.
3. Review OPD statistics, population Dosha bias, and active consultation queue.
4. Click **"Launch 4-Min Demo"** (or open patient *Aarav Sharma*).
5. Walk through the 8 stages:
   - **Chief Complaints**: Rapid symptom chips & severity slider (7/10).
   - **History**: Web Speech bilingual dictation & **"✨ AI Structure Case"** button.
   - **Ashtavidha Pariksha**: 8 clinical examination cards (*Nadi gati, Jihva, Sparsha, etc.*).
   - **Prakriti & Vikriti**: Real-time questionnaire and **Recharts Radar Chart**.
   - **Digital Prescription**: Add formulations (*Saraswatarishta, Brahmi Vati*), set Anupana, and generate printable PDF slip.

### Story B: Patient Self-Service Kiosk & Cross-Hospital Sharing
1. Open `http://localhost:5173` -> Click **"Hospital Reception Kiosk"** (`/kiosk`).
2. Switch language to **हिंदी** or **मराठी**.
3. Click **"I already have an account"** -> Select **Aarav Sharma** (`9876543210`).
4. Select **"Yes, use my records"** -> Answer adaptive pre-consultation questions via Voice/Touch.
5. Review structured pre-consultation summary and click **"Send to Doctor"** -> Receive Queue Token **`OPD-42`**.
6. Switch to **"Patient Portal"** (`/patient/dashboard`):
   - View updated Longitudinal Health Record and uploaded document OCR review.
   - Open **"Share Records"** -> Generate 30-minute QR code and PIN (`492811`).
7. Open **"Cross-Hospital Record Access"** (`/hospital/shared-record`):
   - Simulate Hospital B entering the access PIN.
   - Verify patient consent and view authorized historical records.
   - Click **"+ Start New Case at Hospital B"** without overwriting old hospital records!

---

## 6. Research Innovation & Product Boundary Disclaimer

> **Innovation Context:**  
> Existing research has demonstrated AI-assisted history-taking, voice-enabled patient interaction, adaptive questioning, multimodal clinical information processing, and automated summarization. This project combines patient-facing pre-consultation, structured AYUSH case-taking, medical document digitization, longitudinal health records, and standards-oriented interoperability into a unified workflow designed specifically for Indian healthcare environments.

> **Medical Safety Disclaimer:**  
> This software is a clinical decision-support and structured case documentation prototype developed for Smart India Hackathon 2026. It is **NOT** an autonomous diagnostic system. All rule-based scorings, questionnaire assessments, OCR extractions, and reference formulation suggestions are intended solely to assist the qualified practitioner. Final clinical diagnosis, assessment, and prescription remain the exclusive responsibility of the qualified medical practitioner.
