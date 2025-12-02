from app.database import get_connection
from app.repositories.product_stock_repo import get_product_stock_by_size

def get_or_create_cart(user_id: int):
    """
    Получает существующую корзину пользователя или создает новую
    
    Returns:
        dict с информацией о корзине
    """
    conn = get_connection()
    cur = conn.cursor()
    
    # Ищем существующую корзину
    cur.execute(
        """
        SELECT cart_id, user_id, created_at
        FROM cart
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT 1;
        """,
        (user_id,)
    )
    
    cart = cur.fetchone()
    
    if not cart:
        # Создаем новую корзину
        cur.execute(
            """
            INSERT INTO cart (user_id)
            VALUES (%s)
            RETURNING cart_id, user_id, created_at;
            """,
            (user_id,)
        )
        cart = cur.fetchone()
        conn.commit()
    
    cur.close()
    conn.close()
    return cart

def add_item_to_cart(cart_id: int, product_id: int, size: int, quantity: int):
    """
    Добавляет товар в корзину или обновляет количество, если товар уже есть
    Проверяет доступное количество на складе
    
    Returns:
        dict с информацией о добавленном товаре
    
    Raises:
        ValueError: если запрашиваемое количество превышает доступное на складе
    """
    # Проверяем доступное количество на складе
    stock = get_product_stock_by_size(product_id, size)
    available_quantity = stock.get("quantity", 0) if stock else 0
    
    conn = get_connection()
    cur = conn.cursor()
    
    # Проверяем, есть ли уже такой товар с таким размером в корзине
    cur.execute(
        """
        SELECT cart_item_id, quantity
        FROM cart_items
        WHERE cart_id = %s AND product_id = %s AND size = %s;
        """,
        (cart_id, product_id, size)
    )
    
    existing_item = cur.fetchone()
    current_cart_quantity = existing_item.get("quantity", 0) if existing_item else 0
    new_quantity = current_cart_quantity + quantity
    
    # Проверяем, не превышает ли новое количество доступное на складе
    if new_quantity > available_quantity:
        cur.close()
        conn.close()
        raise ValueError(f"Недостаточно товара на складе. Доступно: {available_quantity}, запрашивается: {new_quantity}")
    
    if existing_item:
        # Обновляем количество
        cur.execute(
            """
            UPDATE cart_items
            SET quantity = %s
            WHERE cart_item_id = %s
            RETURNING cart_item_id, cart_id, product_id, size, quantity;
            """,
            (new_quantity, existing_item.get("cart_item_id"))
        )
        item = cur.fetchone()
    else:
        # Добавляем новый товар
        cur.execute(
            """
            INSERT INTO cart_items (cart_id, product_id, size, quantity)
            VALUES (%s, %s, %s, %s)
            RETURNING cart_item_id, cart_id, product_id, size, quantity;
            """,
            (cart_id, product_id, size, quantity)
        )
        item = cur.fetchone()
    
    conn.commit()
    cur.close()
    conn.close()
    return item

def get_cart_items(cart_id: int):
    """
    Получает все товары из корзины с полной информацией о продуктах
    
    Returns:
        list of dicts с информацией о товарах в корзине
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT 
            ci.cart_item_id,
            ci.cart_id,
            ci.product_id,
            ci.size,
            ci.quantity,
            p.name,
            p.price,
            p.description,
            b.name AS brand,
            i.image_url,
            COALESCE(ps.quantity, 0) AS available_quantity
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        LEFT JOIN brands b ON p.brand_id = b.brand_id
        LEFT JOIN product_images i ON p.product_id = i.product_id
        LEFT JOIN product_stock ps ON ci.product_id = ps.product_id AND ci.size = ps.size
        WHERE ci.cart_id = %s
        ORDER BY ci.cart_item_id DESC;
        """,
        (cart_id,)
    )
    
    items = cur.fetchall()
    cur.close()
    conn.close()
    return items

def remove_item_from_cart(cart_item_id: int):
    """
    Удаляет товар из корзины
    
    Returns:
        True если удалено успешно
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        DELETE FROM cart_items
        WHERE cart_item_id = %s;
        """,
        (cart_item_id,)
    )
    
    conn.commit()
    cur.close()
    conn.close()
    return True

def update_cart_item_quantity(cart_item_id: int, quantity: int):
    """
    Обновляет количество товара в корзине
    Проверяет доступное количество на складе
    
    Returns:
        dict с обновленной информацией о товаре
    
    Raises:
        ValueError: если запрашиваемое количество превышает доступное на складе
    """
    conn = get_connection()
    cur = conn.cursor()
    
    if quantity <= 0:
        # Если количество 0 или меньше, удаляем товар
        return remove_item_from_cart(cart_item_id)
    
    # Получаем информацию о товаре в корзине
    cur.execute(
        """
        SELECT product_id, size
        FROM cart_items
        WHERE cart_item_id = %s;
        """,
        (cart_item_id,)
    )
    
    cart_item = cur.fetchone()
    if not cart_item:
        cur.close()
        conn.close()
        raise ValueError("Товар в корзине не найден")
    
    product_id = cart_item.get("product_id")
    size = cart_item.get("size")
    
    # Проверяем доступное количество на складе
    stock = get_product_stock_by_size(product_id, size)
    available_quantity = stock.get("quantity", 0) if stock else 0
    
    if quantity > available_quantity:
        cur.close()
        conn.close()
        raise ValueError(f"Недостаточно товара на складе. Доступно: {available_quantity}, запрашивается: {quantity}")
    
    cur.execute(
        """
        UPDATE cart_items
        SET quantity = %s
        WHERE cart_item_id = %s
        RETURNING cart_item_id, cart_id, product_id, size, quantity;
        """,
        (quantity, cart_item_id)
    )
    
    item = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return item

