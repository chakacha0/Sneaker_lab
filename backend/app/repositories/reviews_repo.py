from app.database import get_connection

def create_review(user_id: int, product_id: int, rating: int, text: str = None):
    """
    Создает отзыв на товар
    
    Args:
        user_id: ID пользователя
        product_id: ID товара
        rating: Оценка от 1 до 5
        text: Текст отзыва (опционально)
    
    Returns:
        dict с информацией о созданном отзыве
    """
    conn = get_connection()
    cur = conn.cursor()
    
    # Проверяем, не оставил ли уже пользователь отзыв на этот товар
    cur.execute(
        """
        SELECT review_id
        FROM reviews
        WHERE user_id = %s AND product_id = %s;
        """,
        (user_id, product_id)
    )
    
    existing = cur.fetchone()
    if existing:
        cur.close()
        conn.close()
        raise ValueError("Вы уже оставили отзыв на этот товар")
    
    # Создаем отзыв
    cur.execute(
        """
        INSERT INTO reviews (user_id, product_id, rating, text)
        VALUES (%s, %s, %s, %s)
        RETURNING review_id, product_id, user_id, rating, text, created_at;
        """,
        (user_id, product_id, rating, text)
    )
    
    review = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return review

def get_reviews_by_product(product_id: int):
    """
    Получает все отзывы для товара
    
    Args:
        product_id: ID товара
    
    Returns:
        list of dicts с информацией об отзывах
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT 
            r.review_id,
            r.product_id,
            r.user_id,
            r.rating,
            r.text,
            r.created_at,
            u.first_name,
            u.last_name,
            u.email
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.product_id = %s
        ORDER BY r.created_at DESC;
        """,
        (product_id,)
    )
    
    reviews = cur.fetchall()
    cur.close()
    conn.close()
    return reviews

def get_user_review_for_product(user_id: int, product_id: int):
    """
    Получает отзыв пользователя для конкретного товара
    
    Args:
        user_id: ID пользователя
        product_id: ID товара
    
    Returns:
        dict с информацией об отзыве или None
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT 
            review_id,
            product_id,
            user_id,
            rating,
            text,
            created_at
        FROM reviews
        WHERE user_id = %s AND product_id = %s;
        """,
        (user_id, product_id)
    )
    
    review = cur.fetchone()
    cur.close()
    conn.close()
    return review

def update_review(review_id: int, rating: int = None, text: str = None):
    """
    Обновляет отзыв
    
    Args:
        review_id: ID отзыва
        rating: Новая оценка (опционально)
        text: Новый текст (опционально)
    
    Returns:
        dict с обновленной информацией об отзыве
    """
    conn = get_connection()
    cur = conn.cursor()
    
    updates = []
    params = []
    
    if rating is not None:
        updates.append("rating = %s")
        params.append(rating)
    
    if text is not None:
        updates.append("text = %s")
        params.append(text)
    
    if not updates:
        cur.close()
        conn.close()
        raise ValueError("Не указаны поля для обновления")
    
    params.append(review_id)
    
    cur.execute(
        f"""
        UPDATE reviews
        SET {', '.join(updates)}
        WHERE review_id = %s
        RETURNING review_id, product_id, user_id, rating, text, created_at;
        """,
        params
    )
    
    review = cur.fetchone()
    if not review:
        cur.close()
        conn.close()
        raise ValueError("Отзыв не найден")
    
    conn.commit()
    cur.close()
    conn.close()
    return review

def delete_review(review_id: int, user_id: int):
    """
    Удаляет отзыв (только если он принадлежит пользователю)
    
    Args:
        review_id: ID отзыва
        user_id: ID пользователя
    
    Returns:
        True если удалено успешно
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        DELETE FROM reviews
        WHERE review_id = %s AND user_id = %s;
        """,
        (review_id, user_id)
    )
    
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    
    if not deleted:
        raise ValueError("Отзыв не найден или вы не имеете права его удалить")
    
    return True

def get_product_rating_stats(product_id: int):
    """
    Получает статистику оценок для товара
    
    Args:
        product_id: ID товара
    
    Returns:
        dict с статистикой (средняя оценка, количество отзывов)
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT 
            COUNT(*) as total_reviews,
            AVG(rating) as average_rating
        FROM reviews
        WHERE product_id = %s;
        """,
        (product_id,)
    )
    
    stats = cur.fetchone()
    cur.close()
    conn.close()
    
    return {
        "total_reviews": stats["total_reviews"] or 0,
        "average_rating": float(stats["average_rating"]) if stats["average_rating"] else 0.0
    }

