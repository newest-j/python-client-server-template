from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.services.user_service import get_all_users
from app.core.security import get_current_user_id

router = APIRouter(
    prefix="/user",
    tags=["Users"]
)

@router.get("/")
def get_user(
    db:Session = Depends(get_db)
):
    return get_all_users(db)

@router.get("/me")
def get_current_user(
    current_user:int = Depends(get_current_user_id)
    
):
    return current_user
