"""Password hashing (bcrypt) and JWT encode/decode helpers."""

import datetime
import os

import bcrypt
import jwt

# Loaded from the environment in production (set SECRET_KEY on Render). The
# fallback is for local dev only — never rely on it for a deployed service,
# since rotating it invalidates every issued token.
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-only-for-local")
ALGORITHM = "HS256"
TOKEN_TTL_DAYS = 7


def hash_password(password: str) -> str:
    """Hash a plaintext password. bcrypt caps input at 72 bytes."""
    pw_bytes = password.encode("utf-8")[:72]
    return bcrypt.hashpw(pw_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8")[:72], hashed.encode("utf-8"))
    except ValueError:
        return False


def create_access_token(user_id: int, email: str) -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=TOKEN_TTL_DAYS),
        "iat": datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decode a JWT. Raises jwt.PyJWTError on invalid/expired tokens."""
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


# --------------------------- Password reset ----------------------------- #
# Short-lived, single-purpose JWTs. No email infrastructure here (dev setup),
# so /forgot-password returns the token directly for the reset page to consume.
RESET_TTL_MINUTES = 30


def create_reset_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "type": "reset",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=RESET_TTL_MINUTES),
        "iat": datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_reset_token(token: str) -> dict:
    """Decode a reset JWT and ensure it is a reset-purpose token."""
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    if payload.get("type") != "reset":
        raise jwt.InvalidTokenError("Not a reset token")
    return payload
