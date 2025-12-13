# Программный код основных функций работы с БД

## Описание

Документ содержит код 5 основных функций приложения, реализующих операции с базой данных. Каждая функция представлена в сокращенном виде (не более 15 строк) с пояснениями.

---

## Функция 1: Создание пользователя (INSERT)

**Файл:** `backend/app/repositories/users_repo.py`  
**Тип операции:** INSERT (добавление записи)

```python
def create_user(email: str, password: str, first_name: str, last_name: str, phone_number: str):
    conn = get_connection()
    cur = conn.cursor()
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    verification_code = generate_verification_code()
    cur.execute(
        "INSERT INTO users (role, email, password_hash, first_name, last_name, phone_number, email_verified, verification_code) VALUES ('customer', %s, %s, %s, %s, %s, FALSE, %s) RETURNING user_id, role, email, first_name, last_name, phone_number, email_verified, verification_code;",
        (email, password_hash, first_name, last_name, phone_number, verification_code)
    )
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return user
```

**Пояснение:**
- Функция создает нового пользователя в таблице `users`
- Пароль хэшируется с помощью bcrypt перед сохранением
- Генерируется код подтверждения email
- Используется `RETURNING` для получения созданной записи
- `conn.commit()` фиксирует изменения в БД

---

## Функция 2: Получение товара по ID (SELECT с JOIN)

**Файл:** `backend/app/repositories/products_repo.py`  
**Тип операции:** SELECT (выборка с объединением таблиц)

```python
def get_product_by_id(product_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT p.product_id, p.name, p.description, p.price, p.gender,
               p.brand_id, p.category_id,
               b.name AS brand, c.name AS category, i.image_url
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.brand_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN product_images i USING (product_id)
        WHERE p.product_id = %s;
        """,
        (product_id,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row
```

**Пояснение:**
- Функция получает товар по его ID с полной информацией
- Используется `LEFT JOIN` для объединения с таблицами `brands`, `categories`, `product_images`
- `LEFT JOIN` позволяет получить товар даже если бренд/категория не указаны
- `USING (product_id)` - сокращенный синтаксис для JOIN по общему полю
- Возвращается одна запись (dict) или None, если товар не найден

---

## Функция 3: Добавление товара в корзину (INSERT/UPDATE)

**Файл:** `backend/app/repositories/cart_repo.py`  
**Тип операции:** INSERT или UPDATE (в зависимости от наличия товара)

```python
def add_item_to_cart(cart_id: int, product_id: int, size: int, quantity: int):
    stock = get_product_stock_by_size(product_id, size)
    available_quantity = stock.get("quantity", 0) if stock else 0
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = %s AND product_id = %s AND size = %s;", (cart_id, product_id, size))
    existing_item = cur.fetchone()
    new_quantity = (existing_item.get("quantity", 0) if existing_item else 0) + quantity
    if new_quantity > available_quantity:
        raise ValueError(f"Недостаточно товара на складе. Доступно: {available_quantity}")
    if existing_item:
        cur.execute("UPDATE cart_items SET quantity = %s WHERE cart_item_id = %s RETURNING cart_item_id, cart_id, product_id, size, quantity;", (new_quantity, existing_item.get("cart_item_id")))
    else:
        cur.execute("INSERT INTO cart_items (cart_id, product_id, size, quantity) VALUES (%s, %s, %s, %s) RETURNING cart_item_id, cart_id, product_id, size, quantity;", (cart_id, product_id, size, quantity))
    item = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return item
```

**Пояснение:**
- Функция добавляет товар в корзину или обновляет количество, если товар уже есть
- Сначала проверяется наличие товара на складе
- Если товар уже в корзине → выполняется `UPDATE` (увеличивается quantity)
- Если товара нет в корзине → выполняется `INSERT` (создается новая запись)
- Используется `RETURNING` для получения обновленной/созданной записи
- Проверка доступного количества предотвращает превышение лимита

---

## Функция 4: Создание заказа (INSERT с транзакцией)

**Файл:** `backend/app/repositories/orders_repo.py`  
**Тип операции:** INSERT (создание заказа и связанных записей в транзакции)

```python
def create_order(user_id: int, address_id: int, promo_code: str = None):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cart_items = get_cart_items(get_or_create_cart(user_id).get("cart_id"))
        original_total = sum(item.get("price", 0) * item.get("quantity", 0) for item in cart_items)
        cur.execute("SELECT calculate_order_total_with_promo(%s, %s) AS final_total;", (original_total, promo_code.strip().upper() if promo_code else None))
        final_total = float(cur.fetchone().get("final_total", original_total))
        promo_id = get_promo_code_by_code(promo_code.strip().upper()).get("promo_id") if promo_code else None
        cur.execute("INSERT INTO orders (user_id, address_id, promo_id, total_price) VALUES (%s, %s, %s, %s) RETURNING order_id;", (user_id, address_id, promo_id, final_total))
        order_id = cur.fetchone().get("order_id")
        for item in cart_items:
            cur.execute("INSERT INTO order_items (order_id, product_id, size, quantity, price_at_purchase) VALUES (%s, %s, %s, %s, %s);", (order_id, item.get("product_id"), item.get("size"), item.get("quantity"), item.get("price")))
            cur.execute("UPDATE product_stock SET quantity = quantity - %s WHERE product_id = %s AND size = %s;", (item.get("quantity"), item.get("product_id"), item.get("size")))
        conn.commit()
        return get_order_by_id(order_id)
    except Exception as e:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()
```

**Пояснение:**
- Функция создает заказ в рамках одной транзакции
- Используется функция БД `calculate_order_total_with_promo()` для расчета стоимости с учетом промокода
- Создается запись в `orders`, затем записи в `order_items` для каждого товара
- Одновременно уменьшается количество товаров на складе (`UPDATE product_stock`)
- `conn.commit()` фиксирует все изменения, `conn.rollback()` откатывает при ошибке
- Все операции атомарны - либо все выполняется, либо ничего

---

## Функция 5: Получение отфильтрованных товаров (SELECT с условиями)

**Файл:** `backend/app/repositories/products_repo.py`  
**Тип операции:** SELECT (выборка с фильтрацией и сортировкой)

```python
def get_filtered_products(min_price=None, max_price=None, category_id=None, brand_id=None, sizes=None, gender=None, sort_by="created_at", sort_order="DESC"):
    conn = get_connection()
    cur = conn.cursor()
    query = "SELECT DISTINCT p.product_id, p.name, p.description, p.price, p.gender, p.created_at, b.name AS brand, c.name AS category, (SELECT image_url FROM product_images WHERE product_id = p.product_id LIMIT 1) AS image_url FROM products p LEFT JOIN brands b ON p.brand_id = b.brand_id LEFT JOIN categories c ON p.category_id = c.category_id"
    conditions, params = [], []
    
    if min_price is not None:
        conditions.append("p.price >= %s")
        params.append(min_price)
    if max_price is not None:
        conditions.append("p.price <= %s")
        params.append(max_price)
    if category_id is not None:
        conditions.append("p.category_id = %s")
        params.append(category_id)
    if brand_id is not None:
        conditions.append("p.brand_id = %s")
        params.append(brand_id)
    if gender is not None:
        conditions.append("(p.gender = %s OR p.gender = 'unisex')")
        params.append(gender)
    
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    query += f" ORDER BY p.{sort_by if sort_by in {'price', 'created_at', 'name'} else 'created_at'} {sort_order}"
    
    cur.execute(query, params)
    products = cur.fetchall()
    cur.close()
    conn.close()
    return products
```

**Пояснение:**
- Функция получает товары с применением различных фильтров
- Запрос строится динамически - условия добавляются только если параметры указаны
- Используется `LEFT JOIN` для получения названий брендов и категорий
- Подзапрос `(SELECT image_url ... LIMIT 1)` получает первое изображение товара
- `DISTINCT` предотвращает дубликаты при JOIN
- Параметры передаются через `params` для защиты от SQL-инъекций
- Сортировка применяется по указанному полю и направлению

---

## Общие принципы работы с БД

### 1. Подключение к базе данных
```python
conn = get_connection()  # Получаем соединение
cur = conn.cursor()      # Создаем курсор для выполнения запросов
```

### 2. Выполнение запросов
```python
cur.execute("SELECT ... WHERE id = %s", (id_value,))  # Параметризованный запрос
result = cur.fetchone()  # Одна запись
# или
results = cur.fetchall()  # Все записи
```

### 3. Фиксация изменений
```python
conn.commit()  # Сохранить изменения
# или
conn.rollback()  # Откатить изменения при ошибке
```

### 4. Закрытие соединения
```python
cur.close()   # Закрыть курсор
conn.close()  # Закрыть соединение
```

### 5. Безопасность
- Всегда используются параметризованные запросы (`%s` вместо строковой конкатенации)
- Это защищает от SQL-инъекций
- Пароли хэшируются перед сохранением
- Чувствительные данные не возвращаются в ответах

---

## Типы операций с БД

### INSERT (Вставка)
- Создание новых записей
- Используется `RETURNING` для получения созданной записи
- Пример: создание пользователя, добавление товара в корзину

### SELECT (Выборка)
- Получение данных из таблиц
- Может включать JOIN для объединения таблиц
- Может включать WHERE для фильтрации
- Может включать ORDER BY для сортировки
- Пример: получение товара по ID, фильтрация товаров

### UPDATE (Обновление)
- Изменение существующих записей
- Используется WHERE для указания записей
- Может использовать `RETURNING` для получения обновленной записи
- Пример: обновление количества товара в корзине

### DELETE (Удаление)
- Удаление записей из таблиц
- Используется WHERE для указания записей
- Пример: удаление товара из корзины, очистка корзины

### Транзакции
- Группа операций выполняется атомарно
- `BEGIN` (автоматически) → операции → `COMMIT` или `ROLLBACK`
- Пример: создание заказа (создание заказа + создание order_items + обновление склада)

---

## Резюме

Все функции работы с БД следуют единому паттерну:
1. Получение соединения с БД
2. Создание курсора
3. Выполнение SQL запроса с параметрами
4. Получение результата
5. Фиксация изменений (для INSERT/UPDATE/DELETE)
6. Закрытие курсора и соединения

Использование параметризованных запросов обеспечивает безопасность и защиту от SQL-инъекций.

