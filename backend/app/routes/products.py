from fastapi import APIRouter, Query, UploadFile, File, Form, HTTPException, Body
from pydantic import BaseModel
from app.config import settings
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
import json
import os
import shutil
import urllib.error
import urllib.request

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
    ids: Optional[str] = Query(None, description="Comma-separated product IDs to limit catalog results"),
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
    - ids: список ID товаров через запятую
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
    
    product_ids = None
    if ids is not None:
        try:
            product_ids = [int(pid.strip()) for pid in ids.split(",") if pid.strip()]
        except ValueError:
            raise HTTPException(status_code=400, detail="Некорректный список ID товаров")
    
    try:
        products = get_filtered_products(
            min_price=min_price,
            max_price=max_price,
            category_id=category_id,
            brand_id=brand_id,
            sizes=sizes_list,
            gender=gender,
            in_stock=in_stock,
            product_ids=product_ids,
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


class AiRecommendationsRequest(BaseModel):
    query: str
    previous_query: Optional[str] = None


def _product_for_ai(product):
    return {
        "product_id": product.get("product_id"),
        "name": product.get("name"),
        "description": product.get("description"),
        "price": float(product.get("price")) if product.get("price") is not None else None,
        "brand": product.get("brand"),
        "category": product.get("category"),
        "gender": product.get("gender"),
        "has_stock": product.get("has_stock"),
    }


def _extract_product_ids(content: str):
    text = (content or "").strip()
    if text.startswith("```"):
        text = text.strip("`").strip()
        if text.lower().startswith("json"):
            text = text[4:].strip()
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start == -1 or end == -1 or end <= start:
            return []
        parsed = json.loads(text[start:end + 1])

    ids = parsed.get("product_ids", []) if isinstance(parsed, dict) else []
    result = []
    for value in ids:
        try:
            result.append(int(value))
        except (TypeError, ValueError):
            continue
    return result


def _log_openrouter(title: str, data):
    print(f"\n[OpenRouter] {title}")
    try:
        print(json.dumps(data, ensure_ascii=False, indent=2, default=str))
    except Exception:
        print(data)
    print(f"[OpenRouter] End {title}\n")


@router.post("/ai-recommendations")
def get_ai_product_recommendations(data: AiRecommendationsRequest):
    """
    Подбирает товары по одному текстовому запросу через OpenRouter.
    Возвращает product_ids и товары в стандартном формате каталога.
    """
    query = (data.query or "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    if not settings.OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY is not configured")

    catalog = get_all_products()
    if not catalog:
        return {"query": query, "product_ids": [], "products": []}

    catalog_for_ai = [_product_for_ai(product) for product in catalog]
    existing_ids = {product["product_id"] for product in catalog_for_ai if product.get("product_id") is not None}
    prompt_query = query
    if data.previous_query and data.previous_query.strip() and data.previous_query.strip() != query:
        prompt_query = f"Previous request: {data.previous_query.strip()}\nUpdated request: {query}"

    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a sneaker shop assistant. Choose the best matching products from the provided catalog. "
                    "Return ONLY valid JSON in this exact shape: {\"product_ids\":[1,2,3]}. "
                    "Use only product_id values that exist in the catalog. Prefer in-stock products when possible. "
                    "If nothing matches, return {\"product_ids\":[]}."
                ),
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "request": prompt_query,
                        "catalog": catalog_for_ai,
                    },
                    ensure_ascii=False,
                ),
            },
        ],
        "temperature": 0.2,
        "max_tokens": 300,
    }

    _log_openrouter(
        "Request",
        {
            "url": settings.OPENROUTER_API_URL,
            "headers": {
                "Authorization": "Bearer ***",
                "Content-Type": "application/json",
                "HTTP-Referer": settings.FRONTEND_URL,
                "X-Title": "SneakerLab",
            },
            "payload": payload,
            "catalog_count": len(catalog_for_ai),
        },
    )

    request = urllib.request.Request(
        settings.OPENROUTER_API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": settings.FRONTEND_URL,
            "X-Title": "SneakerLab",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            raw_response = response.read().decode("utf-8")
            _log_openrouter("Raw Response", raw_response)
            response_data = json.loads(raw_response)
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="ignore")
        _log_openrouter("HTTP Error", {"status": e.code, "reason": e.reason, "body": detail})
        raise HTTPException(status_code=502, detail=f"OpenRouter error: {detail or e.reason}")
    except Exception as e:
        _log_openrouter("Request Error", str(e))
        raise HTTPException(status_code=502, detail=f"OpenRouter request failed: {str(e)}")

    try:
        content = response_data["choices"][0]["message"]["content"]
        _log_openrouter("Assistant Content", content)
        ai_ids = _extract_product_ids(content)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Invalid OpenRouter response: {str(e)}")

    product_ids = []
    seen = set()
    for product_id in ai_ids:
        if product_id in existing_ids and product_id not in seen:
            product_ids.append(product_id)
            seen.add(product_id)

    products = get_filtered_products(product_ids=product_ids) if product_ids else []
    _log_openrouter(
        "Parsed Product IDs",
        {
            "raw_ids": ai_ids,
            "validated_ids": product_ids,
            "returned_products_count": len(products),
        },
    )
    return {
        "query": query,
        "product_ids": product_ids,
        "products": products,
    }


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

