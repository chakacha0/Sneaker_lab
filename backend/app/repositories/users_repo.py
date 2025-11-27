from app.database import get_connection
import bcrypt

def create_user(email: str, password: str, first_name: str, last_name: str, phone_number: str):
    conn = get_connection()
    cur = conn.cursor()

    # Хэшируем пароль
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Роль всегда customer
    cur.execute(
        """
        INSERT INTO users (role, email, password_hash, first_name, last_name, phone_number)
        VALUES ('customer', %s, %s, %s, %s, %s)
        RETURNING user_id, role, email, first_name, last_name, phone_number;
        """,
        (email, password_hash, first_name, last_name, phone_number)
    )

    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return user
