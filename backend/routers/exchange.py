from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from datetime import datetime, timedelta
import os

router = APIRouter()

# Cache สำหรับอัตราแลกเปลี่ยน (อัพเดททุก 1 ชั่วโมง)
exchange_rate_cache = {
    "rate": None,
    "last_updated": None,
    "cache_duration": timedelta(hours=1)
}

class ExchangeRateResponse(BaseModel):
    thb_to_usd: float
    usd_to_thb: float
    last_updated: str
    base_currency: str = "THB"
    target_currency: str = "USD"

async def fetch_exchange_rate():
    """ดึงอัตราแลกเปลี่ยนจาก API"""
    try:
        # ใช้ exchangerate-api.com (ฟรี, ไม่ต้องใช้ API key)
        async with httpx.AsyncClient(timeout=10.0) as client:
            # ดึงอัตราแลกเปลี่ยน THB to USD
            response = await client.get(
                "https://api.exchangerate-api.com/v4/latest/THB"
            )
            if response.status_code == 200:
                data = response.json()
                thb_to_usd = data["rates"].get("USD", 0.027)  # Default ถ้าไม่มี
                usd_to_thb = 1 / thb_to_usd if thb_to_usd > 0 else 36.5
                return {
                    "thb_to_usd": thb_to_usd,
                    "usd_to_thb": usd_to_thb,
                    "last_updated": datetime.utcnow().isoformat()
                }
    except Exception as e:
        print(f"Error fetching exchange rate: {e}")
    
    # Fallback: ใช้อัตราเริ่มต้นถ้า API ไม่ทำงาน
    return {
        "thb_to_usd": 0.027,  # ประมาณ 1 THB = 0.027 USD
        "usd_to_thb": 36.5,   # ประมาณ 1 USD = 36.5 THB
        "last_updated": datetime.utcnow().isoformat()
    }

@router.get("/rate", response_model=ExchangeRateResponse)
async def get_exchange_rate():
    """ดึงอัตราแลกเปลี่ยนปัจจุบัน"""
    now = datetime.utcnow()
    
    # ตรวจสอบ cache
    if (exchange_rate_cache["rate"] is None or 
        exchange_rate_cache["last_updated"] is None or
        now - exchange_rate_cache["last_updated"] > exchange_rate_cache["cache_duration"]):
        # ดึงอัตราใหม่
        rate_data = await fetch_exchange_rate()
        exchange_rate_cache["rate"] = rate_data
        exchange_rate_cache["last_updated"] = now
    
    rate_data = exchange_rate_cache["rate"]
    return ExchangeRateResponse(
        thb_to_usd=rate_data["thb_to_usd"],
        usd_to_thb=rate_data["usd_to_thb"],
        last_updated=rate_data["last_updated"]
    )

@router.get("/convert")
async def convert_currency(amount: float, from_currency: str = "THB", to_currency: str = "USD"):
    """แปลงสกุลเงิน"""
    if from_currency == to_currency:
        return {"amount": amount, "currency": from_currency}
    
    rate_data = await get_exchange_rate()
    
    if from_currency == "THB" and to_currency == "USD":
        converted = amount * rate_data.thb_to_usd
    elif from_currency == "USD" and to_currency == "THB":
        converted = amount * rate_data.usd_to_thb
    else:
        raise HTTPException(
            status_code=400,
            detail="รองรับเฉพาะ THB และ USD"
        )
    
    return {
        "original_amount": amount,
        "original_currency": from_currency,
        "converted_amount": round(converted, 2),
        "converted_currency": to_currency,
        "rate": rate_data.thb_to_usd if from_currency == "THB" else rate_data.usd_to_thb
    }

