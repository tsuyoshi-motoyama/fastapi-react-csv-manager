from psycopg.rows import dict_row
from database import get_connection
from schemas.product import ProductCreate

def create_product(product: ProductCreate, user_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO products (name, price, user_id)
                VALUES (%s, %s, %s)
                RETURNING id
                """,
                (product.name, product.price, user_id)
            )

            product_id = cur.fetchone()[0]

    return {
        "id": product_id,
        "name": product.name,
        "price": product.price
    }

def create_products(products: list[ProductCreate], user_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            for product in products:
                cur.execute(
                    """
                    INSERT INTO products (name, price, user_id)
                    VALUES (%s, %s, %s)
                    """,
                    (product.name, product.price, user_id)
                )
    return {"registered_count": len(products)}

def search_products(name: str = "", user_id: int = None):
    with get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT id, name, price, created_at
                FROM products
                WHERE user_id = %s
                  AND name ILIKE %s
                ORDER BY id DESC
                """,
                (user_id, f"%{name}%")
            )
            products = cur.fetchall()

    return products