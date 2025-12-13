from app.database import get_connection
from app.repositories.cart_repo import get_cart_items, get_or_create_cart
from app.repositories.promo_codes_repo import get_promo_code_by_code
from app.repositories.addresses_repo import get_address_by_id
from app.repositories.users_repo import get_user_by_id
from app.utils.email_service import send_order_confirmation_email
from decimal import Decimal

def calculate_order_total_with_promo(order_total: float, promo_code: str = None):
    """
    Вычисляет итоговую стоимость заказа с учетом промокода
    Возвращает информацию о валидности промокода
    
    Args:
        order_total: Исходная стоимость заказа
        promo_code: Код промокода (опционально)
    
    Returns:
        tuple: (final_total, promo_valid, promo_message)
        - final_total: итоговая стоимость
        - promo_valid: True если промокод валиден и применен, False иначе
        - promo_message: сообщение о статусе промокода
    """
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Если промокод не указан
        if not promo_code or not promo_code.strip():
            cur.close()
            conn.close()
            return (order_total, False, None)
        
        promo_code = promo_code.strip().upper()
        
        # Получаем информацию о промокоде
        promo = get_promo_code_by_code(promo_code)
        
        if not promo:
            cur.close()
            conn.close()
            return (order_total, False, "Промокод не найден")
        
        # Вычисляем итоговую стоимость с учетом промокода используя функцию из БД
        cur.execute(
            """
            SELECT calculate_order_total_with_promo(%s, %s) AS final_total;
            """,
            (order_total, promo_code)
        )
        
        result = cur.fetchone()
        # Преобразуем Decimal в float для корректных вычислений
        final_total_value = result.get("final_total", order_total)
        if isinstance(final_total_value, Decimal):
            final_total = float(final_total_value)
        else:
            final_total = float(final_total_value)
        
        # Преобразуем order_total в float для корректного сравнения
        order_total_float = float(order_total)
        
        # Проверяем, был ли промокод применен (если final_total != order_total, то промокод применен)
        promo_applied = final_total < order_total_float
        
        if promo_applied:
            discount = order_total_float - final_total
            promo_message = f"Промокод применен! Скидка: {discount:.2f} $"
        else:
            promo_message = "Промокод не применим (не соответствует условиям)"
        
        cur.close()
        conn.close()
        return (final_total, promo_applied, promo_message)
        
    except Exception as e:
        cur.close()
        conn.close()
        return (order_total, False, f"Ошибка проверки промокода: {str(e)}")

def create_order(user_id: int, address_id: int, promo_code: str = None):
    """
    Создает заказ на основе корзины пользователя
    Использует функцию calculate_order_total_with_promo для пересчета стоимости
    
    Args:
        user_id: ID пользователя
        address_id: ID адреса доставки
        promo_code: Код промокода (опционально)
    
    Returns:
        dict с информацией о созданном заказе
    
    Raises:
        ValueError: если корзина пуста или другие ошибки
    """
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Получаем корзину пользователя
        cart = get_or_create_cart(user_id)
        cart_id = cart.get("cart_id")
        
        # Получаем товары из корзины
        cart_items = get_cart_items(cart_id)
        
        if not cart_items:
            raise ValueError("Корзина пуста")
        
        # Вычисляем исходную стоимость заказа
        original_total = sum(item.get("price", 0) * item.get("quantity", 0) for item in cart_items)
        
        # Вычисляем итоговую стоимость с учетом промокода используя функцию из БД
        cur.execute(
            """
            SELECT calculate_order_total_with_promo(%s, %s) AS final_total;
            """,
            (original_total, promo_code.strip().upper() if promo_code else None)
        )
        
        result = cur.fetchone()
        final_total = float(result.get("final_total", original_total))
        
        # Проверяем, был ли промокод реально применен
        # Промокод считается примененным только если итоговая стоимость меньше исходной
        promo_id = None
        promo_applied = False
        if promo_code and final_total < original_total:
            # Промокод был применен, получаем его ID
            promo = get_promo_code_by_code(promo_code.strip().upper())
            if promo:
                promo_id = promo.get("promo_id")
                promo_applied = True
        
        # Создаем заказ (promo_id будет NULL, если промокод не был применен)
        cur.execute(
            """
            INSERT INTO orders (user_id, address_id, promo_id, total_price)
            VALUES (%s, %s, %s, %s)
            RETURNING order_id, user_id, address_id, promo_id, total_price, created_at;
            """,
            (user_id, address_id, promo_id, final_total)
        )
        
        order = cur.fetchone()
        order_id = order.get("order_id")
        
        # Создаем order_items на основе cart_items
        for item in cart_items:
            product_id = item.get("product_id")
            size = item.get("size")
            quantity = item.get("quantity")
            price_at_purchase = item.get("price")
            
            cur.execute(
                """
                INSERT INTO order_items (order_id, product_id, size, quantity, price_at_purchase)
                VALUES (%s, %s, %s, %s, %s);
                """,
                (order_id, product_id, size, quantity, price_at_purchase)
            )
            
            # Уменьшаем количество товара на складе
            cur.execute(
                """
                UPDATE product_stock
                SET quantity = quantity - %s
                WHERE product_id = %s AND size = %s;
                """,
                (quantity, product_id, size)
            )
        
        # Увеличиваем счетчик использований промокода ТОЛЬКО если он был реально применен
        if promo_applied and promo_id:
            cur.execute(
                """
                UPDATE promo_codes
                SET used_count = COALESCE(used_count, 0) + 1
                WHERE promo_id = %s;
                """,
                (promo_id,)
            )
        
        # Очищаем корзину после создания заказа
        cur.execute(
            """
            DELETE FROM cart_items WHERE cart_id = %s;
            """,
            (cart_id,)
        )
        
        conn.commit()
        
        # Получаем полную информацию о заказе
        order_with_items = get_order_by_id(order_id)
        
        # Отправляем email с подтверждением заказа
        try:
            # Получаем информацию о пользователе
            user = get_user_by_id(user_id)
            if user and user.get('email'):
                # Получаем адрес доставки
                address = get_address_by_id(address_id)
                
                if address:
                    # Формируем имя пользователя
                    user_name = None
                    if user.get('first_name') or user.get('last_name'):
                        user_name = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
                    
                    # Отправляем email (не блокируем процесс, если не удалось отправить)
                    email_sent, email_message = send_order_confirmation_email(
                        email=user.get('email'),
                        order_id=order_id,
                        total_price=final_total,
                        order_items=order_with_items.get('items', []),
                        address=address,
                        user_name=user_name
                    )
                    if email_sent:
                        print(f"[ORDER] Email с подтверждением заказа #{order_id} отправлен на {user.get('email')}")
                    else:
                        print(f"[ORDER WARNING] Не удалось отправить email с подтверждением заказа #{order_id}: {email_message}")
        except Exception as e:
            # Не прерываем процесс создания заказа, если не удалось отправить email
            print(f"[ORDER WARNING] Ошибка при отправке email с подтверждением заказа #{order_id}: {str(e)}")
        
        return order_with_items
        
    except Exception as e:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()

def get_order_by_id(order_id: int):
    """
    Получает заказ по ID с полной информацией
    
    Args:
        order_id: ID заказа
    
    Returns:
        dict с информацией о заказе и его товарах
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT 
            o.order_id,
            o.user_id,
            o.address_id,
            o.promo_id,
            o.total_price,
            o.created_at,
            pc.code AS promo_code
        FROM orders o
        LEFT JOIN promo_codes pc ON o.promo_id = pc.promo_id
        WHERE o.order_id = %s;
        """,
        (order_id,)
    )
    
    order = cur.fetchone()
    
    if not order:
        cur.close()
        conn.close()
        return None
    
    # Получаем товары заказа
    cur.execute(
        """
        SELECT DISTINCT ON (oi.order_item_id)
            oi.order_item_id,
            oi.product_id,
            oi.size,
            oi.quantity,
            oi.price_at_purchase,
            p.name,
            p.price AS current_price,
            b.name AS brand,
            (SELECT image_url FROM product_images WHERE product_id = p.product_id LIMIT 1) AS image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        LEFT JOIN brands b ON p.brand_id = b.brand_id
        WHERE oi.order_id = %s
        ORDER BY oi.order_item_id;
        """,
        (order_id,)
    )
    
    items = cur.fetchall()
    order["items"] = items
    
    cur.close()
    conn.close()
    return order

def get_user_orders(user_id: int):
    """
    Получает все заказы пользователя
    
    Args:
        user_id: ID пользователя
    
    Returns:
        list of dicts с информацией о заказах
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT 
            o.order_id,
            o.user_id,
            o.address_id,
            o.promo_id,
            o.total_price,
            o.created_at,
            pc.code AS promo_code
        FROM orders o
        LEFT JOIN promo_codes pc ON o.promo_id = pc.promo_id
        WHERE o.user_id = %s
        ORDER BY o.created_at DESC;
        """,
        (user_id,)
    )
    
    orders = cur.fetchall()
    
    # Для каждого заказа получаем товары
    for order in orders:
        order_id = order.get("order_id")
        cur.execute(
            """
            SELECT DISTINCT ON (oi.order_item_id)
                oi.order_item_id,
                oi.product_id,
                oi.size,
                oi.quantity,
                oi.price_at_purchase,
                p.name,
                b.name AS brand,
                (SELECT image_url FROM product_images WHERE product_id = p.product_id LIMIT 1) AS image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.product_id
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            WHERE oi.order_id = %s
            ORDER BY oi.order_item_id;
            """,
            (order_id,)
        )
        items = cur.fetchall()
        order["items"] = items
    
    cur.close()
    conn.close()
    return orders

def get_sales_statistics(start_date=None, end_date=None):
    """
    Получает статистику продаж за указанный период
    
    Args:
        start_date: Начальная дата (опционально, формат: 'YYYY-MM-DD')
        end_date: Конечная дата (опционально, формат: 'YYYY-MM-DD')
    
    Returns:
        dict с статистикой продаж:
        - total_orders: общее количество заказов
        - total_items_sold: общее количество проданных товаров
        - total_revenue: общая выручка
        - orders: список заказов с деталями
    """
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Формируем условие для фильтрации по датам
        date_condition = ""
        params = []
        
        if start_date:
            date_condition += " AND o.created_at >= %s::date"
            params.append(start_date)
        
        if end_date:
            date_condition += " AND o.created_at <= %s::timestamp"
            # Включаем весь день - добавляем время 23:59:59
            end_date_with_time = end_date if " " in end_date else f"{end_date} 23:59:59"
            params.append(end_date_with_time)
        
        # Получаем общую статистику
        cur.execute(
            f"""
            SELECT 
                COUNT(DISTINCT o.order_id) as total_orders,
                COALESCE(SUM(oi.quantity), 0) as total_items_sold,
                COALESCE(SUM(o.total_price), 0) as total_revenue
            FROM orders o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            WHERE 1=1 {date_condition};
            """,
            params
        )
        
        stats = cur.fetchone()
        
        # Получаем детальную информацию о заказах
        cur.execute(
            f"""
            SELECT 
                o.order_id,
                o.user_id,
                o.total_price,
                o.created_at,
                u.email,
                u.first_name,
                u.last_name,
                pc.code as promo_code
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.user_id
            LEFT JOIN promo_codes pc ON o.promo_id = pc.promo_id
            WHERE 1=1 {date_condition}
            ORDER BY o.created_at DESC;
            """,
            params
        )
        
        orders = cur.fetchall()
        
        # Для каждого заказа получаем товары
        for order in orders:
            order_id = order.get("order_id")
            cur.execute(
                """
                SELECT 
                    oi.order_item_id,
                    oi.product_id,
                    oi.size,
                    oi.quantity,
                    oi.price_at_purchase,
                    p.name as product_name,
                    b.name as brand_name
                FROM order_items oi
                JOIN products p ON oi.product_id = p.product_id
                LEFT JOIN brands b ON p.brand_id = b.brand_id
                WHERE oi.order_id = %s;
                """,
                (order_id,)
            )
            items = cur.fetchall()
            order["items"] = items
        
        result = {
            "total_orders": stats.get("total_orders", 0) if stats else 0,
            "total_items_sold": int(stats.get("total_items_sold", 0)) if stats else 0,
            "total_revenue": float(stats.get("total_revenue", 0)) if stats else 0.0,
            "orders": orders if orders else []
        }
        
        return result
    except Exception as e:
        # Логируем ошибку для отладки
        import traceback
        print(f"Ошибка в get_sales_statistics: {e}")
        traceback.print_exc()
        raise
    finally:
        cur.close()
        conn.close()