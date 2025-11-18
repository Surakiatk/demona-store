from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# รองรับ Railway และ production databases
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://demona_user:demona_password@localhost:5432/demona_store")

# ถ้า Railway ใช้ DATABASE_URL แบบอื่น ให้แปลง
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

