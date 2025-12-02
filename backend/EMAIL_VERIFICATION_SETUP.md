# Настройка подтверждения Email

## Шаги для настройки

### 1. Применить миграцию базы данных

Выполните SQL скрипт для добавления полей подтверждения email:

```bash
psql -U postgres -d shoeses_shop -f migration_add_email_verification.sql
```

Или выполните SQL вручную:
```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_email_verification_token ON users(email_verification_token);
```

### 2. Настройка переменных окружения (опционально)

Для отправки реальных email писем, создайте файл `.env` в папке `backend/` и добавьте настройки:

#### Шаг 1: Создайте файл `.env`

Создайте файл `backend/.env` (если его еще нет) и добавьте следующие строки:

```env
# Database settings (уже должны быть)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shoeses_shop
DB_USER=postgres
DB_PASSWORD=postgre

# SMTP настройки для отправки email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
FRONTEND_URL=http://localhost:5173
```

#### Шаг 2: Настройка Gmail (если используете Gmail)

**Важно:** Gmail требует использования "Пароля приложения" вместо обычного пароля.

1. Войдите в ваш аккаунт Google
2. Перейдите в [Настройки безопасности Google](https://myaccount.google.com/security)
3. Включите **Двухфакторную аутентификацию** (если еще не включена)
4. Перейдите в раздел **"Пароли приложений"** (App passwords)
   - Если не видите этот раздел, поищите в настройках безопасности
5. Выберите приложение: **"Почта"**
6. Выберите устройство: **"Другое (указать название)"** → введите "SneakerLab"
7. Нажмите **"Создать"**
8. Скопируйте сгенерированный 16-символьный пароль (без пробелов)
9. Используйте этот пароль в `SMTP_PASSWORD` в файле `.env`

#### Шаг 3: Заполните настройки в `.env`

Замените в файле `backend/.env`:
- `SMTP_USER` - ваш email адрес Gmail
- `SMTP_PASSWORD` - пароль приложения (16 символов)
- `EMAIL_FROM` - тот же email адрес

**Пример:**
```env
SMTP_USER=myemail@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=myemail@gmail.com
```

**Примечание:** 
- Если SMTP настройки не заданы (оставлены пустыми), система будет работать в режиме разработки и выводить ссылку подтверждения в консоль сервера
- Это удобно для тестирования без настройки email сервера

### 3. Для Gmail

Если используете Gmail, вам нужно:
1. Включить двухфакторную аутентификацию
2. Создать "Пароль приложения" в настройках аккаунта Google
3. Использовать этот пароль приложения в `SMTP_PASSWORD`

### 4. Запуск

После применения миграции и настройки (если нужно), перезапустите backend сервер.

## Как это работает

1. При регистрации пользователя:
   - Генерируется уникальный токен подтверждения
   - Пользователь создается с `email_verified = FALSE`
   - На email отправляется письмо со ссылкой подтверждения

2. Подтверждение email:
   - Пользователь переходит по ссылке из письма
   - Система проверяет токен
   - Если токен валиден, устанавливается `email_verified = TRUE`
   - Токен удаляется из базы данных

3. Режим разработки:
   - Если SMTP не настроен, ссылка подтверждения выводится в консоль сервера
   - Это удобно для разработки без настройки email сервера

