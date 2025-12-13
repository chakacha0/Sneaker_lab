from fastapi import APIRouter, Query, UploadFile, File, Form, HTTPException, Body
from pydantic import BaseModel
from app.repositories.products_repo import (
    get_all_products,
    get_product_by_id,
    get_filtered_products,
    get_price_range,
    get_available_sizes,
    search_products,
    create_product,
    has_stock,
    update_product,
    delete_product
)
from app.repositories.product_stock_repo import get_product_sizes, add_or_update_product_stock
from typing import List, Optional
import os
import shutil

router = APIRouter(prefix="/products")

@router.get("/search")
def search_products_endpoint(q: Optional[str] = None):
    """
    Поиск товаров по названию, описанию или бренду
    
    Query параметры:
    - q: поисковый запрос
    """
    if not q or len(q.strip()) == 0:
        return []
    
    try:
        products = search_products(q.strip())
        return products
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=f"Ошибка поиска: {str(e)}")

@router.get("/")
def list_products(
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    sizes: Optional[str] = None,  # Строка с размерами через запятую: "36,37,38"
    gender: Optional[str] = None,
    in_stock: Optional[bool] = Query(None, description="Filter by stock availability (true = in stock, false = out of stock)"),
    sort_by: str = "created_at",
    sort_order: str = "DESC"
):
    """
    Получает список товаров с фильтрацией и сортировкой
    
    Query параметры:
    - min_price: минимальная цена
    - max_price: максимальная цена
    - category_id: ID категории
    - brand_id: ID бренда
    - sizes: размеры через запятую (например: "36,37,38")
    - gender: пол ('male', 'female', 'unisex')
    - in_stock: фильтр по наличию (true = в наличии, false = нет в наличии)
    - sort_by: поле сортировки ('price', 'created_at', 'name')
    - sort_order: порядок сортировки ('ASC', 'DESC')
    """
    # Валидация цен - не допускаем отрицательные значения
    if min_price is not None and min_price < 0:
        raise HTTPException(status_code=400, detail="Минимальная цена не может быть отрицательной")
    if max_price is not None and max_price < 0:
        raise HTTPException(status_code=400, detail="Максимальная цена не может быть отрицательной")
    
    # Преобразуем строку размеров в список
    sizes_list = None
    if sizes:
        try:
            sizes_list = [int(s.strip()) for s in sizes.split(',')]
            print(f"Получены размеры из запроса: {sizes} -> {sizes_list}")
        except ValueError as e:
            print(f"Ошибка преобразования размеров: {e}")
            sizes_list = None
    
    try:
        products = get_filtered_products(
            min_price=min_price,
            max_price=max_price,
            category_id=category_id,
            brand_id=brand_id,
            sizes=sizes_list,
            gender=gender,
            in_stock=in_stock,
            sort_by=sort_by,
            sort_order=sort_order
        )
        return products
    except Exception as e:
        from fastapi import HTTPException
        import traceback
        print(f"Ошибка при получении товаров: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Ошибка при получении товаров: {str(e)}")

@router.get("/price-range")
def get_price_range_endpoint():
    """
    Получает минимальную и максимальную цену товаров
    """
    return get_price_range()

@router.get("/available-sizes")
def get_available_sizes_endpoint():
    """
    Получает список всех доступных размеров
    """
    return get_available_sizes()


@router.get("/{product_id}")
def get_product(product_id: int):
    result = get_product_by_id(product_id)
    # if not result:
    #     raise HTTPException(status_code=404, detail="Product not found")
    return result

@router.get("/{product_id}/sizes")
def get_product_sizes_endpoint(product_id: int):
    """
    Получает список размеров товара с количеством
    """
    sizes = get_product_sizes(product_id)
    return {"product_id": product_id, "sizes": sizes}

class StockUpdate(BaseModel):
    size: int
    quantity: int

@router.post("/{product_id}/stock")
def add_product_stock_endpoint(product_id: int, stock_data: StockUpdate = Body(...)):
    """
    Добавляет или обновляет количество товара для конкретного размера
    """
    try:
        result = add_or_update_product_stock(product_id, stock_data.size, stock_data.quantity)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка добавления количества: {str(e)}")

@router.post("/")
async def create_product_endpoint(
    name: str = Form(...),
    description: str = Form(None),
    price: float = Form(None),
    brand_id: int = Form(None),
    category_id: int = Form(None),
    gender: str = Form(None),
    image: UploadFile = File(None)
):
    """
    Создает новый товар с загрузкой изображения
    """
    image_url = None
    saved_base_dir = None
    
    # Обрабатываем загрузку изображения
    if image and image.filename:
        # Получаем абсолютный путь к директории static
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        STATIC_DIR = os.path.join(BASE_DIR, "static")
        PRODUCTS_DIR = os.path.join(STATIC_DIR, "products")
        saved_base_dir = BASE_DIR
        
        # Создаем директорию products, если её нет
        os.makedirs(PRODUCTS_DIR, exist_ok=True)
        
        # Генерируем уникальное имя файла
        file_extension = os.path.splitext(image.filename)[1]
        # Используем название товара для имени файла (убираем спецсимволы)
        safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).strip()
        safe_name = safe_name.replace(' ', '_').lower()
        # Добавляем timestamp для уникальности
        import time
        timestamp = int(time.time())
        filename = f"{safe_name}_{timestamp}{file_extension}"
        file_path = os.path.join(PRODUCTS_DIR, filename)
        
        # Сохраняем файл
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            # Формируем URL для сохранения в БД
            image_url = f"/static/products/{filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка сохранения изображения: {str(e)}")
    
    try:
        # Нормализуем цену: округляем до 2 знаков после запятой
        normalized_price = None
        if price is not None:
            try:
                normalized_price = round(float(price), 2)
                if normalized_price < 0:
                    raise HTTPException(status_code=400, detail="Цена не может быть отрицательной")
            except (ValueError, TypeError):
                raise HTTPException(status_code=400, detail="Некорректное значение цены")
        
        product = create_product(
            name=name,
            description=description,
            price=normalized_price,
            brand_id=brand_id if brand_id else None,
            category_id=category_id if category_id else None,
            gender=gender,
            image_url=image_url
        )
        return product
    except Exception as e:
        # Если произошла ошибка и файл был сохранен, удаляем его
        if image_url and saved_base_dir:
            try:
                filename = os.path.basename(image_url)
                file_path = os.path.join(saved_base_dir, "static", "products", filename)
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as cleanup_error:
                print(f"Ошибка при удалении файла: {cleanup_error}")
        
        import traceback
        error_detail = str(e)
        print(f"Ошибка создания товара: {error_detail}")
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=f"Ошибка создания товара: {error_detail}")

@router.put("/{product_id}")
async def update_product_endpoint(
    product_id: int,
    name: str = Form(None),
    description: str = Form(None),
    price: float = Form(None),
    brand_id: int = Form(None),
    category_id: int = Form(None),
    gender: str = Form(None),
    image: UploadFile = File(None)
):
    """
    Обновляет информацию о товаре с загрузкой изображения (опционально)
    """
    image_url = None
    saved_base_dir = None
    
    # Обрабатываем загрузку изображения
    if image and image.filename:
        # Получаем абсолютный путь к директории static
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        STATIC_DIR = os.path.join(BASE_DIR, "static")
        PRODUCTS_DIR = os.path.join(STATIC_DIR, "products")
        saved_base_dir = BASE_DIR
        
        # Создаем директорию products, если её нет
        os.makedirs(PRODUCTS_DIR, exist_ok=True)
        
        # Генерируем уникальное имя файла
        file_extension = os.path.splitext(image.filename)[1]
        # Используем название товара для имени файла (убираем спецсимволы)
        safe_name = "".join(c for c in (name or "product") if c.isalnum() or c in (' ', '-', '_')).strip()
        safe_name = safe_name.replace(' ', '_').lower()
        # Добавляем timestamp для уникальности
        import time
        timestamp = int(time.time())
        filename = f"{safe_name}_{timestamp}{file_extension}"
        file_path = os.path.join(PRODUCTS_DIR, filename)
        
        # Сохраняем файл
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            # Формируем URL для сохранения в БД
            image_url = f"/static/products/{filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка сохранения изображения: {str(e)}")
    
    try:
        # Нормализуем цену: округляем до 2 знаков после запятой
        normalized_price = None
        if price is not None:
            try:
                normalized_price = round(float(price), 2)
                if normalized_price < 0:
                    raise HTTPException(status_code=400, detail="Цена не может быть отрицательной")
            except (ValueError, TypeError):
                raise HTTPException(status_code=400, detail="Некорректное значение цены")
        
        product = update_product(
            product_id=product_id,
            name=name,
            description=description,
            price=normalized_price,
            brand_id=brand_id if brand_id else None,
            category_id=category_id if category_id else None,
            gender=gender,
            image_url=image_url
        )
        
        if not product:
            raise HTTPException(status_code=404, detail="Товар не найден")
        
        return product
    except HTTPException:
        raise
    except Exception as e:
        # Если произошла ошибка и файл был сохранен, удаляем его
        if image_url and saved_base_dir:
            try:
                filename = os.path.basename(image_url)
                file_path = os.path.join(saved_base_dir, "static", "products", filename)
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as cleanup_error:
                print(f"Ошибка при удалении файла: {cleanup_error}")
        
        import traceback
        error_detail = str(e)
        print(f"Ошибка обновления товара: {error_detail}")
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=f"Ошибка обновления товара: {error_detail}")

@router.delete("/{product_id}")
def delete_product_endpoint(product_id: int):
    """
    Удаляет товар из базы данных
    """
    try:
        # Проверяем, есть ли товар на складе
        product_has_stock = has_stock(product_id)
        
        # Получаем информацию о товаре
        product = get_product_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Товар не найден")
        
        # Удаляем товар
        deleted_product = delete_product(product_id)
        
        return {
            "message": "Товар успешно удален",
            "product": deleted_product,
            "had_stock": product_has_stock
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_detail = str(e)
        print(f"Ошибка удаления товара: {error_detail}")
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=f"Ошибка удаления товара: {error_detail}")

@router.get("/{product_id}/has-stock")
def check_product_stock_endpoint(product_id: int):
    """
    Проверяет, есть ли товар на складе
    """
    try:
        product = get_product_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Товар не найден")
        
        has_stock_value = has_stock(product_id)
        return {"product_id": product_id, "has_stock": has_stock_value}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка проверки наличия товара: {str(e)}")

