from app.database import get_connection

def get_all_categories():
    """
    Получает все категории
    
    Returns:
        list of dicts с информацией о категориях
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT category_id, name
        FROM categories
        ORDER BY name ASC;
        """
    )
    
    categories = cur.fetchall()
    cur.close()
    conn.close()
    return categories

def create_category(name: str):
    """
    Создает новую категорию
    
    Args:
        name: Название категории
    
    Returns:
        dict с информацией о созданной категории
    """
    conn = get_connection()
    cur = conn.cursor()
    
    # Синхронизируем последовательность с максимальным ID в таблице
    cur.execute(
        """
        SELECT setval(
            pg_get_serial_sequence('categories', 'category_id'),
            COALESCE((SELECT MAX(category_id) FROM categories), 0) + 1,
            false
        );
        """
    )
    
    cur.execute(
        """
        INSERT INTO categories (name)
        VALUES (%s)
        RETURNING category_id, name;
        """,
        (name,)
    )
    
    category = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return category

def update_category(category_id: int, name: str):
    """
    Обновляет информацию о категории
    
    Args:
        category_id: ID категории для обновления
        name: Новое название категории
    
    Returns:
        dict с обновленной информацией о категории или None, если категория не найдена
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        UPDATE categories
        SET name = %s
        WHERE category_id = %s
        RETURNING category_id, name;
        """,
        (name, category_id)
    )
    
    category = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return category

def has_products(category_id: int):
    """
    Проверяет, есть ли товары с данной категорией
    
    Args:
        category_id: ID категории
    
    Returns:
        bool: True если есть товары, False если нет
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT COUNT(*) as count
        FROM products
        WHERE category_id = %s;
        """,
        (category_id,)
    )
    
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result['count'] > 0 if result else False

def delete_category(category_id: int):
    """
    Удаляет категорию
    
    Args:
        category_id: ID категории для удаления
    
    Returns:
        bool: True если удаление успешно, False если категория не найдена
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        DELETE FROM categories
        WHERE category_id = %s
        RETURNING category_id;
        """,
        (category_id,)
    )
    
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return deleted is not None
