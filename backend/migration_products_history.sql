-- Миграция для создания таблицы истории продуктов (products_history)
-- и триггеров для автоматического логирования операций

-- Создание таблицы products_history
CREATE TABLE IF NOT EXISTS products_history (
    history_id SERIAL PRIMARY KEY,
    operation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    operation_type VARCHAR(10) NOT NULL CHECK (operation_type IN ('INSERT', 'UPDATE', 'DELETE')),
    old_value JSONB,
    new_value JSONB,
    username VARCHAR(255) NOT NULL,
    product_id INTEGER
);

-- Комментарии к столбцам
COMMENT ON TABLE products_history IS 'Журнал операций с таблицей products';
COMMENT ON COLUMN products_history.history_id IS 'Уникальный идентификатор записи истории';
COMMENT ON COLUMN products_history.operation_date IS 'Дата и время операции';
COMMENT ON COLUMN products_history.operation_type IS 'Тип операции: INSERT, UPDATE, DELETE';
COMMENT ON COLUMN products_history.old_value IS 'Старое значение записи (JSON)';
COMMENT ON COLUMN products_history.new_value IS 'Новое значение записи (JSON)';
COMMENT ON COLUMN products_history.username IS 'Имя пользователя, совершившего операцию';
COMMENT ON COLUMN products_history.product_id IS 'ID продукта (для удобства поиска)';

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_products_history_product_id ON products_history(product_id);
CREATE INDEX IF NOT EXISTS idx_products_history_operation_date ON products_history(operation_date);
CREATE INDEX IF NOT EXISTS idx_products_history_operation_type ON products_history(operation_type);
CREATE INDEX IF NOT EXISTS idx_products_history_username ON products_history(username);

-- Функция для получения имени пользователя из переменной сессии или current_user
CREATE OR REPLACE FUNCTION get_operation_username() RETURNS VARCHAR(255) AS $$
BEGIN
    -- Пытаемся получить имя пользователя из переменной сессии
    -- Если переменная не установлена, используем current_user
    RETURN COALESCE(
        current_setting('app.username', TRUE),
        current_user
    );
END;
$$ LANGUAGE plpgsql;

-- Функция для логирования операций INSERT
CREATE OR REPLACE FUNCTION log_product_insert() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO products_history (
        operation_date,
        operation_type,
        old_value,
        new_value,
        username,
        product_id
    ) VALUES (
        CURRENT_TIMESTAMP,
        'INSERT',
        NULL, -- При INSERT нет старого значения
        row_to_json(NEW), -- Новое значение в формате JSON
        get_operation_username(),
        NEW.product_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Функция для логирования операций UPDATE
CREATE OR REPLACE FUNCTION log_product_update() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO products_history (
        operation_date,
        operation_type,
        old_value,
        new_value,
        username,
        product_id
    ) VALUES (
        CURRENT_TIMESTAMP,
        'UPDATE',
        row_to_json(OLD), -- Старое значение в формате JSON
        row_to_json(NEW), -- Новое значение в формате JSON
        get_operation_username(),
        NEW.product_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Функция для логирования операций DELETE
CREATE OR REPLACE FUNCTION log_product_delete() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO products_history (
        operation_date,
        operation_type,
        old_value,
        new_value,
        username,
        product_id
    ) VALUES (
        CURRENT_TIMESTAMP,
        'DELETE',
        row_to_json(OLD), -- Старое значение в формате JSON
        NULL, -- При DELETE нет нового значения
        get_operation_username(),
        OLD.product_id
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Создание триггеров
DROP TRIGGER IF EXISTS trigger_product_insert ON products;
CREATE TRIGGER trigger_product_insert
    AFTER INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION log_product_insert();

DROP TRIGGER IF EXISTS trigger_product_update ON products;
CREATE TRIGGER trigger_product_update
    AFTER UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION log_product_update();

DROP TRIGGER IF EXISTS trigger_product_delete ON products;
CREATE TRIGGER trigger_product_delete
    AFTER DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION log_product_delete();

-- Комментарии к функциям и триггерам
COMMENT ON FUNCTION get_operation_username() IS 'Получает имя пользователя из переменной сессии app.username или использует current_user';
COMMENT ON FUNCTION log_product_insert() IS 'Логирует операции INSERT в таблице products';
COMMENT ON FUNCTION log_product_update() IS 'Логирует операции UPDATE в таблице products';
COMMENT ON FUNCTION log_product_delete() IS 'Логирует операции DELETE в таблице products';
