import sys
import os

# Add backend app directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.database.session import engine, Base, SessionLocal
from app.services.seed_data import seed_database

def run_seed():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        print("Seeding demo data (patients, encounters, Ashtavidha, Prakriti, prescriptions)...")
        seed_database(db)
        print("Seed data successfully initialized!")
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()
