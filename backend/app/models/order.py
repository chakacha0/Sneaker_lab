"""
Модели для заказов (Orders)
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


class OrderItemBase(BaseModel):
    """Базовая модель элемента заказа"""
    product_id: int = Field(..., description="ID товара")
    size: int = Field(..., ge=1, description="Размер товара")
    quantity: int = Field(..., ge=1, description="Количество товара")
    price_at_purchase: Decimal = Field(..., ge=0, description="Цена товара на момент покупки")


class OrderItemCreate(OrderItemBase):
    """Модель для создания элемента заказа"""
    pass


class OrderItem(OrderItemBase):
    """Полная модель элемента заказа"""
    order_item_id: int
    order_id: int
    name: Optional[str] = None  # Название товара
    brand: Optional[str] = None  # Название бренда
    image_url: Optional[str] = None  # URL изображения

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "order_item_id": 1,
                "order_id": 1,
                "product_id": 1,
                "size": 42,
                "quantity": 2,
                "price_at_purchase": 129.99,
                "name": "Air Max 90",
                "brand": "Nike",
                "image_url": "/static/products/air-max-90.jpg"
            }
        }


class OrderBase(BaseModel):
    """Базовая модель заказа"""
    user_id: int = Field(..., description="ID пользователя")
    address_id: int = Field(..., description="ID адреса доставки")
    promo_id: Optional[int] = None
    total_price: Decimal = Field(..., ge=0, description="Итоговая стоимость заказа")


class OrderCreate(BaseModel):
    """Модель для создания заказа"""
    user_id: int
    address_id: int
    promo_code: Optional[str] = None  # Код промокода (не ID)


class Order(OrderBase):
    """Полная модель заказа"""
    order_id: int
    created_at: datetime
    promo_code: Optional[str] = None  # Код промокода
    items: List[OrderItem] = []  # Элементы заказа

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "order_id": 1,
                "user_id": 1,
                "address_id": 1,
                "promo_id": 1,
                "total_price": 259.98,
                "created_at": "2024-01-15T10:30:00",
                "promo_code": "SUMMER2024",
                "items": []
            }
        }

