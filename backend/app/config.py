import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AyushCare Patient Case-Taking Software"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ayushcare_hackathon_demo_secret_key_2026_sih")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for hackathon demo
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ayushcare.db")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
