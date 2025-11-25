from fastapi import APIRouter
from app.repositories.products_repo import get_all_products

router = APIRouter(prefix="/products")

@router.get("/")
def list_products():
    return get_all_products()
