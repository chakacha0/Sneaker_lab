from app.database import get_connection


def get_all_brands():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT 
           * from brands;
    """
    )

    products = cur.fetchall()    
    cur.close()
    conn.close()
    return products

def create_brand(name: str, description: str = None, country: str = None, image_url: str = None):
    """
    Создает новый бренд
    
    Args:
        name: Название бренда
        description: Описание бренда (опционально)
        country: Страна бренда (опционально)
        image_url: URL изображения бренда (опционально)
    
    Returns:
        dict с информацией о созданном бренде
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        INSERT INTO brands (name, description, country, image_url)
        VALUES (%s, %s, %s, %s)
        RETURNING brand_id, name, description, country, image_url;
        """,
        (name, description, country, image_url)
    )
    
    brand = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return brand

def update_brand(brand_id: int, name: str = None, description: str = None, country: str = None, image_url: str = None):
    """
    Обновляет информацию о бренде
    
    Args:
        brand_id: ID бренда для обновления
        name: Новое название бренда (опционально)
        description: Новое описание бренда (опционально)
        country: Новая страна бренда (опционально)
        image_url: Новый URL изображения бренда (опционально)
    
    Returns:
        dict с обновленной информацией о бренде или None, если бренд не найден
    """
    conn = get_connection()
    cur = conn.cursor()
    
    # Формируем динамический запрос на основе переданных параметров
    updates = []
    values = []
    
    if name is not None:
        updates.append("name = %s")
        values.append(name)
    if description is not None:
        updates.append("description = %s")
        values.append(description)
    if country is not None:
        updates.append("country = %s")
        values.append(country)
    if image_url is not None:
        updates.append("image_url = %s")
        values.append(image_url)
    
    if not updates:
        cur.close()
        conn.close()
        return None
    
    values.append(brand_id)
    
    query = f"""
        UPDATE brands
        SET {', '.join(updates)}
        WHERE brand_id = %s
        RETURNING brand_id, name, description, country, image_url;
    """
    
    cur.execute(query, values)
    brand = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return brand

def has_products(brand_id: int):
    """
    Проверяет, есть ли товары у данного бренда
    
    Args:
        brand_id: ID бренда для проверки
    
    Returns:
        True, если у бренда есть товары, False - если нет
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT COUNT(*) as count FROM products WHERE brand_id = %s;
        """,
        (brand_id,)
    )
    
    result = cur.fetchone()
    count = result['count'] if result else 0
    cur.close()
    conn.close()
    return count > 0

def delete_brand(brand_id: int):
    """
    Удаляет бренд из базы данных
    
    Args:
        brand_id: ID бренда для удаления
    
    Returns:
        True, если бренд был удален, False - если не найден
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        DELETE FROM brands WHERE brand_id = %s;
        """,
        (brand_id,)
    )
    
    deleted = cur.rowcount > 0
    conn.commit()
    cur.close()
    conn.close()
    return deleted
