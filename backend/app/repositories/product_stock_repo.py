from app.database import get_connection

def get_product_sizes(product_id: int):
    """
    Получает все размеры товара с количеством
    
    Returns:
        list of dicts с информацией о размерах (size, quantity)
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT size, quantity
        FROM product_stock
        WHERE product_id = %s
        ORDER BY size ASC;
        """,
        (product_id,)
    )
    
    sizes = cur.fetchall()
    cur.close()
    conn.close()
    return sizes

def add_or_update_product_stock(product_id: int, size: int, quantity: int):
    """
    Добавляет или обновляет количество товара для конкретного размера
    Если запись уже существует, обновляет quantity
    Если записи нет, создает новую
    
    Args:
        product_id: ID товара
        size: Размер товара
        quantity: Количество товара (должно быть >= 0)
    
    Returns:
        dict с информацией о записи (product_id, size, quantity)
    """
    if quantity < 0:
        raise ValueError("Количество товара не может быть отрицательным")
    
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Проверяем, существует ли запись
        cur.execute(
            """
            SELECT product_id, size, quantity
            FROM product_stock
            WHERE product_id = %s AND size = %s;
            """,
            (product_id, size)
        )
        
        existing = cur.fetchone()
        
        if existing:
            # Обновляем существующую запись
            cur.execute(
                """
                UPDATE product_stock
                SET quantity = %s
                WHERE product_id = %s AND size = %s
                RETURNING product_id, size, quantity;
                """,
                (quantity, product_id, size)
            )
        else:
            # Создаем новую запись
            cur.execute(
                """
                INSERT INTO product_stock (product_id, size, quantity)
                VALUES (%s, %s, %s)
                RETURNING product_id, size, quantity;
                """,
                (product_id, size, quantity)
            )
        
        result = cur.fetchone()
        conn.commit()
        return result
    except Exception as e:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()

def get_product_stock_by_size(product_id: int, size: int):
    """
    Получает количество товара для конкретного размера
    
    Args:
        product_id: ID товара
        size: Размер товара
    
    Returns:
        dict с информацией о количестве (product_id, size, quantity) или None, если не найдено
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT product_id, size, quantity
        FROM product_stock
        WHERE product_id = %s AND size = %s;
        """,
        (product_id, size)
    )
    
    stock = cur.fetchone()
    cur.close()
    conn.close()
    return stock

