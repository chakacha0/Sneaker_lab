-- Миграция для замены токена на код подтверждения
-- Если поле email_verification_token существует, переименовываем его
ALTER TABLE users 
RENAME COLUMN email_verification_token TO verification_code;

-- Если колонка не существовала, создаем новую
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_code VARCHAR(10);

-- Обновляем индекс
DROP INDEX IF EXISTS idx_email_verification_token;
CREATE INDEX IF NOT EXISTS idx_verification_code ON users(verification_code);


