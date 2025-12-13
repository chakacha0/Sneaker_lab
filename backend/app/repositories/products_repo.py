from app.database import get_connection


def _set_operation_username(cur, username: str = None):
    """
    Устанавливает имя пользователя в переменной сессии PostgreSQL для логирования операций.
    Если username не указан, будет использоваться current_user из БД.
    
    Args:
        cur: Курсор базы данных
        username: Имя пользователя (опционально). Если None, используется current_user
    """
    if username:
        # Устанавливаем переменную сессии с именем пользователя
        cur.execute("SET LOCAL app.username = %s;", (username,))
    else:
        # Если username не указан, используем current_user из БД
        # Переменная будет установлена функцией get_operation_username() в триггере
        pass


def get_all_products():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT 
            p.product_id,
            p.name,
            p.description,
            p.price,
            p.gender,
            b.name AS brand,
            c.name AS category,
            i.image_url
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.brand_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN product_images as i using (product_id)
        ORDER BY p.created_at DESC;
    """
    )

    products = cur.fetchall()
    cur.close()
    conn.close()
    return products

def get_filtered_products(
    min_price=None,
    max_price=None,
    category_id=None,
    brand_id=None,
    sizes=None,
    gender=None,
    in_stock=None,
    sort_by="created_at",
    sort_order="DESC"
):
    """
    Получает отфильтрованные товары
    
    Args:
        min_price: Минимальная цена
        max_price: Максимальная цена
        category_id: ID категории
        brand_id: ID бренда
        sizes: Список размеров (список целых чисел)
        gender: Пол ('male', 'female', 'unisex')
        sort_by: Поле для сортировки ('price', 'created_at', 'name')
        sort_order: Порядок сортировки ('ASC', 'DESC')
    
    Returns:
        list of dicts с информацией о товарах
    """
    conn = get_connection()
    cur = conn.cursor()
    
    # Определяем, нужен ли JOIN с product_stock для фильтрации по размерам или наличию
    needs_size_join = sizes and len(sizes) > 0
    needs_stock_join = in_stock is not None
    
    # Базовый запрос
    # Используем подзапрос для получения первого изображения, чтобы избежать дубликатов
    # Также добавляем информацию о наличии товара
    query = """
        SELECT DISTINCT
            p.product_id,
            p.name,
            p.description,
            p.price,
            p.gender,
            p.created_at,
            b.name AS brand,
            b.brand_id,
            c.name AS category,
            c.category_id,
            (SELECT image_url FROM product_images WHERE product_id = p.product_id LIMIT 1) AS image_url,
            CASE 
                WHEN EXISTS (
                    SELECT 1 FROM product_stock ps2 
                    WHERE ps2.product_id = p.product_id AND ps2.quantity > 0
                ) THEN true
                ELSE false
            END AS has_stock
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.brand_id
        LEFT JOIN categories c ON p.category_id = c.category_id
    """
    
    # Добавляем JOIN с product_stock если нужна фильтрация по размерам или наличию
    if needs_size_join or needs_stock_join:
        query += """
            LEFT JOIN product_stock ps ON p.product_id = ps.product_id
        """
    
    conditions = []
    params = []
    
    # Фильтр по цене
    if min_price is not None:
        conditions.append("p.price >= %s")
        params.append(min_price)
    
    if max_price is not None:
        conditions.append("p.price <= %s")
        params.append(max_price)
    
    # Фильтр по категории
    if category_id is not None:
        conditions.append("p.category_id = %s")
        params.append(category_id)
    
    # Фильтр по бренду
    if brand_id is not None:
        conditions.append("p.brand_id = %s")
        params.append(brand_id)
    
    # Фильтр по полу
    if gender is not None:
        conditions.append("(p.gender = %s OR p.gender = 'unisex')")
        params.append(gender)
    
    # Фильтр по размерам (через product_stock)
    if needs_size_join:
        placeholders = ','.join(['%s'] * len(sizes))
        conditions.append(f"ps.size IN ({placeholders})")
        conditions.append("ps.quantity > 0")
        params.extend(sizes)
    
    # Фильтр по наличию товара
    if in_stock is not None:
        if in_stock:
            # Только товары в наличии (есть хотя бы один размер с quantity > 0)
            conditions.append("""
                EXISTS (
                    SELECT 1 FROM product_stock ps_stock 
                    WHERE ps_stock.product_id = p.product_id AND ps_stock.quantity > 0
                )
            """)
        else:
            # Только товары не в наличии (нет ни одного размера с quantity > 0)
            conditions.append("""
                NOT EXISTS (
                    SELECT 1 FROM product_stock ps_stock 
                    WHERE ps_stock.product_id = p.product_id AND ps_stock.quantity > 0
                )
            """)
    
    # Добавляем условия
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    
    # Сортировка
    valid_sort_fields = {'price', 'created_at', 'name'}
    if sort_by not in valid_sort_fields:
        sort_by = 'created_at'
    
    valid_sort_orders = {'ASC', 'DESC'}
    if sort_order not in valid_sort_orders:
        sort_order = 'DESC'
    
    # Для DISTINCT нужно использовать поле из SELECT, а не алиас таблицы
    if sort_by == 'created_at':
        order_field = 'p.created_at'
    elif sort_by == 'price':
        order_field = 'p.price'
    elif sort_by == 'name':
        order_field = 'p.name'
    else:
        order_field = 'p.created_at'
    
    query += f" ORDER BY {order_field} {sort_order};"
    
    try:
        cur.execute(query, params)
        products = cur.fetchall()
        print(f"Найдено товаров: {len(products)}")
        if len(products) > 0:
            print(f"Пример товара: {products[0]}")
    except Exception as e:
        print(f"Ошибка SQL запроса: {e}")
        print(f"Запрос: {query}")
        print(f"Параметры: {params}")
        raise
    
    cur.close()
    conn.close()
    return products

def search_products(search_query: str):
    """
    Поиск товаров по названию и описанию
    
    Args:
        search_query: Поисковый запрос
    
    Returns:
        list of dicts с информацией о товарах
    """
    conn = get_connection()
    cur = conn.cursor()
    
    query = """
        SELECT DISTINCT
            p.product_id,
            p.name,
            p.description,
            p.price,
            p.gender,
            p.created_at,
            b.name AS brand,
            b.brand_id,
            c.name AS category,
            c.category_id,
            (SELECT image_url FROM product_images WHERE product_id = p.product_id LIMIT 1) AS image_url
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.brand_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.name ILIKE %s OR p.description ILIKE %s OR b.name ILIKE %s
        ORDER BY p.created_at DESC;
    """
    
    search_pattern = f"%{search_query}%"
    cur.execute(query, (search_pattern, search_pattern, search_pattern))
    products = cur.fetchall()
    cur.close()
    conn.close()
    return products

def get_price_range():
    """
    Получает минимальную и максимальную цену товаров
    
    Returns:
        dict с min_price и max_price
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT 
            MIN(price) AS min_price,
            MAX(price) AS max_price
        FROM products;
        """
    )
    
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result

def get_available_sizes():
    """
    Получает список всех доступных размеров (где quantity > 0)
    
    Returns:
        list of dicts с размерами
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT DISTINCT size
        FROM product_stock
        WHERE quantity > 0
        ORDER BY size ASC;
        """
    )
    
    sizes = cur.fetchall()
    cur.close()
    conn.close()
    return sizes

def get_product_by_id(product_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT 
            p.product_id,
            p.name,
            p.description,
            p.price,
            p.gender,
            p.brand_id,
            p.category_id,
            b.name AS brand,
            c.name AS category,
            i.image_url
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.brand_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN product_images i USING (product_id)
        WHERE p.product_id = %s;
        """,
        (product_id,)
    )

    row = cur.fetchone()
    cur.close()
    conn.close()

    return row

def create_product(name: str, description: str = None, price: float = None, brand_id: int = None, category_id: int = None, gender: str = None, image_url: str = None, username: str = None):
    """
    Создает новый товар
    
    Args:
        name: Название товара
        description: Описание товара (опционально)
        price: Цена товара (опционально)
        brand_id: ID бренда (опционально)
        category_id: ID категории (опционально)
        gender: Пол ('male', 'female', 'unisex') (опционально)
        image_url: URL изображения товара (опционально)
        username: Имя пользователя для логирования (опционально)
    
    Returns:
        dict с информацией о созданном товаре
    """
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Устанавливаем имя пользователя для логирования
        _set_operation_username(cur, username)
        
        # Создаем товар
        cur.execute(
            """
            INSERT INTO products (name, description, price, brand_id, category_id, gender)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING product_id, name, description, price, brand_id, category_id, gender;
            """,
            (name, description, price, brand_id, category_id, gender)
        )
        
        product = cur.fetchone()
        if not product:
            conn.rollback()
            cur.close()
            conn.close()
            raise Exception("Не удалось создать товар")
        
        product_id = product['product_id']
        
        # Если есть изображение, добавляем его в product_images
        if image_url:
            cur.execute(
                """
                INSERT INTO product_images (product_id, image_url)
                VALUES (%s, %s);
                """,
                (product_id, image_url)
            )
        
        conn.commit()
        return product
    except Exception as e:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()

def has_stock(product_id: int):
    """
    Проверяет, есть ли товар на складе (записи в product_stock)
    
    Args:
        product_id: ID товара
    
    Returns:
        bool: True если товар есть на складе, False если нет
    """
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """
            SELECT COUNT(*) as count
            FROM product_stock
            WHERE product_id = %s;
            """,
            (product_id,)
        )
        
        result = cur.fetchone()
        return result['count'] > 0
    finally:
        cur.close()
        conn.close()

def update_product(product_id: int, name: str = None, description: str = None, price: float = None, brand_id: int = None, category_id: int = None, gender: str = None, image_url: str = None, username: str = None):
    """
    Обновляет информацию о товаре
    
    Args:
        product_id: ID товара
        name: Название товара (опционально)
        description: Описание товара (опционально)
        price: Цена товара (опционально)
        brand_id: ID бренда (опционально)
        category_id: ID категории (опционально)
        gender: Пол (опционально)
        image_url: URL изображения (опционально)
        username: Имя пользователя для логирования (опционально)
    
    Returns:
        dict с обновленной информацией о товаре
    """
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Устанавливаем имя пользователя для логирования
        _set_operation_username(cur, username)
        
        # Формируем список полей для обновления
        updates = []
        params = []
        
        if name is not None:
            updates.append("name = %s")
            params.append(name)
        if description is not None:
            updates.append("description = %s")
            params.append(description)
        if price is not None:
            updates.append("price = %s")
            params.append(price)
        if brand_id is not None:
            updates.append("brand_id = %s")
            params.append(brand_id)
        elif brand_id is None and 'brand_id' in locals():
            updates.append("brand_id = NULL")
        if category_id is not None:
            updates.append("category_id = %s")
            params.append(category_id)
        elif category_id is None and 'category_id' in locals():
            updates.append("category_id = NULL")
        if gender is not None:
            updates.append("gender = %s")
            params.append(gender)
        
        if not updates:
            # Если нет изменений, просто возвращаем текущий товар
            cur.execute(
                """
                SELECT product_id, name, description, price, brand_id, category_id, gender
                FROM products
                WHERE product_id = %s;
                """,
                (product_id,)
            )
            return cur.fetchone()
        
        # Обновляем товар
        update_query = f"UPDATE products SET {', '.join(updates)} WHERE product_id = %s RETURNING product_id, name, description, price, brand_id, category_id, gender;"
        params.append(product_id)
        
        cur.execute(update_query, params)
        product = cur.fetchone()
        
        # Если есть новое изображение, обновляем его
        if image_url:
            # Проверяем, есть ли уже изображение
            cur.execute(
                """
                SELECT image_url FROM product_images WHERE product_id = %s LIMIT 1;
                """,
                (product_id,)
            )
            existing_image = cur.fetchone()
            
            if existing_image:
                # Обновляем существующее изображение
                cur.execute(
                    """
                    UPDATE product_images
                    SET image_url = %s
                    WHERE product_id = %s AND image_url = %s;
                    """,
                    (image_url, product_id, existing_image['image_url'])
                )
            else:
                # Создаем новое изображение
                cur.execute(
                    """
                    INSERT INTO product_images (product_id, image_url)
                    VALUES (%s, %s);
                    """,
                    (product_id, image_url)
                )
        
        conn.commit()
        return product
    except Exception as e:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()

def delete_product(product_id: int, username: str = None):
    """
    Удаляет товар из базы данных
    Также удаляет связанные записи из product_images и product_stock
    
    Args:
        product_id: ID товара
        username: Имя пользователя для логирования (опционально)
    
    Returns:
        dict с информацией об удаленном товаре или None если товар не найден
    """
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Устанавливаем имя пользователя для логирования
        _set_operation_username(cur, username)
        
        # Получаем информацию о товаре перед удалением
        cur.execute(
            """
            SELECT product_id, name, description, price, brand_id, category_id, gender
            FROM products
            WHERE product_id = %s;
            """,
            (product_id,)
        )
        product = cur.fetchone()
        
        if not product:
            return None
        
        # Удаляем связанные записи
        # Удаляем изображения
        cur.execute(
            """
            DELETE FROM product_images WHERE product_id = %s;
            """,
            (product_id,)
        )
        
        # Удаляем остатки на складе
        cur.execute(
            """
            DELETE FROM product_stock WHERE product_id = %s;
            """,
            (product_id,)
        )
        
        # Удаляем сам товар
        cur.execute(
            """
            DELETE FROM products WHERE product_id = %s;
            """,
            (product_id,)
        )
        
        conn.commit()
        return product
    except Exception as e:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()

