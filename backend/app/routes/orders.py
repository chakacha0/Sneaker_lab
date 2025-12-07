from fastapi import APIRouter, HTTPException
from app.repositories.orders_repo import (
    create_order,
    get_order_by_id,
    get_user_orders,
    calculate_order_total_with_promo
)
from app.repositories.cart_repo import get_cart_items, get_or_create_cart

router = APIRouter(prefix="/orders")

@router.post("/")
def create_order_endpoint(data: dict):
    """
    Создает заказ на основе корзины пользователя
    Требует: user_id, address_id
    Опционально: promo_code
    """
    user_id = data.get("user_id")
    address_id = data.get("address_id")
    promo_code = data.get("promo_code")
    
    if not user_id or not address_id:
        raise HTTPException(status_code=400, detail="user_id и address_id обязательны")
    
    try:
        order = create_order(
            user_id=user_id,
            address_id=address_id,
            promo_code=promo_code
        )
        return {
            "message": "Заказ успешно создан",
            "order": order
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка создания заказа: {str(e)}")

@router.get("/{order_id}")
def get_order(order_id: int):
    """
    Получает заказ по ID
    """
    try:
        order = get_order_by_id(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Заказ не найден")
        return order
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/user/{user_id}")
def get_orders_by_user(user_id: int):
    """
    Получает все заказы пользователя
    """
    try:
        orders = get_user_orders(user_id)
        return orders
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/calculate-total")
def calculate_order_total(data: dict):
    """
    Вычисляет итоговую стоимость заказа с учетом промокода
    Требует: user_id, promo_code (опционально)
    """
    user_id = data.get("user_id")
    promo_code = data.get("promo_code")
    
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id обязателен")
    
    try:
        # Получаем корзину пользователя
        cart = get_or_create_cart(user_id)
        cart_id = cart.get("cart_id")
        
        # Получаем товары из корзины
        cart_items = get_cart_items(cart_id)
        
        if not cart_items:
            raise HTTPException(status_code=400, detail="Корзина пуста")
        
        # Вычисляем исходную стоимость заказа
        original_total = sum(item.get("price", 0) * item.get("quantity", 0) for item in cart_items)
        
        # Вычисляем итоговую стоимость с учетом промокода
        final_total, promo_valid, promo_message = calculate_order_total_with_promo(
            original_total,
            promo_code.strip().upper() if promo_code and promo_code.strip() else None
        )
        
        # Убеждаемся, что все значения приведены к float
        original_total_float = float(original_total)
        final_total_float = float(final_total)
        
        return {
            "original_total": original_total_float,
            "final_total": final_total_float,
            "promo_code": promo_code.strip().upper() if promo_code and promo_code.strip() else None,
            "promo_valid": promo_valid,
            "promo_message": promo_message,
            "discount": max(0, original_total_float - final_total_float)  # Скидка не может быть отрицательной
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
