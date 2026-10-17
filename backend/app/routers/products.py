from fastapi import APIRouter, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
from schemas.product import ProductCreate
from repositories import product as product_repository

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
    text = content.decode("utf-8-sig")

    reader = csv.DictReader(io.StringIO(text))
    # ヘッダーの検証
    if reader.fieldnames != ["name", "price"]:
        raise HTTPException(
            status_code=422,
            detail="CSVのヘッダーは name,price にしてください"
        )
    products = []

    for row_number, row in enumerate(reader, start=2):
        try:
            product = ProductCreate.model_validate(row)
            products.append(product)
        except ValidationError as e:
            raise HTTPException(
                status_code=422,
                detail={
                    "row": row_number,
                    "errors": e.errors()
                }
            )

    if not products:
        raise HTTPException(
            status_code=422,
            detail="CSVに商品データがありません"
        )
    
    result = product_repository.create_products(products)

    return {
        "filename": file.filename,
        "registered_count": result["registered_count"]
    }

@router.get("/download")
def download_products():
    products = product_repository.search_products("")

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["id", "name", "price"])

    for product in products:
        writer.writerow([
            product["id"],
            product["name"],
            product["price"]
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue().encode("utf-8-sig")]),
        media_type="text/csv; charset=utf-8",
        headers={
             "Content-Disposition": 'attachment; filename="products.csv"'
        }
    )