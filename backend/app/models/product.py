"""
Модели для товаров (Products)
"""

from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal


class ProductBase(BaseModel):
    """Базовая модель товара"""
    name: str = Field(..., min_length=1, max_length=255, description="Название товара")
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0, description="Цена товара")
    gender: Optional[str] = Field(None, description="Пол: male, female, unisex")
    brand_id: Optional[int] = None
    category_id: Optional[int] = None


class ProductCreate(ProductBase):
    """Модель для создания товара"""
    image: Optional[str] = None  # URL изображения


class ProductUpdate(BaseModel):
    """Модель для обновления товара"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0)
    gender: Optional[str] = None
    brand_id: Optional[int] = None
    category_id: Optional[int] = None
    image: Optional[str] = None


class Product(ProductBase):
    """Полная модель товара"""
    product_id: int
    image_url: Optional[str] = None
    brand: Optional[str] = None  # Название бренда
    category: Optional[str] = None  # Название категории

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "product_id": 1,
                "name": "Air Max 90",
                "description": "Классические кроссовки",
                "price": 129.99,
                "gender": "unisex",
                "brand_id": 1,
                "category_id": 1,
                "image_url": "/static/products/air-max-90.jpg",
                "brand": "Nike",
                "category": "Кроссовки"
            }
        }

