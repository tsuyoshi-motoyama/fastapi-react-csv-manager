from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.products import router as products_router
from routers.health import router as health_router
from routers.index import router as index_router
from routers.users import router as users_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"]
)

app.include_router(products_router)
app.include_router(health_router)
app.include_router(index_router)
app.include_router(users_router)
