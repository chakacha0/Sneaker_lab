from fastapi import APIRouter, HTTPException
from app.repositories.users_repo import create_user, verify_email_by_code, get_user_by_email, authenticate_user
from app.utils.email_service import send_verification_email

router = APIRouter(prefix="/users")

@router.post("/register")
def register_user(data: dict):
    email = data.get("email")
    password = data.get("password")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    phone_number = data.get("phone_number")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email и пароль обязательны")

    try:
        user = create_user(email, password, first_name, last_name, phone_number)
        
        # Отправляем письмо с кодом подтверждения
        code = user.get("verification_code")
        email_sent = False
        email_message = ""
        
        if code:
            email_sent, email_message = send_verification_email(email, code)
        
        # Формируем сообщение в зависимости от результата отправки
        if email_sent:
            if "Режим разработки" in email_message:
                message = "Регистрация успешна! Проверьте консоль сервера для получения кода подтверждения."
            else:
                message = "Регистрация успешна! Проверьте вашу почту - мы отправили код подтверждения."
        else:
            message = f"Регистрация успешна, но не удалось отправить письмо: {email_message}. Проверьте консоль сервера."
        
        return {
            "message": message,
            "email_sent": email_sent,
            "email_message": email_message if not email_sent else None,
            "user": {
                "user_id": user.get("user_id"),
                "email": user.get("email"),
                "first_name": user.get("first_name"),
                "last_name": user.get("last_name"),
                "phone_number": user.get("phone_number"),
                "email_verified": user.get("email_verified", False)
            },
            "verification_code": code if "Режим разработки" in email_message else None  # Только в режиме разработки
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/verify-email")
def verify_email(data: dict):
    """
    Подтверждает email пользователя по коду
    """
    email = data.get("email")
    code = data.get("code")
    
    if not email or not code:
        raise HTTPException(status_code=400, detail="Email и код подтверждения обязательны")
    
    # Проверяем пользователя
    user = get_user_by_email(email)
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь с таким email не найден")
    
    if user.get("email_verified"):
        return {
            "message": "Email уже подтвержден",
            "user": {
                "user_id": user.get("user_id"),
                "email": user.get("email"),
                "first_name": user.get("first_name"),
                "last_name": user.get("last_name"),
                "phone_number": user.get("phone_number"),
                "email_verified": True
            }
        }
    
    # Подтверждаем email по коду
    verified_user = verify_email_by_code(email, code)
    
    if not verified_user:
        raise HTTPException(status_code=400, detail="Неверный код подтверждения. Проверьте код и попробуйте снова.")
    
    return {
        "message": "Email успешно подтвержден!",
        "user": {
            "user_id": verified_user.get("user_id"),
            "email": verified_user.get("email"),
            "first_name": verified_user.get("first_name"),
            "last_name": verified_user.get("last_name"),
            "phone_number": verified_user.get("phone_number"),
            "email_verified": verified_user.get("email_verified", True)
        }
    }

@router.post("/login")
def login(data: dict):
    """
    Авторизация пользователя по email и паролю
    """
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email и пароль обязательны")
    
    # Проверяем пользователя
    user = authenticate_user(email, password)
    
    if not user:
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    
    if not user.get("email_verified"):
        raise HTTPException(status_code=403, detail="Email не подтвержден. Пожалуйста, подтвердите email перед входом.")
    
    return {
        "message": "Вход выполнен успешно",
        "user": {
            "user_id": user.get("user_id"),
            "email": user.get("email"),
            "first_name": user.get("first_name"),
            "last_name": user.get("last_name"),
            "phone_number": user.get("phone_number"),
            "role": user.get("role"),
            "email_verified": user.get("email_verified", True)
        }
    }


