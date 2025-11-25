from fastapi import APIRouter
from app.repositories.brands_repo import get_all_brands

router = APIRouter(prefix="/brands")

@router.get("/")
def list_brands():
    return get_all_brands()
