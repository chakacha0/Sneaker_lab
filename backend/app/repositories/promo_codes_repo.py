from app.database import get_connection


def get_all_promo_codes():
    """
    Получает все промокоды
    
    Returns:
        list of dicts с информацией о промокодах
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT * FROM promo_codes
        ORDER BY promo_id DESC;
        """
    )
    
    promo_codes = cur.fetchall()
    cur.close()
    conn.close()
    return promo_codes


def get_promo_code_by_id(promo_id: int):
    """
    Получает промокод по ID
    
    Args:
        promo_id: ID промокода
    
    Returns:
        dict с информацией о промокоде или None
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT * FROM promo_codes
        WHERE promo_id = %s;
        """,
        (promo_id,)
    )
    
    promo_code = cur.fetchone()
    cur.close()
    conn.close()
    return promo_code


def get_promo_code_by_code(code: str):
    """
    Получает промокод по коду
    
    Args:
        code: Код промокода
    
    Returns:
        dict с информацией о промокоде или None
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT * FROM promo_codes
        WHERE code = %s;
        """,
        (code,)
    )
    
    promo_code = cur.fetchone()
    cur.close()
    conn.close()
    return promo_code


def create_promo_code(
    code: str,
    discount_percent: int = None,
    discount_amount: float = None,
    valid_from: str = None,
    valid_to: str = None,
    min_order_price: float = None,
    usage_limit: int = None
):
    """
    Создает новый промокод
    
    Args:
        code: Код промокода
        discount_percent: Процент скидки (опционально)
        discount_amount: Сумма скидки (опционально)
        valid_from: Дата начала действия (опционально, формат: YYYY-MM-DD)
        valid_to: Дата окончания действия (опционально, формат: YYYY-MM-DD)
        min_order_price: Минимальная сумма заказа (опционально)
        usage_limit: Лимит использований (опционально)
    
    Returns:
        dict с информацией о созданном промокоде
    """
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """
            INSERT INTO promo_codes (
                code, discount_percent, discount_amount, 
                valid_from, valid_to, min_order_price, usage_limit
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING *;
            """,
            (code, discount_percent, discount_amount, valid_from, valid_to, min_order_price, usage_limit)
        )
        
        promo_code = cur.fetchone()
        conn.commit()
        return promo_code
    except Exception as e:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()


def update_promo_code(
    promo_id: int,
    code: str = None,
    discount_percent: int = None,
    discount_amount: float = None,
    valid_from: str = None,
    valid_to: str = None,
    min_order_price: float = None,
    usage_limit: int = None
):
    """
    Обновляет информацию о промокоде
    
    Args:
        promo_id: ID промокода
        code: Код промокода (опционально)
        discount_percent: Процент скидки (опционально)
        discount_amount: Сумма скидки (опционально)
        valid_from: Дата начала действия (опционально)
        valid_to: Дата окончания действия (опционально)
        min_order_price: Минимальная сумма заказа (опционально)
        usage_limit: Лимит использований (опционально)
    
    Returns:
        dict с обновленной информацией о промокоде или None, если промокод не найден
    """
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        updates = []
        params = []
        
        if code is not None:
            updates.append("code = %s")
            params.append(code)
        if discount_percent is not None:
            updates.append("discount_percent = %s")
            params.append(discount_percent)
        if discount_amount is not None:
            updates.append("discount_amount = %s")
            params.append(discount_amount)
        if valid_from is not None:
            updates.append("valid_from = %s")
            params.append(valid_from)
        if valid_to is not None:
            updates.append("valid_to = %s")
            params.append(valid_to)
        if min_order_price is not None:
            updates.append("min_order_price = %s")
            params.append(min_order_price)
        if usage_limit is not None:
            updates.append("usage_limit = %s")
            params.append(usage_limit)
        
        if not updates:
            cur.close()
            conn.close()
            return None
        
        params.append(promo_id)
        
        query = f"""
            UPDATE promo_codes
            SET {', '.join(updates)}
            WHERE promo_id = %s
            RETURNING *;
        """
        
        cur.execute(query, params)
        promo_code = cur.fetchone()
        conn.commit()
        return promo_code
    except Exception as e:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()


def delete_promo_code(promo_id: int):
    """
    Удаляет промокод из базы данных
    
    Args:
        promo_id: ID промокода
    
    Returns:
        True, если промокод был удален, False - если не найден
    """
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """
            DELETE FROM promo_codes WHERE promo_id = %s;
            """,
            (promo_id,)
        )
        
        deleted = cur.rowcount > 0
        conn.commit()
        return deleted
    except Exception as e:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()
