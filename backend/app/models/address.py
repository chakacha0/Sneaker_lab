"""
Модели для адресов (Addresses)
"""

from pydantic import BaseModel, Field
from typing import Optional


class AddressBase(BaseModel):
    """Базовая модель адреса"""
    country: str = Field(..., min_length=1, max_length=100, description="Страна")
    city: str = Field(..., min_length=1, max_length=100, description="Город")
    street: str = Field(..., min_length=1, max_length=255, description="Улица")
    house: str = Field(..., min_length=1, max_length=50, description="Дом")
    apartment: Optional[str] = Field(None, max_length=50, description="Квартира")
    postal_code: Optional[str] = Field(None, max_length=20, description="Почтовый индекс")


class AddressCreate(AddressBase):
    """Модель для создания адреса"""
    user_id: int = Field(..., description="ID пользователя")


class AddressUpdate(BaseModel):
    """Модель для обновления адреса"""
    country: Optional[str] = Field(None, min_length=1, max_length=100)
    city: Optional[str] = Field(None, min_length=1, max_length=100)
    street: Optional[str] = Field(None, min_length=1, max_length=255)
    house: Optional[str] = Field(None, min_length=1, max_length=50)
    apartment: Optional[str] = Field(None, max_length=50)
    postal_code: Optional[str] = Field(None, max_length=20)


class Address(AddressBase):
    """Полная модель адреса"""
    address_id: int
    user_id: int

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "address_id": 1,
                "user_id": 1,
                "country": "Россия",
                "city": "Москва",
                "street": "Тверская",
                "house": "1",
                "apartment": "10",
                "postal_code": "101000"
            }
        }

