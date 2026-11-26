from sqlalchemy.orm import Session
from app.models.user import User

def get_all_users(db:Session):
    return db.query(User).all();

def get_user_by_id(db:Session, user_id:int):
    return db.get(User, user_id)