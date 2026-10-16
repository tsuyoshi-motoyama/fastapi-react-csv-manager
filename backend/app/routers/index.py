from fastapi import APIRouter

router = APIRouter(tags=['index'])

@router.get("/")
def index():
    return {
        "message" : "FastAPI CSV Manager",
        "status" : "Runnning!!"
    }