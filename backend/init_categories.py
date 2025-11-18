"""
Script to initialize default categories in the database
Run this after the database is set up
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Category
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://demona_user:demona_password@localhost:5432/demona_store")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Default categories
default_categories = [
    # Income categories
    {"name": "ขายสินค้า", "type": "income", "description": "รายได้จากการขายสินค้า"},
    {"name": "ขายบริการ", "type": "income", "description": "รายได้จากการให้บริการ"},
    {"name": "รายได้อื่นๆ", "type": "income", "description": "รายได้อื่นๆ"},
    
    # Expense categories
    {"name": "ซื้อสินค้า", "type": "expense", "description": "ค่าใช้จ่ายในการซื้อสินค้า"},
    {"name": "ค่าเช่า", "type": "expense", "description": "ค่าเช่าร้าน/สถานที่"},
    {"name": "ค่าไฟฟ้า", "type": "expense", "description": "ค่าใช้จ่ายไฟฟ้า"},
    {"name": "ค่าน้ำ", "type": "expense", "description": "ค่าใช้จ่ายน้ำ"},
    {"name": "ค่าโทรศัพท์/อินเทอร์เน็ต", "type": "expense", "description": "ค่าโทรศัพท์และอินเทอร์เน็ต"},
    {"name": "เงินเดือน", "type": "expense", "description": "ค่าใช้จ่ายเงินเดือนพนักงาน"},
    {"name": "ค่าส่งของ", "type": "expense", "description": "ค่าใช้จ่ายในการส่งของ"},
    {"name": "ค่าโฆษณา", "type": "expense", "description": "ค่าใช้จ่ายในการโฆษณา"},
    {"name": "ค่าซ่อมแซม", "type": "expense", "description": "ค่าใช้จ่ายในการซ่อมแซม"},
    {"name": "ค่าใช้จ่ายอื่นๆ", "type": "expense", "description": "ค่าใช้จ่ายอื่นๆ"},
]

def init_categories():
    db = SessionLocal()
    try:
        # Check if categories already exist
        existing_count = db.query(Category).count()
        if existing_count > 0:
            print(f"พบหมวดหมู่ {existing_count} รายการอยู่แล้ว ข้ามการสร้างหมวดหมู่เริ่มต้น")
            return
        
        # Create default categories
        for cat_data in default_categories:
            category = Category(**cat_data)
            db.add(category)
        
        db.commit()
        print(f"สร้างหมวดหมู่เริ่มต้น {len(default_categories)} รายการเรียบร้อยแล้ว")
    except Exception as e:
        db.rollback()
        print(f"เกิดข้อผิดพลาด: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_categories()

