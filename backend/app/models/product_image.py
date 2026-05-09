"""
Модели для изображений товаров (Product Images)
"""

from pydantic import BaseModel, Field
from typing import Optional


class ProductImageBase(BaseModel):
    """Базовая модель изображения товара"""
    product_id: int = Field(..., description="ID товара")
    image_url: str = Field(..., description="URL изображения")


class ProductImageCreate(ProductImageBase):
    """Модель для создания изображения товара"""
    pass


class ProductImage(ProductImageBase):
    """Полная модель изображения товара"""
    image_id: Optional[int] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "image_id": 1,
                "product_id": 1,
                "image_url": "/static/products/air-max-90.jpg"
            }
        }

