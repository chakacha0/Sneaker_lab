# Что такое эндпоинты и как они работают

## Простыми словами

**Эндпоинт (endpoint)** = это адрес в интернете, куда можно отправить запрос и получить ответ.

Представьте, что ваш backend сервер - это ресторан:
- **Эндпоинт** = это меню с блюдами (функциями)
- **Запрос (request)** = заказ от клиента
- **Ответ (response)** = готовое блюдо (данные)

## Структура эндпоинта

```
http://localhost:8000/users/register
│              │      │     │
│              │      │     └─ Путь (path) - что мы хотим сделать
│              │      └─────── Префикс роутера
│              └────────────── Порт (где работает сервер)
└────────────────────────────── Хост (адрес сервера)
```

## Типы запросов (HTTP методы)

### 1. GET - Получить данные
**"Дай мне информацию"**

```python
@router.get("/products/")
def list_products():
    return get_all_products()
```

**Пример использования:**
```javascript
// Фронтенд отправляет запрос
fetch("http://localhost:8000/products/")
// Сервер возвращает список товаров
```

**Аналогия:** "Покажи мне меню" → официант приносит меню

---

### 2. POST - Создать/Отправить данные
**"Прими эти данные и сделай что-то"**

```python
@router.post("/users/register")
def register_user(data: dict):
    email = data.get("email")
    password = data.get("password")
    # ... создаем пользователя
    return {"message": "Регистрация успешна"}
```

**Пример использования:**
```javascript
// Фронтенд отправляет данные
fetch("http://localhost:8000/users/register", {
  method: "POST",
  body: JSON.stringify({
    email: "user@example.com",
    password: "123456"
  })
})
// Сервер создает пользователя и возвращает ответ
```

**Аналогия:** "Я хочу заказать пиццу" → отдаете заказ → официант передает на кухню → приносят пиццу

---

### 3. PUT - Обновить данные
**"Измени существующие данные"**

```python
@router.put("/cart/item/{cart_item_id}")
def update_item_quantity(cart_item_id: int, data: dict):
    quantity = data.get("quantity")
    # ... обновляем количество
    return {"message": "Количество обновлено"}
```

**Пример использования:**
```javascript
fetch(`http://localhost:8000/cart/item/5`, {
  method: "PUT",
  body: JSON.stringify({ quantity: 3 })
})
```

**Аналогия:** "Измени мой заказ - хочу 3 пиццы вместо 2" → официант обновляет заказ

---

### 4. DELETE - Удалить данные
**"Удали это"**

```python
@router.delete("/cart/item/{cart_item_id}")
def remove_item(cart_item_id: int):
    remove_item_from_cart(cart_item_id)
    return {"message": "Товар удален"}
```

**Пример использования:**
```javascript
fetch(`http://localhost:8000/cart/item/5`, {
  method: "DELETE"
})
```

**Аналогия:** "Отмени мой заказ" → официант удаляет заказ

---

## Как это работает в вашем проекте

### Пример 1: Регистрация пользователя

**Backend (users.py):**
```python
@router.post("/register")
def register_user(data: dict):
    email = data.get("email")
    password = data.get("password")
    # ... создаем пользователя
    return {"message": "Регистрация успешна"}
```

**Frontend (users.js):**
```javascript
export async function registerUser(userData) {
  const response = await fetch("http://localhost:8000/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
}
```

**Что происходит:**
1. Пользователь заполняет форму регистрации
2. Фронтенд отправляет POST запрос на `/users/register`
3. Backend получает данные, создает пользователя
4. Backend возвращает ответ: `{"message": "Регистрация успешна"}`
5. Фронтенд получает ответ и показывает сообщение

---

### Пример 2: Получение товаров

**Backend (products.py):**
```python
@router.get("/")
def list_products():
    return get_all_products()
```

**Frontend (products.js):**
```javascript
export async function fetchProducts() {
  const response = await fetch("http://localhost:8000/products/");
  return response.json();
}
```

**Что происходит:**
1. Фронтенд отправляет GET запрос на `/products/`
2. Backend получает запрос, вызывает функцию `get_all_products()`
3. Backend возвращает список товаров из базы данных
4. Фронтенд получает список и отображает на странице

---

### Пример 3: Добавление в корзину

**Backend (cart.py):**
```python
@router.post("/add")
def add_to_cart(data: dict):
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    size = data.get("size")
    # ... добавляем в корзину
    return {"message": "Товар добавлен в корзину"}
```

**Frontend (cart.js):**
```javascript
export async function addToCart(userId, productId, size, quantity = 1) {
  const response = await fetch("http://localhost:8000/cart/add", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      product_id: productId,
      size: size,
      quantity: quantity,
    }),
  });
  return response.json();
}
```

**Что происходит:**
1. Пользователь выбирает размер и нажимает "Добавить в корзину"
2. Фронтенд отправляет POST запрос с данными товара
3. Backend получает данные, добавляет товар в базу данных
4. Backend возвращает подтверждение
5. Фронтенд показывает сообщение "Товар добавлен в корзину"

---

## Параметры в URL

### Параметры пути (Path Parameters)

```python
@router.get("/products/{product_id}")
def get_product(product_id: int):
    return get_product_by_id(product_id)
```

**Использование:**
```
GET http://localhost:8000/products/5
                          └─ product_id = 5
```

### Query параметры (Query Parameters)

```python
@router.get("/verify-email")
def verify_email(token: str):
    # token приходит из ?token=abc123
    return verify_email_by_token(token)
```

**Использование:**
```
GET http://localhost:8000/users/verify-email?token=abc123
                                          └─ token = "abc123"
```

---

## Структура ответа

### Успешный ответ (200 OK)
```json
{
  "message": "Товар добавлен в корзину",
  "item": {
    "cart_item_id": 1,
    "product_id": 5,
    "size": 42,
    "quantity": 1
  }
}
```

### Ошибка (400 Bad Request)
```json
{
  "detail": "Email и пароль обязательны"
}
```

### Ошибка (404 Not Found)
```json
{
  "detail": "Товар не найден"
}
```

---

## Полный цикл работы

```
┌─────────────┐
│   Frontend  │
│  (Браузер)  │
└──────┬──────┘
       │
       │ 1. Пользователь нажимает кнопку
       │
       │ 2. fetch("http://localhost:8000/users/register", {...})
       │
       ▼
┌─────────────────────────────────────┐
│         HTTP Request                │
│  POST /users/register               │
│  Body: {email: "...", password: "..."}│
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────┐
│   Backend   │
│  (FastAPI)  │
└──────┬──────┘
       │
       │ 3. @router.post("/register") получает запрос
       │
       │ 4. Функция register_user() обрабатывает данные
       │
       │ 5. Вызывается create_user() из репозитория
       │
       │ 6. Данные сохраняются в базу данных
       │
       │ 7. Возвращается ответ
       │
       ▼
┌─────────────────────────────────────┐
│         HTTP Response                │
│  Status: 200 OK                      │
│  Body: {message: "Регистрация успешна"}│
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────┐
│   Frontend  │
│  (Браузер)  │
└─────────────┘
       │
       │ 8. Получен ответ
       │
       │ 9. Отображается сообщение пользователю
```

---

## Ваши эндпоинты в проекте

### Пользователи (`/users`)
- `POST /users/register` - Регистрация
- `POST /users/login` - Вход
- `POST /users/verify-email` - Подтверждение email

### Товары (`/products`)
- `GET /products/` - Список всех товаров
- `GET /products/{product_id}` - Информация о товаре
- `GET /products/{product_id}/sizes` - Размеры товара

### Корзина (`/cart`)
- `POST /cart/add` - Добавить товар
- `GET /cart/{user_id}` - Получить корзину
- `DELETE /cart/item/{cart_item_id}` - Удалить товар
- `PUT /cart/item/{cart_item_id}` - Обновить количество

---

## Важные моменты

1. **Эндпоинт = URL + HTTP метод**
   - `GET /products/` - это один эндпоинт
   - `POST /products/` - это другой эндпоинт (даже если URL тот же)

2. **Один эндпоинт = одна функция**
   - Каждый эндпоинт вызывает определенную функцию на сервере

3. **Эндпоинты могут принимать данные**
   - В URL (параметры пути)
   - В теле запроса (body)
   - В query параметрах (?key=value)

4. **Эндпоинты возвращают данные**
   - Обычно в формате JSON
   - Могут возвращать ошибки с кодами (400, 404, 500)

---

## Аналогия с реальной жизнью

**Эндпоинт** = это как номер телефона:
- У каждого номера своя функция
- Вы звоните (отправляете запрос)
- На том конце отвечают (возвращают данные)

**Разные эндпоинты** = разные номера:
- `/users/register` = "Отдел регистрации"
- `/products/` = "Отдел товаров"
- `/cart/add` = "Отдел корзины"

---

## Итого

**Эндпоинт** - это точка входа в ваш backend сервер, куда можно обратиться за определенной функцией. Это как кнопки на пульте управления - каждая кнопка делает что-то свое!

