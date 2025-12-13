from app.database import get_connection
import bcrypt
from app.utils.email_service import generate_verification_code

def create_user(email: str, password: str, first_name: str, last_name: str, phone_number: str):
    conn = get_connection()
    cur = conn.cursor()

    # Хэшируем пароль
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    
    # Генерируем 6-значный код для подтверждения email
    verification_code = generate_verification_code()

    # Роль всегда customer, email_verified = False по умолчанию
    cur.execute(
        """
        INSERT INTO users (role, email, password_hash, first_name, last_name, phone_number, email_verified, verification_code)
        VALUES ('customer', %s, %s, %s, %s, %s, FALSE, %s)
        RETURNING user_id, role, email, first_name, last_name, phone_number, email_verified, verification_code;
        """,
        (email, password_hash, first_name, last_name, phone_number, verification_code)
    )

    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return user

def verify_email_by_code(email: str, code: str):
    """
    Подтверждает email пользователя по коду
    
    Args:
        email: Email адрес пользователя
        code: Код подтверждения (6 цифр)
    
    Returns:
        dict с информацией о пользователе или None, если код неверный
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        UPDATE users 
        SET email_verified = TRUE, verification_code = NULL
        WHERE email = %s AND verification_code = %s AND email_verified = FALSE
        RETURNING user_id, role, email, first_name, last_name, phone_number, email_verified;
        """,
        (email, code)
    )
    
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return user

def get_user_by_email(email: str):
    """
    Получает пользователя по email
    
    Returns:
        dict с информацией о пользователе или None, если пользователь не найден
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT user_id, role, email, first_name, last_name, phone_number, email_verified, verification_code
        FROM users
        WHERE email = %s;
        """,
        (email,)
    )
    
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

def get_user_by_id(user_id: int):
    """
    Получает пользователя по ID
    
    Args:
        user_id: ID пользователя
    
    Returns:
        dict с информацией о пользователе или None, если пользователь не найден
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT user_id, role, email, first_name, last_name, phone_number, email_verified
        FROM users
        WHERE user_id = %s;
        """,
        (user_id,)
    )
    
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

def authenticate_user(email: str, password: str):
    """
    Проверяет email и пароль пользователя
    
    Args:
        email: Email адрес пользователя
        password: Пароль в открытом виде
        
    Returns:
        dict с информацией о пользователе или None, если неверные данные
    """
    conn = get_connection()
    cur = conn.cursor()
    
    # Получаем пользователя по email
    cur.execute(
        """
        SELECT user_id, role, email, password_hash, first_name, last_name, phone_number, email_verified
        FROM users
        WHERE email = %s;
        """,
        (email,)
    )
    
    user = cur.fetchone()
    cur.close()
    conn.close()
    
    if not user:
        return None
    
    # Проверяем пароль
    password_hash = user.get("password_hash")
    if password_hash and bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8")):
        # Удаляем password_hash из ответа
        user_dict = dict(user)
        user_dict.pop("password_hash", None)
        return user_dict
    
    return None

def get_all_admins():
    """
    Получает всех администраторов
    
    Returns:
        list of dicts с информацией об администраторах
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT user_id, role, email, first_name, last_name, phone_number, email_verified
        FROM users
        WHERE role = 'admin'
        ORDER BY email ASC;
        """
    )
    
    admins = cur.fetchall()
    cur.close()
    conn.close()
    return admins

def search_users_by_email(email_query: str):
    """
    Ищет пользователей по email (частичное совпадение)
    
    Args:
        email_query: Часть email для поиска
    
    Returns:
        list of dicts с информацией о пользователях
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT user_id, role, email, first_name, last_name, phone_number, email_verified
        FROM users
        WHERE email ILIKE %s
        ORDER BY email ASC
        LIMIT 20;
        """,
        (f"%{email_query}%",)
    )
    
    users = cur.fetchall()
    cur.close()
    conn.close()
    return users

def promote_to_admin(user_id: int):
    """
    Назначает пользователя администратором
    
    Args:
        user_id: ID пользователя
    
    Returns:
        dict с обновленной информацией о пользователе или None, если пользователь не найден
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        UPDATE users
        SET role = 'admin'
        WHERE user_id = %s
        RETURNING user_id, role, email, first_name, last_name, phone_number, email_verified;
        """,
        (user_id,)
    )
    
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return user

def remove_admin_role(user_id: int):
    """
    Лишает пользователя прав администратора (возвращает роль customer)
    
    Args:
        user_id: ID пользователя
    
    Returns:
        dict с обновленной информацией о пользователе или None, если пользователь не найден
    """
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute(
        """
        UPDATE users
        SET role = 'customer'
        WHERE user_id = %s AND role = 'admin'
        RETURNING user_id, role, email, first_name, last_name, phone_number, email_verified;
        """,
        (user_id,)
    )
    
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return user
