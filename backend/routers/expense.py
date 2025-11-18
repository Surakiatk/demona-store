from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime
from database import get_db
from models import Expense, Category
from schemas import ExpenseCreate, ExpenseUpdate, ExpenseResponse

router = APIRouter()

@router.post("/", response_model=ExpenseResponse, status_code=201)
async def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    # ตรวจสอบว่ามี category หรือไม่
    category = db.query(Category).filter(
        and_(Category.id == expense.category_id, Category.type == "expense")
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="ไม่พบหมวดหมู่นี้")
    
    db_expense = Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/", response_model=List[ExpenseResponse])
async def get_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Expense)
    
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)
    if category_id:
        query = query.filter(Expense.category_id == category_id)
    
    expenses = query.order_by(Expense.date.desc()).offset(skip).limit(limit).all()
    return expenses

@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="ไม่พบรายจ่ายนี้")
    return expense

@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: int,
    expense_update: ExpenseUpdate,
    db: Session = Depends(get_db)
):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="ไม่พบรายจ่ายนี้")
    
    update_data = expense_update.dict(exclude_unset=True)
    
    # ตรวจสอบ category ถ้ามีการอัพเดท
    if "category_id" in update_data:
        category = db.query(Category).filter(
            and_(Category.id == update_data["category_id"], Category.type == "expense")
        ).first()
        if not category:
            raise HTTPException(status_code=404, detail="ไม่พบหมวดหมู่นี้")
    
    for field, value in update_data.items():
        setattr(db_expense, field, value)
    
    db_expense.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.delete("/{expense_id}", status_code=204)
async def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="ไม่พบรายจ่ายนี้")
    
    db.delete(db_expense)
    db.commit()
    return None

@router.get("/stats/summary", response_model=dict)
async def get_expense_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Expense)
    
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)
    
    total = db.query(func.sum(Expense.amount)).filter(
        Expense.id.in_([e.id for e in query.all()])
    ).scalar() or 0
    
    count = query.count()
    avg = total / count if count > 0 else 0
    
    return {
        "total": float(total),
        "count": count,
        "average": float(avg)
    }

