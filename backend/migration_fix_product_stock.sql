-- Миграция для изменения ограничения quantity в product_stock
-- Разрешаем quantity = 0 (товар может быть отсутствующим)

ALTER TABLE product_stock 
DROP CONSTRAINT IF EXISTS product_stock_quantity_check;

ALTER TABLE product_stock 
ADD CONSTRAINT product_stock_quantity_check CHECK (quantity >= 0);


