"""SQLAlchemy engine, session factory and declarative Base for Nova."""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# SQLite lives next to the backend. check_same_thread=False lets FastAPI's
# threadpool workers share the connection safely for our read/write patterns.
DATABASE_URL = "sqlite:///./nova.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
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
