-- Миграция для добавления полей description и country в таблицу brands
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS country VARCHAR(100);





