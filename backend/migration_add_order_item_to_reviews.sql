-- Миграция: добавление поля order_item_id в таблицу reviews
-- Это позволит привязывать отзывы к конкретным элементам заказа,
-- а не только к товару в целом

-- Добавляем поле order_item_id (опциональное, для обратной совместимости)
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS order_item_id INTEGER REFERENCES order_items(order_item_id) ON DELETE SET NULL;

-- Создаем индекс для быстрого поиска отзывов по order_item_id
CREATE INDEX IF NOT EXISTS idx_reviews_order_item_id ON reviews(order_item_id);

-- Комментарий к полю
COMMENT ON COLUMN reviews.order_item_id IS 'ID элемента заказа, к которому относится отзыв. Если NULL, отзыв относится ко всему товару в целом.';

