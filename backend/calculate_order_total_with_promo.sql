-- Скалярная функция для расчета итоговой стоимости заказа после применения промокода
-- 
-- Параметры:
--   p_order_total - исходная стоимость заказа (NUMERIC)
--   p_promo_code - код промокода (VARCHAR) или NULL
--
-- Возвращает:
--   NUMERIC - итоговая стоимость заказа после применения скидки
--   Если промокод недействителен или не указан, возвращает исходную стоимость
--
-- Пример использования:
--   SELECT calculate_order_total_with_promo(5000.00, 'SUMMER2024');
--   SELECT calculate_order_total_with_promo(5000.00, NULL);

CREATE OR REPLACE FUNCTION calculate_order_total_with_promo(
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

-- Комментарий к функции
COMMENT ON FUNCTION calculate_order_total_with_promo(NUMERIC, VARCHAR) IS 
'Вычисляет итоговую стоимость заказа после применения промокода. 
Проверяет валидность промокода (даты, лимит использований, минимальная сумма заказа).
Применяет процентную или фиксированную скидку. Возвращает исходную стоимость, если промокод недействителен.';

-- Примеры использования:
-- 
-- 1. Заказ на 5000 рублей с промокодом на 10% скидку:
--    SELECT calculate_order_total_with_promo(5000.00, 'SUMMER10');
--    Результат: 4500.00
--
-- 2. Заказ на 3000 рублей с промокодом на 500 рублей скидки:
--    SELECT calculate_order_total_with_promo(3000.00, 'DISCOUNT500');
--    Результат: 2500.00
--
-- 3. Заказ на 1000 рублей с промокодом, требующим минимум 2000 рублей:
--    SELECT calculate_order_total_with_promo(1000.00, 'MIN2000');
--    Результат: 1000.00 (промокод не применен)
--
-- 4. Заказ без промокода:
--    SELECT calculate_order_total_with_promo(5000.00, NULL);
--    Результат: 5000.00
--
-- 5. Использование в запросе с таблицей заказов:
--    SELECT 
--        order_id,
--        order_total,
--        promo_code,
--        calculate_order_total_with_promo(order_total, promo_code) AS final_total
--    FROM orders;
