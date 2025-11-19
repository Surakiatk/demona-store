from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import logging

logger = logging.getLogger(__name__)

# รองรับ Railway และ production databases
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

# ถ้า DATABASE_URL ว่างเปล่า
if not DATABASE_URL:
    # ตรวจสอบว่าเป็น production environment หรือไม่ (Railway จะมี PORT)
    is_production = bool(os.getenv("PORT"))
    if is_production:
        logger.error("❌ DATABASE_URL is required in production but not set!")
        logger.error("   Please set DATABASE_URL in Railway Variables")
        raise ValueError("DATABASE_URL environment variable is required in production")
    else:
        # Local development - ใช้ค่า default
        DATABASE_URL = "postgresql://demona_user:demona_password@localhost:5432/demona_store"
        logger.warning("⚠️  DATABASE_URL not set, using default (localhost)")

# ถ้า Railway ใช้ DATABASE_URL แบบอื่น ให้แปลง
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Validate DATABASE_URL
if not DATABASE_URL or not DATABASE_URL.startswith(("postgresql://", "postgres://")):
    logger.error(f"❌ Invalid DATABASE_URL format")
    raise ValueError("DATABASE_URL must be a valid PostgreSQL connection string")

logger.info(f"🔗 Database URL configured: {DATABASE_URL.split('@')[0]}@...")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

