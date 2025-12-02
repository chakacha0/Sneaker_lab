from fastapi import APIRouter, HTTPException
from app.repositories.favourites_repo import (
    add_to_favourites,
    remove_from_favourites,
    is_favourite,
    get_user_favourites
)

router = APIRouter(prefix="/favourites")

@router.post("/add")
def add_favourite(data: dict):
    """
    Добавляет товар в избранное
    Требует: user_id, product_id, size (опционально)
    """
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    size = data.get("size")
    
    if not user_id or not product_id:
        raise HTTPException(status_code=400, detail="user_id и product_id обязательны")
    
    try:
        favourite = add_to_favourites(user_id, product_id, size)
        return {"message": "Товар добавлен в избранное", "favourite": favourite}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/remove")
def remove_favourite(data: dict):
    """
    Удаляет товар из избранного
    Требует: user_id, product_id, size (опционально)
    """
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    size = data.get("size")
    
    if not user_id or not product_id:
        raise HTTPException(status_code=400, detail="user_id и product_id обязательны")
    
    try:
        remove_from_favourites(user_id, product_id, size)
        return {"message": "Товар удален из избранного"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/check")
def check_favourite(user_id: int, product_id: int, size: int = None):
    """
    Проверяет, находится ли товар в избранном
    """
    try:
        result = is_favourite(user_id, product_id, size)
        return {"is_favourite": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}")
def get_favourites(user_id: int):
    """
    Получает все товары из избранного пользователя
    """
    try:
        favourites = get_user_favourites(user_id)
        return favourites
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

