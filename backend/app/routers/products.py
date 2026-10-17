from fastapi import APIRouter, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
from schemas.product import ProductCreate
from repositories import product as product_repository
from services.product_csv import parse_products_csv, generate_products_csv

import csv
import io
from pydantic import ValidationError

router = APIRouter(prefix="/products", tags=["products"])

@router.post("")
def create_product(product: ProductCreate):
    return product_repository.create_product(product)

@router.get("")
def search_product(name: str = ""):
    return product_repository.search_products(name)

@router.post("/upload")
async def upload_products(file: UploadFile = File(...)):
    content = await file.read()

    products = parse_products_csv(content)
    result = product_repository.create_products(products)

    return {
        "filename": file.filename,
        "registered_count": result["registered_count"]
    }

@router.get("/download")
def download_products():
    products = product_repository.search_products("")
    content = generate_products_csv(products)
    
    return StreamingResponse(
        iter([content]),
        media_type="text/csv; charset=utf-8",
        headers={
             "Content-Disposition": 'attachment; filename="products.csv"'
        }
    )