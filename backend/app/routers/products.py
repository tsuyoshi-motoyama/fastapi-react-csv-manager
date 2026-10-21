from fastapi import APIRouter, File, UploadFile, Depends
from fastapi.responses import StreamingResponse
from schemas.product import ProductCreate
from repositories import product as product_repository
from services.product_csv import parse_products_csv, generate_products_csv
from dependencies.auth import get_current_user

router = APIRouter(prefix="/products", tags=["products"])

@router.post("")
def create_product(
        product: ProductCreate,
        current_user = Depends(get_current_user)
    ):
    return product_repository.create_product(product, current_user["id"])

@router.get("")
def search_product(
        name: str = "",
        current_user = Depends(get_current_user)
    ):
    return product_repository.search_products(name, current_user["id"])

@router.post("/upload")
async def upload_products(
        file: UploadFile = File(...),
        current_user = Depends(get_current_user)
    ):
    content = await file.read()

    products = parse_products_csv(content)
    result = product_repository.create_products(products, current_user["id"])

    return {
        "filename": file.filename,
        "registered_count": result["registered_count"]
    }

@router.get("/download")
def download_products(current_user = Depends(get_current_user)):
    products = product_repository.search_products("", current_user["id"])
    content = generate_products_csv(products)
    
    return StreamingResponse(
        iter([content]),
        media_type="text/csv; charset=utf-8",
        headers={
             "Content-Disposition": 'attachment; filename="products.csv"'
        }
    )