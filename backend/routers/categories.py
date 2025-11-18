from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Category
from schemas import CategoryCreate, CategoryResponse

router = APIRouter()

@router.post("/", response_model=CategoryResponse, status_code=201)
async def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    # ตรวจสอบว่ามีชื่อซ้ำหรือไม่
    existing = db.query(Category).filter(Category.name == category.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="มีหมวดหมู่นี้อยู่แล้ว")
    
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/", response_model=List[CategoryResponse])
async def get_categories(
    type: str = None,  # 'income' or 'expense'
    db: Session = Depends(get_db)
):
    query = db.query(Category)
    if type:
        query = query.filter(Category.type == type)
    
    categories = query.order_by(Category.name).all()
    return categories

@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="ไม่พบหมวดหมู่นี้")
    return category

@router.delete("/{category_id}", status_code=204)
async def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="ไม่พบหมวดหมู่นี้")
    
    # ตรวจสอบว่ามีการใช้หมวดหมู่นี้หรือไม่
    from models import Income, Expense
    income_count = db.query(Income).filter(Income.category_id == category_id).count()
    expense_count = db.query(Expense).filter(Expense.category_id == category_id).count()
    
    if income_count > 0 or expense_count > 0:
        raise HTTPException(
            status_code=400,
            detail="ไม่สามารถลบหมวดหมู่นี้ได้ เนื่องจากมีการใช้งานอยู่"
        )
    
    db.delete(category)
    db.commit()
    return None

