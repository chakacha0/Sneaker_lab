# Настройка системы истории операций с продуктами

## Описание

Система истории операций автоматически логирует все изменения в таблице `products` (INSERT, UPDATE, DELETE) в таблицу `products_history`.

## Структура таблицы products_history

Таблица `products_history` содержит следующие столбцы:

- `history_id` - Уникальный идентификатор записи истории (SERIAL PRIMARY KEY)
- `operation_date` - Дата и время операции (TIMESTAMP, по умолчанию CURRENT_TIMESTAMP)
- `operation_type` - Тип операции: 'INSERT', 'UPDATE', 'DELETE' (VARCHAR(10))
- `old_value` - Старое значение записи в формате JSON (JSONB, NULL для INSERT)
- `new_value` - Новое значение записи в формате JSON (JSONB, NULL для DELETE)
- `username` - Имя пользователя, совершившего операцию (VARCHAR(255))
- `product_id` - ID продукта для удобства поиска (INTEGER)

## Установка

1. Выполните миграцию SQL:
```bash
psql -U postgres -d shoeses_shop -f migration_products_history.sql
```

Или выполните SQL-скрипт напрямую в вашей базе данных.

## Как это работает

### Автоматическое логирование

Триггеры автоматически срабатывают при выполнении операций:
- **INSERT** - записывает новое значение в `new_value`, `old_value` = NULL
- **UPDATE** - записывает старое значение в `old_value` и новое в `new_value`
- **DELETE** - записывает старое значение в `old_value`, `new_value` = NULL

### Определение имени пользователя

Имя пользователя определяется следующим образом:
1. Если в функции репозитория передан параметр `username`, он устанавливается в переменную сессии PostgreSQL
2. Если `username` не передан, используется `current_user` (имя пользователя БД)

### Использование в коде

Функции в `products_repo.py` поддерживают опциональный параметр `username`:

```python
# Создание продукта с указанием пользователя
create_product(
    name="Кроссовки",
    price=5000,
    username="admin@example.com"  # Опционально
)

# Обновление продукта
update_product(
    product_id=1,
    price=4500,
    username="admin@example.com"  # Опционально
)

# Удаление продукта
delete_product(
    product_id=1,
    username="admin@example.com"  # Опционально
)
```

Если `username` не указан, будет использоваться имя пользователя БД (`current_user`).

## Просмотр истории

### Все операции
```sql
SELECT * FROM products_history ORDER BY operation_date DESC;
```

### Операции по конкретному продукту
```sql
SELECT * FROM products_history 
WHERE product_id = 1 
ORDER BY operation_date DESC;
```

### Операции конкретного типа
```sql
SELECT * FROM products_history 
WHERE operation_type = 'UPDATE' 
ORDER BY operation_date DESC;
```

### Операции конкретного пользователя
```sql
SELECT * FROM products_history 
WHERE username = 'admin@example.com' 
ORDER BY operation_date DESC;
```

### Детальный просмотр изменений (UPDATE)
```sql
SELECT 
    operation_date,
    operation_type,
    username,
    product_id,
    old_value->>'name' as old_name,
    new_value->>'name' as new_name,
    old_value->>'price' as old_price,
    new_value->>'price' as new_price
FROM products_history
WHERE operation_type = 'UPDATE'
ORDER BY operation_date DESC;
```

## Индексы

Для оптимизации запросов созданы следующие индексы:
- `idx_products_history_product_id` - по `product_id`
- `idx_products_history_operation_date` - по `operation_date`
- `idx_products_history_operation_type` - по `operation_type`
- `idx_products_history_username` - по `username`

## Примечания

- Все операции логируются автоматически через триггеры
- Данные хранятся в формате JSON для гибкости
- История сохраняется даже при удалении продукта
- Переменная сессии `app.username` устанавливается только для текущей транзакции




