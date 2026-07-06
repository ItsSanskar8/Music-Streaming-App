"""SQLAlchemy engine, session factory and declarative Base for Nova."""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Defaults to a local SQLite file; override with DATABASE_URL in deployment
# (e.g. a Postgres URL on Render). check_same_thread=False is a SQLite-only
# flag that lets FastAPI's threadpool workers share the connection safely.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nova.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a scoped DB session and closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
