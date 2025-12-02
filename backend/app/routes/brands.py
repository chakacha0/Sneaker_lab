from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.repositories.brands_repo import get_all_brands, create_brand, update_brand, has_products, delete_brand
import os
import shutil

router = APIRouter(prefix="/brands")

@router.get("/")
def list_brands():
    return get_all_brands()

@router.post("/")
async def create_brand_endpoint(
    name: str = Form(...),
    description: str = Form(None),
    country: str = Form(None),
    image: UploadFile = File(None)
):
    """
    Создает новый бренд с загрузкой изображения
    """
    image_url = None
    saved_base_dir = None
    
    # Обрабатываем загрузку изображения
    if image and image.filename:
        # Получаем абсолютный путь к директории static
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        STATIC_DIR = os.path.join(BASE_DIR, "static")
        BRANDS_DIR = os.path.join(STATIC_DIR, "brands")
        saved_base_dir = BASE_DIR
        
        # Создаем директорию brands, если её нет
        os.makedirs(BRANDS_DIR, exist_ok=True)
        
        # Генерируем уникальное имя файла
        file_extension = os.path.splitext(image.filename)[1]
        # Используем название бренда для имени файла (убираем спецсимволы)
        safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).strip()
        safe_name = safe_name.replace(' ', '_').lower()
        filename = f"{safe_name}{file_extension}"
        file_path = os.path.join(BRANDS_DIR, filename)
        
        # Сохраняем файл
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            # Формируем URL для сохранения в БД
            image_url = f"/static/brands/{filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка сохранения изображения: {str(e)}")
    
    try:
        brand = create_brand(
            name=name,
            description=description,
            country=country,
            image_url=image_url
        )
        return brand
    except Exception as e:
        # Если произошла ошибка и файл был сохранен, удаляем его
        if image_url:
            try:
                file_path = os.path.join(saved_base_dir, "static", "brands", os.path.basename(image_url))
                if os.path.exists(file_path):
                    os.remove(file_path)
            except:
                pass
        raise HTTPException(status_code=400, detail=f"Ошибка создания бренда: {str(e)}")

@router.put("/{brand_id}")
async def update_brand_endpoint(
    brand_id: int,
    name: str = Form(None),
    description: str = Form(None),
    country: str = Form(None),
    image: UploadFile = File(None)
):
    """
    Обновляет информацию о бренде с возможностью загрузки нового изображения
    """
    image_url = None
    saved_base_dir = None
    
    # Обрабатываем загрузку нового изображения
    if image and image.filename:
        # Получаем абсолютный путь к директории static
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        STATIC_DIR = os.path.join(BASE_DIR, "static")
        BRANDS_DIR = os.path.join(STATIC_DIR, "brands")
        saved_base_dir = BASE_DIR
        
        # Создаем директорию brands, если её нет
        os.makedirs(BRANDS_DIR, exist_ok=True)
        
        # Генерируем уникальное имя файла
        file_extension = os.path.splitext(image.filename)[1]
        # Используем название бренда для имени файла (убираем спецсимволы)
        safe_name = "".join(c for c in (name or f"brand_{brand_id}") if c.isalnum() or c in (' ', '-', '_')).strip()
        safe_name = safe_name.replace(' ', '_').lower()
        filename = f"{safe_name}{file_extension}"
        file_path = os.path.join(BRANDS_DIR, filename)
        
        # Сохраняем файл
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            # Формируем URL для сохранения в БД
            image_url = f"/static/brands/{filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка сохранения изображения: {str(e)}")
    
    try:
        brand = update_brand(
            brand_id=brand_id,
            name=name,
            description=description,
            country=country,
            image_url=image_url
        )
        
        if not brand:
            raise HTTPException(status_code=404, detail="Бренд не найден")
        
        return brand
    except HTTPException:
        raise
    except Exception as e:
        # Если произошла ошибка и файл был сохранен, удаляем его
        if image_url:
            try:
                file_path = os.path.join(saved_base_dir, "static", "brands", os.path.basename(image_url))
                if os.path.exists(file_path):
                    os.remove(file_path)
            except:
                pass
        raise HTTPException(status_code=400, detail=f"Ошибка обновления бренда: {str(e)}")

@router.delete("/{brand_id}")
def delete_brand_endpoint(brand_id: int):
    """
    Удаляет бренд, если у него нет товаров
    """
    # Проверяем, есть ли товары у этого бренда
    if has_products(brand_id):
        raise HTTPException(
            status_code=400,
            detail="Невозможно удалить бренд: у него есть связанные товары"
        )
    
    # Удаляем бренд
    deleted = delete_brand(brand_id)
    
    if not deleted:
        raise HTTPException(status_code=404, detail="Бренд не найден")
    
    return {"message": "Бренд успешно удален"}
