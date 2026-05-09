"""
Модели для промокодов (Promo Codes)
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from decimal import Decimal


class PromoCodeBase(BaseModel):
    """Базовая модель промокода"""
    code: str = Field(..., min_length=1, max_length=50, description="Код промокода")
    discount_percent: Optional[int] = Field(None, ge=0, le=100, description="Процент скидки (0-100)")
    discount_amount: Optional[Decimal] = Field(None, ge=0, description="Сумма скидки")
    valid_from: Optional[date] = Field(None, description="Дата начала действия")
    valid_to: Optional[date] = Field(None, description="Дата окончания действия")
    min_order_price: Optional[Decimal] = Field(None, ge=0, description="Минимальная сумма заказа")
    usage_limit: Optional[int] = Field(None, ge=0, description="Лимит использований")


class PromoCodeCreate(PromoCodeBase):
    """Модель для создания промокода"""
    pass


class PromoCodeUpdate(BaseModel):
    """Модель для обновления промокода"""
    code: Optional[str] = Field(None, min_length=1, max_length=50)
    discount_percent: Optional[int] = Field(None, ge=0, le=100)
    discount_amount: Optional[Decimal] = Field(None, ge=0)
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None
    min_order_price: Optional[Decimal] = Field(None, ge=0)
    usage_limit: Optional[int] = Field(None, ge=0)


class PromoCode(PromoCodeBase):
    """Полная модель промокода"""
    promo_id: int
    used_count: int = Field(default=0, ge=0, description="Количество использований")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "promo_id": 1,
                "code": "SUMMER2024",
                "discount_percent": 10,
                "discount_amount": None,
                "valid_from": "2024-06-01",
                "valid_to": "2024-08-31",
                "min_order_price": 100.00,
                "usage_limit": 100,
                "used_count": 5
            }
        }

