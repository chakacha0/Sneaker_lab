"""
Модели для брендов (Brands)
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional


class BrandBase(BaseModel):
    """Базовая модель бренда"""
    name: str = Field(..., min_length=1, max_length=255, description="Название бренда")
    description: Optional[str] = None
    country: Optional[str] = None


class BrandCreate(BrandBase):
    """Модель для создания бренда"""
    image_url: Optional[str] = None


class BrandUpdate(BaseModel):
    """Модель для обновления бренда"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    country: Optional[str] = None
    image_url: Optional[str] = None


class Brand(BrandBase):
    """Полная модель бренда"""
    brand_id: int
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "brand_id": 1,
                "name": "Nike",
                "description": "Just Do It",
                "country": "USA",
                "image_url": "/static/brands/nike.jpg"
            }
        }

