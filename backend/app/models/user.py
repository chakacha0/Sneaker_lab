"""
Модели для пользователей (Users)
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Базовая модель пользователя"""
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None


class UserCreate(UserBase):
    """Модель для создания пользователя"""
    password: str = Field(..., min_length=6, description="Пароль должен содержать минимум 6 символов")
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: str


class UserUpdate(BaseModel):
    """Модель для обновления пользователя"""
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6)


class UserLogin(BaseModel):
    """Модель для входа пользователя"""
    email: EmailStr
    password: str


class User(UserBase):
    """Полная модель пользователя"""
    user_id: int
    role: str = Field(default="customer", description="Роль пользователя: customer или admin")
    email_verified: bool = Field(default=False, description="Подтвержден ли email")
    verification_code: Optional[str] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "email": "user@example.com",
                "first_name": "Иван",
                "last_name": "Иванов",
                "phone_number": "+1234567890",
                "role": "customer",
                "email_verified": True,
                "verification_code": None
            }
        }

