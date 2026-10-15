from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import sample

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)

app.include_router(sample.router, prefix="/api")

@app.get("/")
def index():
    return {"message": "FastAPI Docker Compose OK"}

