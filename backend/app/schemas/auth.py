from typing import Optional
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    name: str
    email: str
    role: str
    registration_no: Optional[str] = None
    clinic_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    registration_no: Optional[str] = None
    clinic_name: Optional[str] = None

    class Config:
        from_attributes = True
