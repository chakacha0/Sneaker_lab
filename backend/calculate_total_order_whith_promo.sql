-- ===========================
--   TABLE: Orders
-- ===========================
CREATE TABLE orders (
    order_id    SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(user_id),
    address_id  INTEGER REFERENCES addresses(address_id),
    promo_id    INTEGER REFERENCES promo_codes(promo_id),
    /* order_status VARCHAR(20) NOT NULL 
        CHECK (order_status IN ('created','paid','shipped','delivered','cancelled')),*/
    total_price NUMERIC(10,2) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ===========================
--   TABLE: OrderItems
-- ===========================
CREATE TABLE order_items (
    order_item_id    SERIAL PRIMARY KEY,
    order_id         INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id       INTEGER REFERENCES products(product_id),
    size          INTEGER,
    quantity         INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC(10,2) NOT NULL
);



CREATE FUNCTION calculate_order_total_with_promo(
    p_order_total NUMERIC(10,2),
    p_promo_code VARCHAR(50) DEFAULT NULL
)
RETURNS NUMERIC(10,2) AS $$
DECLARE
    v_promo RECORD;
    v_discount_amount NUMERIC(10,2) := 0;
    v_final_total NUMERIC(10,2);
    v_current_date DATE := CURRENT_DATE;
BEGIN
    -- Если промокод не указан, возвращаем исходную стоимость
    IF p_promo_code IS NULL OR p_promo_code = '' THEN
        RETURN p_order_total;
    END IF;
    
    -- Если исходная стоимость <= 0, возвращаем 0
    IF p_order_total <= 0 THEN
        RETURN 0;
    END IF;
    
    -- Получаем информацию о промокоде
    SELECT 
        promo_id,
        code,
        discount_percent,
        discount_amount,
        valid_from,
        valid_to,
        min_order_price,
        usage_limit,
        used_count
    INTO v_promo
    FROM promo_codes
    WHERE code = UPPER(TRIM(p_promo_code));
    
    -- Если промокод не найден, возвращаем исходную стоимость
    IF NOT FOUND THEN
        RETURN p_order_total;
    END IF;
    
    -- Проверка минимальной суммы заказа
    IF v_promo.min_order_price IS NOT NULL AND p_order_total < v_promo.min_order_price THEN
        RETURN p_order_total; -- Промокод не применим, возвращаем исходную стоимость
    END IF;
    
    -- Проверка периода действия (valid_from)
    IF v_promo.valid_from IS NOT NULL AND v_current_date < v_promo.valid_from THEN
        RETURN p_order_total; -- Промокод еще не действует
    END IF;
    
    -- Проверка периода действия (valid_to)
    IF v_promo.valid_to IS NOT NULL AND v_current_date > v_promo.valid_to THEN
        RETURN p_order_total; -- Промокод истек
    END IF;
    
    -- Проверка лимита использований
    IF v_promo.usage_limit IS NOT NULL AND v_promo.used_count >= v_promo.usage_limit THEN
        RETURN p_order_total; -- Лимит использований исчерпан
    END IF;
    
    -- Вычисляем скидку
    IF v_promo.discount_percent IS NOT NULL THEN
        -- Процентная скидка
        v_discount_amount := (p_order_total * v_promo.discount_percent) / 100;
        
        -- Ограничиваем скидку максимальной суммой заказа (не может быть отрицательной)
        IF v_discount_amount > p_order_total THEN
            v_discount_amount := p_order_total;
        END IF;
        
    ELSIF v_promo.discount_amount IS NOT NULL THEN
        -- Фиксированная сумма скидки
        v_discount_amount := v_promo.discount_amount;
        
        -- Скидка не может превышать стоимость заказа
        IF v_discount_amount > p_order_total THEN
            v_discount_amount := p_order_total;
        END IF;
    ELSE
        -- Нет скидки (не должно произойти, но на всякий случай)
        RETURN p_order_total;
    END IF;
    
    -- Вычисляем итоговую стоимость
    v_final_total := p_order_total - v_discount_amount;
    
    -- Итоговая стоимость не может быть отрицательной
    IF v_final_total < 0 THEN
        v_final_total := 0;
    END IF;
    
    -- Округляем до 2 знаков после запятой
    RETURN ROUND(v_final_total, 2);
    
EXCEPTION
    WHEN OTHERS THEN
        -- В случае ошибки возвращаем исходную стоимость
        RETURN p_order_total;
END;
$$ LANGUAGE plpgsql IMMUTABLE;