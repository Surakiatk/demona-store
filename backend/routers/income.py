from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime, timedelta
from database import get_db
from models import Income, Category
from schemas import IncomeCreate, IncomeUpdate, IncomeResponse

router = APIRouter()

@router.post("/", response_model=IncomeResponse, status_code=201)
async def create_income(income: IncomeCreate, db: Session = Depends(get_db)):
    # ตรวจสอบว่ามี category หรือไม่
    category = db.query(Category).filter(
        and_(Category.id == income.category_id, Category.type == "income")
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="ไม่พบหมวดหมู่นี้")
    
    db_income = Income(**income.dict())
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

@router.get("/", response_model=List[IncomeResponse])
async def get_incomes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Income)
    
    if start_date:
        query = query.filter(Income.date >= start_date)
    if end_date:
        query = query.filter(Income.date <= end_date)
    if category_id:
        query = query.filter(Income.category_id == category_id)
    
    incomes = query.order_by(Income.date.desc()).offset(skip).limit(limit).all()
    return incomes

@router.get("/{income_id}", response_model=IncomeResponse)
async def get_income(income_id: int, db: Session = Depends(get_db)):
    income = db.query(Income).filter(Income.id == income_id).first()
    if not income:
        raise HTTPException(status_code=404, detail="ไม่พบรายรับนี้")
    return income

@router.put("/{income_id}", response_model=IncomeResponse)
async def update_income(
    income_id: int,
    income_update: IncomeUpdate,
    db: Session = Depends(get_db)
):
    db_income = db.query(Income).filter(Income.id == income_id).first()
    if not db_income:
        raise HTTPException(status_code=404, detail="ไม่พบรายรับนี้")
    
    update_data = income_update.dict(exclude_unset=True)
    
    # ตรวจสอบ category ถ้ามีการอัพเดท
    if "category_id" in update_data:
        category = db.query(Category).filter(
            and_(Category.id == update_data["category_id"], Category.type == "income")
        ).first()
        if not category:
            raise HTTPException(status_code=404, detail="ไม่พบหมวดหมู่นี้")
    
    for field, value in update_data.items():
        setattr(db_income, field, value)
    
    db_income.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_income)
    return db_income

@router.delete("/{income_id}", status_code=204)
async def delete_income(income_id: int, db: Session = Depends(get_db)):
    db_income = db.query(Income).filter(Income.id == income_id).first()
    if not db_income:
        raise HTTPException(status_code=404, detail="ไม่พบรายรับนี้")
    
    db.delete(db_income)
    db.commit()
    return None

@router.get("/stats/summary", response_model=dict)
async def get_income_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Income)
    
    if start_date:
        query = query.filter(Income.date >= start_date)
    if end_date:
        query = query.filter(Income.date <= end_date)
    
    total = db.query(func.sum(Income.amount)).filter(
        Income.id.in_([i.id for i in query.all()])
    ).scalar() or 0
    
    count = query.count()
    avg = total / count if count > 0 else 0
    
    return {
        "total": float(total),
        "count": count,
        "average": float(avg)
    }

