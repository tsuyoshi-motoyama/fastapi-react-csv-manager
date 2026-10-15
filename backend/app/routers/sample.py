from fastapi import APIRouter
from schemas.sample import MessageRequest

router = APIRouter()

@router.get("/hello")
def hello():
    return {"message": "Hello from FastAPI Router"}

@router.post("/hello")
def post_hello(request: MessageRequest):
    return {"message": f"Received: {request}"}