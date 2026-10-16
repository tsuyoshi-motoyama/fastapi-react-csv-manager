from fastapi import APIRouter
from schemas.product import ProductCreate
from repositories import product as product_repository

router = APIRouter(prefix="/products", tags=["products"])

@router.post("")
def create_product(product: ProductCreate):
    return product_repository.create_product(product)

@router.get("")
def search_product(name: str = ""):
    return product_repository.search_products(name)