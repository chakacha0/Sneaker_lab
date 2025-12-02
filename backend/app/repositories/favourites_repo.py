from app.database import get_connection

def add_to_favourites(user_id: int, product_id: int, size: int = None):
    """
    Добавляет товар в избранное
    
    Returns:
        dict с информацией о добавленном товаре
    """
    conn = get_connection()
    cur = conn.cursor()
    
    # Проверяем, не добавлен ли уже этот товар
    cur.execute(
        """
        SELECT fav_id
        FROM favourites
        WHERE user_id = %s AND product_id = %s AND (size = %s OR (size IS NULL AND %s IS NULL));
        """,
        (user_id, product_id, size, size)
    )
    
    existing = cur.fetchone()
    
    if existing:
        cur.close()
        conn.close()
        return existing
    
    # Добавляем в избранное
    cur.execute(
        """
        INSERT INTO favourites (user_id, product_id, size)
        VALUES (%s, %s, %s)
        RETURNING fav_id, user_id, product_id, size, added_at;
        """,
        (user_id, product_id, size)
    )
    
    favourite = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return favourite

def remove_from_favourites(user_id: int, product_id: int, size: int = None):
    """
    Удаляет товар из избранного
    
    Returns:
        True если удалено успешно
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        DELETE FROM favourites
        WHERE user_id = %s AND product_id = %s AND (size = %s OR (size IS NULL AND %s IS NULL));
        """,
        (user_id, product_id, size, size)
    )
    
    conn.commit()
    cur.close()
    conn.close()
    return True

def is_favourite(user_id: int, product_id: int, size: int = None):
    """
    Проверяет, находится ли товар в избранном
    
    Returns:
        True если товар в избранном, False иначе
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT fav_id
        FROM favourites
        WHERE user_id = %s AND product_id = %s AND (size = %s OR (size IS NULL AND %s IS NULL));
        """,
        (user_id, product_id, size, size)
    )
    
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result is not None

def get_user_favourites(user_id: int):
    """
    Получает все товары из избранного пользователя с полной информацией
    
    Returns:
        list of dicts с информацией о товарах в избранном
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT 
            f.fav_id,
            f.user_id,
            f.product_id,
            f.size,
            f.added_at,
            p.name,
            p.description,
            p.price,
            p.gender,
            b.name AS brand,
            c.name AS category,
            (SELECT image_url FROM product_images WHERE product_id = p.product_id LIMIT 1) AS image_url
        FROM favourites f
        JOIN products p ON f.product_id = p.product_id
        LEFT JOIN brands b ON p.brand_id = b.brand_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE f.user_id = %s
        ORDER BY f.added_at DESC;
        """,
        (user_id,)
    )
    
    favourites = cur.fetchall()
    cur.close()
    conn.close()
    return favourites

