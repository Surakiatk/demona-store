from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# Category Schemas
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str = Field(..., pattern="^(income|expense)$")
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Income Schemas
class IncomeBase(BaseModel):
    amount: float = Field(..., gt=0)
    description: Optional[str] = None
    category_id: int
    date: datetime
    payment_method: Optional[str] = None
    reference: Optional[str] = None
    notes: Optional[str] = None

class IncomeCreate(IncomeBase):
    pass

class IncomeUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    category_id: Optional[int] = None
    date: Optional[datetime] = None
    payment_method: Optional[str] = None
    reference: Optional[str] = None
    notes: Optional[str] = None

class IncomeResponse(IncomeBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: CategoryResponse
    
    class Config:
        from_attributes = True

# Expense Schemas
class ExpenseBase(BaseModel):
    amount: float = Field(..., gt=0)
    description: Optional[str] = None
    category_id: int
    date: datetime
    payment_method: Optional[str] = None
    reference: Optional[str] = None
    vendor: Optional[str] = None
    notes: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    category_id: Optional[int] = None
    date: Optional[datetime] = None
    payment_method: Optional[str] = None
    reference: Optional[str] = None
    vendor: Optional[str] = None
    notes: Optional[str] = None

class ExpenseResponse(ExpenseBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: CategoryResponse
    
    class Config:
        from_attributes = True

# Dashboard Schemas
class DashboardStats(BaseModel):
    total_income: float
    total_expense: float
    net_profit: float
    income_count: int
    expense_count: int
    income_by_category: dict
    expense_by_category: dict
    income_by_month: dict
    expense_by_month: dict

class DateRange(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

