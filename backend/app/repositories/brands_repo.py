from app.database import get_connection


def get_all_brands():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT 
           * from brands;
    """
    )

    products = cur.fetchall()    
    cur.close()
    conn.close()
    return products
