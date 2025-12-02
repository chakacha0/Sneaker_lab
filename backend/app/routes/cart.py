from fastapi import APIRouter, HTTPException
from app.repositories.cart_repo import (
    get_or_create_cart,
    add_item_to_cart,
    get_cart_items,
    remove_item_from_cart,
    update_cart_item_quantity
)

router = APIRouter(prefix="/cart")

@router.post("/add")
def add_to_cart(data: dict):
    """
    Добавляет товар в корзину
    Требует: user_id, product_id, size, quantity
    """
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    size = data.get("size")
    quantity = data.get("quantity", 1)
    
    if not user_id or not product_id or size is None:
        raise HTTPException(status_code=400, detail="user_id, product_id и size обязательны")
    
    try:
        # Получаем или создаем корзину
        cart = get_or_create_cart(user_id)
        cart_id = cart.get("cart_id")
        
        # Добавляем товар
        item = add_item_to_cart(cart_id, product_id, size, quantity)
        
        return {
            "message": "Товар добавлен в корзину",
            "item": item
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}")
def get_cart(user_id: int):
    """
    Получает все товары из корзины пользователя
    """
    try:
        cart = get_or_create_cart(user_id)
        cart_id = cart.get("cart_id")
        
        items = get_cart_items(cart_id)
        
        # Вычисляем общую сумму
        total = sum(item.get("price", 0) * item.get("quantity", 0) for item in items)
        
        return {
            "cart_id": cart_id,
            "items": items,
            "total": total
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/item/{cart_item_id}")
def remove_item(cart_item_id: int):
    """
    Удаляет товар из корзины
    """
    try:
        remove_item_from_cart(cart_item_id)
        return {"message": "Товар удален из корзины"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/item/{cart_item_id}")
def update_item_quantity(cart_item_id: int, data: dict):
    """
    Обновляет количество товара в корзине
    Требует: quantity
    """
    quantity = data.get("quantity")
    
    if quantity is None:
        raise HTTPException(status_code=400, detail="quantity обязателен")
    
    try:
        result = update_cart_item_quantity(cart_item_id, quantity)
        return {
            "message": "Количество обновлено",
            "item": result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

