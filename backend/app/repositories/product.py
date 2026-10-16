from psycopg.rows import dict_row
from database import get_connection
from schemas.product import ProductCreate

def create_product(product: ProductCreate):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO products (name, price)
                VALUES (%s, %s)
                RETURNING id
                """,
                (product.name, product.price)
            )

            product_id = cur.fetchone()[0]

    return {
        "id": product_id,
        "name": product.name,
        "price": product.price
    }

def search_products(name: str = ""):
    with get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT id, name, price, created_at
                FROM products
                WHERE name ILIKE %s
                ORDER BY id DESC
                """,
                (f"%{name}%",)
            )
            products = cur.fetchall()

    return products