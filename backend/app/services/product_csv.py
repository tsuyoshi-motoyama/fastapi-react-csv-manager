import csv
import io
from fastapi import HTTPException
from pydantic import ValidationError

from schemas.product import ProductCreate

def parse_products_csv(content: bytes) -> list[ProductCreate]:
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

    return products

def generate_products_csv(products: list[dict]) -> bytes:
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["id", "name", "price"])

    for product in products:
        writer.writerow([
            product["id"],
            product["name"],
            product["price"]
        ])

    return output.getvalue().encode("utf-8-sig")
