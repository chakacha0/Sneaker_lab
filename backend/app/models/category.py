"""
Модели для категорий (Categories)
"""

from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    """Базовая модель категории"""
    name: str = Field(..., min_length=1, max_length=255, description="Название категории")


class CategoryCreate(CategoryBase):
    """Модель для создания категории"""
    pass


class CategoryUpdate(CategoryBase):
    """Модель для обновления категории"""
    pass


class Category(CategoryBase):
    """Полная модель категории"""
    category_id: int

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "category_id": 1,
                "name": "Кроссовки"
            }
        }

