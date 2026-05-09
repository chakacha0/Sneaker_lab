"""
Модели для отзывов (Reviews)
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewBase(BaseModel):
    """Базовая модель отзыва"""
    user_id: int = Field(..., description="ID пользователя")
    product_id: int = Field(..., description="ID товара")
    rating: int = Field(..., ge=1, le=5, description="Оценка от 1 до 5")
    text: Optional[str] = Field(None, max_length=2000, description="Текст отзыва")
    order_item_id: Optional[int] = Field(None, description="ID элемента заказа (для привязки к заказу)")


class ReviewCreate(ReviewBase):
    """Модель для создания отзыва"""
    pass


class ReviewUpdate(BaseModel):
    """Модель для обновления отзыва"""
    rating: Optional[int] = Field(None, ge=1, le=5)
    text: Optional[str] = Field(None, max_length=2000)


class Review(ReviewBase):
    """Полная модель отзыва"""
    review_id: int
    created_at: datetime
    user_name: Optional[str] = None  # Имя пользователя (first_name + last_name)

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "review_id": 1,
                "user_id": 1,
                "product_id": 1,
                "order_item_id": 1,
                "rating": 5,
                "text": "Отличные кроссовки, очень удобные!",
                "created_at": "2024-01-15T10:30:00",
                "user_name": "Иван Иванов"
            }
        }

