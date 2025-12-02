from fastapi import APIRouter, HTTPException
from app.repositories.users_repo import (
    get_all_admins,
    search_users_by_email,
    promote_to_admin,
    remove_admin_role
)

router = APIRouter(prefix="/admins")

@router.get("/")
def list_admins():
    """
    Получает список всех администраторов
    """
    try:
        admins = get_all_admins()
        return admins
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении списка администраторов: {str(e)}")

@router.get("/search-users")
def search_users(email_query: str):
    """
    Ищет пользователей по email
    
    Args:
        email_query: Часть email для поиска
    """
    if not email_query or len(email_query.strip()) < 2:
        raise HTTPException(status_code=400, detail="Минимум 2 символа для поиска")
    
    try:
        users = search_users_by_email(email_query.strip())
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при поиске пользователей: {str(e)}")

@router.post("/promote/{user_id}")
def promote_user_to_admin(user_id: int):
    """
    Назначает пользователя администратором
    
    Args:
        user_id: ID пользователя
    """
    try:
        user = promote_to_admin(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при назначении администратором: {str(e)}")

@router.post("/remove/{user_id}")
def remove_admin(user_id: int):
    """
    Лишает пользователя прав администратора
    
    Args:
        user_id: ID пользователя
    """
    try:
        user = remove_admin_role(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Администратор не найден или уже не является администратором")
        return {"message": "Права администратора успешно отозваны", "user": user}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при отзыве прав администратора: {str(e)}")
