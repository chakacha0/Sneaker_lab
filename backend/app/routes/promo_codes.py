from fastapi import APIRouter, HTTPException
from app.repositories.promo_codes_repo import (
    get_all_promo_codes,
    get_promo_code_by_id,
    create_promo_code,
    update_promo_code,
    delete_promo_code
)

router = APIRouter(prefix="/promo-codes")


@router.get("/")
def list_promo_codes():
    """
    Получает список всех промокодов
    """
    try:
        promo_codes = get_all_promo_codes()
        return promo_codes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении промокодов: {str(e)}")


@router.get("/{promo_id}")
def get_promo_code(promo_id: int):
    """
    Получает промокод по ID
    """
    try:
        promo_code = get_promo_code_by_id(promo_id)
        if not promo_code:
            raise HTTPException(status_code=404, detail="Промокод не найден")
        return promo_code
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении промокода: {str(e)}")


@router.post("/")
def create_promo_code_endpoint(data: dict):
    """
    Создает новый промокод
    """
    code = data.get("code")
    discount_percent = data.get("discount_percent")
    discount_amount = data.get("discount_amount")
    valid_from = data.get("valid_from")
    valid_to = data.get("valid_to")
    min_order_price = data.get("min_order_price")
    usage_limit = data.get("usage_limit")
    
    if not code:
        raise HTTPException(status_code=400, detail="Код промокода обязателен")
    
    # Проверяем, что указан либо процент, либо сумма скидки
    if discount_percent is None and discount_amount is None:
        raise HTTPException(
            status_code=400,
            detail="Необходимо указать либо процент скидки, либо сумму скидки"
        )
    
    # Проверяем, что не указаны оба типа скидки одновременно
    if discount_percent is not None and discount_amount is not None:
        raise HTTPException(
            status_code=400,
            detail="Нельзя указать одновременно процент и сумму скидки"
        )
    
    try:
        promo_code = create_promo_code(
            code=code,
            discount_percent=discount_percent,
            discount_amount=discount_amount,
            valid_from=valid_from,
            valid_to=valid_to,
            min_order_price=min_order_price,
            usage_limit=usage_limit
        )
        return promo_code
    except Exception as e:
        error_msg = str(e)
        if "unique" in error_msg.lower() or "duplicate" in error_msg.lower():
            raise HTTPException(status_code=400, detail="Промокод с таким кодом уже существует")
        raise HTTPException(status_code=400, detail=f"Ошибка создания промокода: {error_msg}")


@router.put("/{promo_id}")
def update_promo_code_endpoint(promo_id: int, data: dict):
    """
    Обновляет информацию о промокоде
    """
    code = data.get("code")
    discount_percent = data.get("discount_percent")
    discount_amount = data.get("discount_amount")
    valid_from = data.get("valid_from")
    valid_to = data.get("valid_to")
    min_order_price = data.get("min_order_price")
    usage_limit = data.get("usage_limit")
    
    # Проверяем, что не указаны оба типа скидки одновременно
    if discount_percent is not None and discount_amount is not None:
        raise HTTPException(
            status_code=400,
            detail="Нельзя указать одновременно процент и сумму скидки"
        )
    
    try:
        promo_code = update_promo_code(
            promo_id=promo_id,
            code=code,
            discount_percent=discount_percent,
            discount_amount=discount_amount,
            valid_from=valid_from,
            valid_to=valid_to,
            min_order_price=min_order_price,
            usage_limit=usage_limit
        )
        
        if not promo_code:
            raise HTTPException(status_code=404, detail="Промокод не найден")
        
        return promo_code
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        if "unique" in error_msg.lower() or "duplicate" in error_msg.lower():
            raise HTTPException(status_code=400, detail="Промокод с таким кодом уже существует")
        raise HTTPException(status_code=400, detail=f"Ошибка обновления промокода: {error_msg}")


@router.delete("/{promo_id}")
def delete_promo_code_endpoint(promo_id: int):
    """
    Удаляет промокод
    """
    try:
        deleted = delete_promo_code(promo_id)
        
        if not deleted:
            raise HTTPException(status_code=404, detail="Промокод не найден")
        
        return {"message": "Промокод успешно удален"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка удаления промокода: {str(e)}")
