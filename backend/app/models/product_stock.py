"""
Модели для склада товаров (Product Stock)
"""

from pydantic import BaseModel, Field


class ProductStockBase(BaseModel):
    """Базовая модель склада"""
    product_id: int = Field(..., description="ID товара")
    size: int = Field(..., ge=1, description="Размер товара")
    quantity: int = Field(..., ge=0, description="Количество товара на складе")


class ProductStockCreate(ProductStockBase):
    """Модель для создания записи на складе"""
    pass


class ProductStockUpdate(BaseModel):
    """Модель для обновления записи на складе"""
    quantity: int = Field(..., ge=0, description="Новое количество товара")


class ProductStock(ProductStockBase):
    """Полная модель склада"""
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "product_id": 1,
                "size": 42,
                "quantity": 10
            }
        }

