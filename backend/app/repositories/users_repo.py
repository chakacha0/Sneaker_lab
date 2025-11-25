from app.database import get_connection
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_user(email: str, password: str, first_name: str, last_name: str, phone_number: str):
    conn = get_connection()
    cur = conn.cursor()

    # Проверка email
    cur.execute("SELECT user_id FROM users WHERE email = %s", (email,))
    existing = cur.fetchone()

    if existing:
        cur.close()
        conn.close()
        return {"error": "Email уже зарегистрирован"}

    password_hash = hash_password(password)

    cur.execute(
        """
        INSERT INTO users (role, email, password_hash, first_name, last_name, phone_number)
        VALUES ('customer', %s, %s, %s, %s, %s)
        RETURNING user_id;
        """,
        (email, password_hash, first_name, last_name, phone_number)
    )

    user_id = cur.fetchone()[0]
    conn.commit()

    cur.close()
    conn.close()

    return {
        "user_id": user_id,
        "role": "customer",
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "phone_number": phone_number
    }
