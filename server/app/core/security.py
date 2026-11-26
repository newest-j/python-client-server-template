from pwdlib import PasswordHash
import jwt
from app.core.config import settings
from datetime import datetime, timedelta, timezone
import secrets
from fastapi import Cookie, Header, HTTPException

password_hash = PasswordHash.recommended()
SECRET_KEY = settings.jwt_secret_key

if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is not cofigured");

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7
CSRF_TOKEN_MAX_AGE = 7 * 24 * 60 * 60


def create_csrf_token() -> str:
     return secrets.token_urlsafe(32)


def require_csrf_token(
          csrf_cookie: str | None = Cookie(default=None, alias="csrf_token"),
          csrf_header: str | None = Header(default=None, alias="X-CSRF-Token"),
):
     if (
          not csrf_cookie
          or not csrf_header
          or not secrets.compare_digest(csrf_cookie, csrf_header)
     ):
          raise HTTPException(
               status_code=403,
               detail="Invalid or missing CSRF token"
          )


def hash_password(password:str) -> str:
    return password_hash.hash(password);

def verify_password(password:str, hashed_password:str) ->bool:
    return password_hash.verify(password, hashed_password);

def create_access_token(user_id:int)->str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTTES)
    payload = {
        "sub":str(user_id),
        "type":"access",
        "exp": expires,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    );

def create_refresh_token(user_id:int)->str:
        expires = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

        payload = {
        "sub": str(user_id),
        "type": "refresh",
        "exp": expires,
    }
        return jwt.encode(
             payload,
             SECRET_KEY,
             algorithm=ALGORITHM
        );

def decode_token(token:str):
     try:
          return jwt.decode(
               token,
               SECRET_KEY,
               algorithms=[ALGORITHM]
          )
     except jwt.PyJWTError:
          return None


def get_current_user_id(
          token: str | None = Cookie(default=None, alias="access_token"),
):
     if not token:
          raise HTTPException(
               status_code=401,
               detail="Access token missing"
          )

     payload = decode_token(token)

     if not payload:
          raise HTTPException(
               status_code=401,
               detail="Invalid or expired token"
          )
     if payload.get("type") != "access":
          raise HTTPException(
               status_code=401,
               detail="Invalid access token"
          )  
     user_id = payload.get("sub")   
     if not user_id:
          raise HTTPException(
               status_code=401,
               detail="Invalid token"
          )   
     return int(user_id)
    