from app.database import get_connection


def get_all_products():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT 
            p.product_id,
            p.name,
            p.description,
            p.price,
            b.name AS brand,
            c.name AS category,
            i.image_url
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.brand_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN product_images as i using (product_id)
        ORDER BY p.created_at DESC;
    """
    )

    products = cur.fetchall()
    cur.close()
    conn.close()
    return products
