from fastapi import APIRouter
from repositories import health as health_repository

router = APIRouter(tags=["health"])

@router.get("/db-check")
def db_check():
    version = health_repository.check_database()
    
    return {
        "database": "connected",
        "version": version
    }