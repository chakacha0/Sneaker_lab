from fastapi import APIRouter, HTTPException, Query
from app.repositories.reviews_repo import (
    create_review,
    get_reviews_by_product,
    get_user_review_for_product,
    update_review,
    delete_review,
    get_product_rating_stats
)

router = APIRouter(prefix="/reviews")

@router.post("/")
def create_review_endpoint(data: dict):
    """
    Создает отзыв на товар
    Требует: user_id, product_id, rating (1-5)
    Опционально: text, order_item_id (для привязки к конкретному элементу заказа)
    """
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    rating = data.get("rating")
    text = data.get("text")
    order_item_id = data.get("order_item_id")
    
    if not user_id or not product_id or not rating:
        raise HTTPException(status_code=400, detail="user_id, product_id и rating обязательны")
    
    if not isinstance(rating, int) or rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="rating должен быть числом от 1 до 5")
    
    try:
        review = create_review(
            user_id=user_id,
            product_id=product_id,
            rating=rating,
            text=text,
            order_item_id=order_item_id
        )
        return {
            "message": "Отзыв успешно создан",
            "review": review
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка создания отзыва: {str(e)}")

@router.get("/product/{product_id}")
def get_product_reviews(product_id: int):
    """
    Получает все отзывы для товара
    """
    try:
        reviews = get_reviews_by_product(product_id)
        return reviews
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения отзывов: {str(e)}")

@router.get("/product/{product_id}/stats")
def get_product_review_stats(product_id: int):
    """
    Получает статистику оценок для товара
    """
    try:
        stats = get_product_rating_stats(product_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения статистики: {str(e)}")

@router.get("/user/{user_id}/product/{product_id}")
def get_user_product_review(user_id: int, product_id: int, order_item_id: int = Query(None)):
    """
    Получает отзыв пользователя для конкретного товара
    Query параметр: order_item_id (опционально, для поиска отзыва по конкретному элементу заказа)
    """
    try:
        review = get_user_review_for_product(user_id, product_id, order_item_id)
        if not review:
            return None
        return review
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения отзыва: {str(e)}")

@router.get("/user/{user_id}/order-item/{order_item_id}")
def get_user_order_item_review(user_id: int, order_item_id: int):
    """
    Получает отзыв пользователя для конкретного элемента заказа
    """
    try:
        # Сначала получаем product_id из order_item
        from app.database import get_connection
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT product_id FROM order_items WHERE order_item_id = %s;",
            (order_item_id,)
        )
        order_item = cur.fetchone()
        cur.close()
        conn.close()
        
        if not order_item:
            return None
        
        review = get_user_review_for_product(user_id, order_item["product_id"], order_item_id)
        if not review:
            return None
        return review
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения отзыва: {str(e)}")

@router.put("/{review_id}")
def update_review_endpoint(review_id: int, data: dict):
    """
    Обновляет отзыв
    Опционально: rating, text
    """
    rating = data.get("rating")
    text = data.get("text")
    
    if rating is not None and (not isinstance(rating, int) or rating < 1 or rating > 5):
        raise HTTPException(status_code=400, detail="rating должен быть числом от 1 до 5")
    
    try:
        review = update_review(
            review_id=review_id,
            rating=rating,
            text=text
        )
        return {
            "message": "Отзыв успешно обновлен",
            "review": review
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обновления отзыва: {str(e)}")

@router.delete("/{review_id}")
def delete_review_endpoint(review_id: int, data: dict):
    """
    Удаляет отзыв
    Требует: user_id
    """
    user_id = data.get("user_id")
    
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id обязателен")
    
    try:
        delete_review(review_id, user_id)
        return {
            "message": "Отзыв успешно удален"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка удаления отзыва: {str(e)}")

