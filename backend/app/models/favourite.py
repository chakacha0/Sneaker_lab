"""
Модели для избранного (Favourites)
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class FavouriteBase(BaseModel):
    """Базовая модель избранного"""
    user_id: int = Field(..., description="ID пользователя")
    product_id: int = Field(..., description="ID товара")
    size: Optional[int] = Field(None, ge=1, description="Размер товара (опционально)")


class FavouriteCreate(FavouriteBase):
    """Модель для создания записи в избранном"""
    pass


class Favourite(FavouriteBase):
    """Полная модель избранного"""
    fav_id: int
    added_at: datetime
    name: Optional[str] = None  # Название товара
    description: Optional[str] = None  # Описание товара
    price: Optional[Decimal] = None  # Цена товара
    gender: Optional[str] = None
    brand: Optional[str] = None  # Название бренда
    category: Optional[str] = None  # Название категории
    image_url: Optional[str] = None  # URL изображения

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "fav_id": 1,
                "user_id": 1,
                "product_id": 1,
                "size": 42,
                "added_at": "2024-01-15T10:30:00",
                "name": "Air Max 90",
                "price": 129.99,
                "brand": "Nike",
                "category": "Кроссовки",
                "image_url": "/static/products/air-max-90.jpg"
            }
        }

