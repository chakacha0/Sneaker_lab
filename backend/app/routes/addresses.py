from fastapi import APIRouter, HTTPException
from app.repositories.addresses_repo import (
    create_address,
    get_user_addresses,
    get_address_by_id
)

router = APIRouter(prefix="/addresses")

@router.post("/")
def create_address_endpoint(data: dict):
    """
    Создает новый адрес для пользователя
    Требует: user_id, country, city, street, house
    Опционально: apartment, postal_code
    """
    user_id = data.get("user_id")
    country = data.get("country")
    city = data.get("city")
    street = data.get("street")
    house = data.get("house")
    apartment = data.get("apartment")
    postal_code = data.get("postal_code")
    
    if not all([user_id, country, city, street, house]):
        raise HTTPException(status_code=400, detail="user_id, country, city, street и house обязательны")
    
    try:
        address = create_address(
            user_id=user_id,
            country=country,
            city=city,
            street=street,
            house=house,
            apartment=apartment,
            postal_code=postal_code
        )
        return address
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/user/{user_id}")
def get_addresses_by_user(user_id: int):
    """
    Получает все адреса пользователя
    """
    try:
        addresses = get_user_addresses(user_id)
        return addresses
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{address_id}")
def get_address(address_id: int):
    """
    Получает адрес по ID
    """
    try:
        address = get_address_by_id(address_id)
        if not address:
            raise HTTPException(status_code=404, detail="Адрес не найден")
        return address
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
