from fastapi import APIRouter, HTTPException
from app.repositories.users_repo import create_user

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
        return {"message": "Регистрация успешна", "user": user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
