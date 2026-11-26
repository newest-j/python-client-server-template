from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User
from app.schemas.auth import LoginRequest
from app.schemas.user import UserCreate
from app.core.security import hash_password, verify_password,create_access_token,create_refresh_token

def register_user(db:Session, data:UserCreate):

    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )
    
    hashed_password = hash_password(data.password)

    user = User(
        name = data.name,
        email = data.email,
        password = hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return  user;

def login_user(db:Session, data:LoginRequest):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    return {
        "user": user,
        "access_token":access_token,
        "refresh_token": refresh_token,
    }