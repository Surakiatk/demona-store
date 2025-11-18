from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    type = Column(String(20), nullable=False)  # 'income' or 'expense'
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    incomes = relationship("Income", back_populates="category")
    expenses = relationship("Expense", back_populates="category")

class Income(Base):
    __tablename__ = "incomes"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    payment_method = Column(String(50), nullable=True)  # เงินสด, โอนเงิน, บัตรเครดิต
    reference = Column(String(100), nullable=True)  # เลขที่อ้างอิง
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    category = relationship("Category", back_populates="incomes")

class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    payment_method = Column(String(50), nullable=True)  # เงินสด, โอนเงิน, บัตรเครดิต
    reference = Column(String(100), nullable=True)  # เลขที่อ้างอิง
    vendor = Column(String(100), nullable=True)  # ผู้ขาย/ผู้ให้บริการ
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    category = relationship("Category", back_populates="expenses")

