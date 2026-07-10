import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables securely from .env
load_dotenv()

# Database URL configuration (Defaults cleanly to SQLite)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./finrelief.db")

# Create connection engine optimized for asynchronous concurrent requests
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Active thread guard bypass
)

# Session manager instance parameters
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base ORM declarative tracking class
Base = declarative_base()

def get_db():
    """Database dependency injection session generator."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()