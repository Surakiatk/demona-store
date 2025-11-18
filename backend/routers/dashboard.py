from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, and_
from typing import Optional
from datetime import datetime, timedelta
from database import get_db
from models import Income, Expense, Category
from schemas import DashboardStats

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db)
):
    # ตั้งค่า default date range (30 วันล่าสุด)
    if not end_date:
        end_date = datetime.utcnow()
    if not start_date:
        start_date = end_date - timedelta(days=30)
    
    # คำนวณรายรับทั้งหมด
    income_query = db.query(Income).filter(
        and_(Income.date >= start_date, Income.date <= end_date)
    )
    total_income = db.query(func.sum(Income.amount)).filter(
        Income.id.in_([i.id for i in income_query.all()])
    ).scalar() or 0
    income_count = income_query.count()
    
    # คำนวณรายจ่ายทั้งหมด
    expense_query = db.query(Expense).filter(
        and_(Expense.date >= start_date, Expense.date <= end_date)
    )
    total_expense = db.query(func.sum(Expense.amount)).filter(
        Expense.id.in_([e.id for e in expense_query.all()])
    ).scalar() or 0
    expense_count = expense_query.count()
    
    # คำนวณกำไรสุทธิ
    net_profit = float(total_income) - float(total_expense)
    
    # รายรับแยกตามหมวดหมู่
    income_by_category = {}
    income_categories = db.query(
        Category.name,
        func.sum(Income.amount).label('total')
    ).join(Income).filter(
        and_(Income.date >= start_date, Income.date <= end_date)
    ).group_by(Category.name).all()
    
    for cat_name, total in income_categories:
        income_by_category[cat_name] = float(total)
    
    # รายจ่ายแยกตามหมวดหมู่
    expense_by_category = {}
    expense_categories = db.query(
        Category.name,
        func.sum(Expense.amount).label('total')
    ).join(Expense).filter(
        and_(Expense.date >= start_date, Expense.date <= end_date)
    ).group_by(Category.name).all()
    
    for cat_name, total in expense_categories:
        expense_by_category[cat_name] = float(total)
    
    # รายรับแยกตามเดือน
    income_by_month = {}
    income_months = db.query(
        extract('year', Income.date).label('year'),
        extract('month', Income.date).label('month'),
        func.sum(Income.amount).label('total')
    ).filter(
        and_(Income.date >= start_date, Income.date <= end_date)
    ).group_by(
        extract('year', Income.date),
        extract('month', Income.date)
    ).all()
    
    for year, month, total in income_months:
        key = f"{int(year)}-{int(month):02d}"
        income_by_month[key] = float(total)
    
    # รายจ่ายแยกตามเดือน
    expense_by_month = {}
    expense_months = db.query(
        extract('year', Expense.date).label('year'),
        extract('month', Expense.date).label('month'),
        func.sum(Expense.amount).label('total')
    ).filter(
        and_(Expense.date >= start_date, Expense.date <= end_date)
    ).group_by(
        extract('year', Expense.date),
        extract('month', Expense.date)
    ).all()
    
    for year, month, total in expense_months:
        key = f"{int(year)}-{int(month):02d}"
        expense_by_month[key] = float(total)
    
    return DashboardStats(
        total_income=float(total_income),
        total_expense=float(total_expense),
        net_profit=net_profit,
        income_count=income_count,
        expense_count=expense_count,
        income_by_category=income_by_category,
        expense_by_category=expense_by_category,
        income_by_month=income_by_month,
        expense_by_month=expense_by_month
    )

@router.get("/recent-transactions")
async def get_recent_transactions(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    # ดึงรายรับล่าสุด
    recent_incomes = db.query(Income).order_by(Income.date.desc()).limit(limit).all()
    
    # ดึงรายจ่ายล่าสุด
    recent_expenses = db.query(Expense).order_by(Expense.date.desc()).limit(limit).all()
    
    # รวมและเรียงตามวันที่
    transactions = []
    
    for income in recent_incomes:
        transactions.append({
            "id": income.id,
            "type": "income",
            "amount": income.amount,
            "description": income.description,
            "category": income.category.name,
            "date": income.date,
            "payment_method": income.payment_method
        })
    
    for expense in recent_expenses:
        transactions.append({
            "id": expense.id,
            "type": "expense",
            "amount": expense.amount,
            "description": expense.description,
            "category": expense.category.name,
            "date": expense.date,
            "payment_method": expense.payment_method
        })
    
    # เรียงตามวันที่ล่าสุด
    transactions.sort(key=lambda x: x["date"], reverse=True)
    
    return transactions[:limit]

