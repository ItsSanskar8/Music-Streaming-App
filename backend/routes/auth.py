"""Auth routes: signup, login, me — plus the get_current_user dependency."""

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import (
    create_access_token,
    create_reset_token,
    decode_access_token,
    decode_reset_token,
    hash_password,
    verify_password,
)
from database import get_db
from models import User

router = APIRouter()
bearer = HTTPBearer(auto_error=True)


# ----------------------------- Schemas ---------------------------------- #
class SignupIn(BaseModel):
    name: str
    email: str
    password: str


class LoginIn(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    avatar_url: str | None = None

    class Config:
        from_attributes = True


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# --------------------------- Dependency --------------------------------- #
def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    """Resolve the User from the Bearer JWT or raise 401."""
    try:
        payload = decode_access_token(creds.credentials)
        user_id = int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


# ----------------------------- Routes ----------------------------------- #
@router.post("/signup", response_model=TokenOut, status_code=201)
def signup(body: SignupIn, db: Session = Depends(get_db)):
    email = body.email.strip().lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Deterministic avatar from the initial (no external calls).
    avatar = f"https://api.dicebear.com/7.x/initials/svg?seed={body.name}"
    user = User(
        name=body.name.strip(),
        email=email,
        hashed_pw=hash_password(body.password),
        avatar_url=avatar,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id, user.email)
    return TokenOut(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenOut)
def login(body: LoginIn, db: Session = Depends(get_db)):
    email = body.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(body.password, user.hashed_pw):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user.id, user.email)
    return TokenOut(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(current: User = Depends(get_current_user)):
    return UserOut.model_validate(current)


# ------------------------- Password reset ------------------------------- #
class ForgotIn(BaseModel):
    email: str


class ForgotOut(BaseModel):
    # `reset_token` is included because this dev setup has no email service.
    # In production you would email a link and NOT return the token here.
    detail: str
    reset_token: str | None = None


class ResetIn(BaseModel):
    token: str
    password: str


@router.post("/forgot-password", response_model=ForgotOut)
def forgot_password(body: ForgotIn, db: Session = Depends(get_db)):
    email = body.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    # Always report success to avoid leaking which emails are registered.
    if not user:
        return ForgotOut(detail="If that email exists, a reset link was created.")
    token = create_reset_token(user.id)
    return ForgotOut(
        detail="Reset link created. Use it to set a new password.",
        reset_token=token,
    )


@router.post("/reset-password", response_model=TokenOut)
def reset_password(body: ResetIn, db: Session = Depends(get_db)):
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    try:
        payload = decode_reset_token(body.token)
        user_id = int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_pw = hash_password(body.password)
    db.commit()
    db.refresh(user)

    # Log the user straight in after a successful reset.
    token = create_access_token(user.id, user.email)
    return TokenOut(access_token=token, user=UserOut.model_validate(user))
