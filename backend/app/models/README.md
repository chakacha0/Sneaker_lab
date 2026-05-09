# Модели данных (Models)

Этот пакет содержит Pydantic модели для всех сущностей предметной области приложения.

## Структура

Каждая сущность имеет следующие типы моделей:

1. **Base** - Базовая модель с общими полями
2. **Create** - Модель для создания новой записи (все обязательные поля)
3. **Update** - Модель для обновления записи (все поля опциональные)
4. **Основная модель** - Полная модель с ID и всеми полями

## Сущности

### 1. User (Пользователи)
- `User` - Полная модель пользователя
- `UserCreate` - Создание пользователя
- `UserUpdate` - Обновление пользователя
- `UserLogin` - Авторизация пользователя

**Файл:** `user.py`

### 2. Product (Товары)
- `Product` - Полная модель товара
- `ProductCreate` - Создание товара
- `ProductUpdate` - Обновление товара

**Файл:** `product.py`

### 3. Brand (Бренды)
- `Brand` - Полная модель бренда
- `BrandCreate` - Создание бренда
- `BrandUpdate` - Обновление бренда

**Файл:** `brand.py`

### 4. Category (Категории)
- `Category` - Полная модель категории
- `CategoryCreate` - Создание категории
- `CategoryUpdate` - Обновление категории

**Файл:** `category.py`

### 5. Order (Заказы)
- `Order` - Полная модель заказа
- `OrderCreate` - Создание заказа
- `OrderItem` - Элемент заказа
- `OrderItemCreate` - Создание элемента заказа

**Файл:** `order.py`

### 6. Cart (Корзина)
- `Cart` - Модель корзины
- `CartItem` - Элемент корзины
- `CartItemCreate` - Создание элемента корзины

**Файл:** `cart.py`

### 7. Favourite (Избранное)
- `Favourite` - Полная модель избранного
- `FavouriteCreate` - Создание записи в избранном

**Файл:** `favourite.py`

### 8. Address (Адреса)
- `Address` - Полная модель адреса
- `AddressCreate` - Создание адреса
- `AddressUpdate` - Обновление адреса

**Файл:** `address.py`

### 9. PromoCode (Промокоды)
- `PromoCode` - Полная модель промокода
- `PromoCodeCreate` - Создание промокода
- `PromoCodeUpdate` - Обновление промокода

**Файл:** `promo_code.py`

### 10. Review (Отзывы)
- `Review` - Полная модель отзыва
- `ReviewCreate` - Создание отзыва
- `ReviewUpdate` - Обновление отзыва

**Файл:** `review.py`

### 11. ProductStock (Склад товаров)
- `ProductStock` - Полная модель склада
- `ProductStockCreate` - Создание записи на складе
- `ProductStockUpdate` - Обновление записи на складе

**Файл:** `product_stock.py`

### 12. ProductImage (Изображения товаров)
- `ProductImage` - Полная модель изображения
- `ProductImageCreate` - Создание изображения

**Файл:** `product_image.py`

## Использование

### Импорт моделей

```python
from app.models import User, UserCreate, Product, ProductCreate
from app.models.order import Order, OrderCreate, OrderItem
```

### Пример использования в роутах

```python
from fastapi import APIRouter
from app.models import UserCreate, User
from app.repositories.users_repo import create_user

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=User)
async def register_user(user_data: UserCreate):
    user = create_user(
        email=user_data.email,
        password=user_data.password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        phone_number=user_data.phone_number
    )
    return user
```

## Валидация

Все модели используют Pydantic для валидации данных:

- **EmailStr** - для email адресов
- **Field** - для дополнительных ограничений (min_length, max_length, ge, le)
- **Optional** - для опциональных полей
- **Decimal** - для денежных значений
- **datetime** - для дат и времени

## Конфигурация

Все модели используют `from_attributes = True` в классе `Config`, что позволяет создавать модели из ORM объектов (например, из SQLAlchemy или psycopg2 результатов).

## Примеры

Каждая модель содержит примеры в `json_schema_extra` для документации API.

