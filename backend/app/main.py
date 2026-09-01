import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.session import engine, Base, SessionLocal
from app.services.seed_data import seed_database
from app.routes import (
    auth,
    dashboard,
    patients,
    encounters,
    ashtavidha,
    prakriti,
    prescriptions,
    ai,
    terminology,
    abdm,
    repertorization,
    patient_portal,
    kiosk,
    documents,
    shared_records
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database Tables
    Base.metadata.create_all(bind=engine)
    # Seed Demo Records
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AyushCare Patient Case-Taking, Patient Portal, Kiosk & Health Record Ecosystem - SIH PS 26047",
    lifespan=lifespan
)

# Enable CORS for Frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core Doctor / Clinical Routers (Preserved 100%)
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(patients.router, prefix=settings.API_V1_STR)
app.include_router(encounters.router, prefix=settings.API_V1_STR)
app.include_router(ashtavidha.router, prefix=settings.API_V1_STR)
app.include_router(prakriti.router, prefix=settings.API_V1_STR)
app.include_router(prescriptions.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(terminology.router, prefix=settings.API_V1_STR)
app.include_router(abdm.router, prefix=settings.API_V1_STR)
app.include_router(repertorization.router, prefix=settings.API_V1_STR)

# New Ecosystem Routers (Patient Portal, Kiosk, Documents, Portable Records)
app.include_router(patient_portal.router, prefix=settings.API_V1_STR)
app.include_router(kiosk.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(shared_records.router)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "api_docs": "/docs",
        "disclaimer": "Clinical Decision Support — Final clinical assessment and prescription remain the responsibility of the qualified practitioner."
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "AyushCare Clinical & Patient Portal API"}
