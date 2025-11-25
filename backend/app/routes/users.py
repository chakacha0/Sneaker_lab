from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.repositories.users_repo import create_user

router = APIRouter(prefix="/users")


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone_number: str


@router.post("/register")
def register_user(data: RegisterRequest):
    result = create_user(
        data.email,
        data.password,
        data.first_name,
        data.last_name,
        data.phone_number
    )

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return {"message": "Регистрация успешна", "user": result}
