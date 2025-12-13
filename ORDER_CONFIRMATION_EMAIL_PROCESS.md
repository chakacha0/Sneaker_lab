# Процесс отправки email с подтверждением заказа

## Описание процесса

Документ описывает полный процесс отправки email с подтверждением заказа пользователю после успешного оформления заказа в системе SneakerLab.

---

## Общая схема процесса

```
Оформление заказа
    ↓
Создание заказа в БД
    ↓
Получение информации о заказе
    ↓
Получение email пользователя
    ↓
Получение адреса доставки
    ↓
Вызов send_order_confirmation_email()
    ↓
Проверка настроек SMTP
    ↓
    ├─→ SMTP не настроен → Режим разработки (вывод в консоль)
    └─→ SMTP настроен → Отправка через SMTP сервер
```

---

## Детальный процесс отправки email

### Шаг 1: Создание заказа

**Файл:** `backend/app/repositories/orders_repo.py`

После успешного создания заказа в базе данных и фиксации транзакции:

```python
conn.commit()

# Получаем полную информацию о заказе
order_with_items = get_order_by_id(order_id)
```

**Что происходит:**
- Заказ создан в таблице `orders`
- Товары добавлены в `order_items`
- Количество на складе уменьшено
- Корзина очищена
- Транзакция зафиксирована (COMMIT)

---

### Шаг 2: Получение информации о пользователе

**Файл:** `backend/app/repositories/orders_repo.py`

```python
from app.repositories.users_repo import get_user_by_id

# Получаем информацию о пользователе
user = get_user_by_id(user_id)
```

**SQL запрос:**
```sql
SELECT user_id, role, email, first_name, last_name, phone_number, email_verified
FROM users
WHERE user_id = %s;
```

**Получаемые данные:**
- `email` - email адрес пользователя (для отправки письма)
- `first_name` - имя пользователя
- `last_name` - фамилия пользователя
- Другие данные пользователя

**Проверка:**
- Если пользователь не найден или email отсутствует → отправка email пропускается

---

### Шаг 3: Получение адреса доставки

**Файл:** `backend/app/repositories/orders_repo.py`

```python
from app.repositories.addresses_repo import get_address_by_id

# Получаем адрес доставки
address = get_address_by_id(address_id)
```

**SQL запрос:**
```sql
SELECT address_id, user_id, country, city, street, house, apartment, postal_code
FROM addresses
WHERE address_id = %s;
```

**Получаемые данные:**
- `country` - страна
- `city` - город
- `street` - улица
- `house` - дом
- `apartment` - квартира (опционально)
- `postal_code` - почтовый индекс (опционально)

**Проверка:**
- Если адрес не найден → отправка email пропускается

---

### Шаг 4: Формирование имени пользователя

**Файл:** `backend/app/repositories/orders_repo.py`

```python
# Формируем имя пользователя
user_name = None
if user.get('first_name') or user.get('last_name'):
    user_name = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
```

**Результат:**
- Если указаны имя или фамилия → `user_name = "Имя Фамилия"`
- Если не указаны → `user_name = None` (будет использовано общее приветствие)

---

### Шаг 5: Вызов функции отправки email

**Файл:** `backend/app/repositories/orders_repo.py`

```python
from app.utils.email_service import send_order_confirmation_email

# Отправляем email (не блокируем процесс, если не удалось отправить)
email_sent, email_message = send_order_confirmation_email(
    email=user.get('email'),
    order_id=order_id,
    total_price=final_total,
    order_items=order_with_items.get('items', []),
    address=address,
    user_name=user_name
)
```

**Параметры функции:**
- `email` - email адрес пользователя
- `order_id` - номер заказа
- `total_price` - итоговая стоимость заказа
- `order_items` - список товаров в заказе (массив объектов)
- `address` - информация об адресе доставки (словарь)
- `user_name` - имя пользователя (опционально)

**Важно:** Отправка email выполняется в блоке `try-except`, чтобы не прервать процесс создания заказа, если отправка не удалась.

---

### Шаг 6: Проверка настроек SMTP

**Файл:** `backend/app/utils/email_service.py`

Функция проверяет, настроен ли SMTP сервер:

```python
from app.config import settings

# Проверка наличия настроек
if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
    # Режим разработки
    ...
else:
    # Реальная отправка через SMTP
    ...
```

**Настройки из `.env` файла:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ваш-email@gmail.com
SMTP_PASSWORD=ваш-пароль-приложения
EMAIL_FROM=ваш-email@gmail.com
```

---

### Шаг 7A: Режим разработки (SMTP не настроен)

**Если SMTP не настроен**, система работает в режиме разработки:

```python
if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
    print(f"\n{'='*60}")
    print(f"[DEV MODE] Email не настроен - информация о заказе в консоли:")
    print(f"Email: {email}")
    print(f"Order number: #{order_id}")
    print(f"Order total: {total_price:.2f} $")
    print(f"Delivery address: {address.get('country', '')}, {address.get('city', '')}, {address.get('street', '')}, {address.get('house', '')}")
    print(f"Items in order:")
    for item in order_items:
        print(f"  - {item.get('name', '')} (Size: {item.get('size', '')}, Quantity: {item.get('quantity', '')}, Price: {item.get('price_at_purchase', 0)} $)")
    print(f"{'='*60}\n")
    return (True, f"Режим разработки. Информация о заказе в консоли сервера.")
```

**Что происходит:**
1. Вся информация о заказе выводится в консоль сервера
2. Функция возвращает `(True, "Режим разработки...")`
3. Заказ создается успешно, но email не отправляется

**Пример вывода в консоль:**
```
============================================================
[DEV MODE] Email не настроен - информация о заказе в консоли:
Email: user@example.com
Order number: #123
Order total: 299.99 $
Delivery address: Belarus, Minsk, Lenin Street, 10
Items in order:
  - Nike Air Max (Size: 42, Quantity: 1, Price: 150.00 $)
  - Adidas Superstar (Size: 40, Quantity: 2, Price: 149.99 $)
============================================================
```

---

### Шаг 7B: Реальная отправка через SMTP (SMTP настроен)

**Если SMTP настроен**, происходит реальная отправка email:

#### 7.1. Создание сообщения

```python
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Создаем сообщение
msg = MIMEMultipart()
msg['From'] = settings.EMAIL_FROM
msg['To'] = email
msg['Subject'] = f"Order Confirmation #{order_id} - SneakerLab"
```

**Заголовки письма:**
- `From`: Адрес отправителя (из `EMAIL_FROM`)
- `To`: Email получателя (пользователя)
- `Subject`: Тема письма - "Order Confirmation #123 - SneakerLab"

#### 7.2. Формирование адреса доставки

```python
# Формируем адрес доставки
address_parts = [
    address.get('country', ''),
    address.get('city', ''),
    address.get('street', ''),
    address.get('house', '')
]
if address.get('apartment'):
    address_parts.append(f"apt. {address.get('apartment')}")
if address.get('postal_code'):
    address_parts.append(f"postal code: {address.get('postal_code')}")
delivery_address = ", ".join(filter(None, address_parts))
```

**Результат:**
- Пример: `"Belarus, Minsk, Lenin Street, 10, apt. 25, postal code: 220000"`
- Если квартира или индекс не указаны, они не добавляются

#### 7.3. Формирование списка товаров

```python
# Формируем список товаров
items_text = ""
for item in order_items:
    item_name = item.get('name', 'Item')
    item_size = item.get('size', '')
    item_quantity = item.get('quantity', 1)
    item_price = item.get('price_at_purchase', 0)
    items_text += f"\n  • {item_name} (Size: {item_size}, Quantity: {item_quantity}) - {item_price:.2f} $"
```

**Результат:**
```
  • Nike Air Max (Size: 42, Quantity: 1) - 150.00 $
  • Adidas Superstar (Size: 40, Quantity: 2) - 149.99 $
```

#### 7.4. Формирование приветствия

```python
# Обращение к пользователю
greeting = f"Hello, {user_name}!" if user_name else "Hello!"
```

**Результат:**
- Если указано имя: `"Hello, John Doe!"`
- Если имя не указано: `"Hello!"`

#### 7.5. Формирование текста письма

```python
body = f"""
{greeting}

Thank you for your order at SneakerLab!

Your order number: #{order_id}
Order total: {total_price:.2f} $

Items in your order:
{items_text}

Delivery address:
{delivery_address}

Your order has been received and is being processed. We will contact you to confirm and clarify delivery details.

Please expect delivery within 3-5 business days.

You can track your order status in your personal account on our website.

If you have any questions, please contact our support team.

Best regards,
SneakerLab Team
"""

msg.attach(MIMEText(body, 'plain', 'utf-8'))
```

**Содержание письма:**
- Приветствие (с именем, если указано)
- Благодарность за заказ
- **Номер заказа** (#123)
- **Сумма заказа** (299.99 $)
- **Список товаров** с размерами, количеством и ценами
- **Адрес доставки** (полный адрес)
- Информация о обработке заказа
- Сроки доставки (3-5 рабочих дней)
- Информация об отслеживании заказа
- Контакты службы поддержки

#### 7.6. Подключение к SMTP серверу

```python
import smtplib

print(f"[EMAIL] Попытка отправить письмо с подтверждением заказа на {email}...")
server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
```

**Параметры подключения:**
- `SMTP_HOST`: Адрес SMTP сервера (например: `smtp.gmail.com`)
- `SMTP_PORT`: Порт SMTP сервера (обычно `587` для TLS)

#### 7.7. Включение шифрования (TLS)

```python
server.starttls()
print(f"[EMAIL] Подключение к {settings.SMTP_HOST}:{settings.SMTP_PORT}...")
```

**Что делает `starttls()`:**
- Включает шифрование соединения
- Защищает данные от перехвата
- Обязательно для Gmail

#### 7.8. Авторизация на SMTP сервере

```python
server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
print(f"[EMAIL] Авторизация успешна")
```

**Параметры авторизации:**
- `SMTP_USER`: Email адрес для авторизации
- `SMTP_PASSWORD`: Пароль приложения (для Gmail)

#### 7.9. Отправка письма

```python
server.send_message(msg)
server.quit()
print(f"[EMAIL] Письмо с подтверждением заказа успешно отправлено на {email}")
return (True, "Письмо отправлено успешно")
```

**Что происходит:**
1. `send_message(msg)` - отправляет письмо через SMTP сервер
2. `server.quit()` - закрывает соединение
3. Возвращает успешный результат

---

### Шаг 8: Обработка результата

**Файл:** `backend/app/repositories/orders_repo.py`

После вызова функции отправки email:

```python
if email_sent:
    print(f"[ORDER] Email с подтверждением заказа #{order_id} отправлен на {user.get('email')}")
else:
    print(f"[ORDER WARNING] Не удалось отправить email с подтверждением заказа #{order_id}: {email_message}")
```

**Важно:** 
- Если отправка не удалась, заказ все равно считается успешно созданным
- Ошибка только логируется, но не прерывает процесс

---

### Шаг 9: Обработка ошибок

Функция обрабатывает различные типы ошибок:

#### 9.1. Ошибка авторизации SMTP

```python
except smtplib.SMTPAuthenticationError as e:
    error_msg = f"Ошибка авторизации SMTP: {str(e)}. Проверьте SMTP_USER и SMTP_PASSWORD в .env"
    print(f"[EMAIL ERROR] {error_msg}")
    return (False, error_msg)
```

**Причины:**
- Неверный `SMTP_USER` или `SMTP_PASSWORD`
- Для Gmail: используется обычный пароль вместо пароля приложения

#### 9.2. Общая ошибка SMTP

```python
except smtplib.SMTPException as e:
    error_msg = f"Ошибка SMTP: {str(e)}"
    print(f"[EMAIL ERROR] {error_msg}")
    return (False, error_msg)
```

**Причины:**
- Неверный `SMTP_HOST` или `SMTP_PORT`
- Проблемы с сетью
- SMTP сервер недоступен

#### 9.3. Другие ошибки

```python
except Exception as e:
    error_msg = f"Ошибка при отправке email: {str(e)}"
    print(f"[EMAIL ERROR] {error_msg}")
    return (False, error_msg)
```

**Причины:**
- Неожиданные ошибки
- Проблемы с кодировкой
- Другие системные ошибки

---

## Пример полного процесса

### Сценарий 1: Успешная отправка (SMTP настроен)

```
1. Пользователь оформляет заказ
2. Заказ создается в БД (order_id = 123)
3. Получение информации о пользователе:
   - user_id = 1
   - email = "user@example.com"
   - first_name = "John"
   - last_name = "Doe"
4. Получение адреса доставки:
   - country = "Belarus"
   - city = "Minsk"
   - street = "Lenin Street"
   - house = "10"
   - apartment = "25"
5. Формирование имени: "John Doe"
6. Вызов send_order_confirmation_email():
   - email = "user@example.com"
   - order_id = 123
   - total_price = 299.99
   - order_items = [товар1, товар2]
   - address = {country, city, ...}
   - user_name = "John Doe"
7. Проверка: SMTP настроен → продолжение
8. Создание сообщения:
   From: noreply@sneakerlab.com
   To: user@example.com
   Subject: Order Confirmation #123 - SneakerLab
9. Подключение к smtp.gmail.com:587
10. Включение TLS
11. Авторизация: успешно
12. Отправка письма: успешно
13. Возврат: (True, "Письмо отправлено успешно")
14. Пользователь получает email с подтверждением заказа
```

### Сценарий 2: Режим разработки (SMTP не настроен)

```
1. Пользователь оформляет заказ
2. Заказ создается в БД
3. Получение информации о пользователе: успешно
4. Получение адреса доставки: успешно
5. Вызов send_order_confirmation_email()
6. Проверка: SMTP не настроен → режим разработки
7. Вывод в консоль:
   ============================================================
   [DEV MODE] Email не настроен - информация о заказе в консоли:
   Email: user@example.com
   Order number: #123
   Order total: 299.99 $
   Delivery address: Belarus, Minsk, Lenin Street, 10
   Items in order:
     - Nike Air Max (Size: 42, Quantity: 1, Price: 150.00 $)
   ============================================================
8. Возврат: (True, "Режим разработки...")
9. Заказ создан успешно, но email не отправлен
```

### Сценарий 3: Ошибка отправки email

```
1. Пользователь оформляет заказ
2. Заказ создается в БД: успешно
3. Получение информации о пользователе: успешно
4. Получение адреса доставки: успешно
5. Вызов send_order_confirmation_email()
6. Проверка: SMTP настроен → продолжение
7. Подключение к SMTP серверу: успешно
8. Включение TLS: успешно
9. Авторизация: ОШИБКА (неверный пароль)
10. Возврат: (False, "Ошибка авторизации SMTP: ...")
11. Логирование предупреждения в консоль
12. Заказ создан успешно (email не отправлен, но это не критично)
```

---

## Структура письма

### Заголовки

```
From: noreply@sneakerlab.com
To: user@example.com
Subject: Order Confirmation #123 - SneakerLab
Content-Type: text/plain; charset=utf-8
```

### Тело письма

```
Hello, John Doe!

Thank you for your order at SneakerLab!

Your order number: #123
Order total: 299.99 $

Items in your order:
  • Nike Air Max (Size: 42, Quantity: 1) - 150.00 $
  • Adidas Superstar (Size: 40, Quantity: 2) - 149.99 $

Delivery address:
Belarus, Minsk, Lenin Street, 10, apt. 25, postal code: 220000

Your order has been received and is being processed. We will contact you to confirm and clarify delivery details.

Please expect delivery within 3-5 business days.

You can track your order status in your personal account on our website.

If you have any questions, please contact our support team.

Best regards,
SneakerLab Team
```

---

## Логирование процесса

Система выводит подробные логи в консоль сервера:

### Успешная отправка:
```
[ORDER] Email с подтверждением заказа #123 отправлен на user@example.com
[EMAIL] Попытка отправить письмо с подтверждением заказа на user@example.com...
[EMAIL] Подключение к smtp.gmail.com:587...
[EMAIL] Авторизация успешна
[EMAIL] Письмо с подтверждением заказа успешно отправлено на user@example.com
```

### Ошибка:
```
[ORDER WARNING] Не удалось отправить email с подтверждением заказа #123: Ошибка авторизации SMTP: ...
[EMAIL ERROR] Ошибка авторизации SMTP: ...
```

### Режим разработки:
```
============================================================
[DEV MODE] Email не настроен - информация о заказе в консоли:
Email: user@example.com
Order number: #123
Order total: 299.99 $
Delivery address: Belarus, Minsk, Lenin Street, 10
Items in order:
  - Nike Air Max (Size: 42, Quantity: 1, Price: 150.00 $)
============================================================
```

---

## Особенности реализации

### 1. Неблокирующая отправка

Отправка email выполняется в блоке `try-except`, который не прерывает процесс создания заказа:

```python
try:
    # Отправка email
    email_sent, email_message = send_order_confirmation_email(...)
    if email_sent:
        print(f"[ORDER] Email отправлен...")
    else:
        print(f"[ORDER WARNING] Не удалось отправить...")
except Exception as e:
    # Не прерываем процесс создания заказа
    print(f"[ORDER WARNING] Ошибка при отправке email: {str(e)}")
```

**Преимущества:**
- Заказ создается даже если email не удалось отправить
- Пользователь получает подтверждение на сайте
- Ошибки отправки логируются, но не влияют на основной процесс

### 2. Получение данных из разных источников

Для формирования письма используются данные из нескольких таблиц:
- `users` - email и имя пользователя
- `addresses` - адрес доставки
- `orders` - информация о заказе
- `order_items` - товары в заказе

### 3. Форматирование данных

- **Адрес:** Автоматически форматируется с учетом опциональных полей (квартира, индекс)
- **Список товаров:** Формируется циклом с информацией о каждом товаре
- **Имя пользователя:** Объединяется из first_name и last_name

### 4. Режим разработки

В режиме разработки (SMTP не настроен) вся информация выводится в консоль, что удобно для тестирования без настройки email сервера.

---

## Безопасность

1. **Шифрование соединения:** Используется TLS (`starttls()`)
2. **Пароль приложения:** Для Gmail используется специальный пароль, а не основной
3. **Неблокирующая отправка:** Ошибки отправки не влияют на создание заказа
4. **Логирование:** Все ошибки логируются для отладки

---

## Итоговая схема

```
┌─────────────────────────────────┐
│  Создание заказа в БД            │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  COMMIT транзакции              │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Получение информации о заказе  │
│  get_order_by_id(order_id)      │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Получение информации о         │
│  пользователе                    │
│  get_user_by_id(user_id)         │
└──────────────┬──────────────────┘
               │
               ▼
        ┌──────┴──────┐
        │ Пользователь│
        │ найден?     │
        └──────┬──────┘
               │
        ┌──────┴──────┐
        │             │
       ДА            НЕТ
        │             │
        │             ▼
        │   ┌─────────────────────┐
        │   │  Пропуск отправки   │
        │   │  email              │
        │   └─────────────────────┘
        │             │
        │             ▼
        │   ┌─────────────────────┐
        │   │      КОНЕЦ          │
        │   └─────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│  Получение адреса доставки      │
│  get_address_by_id(address_id)  │
└──────────────┬──────────────────┘
               │
               ▼
        ┌──────┴──────┐
        │ Адрес      │
        │ найден?    │
        └──────┬──────┘
               │
        ┌──────┴──────┐
        │             │
       ДА            НЕТ
        │             │
        │             ▼
        │   ┌─────────────────────┐
        │   │  Пропуск отправки   │
        │   │  email              │
        │   └─────────────────────┘
        │             │
        │             ▼
        │   ┌─────────────────────┐
        │   │      КОНЕЦ          │
        │   └─────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│  Формирование имени пользователя│
│  user_name = first_name +       │
│  last_name                       │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  send_order_confirmation_email()│
└──────────────┬──────────────────┘
               │
               ▼
        ┌──────┴──────┐
        │ SMTP        │
        │ настроен?   │
        └──────┬──────┘
               │
        ┌──────┴──────┐
        │             │
       НЕТ           ДА
        │             │
        ▼             ▼
┌──────────────┐  ┌──────────────────┐
│ Вывод в      │  │ Подключение к    │
│ консоль      │  │ SMTP серверу     │
└──────────────┘  └────────┬─────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │ TLS шифрование   │
                    └────────┬─────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │ Авторизация      │
                    └────────┬─────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │ Отправка письма  │
                    └────────┬─────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │ Пользователь     │
                    │ получает email   │
                    └──────────────────┘
```

---

## Резюме

Процесс отправки email с подтверждением заказа включает:

1. **Создание заказа** в базе данных
2. **Получение данных:**
   - Информация о пользователе (email, имя)
   - Адрес доставки
   - Информация о заказе и товарах
3. **Проверку** настроек SMTP
4. **Два режима работы:**
   - Режим разработки (вывод в консоль)
   - Реальная отправка через SMTP
5. **Формирование** письма с полной информацией о заказе
6. **Отправку** через SMTP сервер (Gmail, Mailgun и др.)
7. **Обработку** ошибок без прерывания процесса создания заказа
8. **Логирование** всех операций

Система автоматически переключается между режимами в зависимости от наличия настроек SMTP, что удобно для разработки и продакшена. Ошибки отправки email не влияют на успешность создания заказа.

