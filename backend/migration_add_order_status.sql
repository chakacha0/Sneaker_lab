-- Order status for admin and customer views
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'processing';

COMMENT ON COLUMN orders.status IS 'processing | assembled | handed_to_delivery | delivered | cancelled';
