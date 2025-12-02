-- Миграция для добавления подтверждения email
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255);

-- Создаем индекс для быстрого поиска по токену
CREATE INDEX IF NOT EXISTS idx_email_verification_token ON users(email_verification_token);

