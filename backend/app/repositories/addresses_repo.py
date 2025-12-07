from app.database import get_connection

def create_address(user_id: int, country: str, city: str, street: str, house: str, apartment: str = None, postal_code: str = None):
    """
    Создает новый адрес для пользователя
    
    Args:
        user_id: ID пользователя
        country: Страна
        city: Город
        street: Улица
        house: Дом
        apartment: Квартира (опционально)
        postal_code: Почтовый индекс (опционально)
    
    Returns:
        dict с информацией о созданном адресе
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        INSERT INTO addresses (user_id, country, city, street, house, apartment, postal_code)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING address_id, user_id, country, city, street, house, apartment, postal_code;
        """,
        (user_id, country, city, street, house, apartment, postal_code)
    )
    
    address = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return address

def get_user_addresses(user_id: int):
    """
    Получает все адреса пользователя
    
    Args:
        user_id: ID пользователя
    
    Returns:
        list of dicts с информацией об адресах
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT address_id, user_id, country, city, street, house, apartment, postal_code
        FROM addresses
        WHERE user_id = %s
        ORDER BY address_id DESC;
        """,
        (user_id,)
    )
    
    addresses = cur.fetchall()
    cur.close()
    conn.close()
    return addresses

def get_address_by_id(address_id: int):
    """
    Получает адрес по ID
    
    Args:
        address_id: ID адреса
    
    Returns:
        dict с информацией об адресе или None
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT address_id, user_id, country, city, street, house, apartment, postal_code
        FROM addresses
        WHERE address_id = %s;
        """,
        (address_id,)
    )
    
    address = cur.fetchone()
    cur.close()
    conn.close()
    return address
