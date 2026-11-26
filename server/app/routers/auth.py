from fastapi import APIRouter, Depends,Response, HTTPException,Request
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.schemas.auth import LoginRequest
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import register_user, login_user
from app.core.security import (
    CSRF_TOKEN_MAX_AGE,
    create_access_token,
    create_csrf_token,
    create_refresh_token,
    decode_token,
    require_csrf_token,
)


router = APIRouter(
    prefix= "/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_csrf_token),
):
    return register_user(db,user);

@router.get("/csrf")
def csrf(response: Response):
    response.set_cookie(
        key="csrf_token",
        value=create_csrf_token(),
        httponly=False,
        secure=False,
        samesite="lax",
        max_age=CSRF_TOKEN_MAX_AGE,
        path="/",
    )
    return {"message": "CSRF token issued"}

@router.post("/login")
def login(
    data:LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
    _: None = Depends(require_csrf_token),
):
    result =  login_user(db,data)

    response.set_cookie(
        key="access_token",
        value= result["access_token"],
        httponly=True,
        secure=False,
        samesite= "lax",
        max_age= 15 * 60,
        path="/",
    )

    response.set_cookie(
        key="refresh_token",
        value=result["refresh_token"],
        httponly=True,
        secure=False,     
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/",
    )
    response.set_cookie(
        key="csrf_token",
        value=create_csrf_token(),
        httponly=False,
        secure=False,
        samesite="lax",
        max_age=CSRF_TOKEN_MAX_AGE,
        path="/",
    )

    return {
        "message":"Login successful",
        "user":{
            "id": result["user"].id,
            "name": result["user"].name,
            "email": result["user"].email,

        }
    }

@router.post("/logout")
def logout(response:Response, _: None = Depends(require_csrf_token)):
    response.delete_cookie(
        key="access_token",
        path="/",
    )
    response.delete_cookie(
        key="refresh_token",
        path="/",
        )
    response.delete_cookie(key="csrf_token", path="/")
    return {
        "message": "Logout successful"
    }

@router.post("/refresh")
def refresh(
        request:Request,
        response:Response,
        _: None = Depends(require_csrf_token),
):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(
            status_code=401,
            detail="refresh token missing"
        )

    payload = decode_token(refresh_token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token"
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Invalid token type"
        )

    user_id = int(payload["sub"])

    new_access_token = create_access_token(user_id)
    new_refresh_token = create_refresh_token(user_id)

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=15 * 60,
        path="/",
    )

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/",
    )
    response.set_cookie(
        key="csrf_token",
        value=create_csrf_token(),
        httponly=False,
        secure=False,
        samesite="lax",
        max_age=CSRF_TOKEN_MAX_AGE,
        path="/",
    )

    return {
        "message": "Token refreshed"
    }
