from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import sample
from database import get_connection
from pydantic import BaseModel
from psycopg.rows import dict_row

class ProductCreate(BaseModel):
    name: str
    price: int

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"]
)

app.include_router(sample.router, prefix="/api")

@app.get("/")
def index():
    return {"message": "FastAPI Docker Compose OK"}

@app.get("/db-check")
def db_check():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT version()")
            version = cur.fetchone()[0]

    return {
        "database": "connected",
        "version": version
    }

@app.post('/products')
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

@app.get("/products")
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