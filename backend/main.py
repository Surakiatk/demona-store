from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import income, expense, dashboard, categories, exchange
from sqlalchemy import text
import logging

# ตั้งค่า logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# สร้างตารางในฐานข้อมูล (พร้อม error handling)
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

app = FastAPI(
    title="Demona Store API",
    description="ระบบจัดการรายรับรายจ่ายสำหรับร้านค้า",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    import os
    port = os.getenv("PORT", "8000")
    logger.info("=" * 50)
    logger.info("🚀 Starting Demona Store API")
    logger.info(f"📍 Port: {port}")
    logger.info(f"🔗 DATABASE_URL exists: {bool(os.getenv('DATABASE_URL'))}")
    logger.info(f"🌐 ALLOWED_ORIGINS: {os.getenv('ALLOWED_ORIGINS', 'Not set')}")
    logger.info("=" * 50)

# ตั้งค่า CORS
import os

# อนุญาต origins จาก environment variable หรือใช้ค่า default
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# รวม routers
app.include_router(income.router, prefix="/api/income", tags=["รายรับ"])
app.include_router(expense.router, prefix="/api/expense", tags=["รายจ่าย"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(categories.router, prefix="/api/categories", tags=["หมวดหมู่"])
app.include_router(exchange.router, prefix="/api/exchange", tags=["อัตราแลกเปลี่ยน"])

@app.get("/")
async def root():
    return {"message": "Demona Store API - ระบบจัดการรายรับรายจ่าย"}

@app.get("/api/health")
async def health_check():
    """Health check endpoint for Railway - always returns 200 immediately"""
    # Return 200 immediately without checking database
    # This ensures Railway healthcheck passes even if database is not ready
    return {"status": "healthy", "service": "running"}

