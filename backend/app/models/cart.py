"""
Модели для корзины (Cart)
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from decimal import Decimal


class CartItemBase(BaseModel):
    """Базовая модель элемента корзины"""
    product_id: int = Field(..., description="ID товара")
    size: int = Field(..., ge=1, description="Размер товара")
    quantity: int = Field(..., ge=1, description="Количество товара")
    price: Decimal = Field(..., ge=0, description="Цена товара")


class CartItemCreate(CartItemBase):
    """Модель для создания элемента корзины"""
    pass


class CartItem(CartItemBase):
    """Полная модель элемента корзины"""
    cart_item_id: int
    cart_id: int
    name: Optional[str] = None  # Название товара
    description: Optional[str] = None  # Описание товара
    brand: Optional[str] = None  # Название бренда
    category: Optional[str] = None  # Название категории
    gender: Optional[str] = None
    image_url: Optional[str] = None  # URL изображения

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "cart_item_id": 1,
                "cart_id": 1,
                "product_id": 1,
                "size": 42,
                "quantity": 2,
                "price": 129.99,
                "name": "Air Max 90",
                "brand": "Nike",
                "category": "Кроссовки",
                "image_url": "/static/products/air-max-90.jpg"
            }
        }


class Cart(BaseModel):
    """Модель корзины"""
    cart_id: int
    user_id: int
    items: List[CartItem] = []
    total: Optional[Decimal] = Field(None, ge=0, description="Общая стоимость корзины")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "cart_id": 1,
                "user_id": 1,
                "total": 259.98,
                "items": []
            }
        }

