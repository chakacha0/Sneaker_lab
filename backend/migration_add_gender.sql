-- Миграция для добавления поля gender в таблицу products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS gender VARCHAR(20);

-- Добавляем CHECK ограничение для gender (мужские, женские, унисекс)
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_gender_check;

ALTER TABLE products 
ADD CONSTRAINT products_gender_check 
CHECK (gender IS NULL OR gender IN ('male', 'female', 'unisex'));

-- Комментарий к колонке
COMMENT ON COLUMN products.gender IS 'Пол: male - мужские, female - женские, unisex - унисекс';


