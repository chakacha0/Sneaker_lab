from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.repositories.categories_repo import (
    get_all_categories,
    create_category,
    update_category,
    has_products,
    delete_category
)
import os
import shutil
from pathlib import Path

router = APIRouter(prefix="/categories")

@router.get("/")
def list_categories():
    return get_all_categories()

@router.post("/")
def create_category_endpoint(name: str = Form(...)):
    """
    Создает новую категорию
    
    Args:
        name: Название категории
    """
    if not name or not name.strip():
        raise HTTPException(status_code=400, detail="Название категории обязательно")
    
    try:
        category = create_category(name.strip())
        return category
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при создании категории: {str(e)}")

@router.put("/{category_id}")
def update_category_endpoint(category_id: int, name: str = Form(...)):
    """
    Обновляет информацию о категории
    
    Args:
        category_id: ID категории
        name: Новое название категории
    """
    if not name or not name.strip():
        raise HTTPException(status_code=400, detail="Название категории обязательно")
    
    try:
        category = update_category(category_id, name.strip())
        if not category:
            raise HTTPException(status_code=404, detail="Категория не найдена")
        return category
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении категории: {str(e)}")

@router.delete("/{category_id}")
def delete_category_endpoint(category_id: int):
    """
    Удаляет категорию
    
    Args:
        category_id: ID категории
    """
    # Проверяем, есть ли товары с этой категорией
    if has_products(category_id):
        raise HTTPException(
            status_code=400,
            detail="Невозможно удалить категорию: у неё есть связанные товары"
        )
    
    try:
        deleted = delete_category(category_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Категория не найдена")
        return {"message": "Категория успешно удалена"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении категории: {str(e)}")

@router.get("/{category_id}/has-products")
def check_category_products(category_id: int):
    """
    Проверяет, есть ли товары с данной категорией
    
    Args:
        category_id: ID категории
    
    Returns:
        dict с has_products: bool
    """
    return {"has_products": has_products(category_id)}
