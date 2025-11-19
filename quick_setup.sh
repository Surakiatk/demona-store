#!/bin/bash

# Quick setup script - ต้อง copy DATABASE_URL และ Frontend URL มาก่อน

echo "🚀 Quick Setup Railway Environment Variables"
echo ""

# ตรวจสอบ Railway CLI
if ! command -v railway &> /dev/null; then
    echo "📦 ติดตั้ง Railway CLI..."
    npm install -g @railway/cli
fi

# Login (ถ้ายังไม่ได้ login)
if ! railway whoami &> /dev/null; then
    echo "🔐 Login Railway..."
    railway login
fi

# Link project
cd /Users/saber/Desktop/workshop/Demona_Store
if ! railway status &> /dev/null; then
    echo "🔗 Link project..."
    railway link
fi

echo ""
echo "📋 ต้อง copy ค่าเหล่านี้:"
echo ""
echo "1. DATABASE_URL:"
echo "   → ไปที่ Railway Dashboard"
echo "   → คลิก PostgreSQL service"
echo "   → Variables tab"
echo "   → Copy DATABASE_URL"
echo ""
echo "2. Backend URL (สำหรับ ALLOWED_ORIGINS):"
echo "   → ไปที่ Railway Dashboard"
echo "   → คลิก demona-backend service"
echo "   → Copy URL (เช่น: https://demona-backend-production-xxx.up.railway.app)"
echo ""

read -p "📋 วาง DATABASE_URL ที่นี่: " DB_URL
read -p "📋 วาง Backend URL ที่นี่: " BACKEND_URL

if [ -z "$DB_URL" ] || [ -z "$BACKEND_URL" ]; then
    echo "❌ ต้องใส่ทั้งสองค่า"
    exit 1
fi

# ตั้งค่า DATABASE_URL
echo ""
echo "📊 กำลังตั้งค่า DATABASE_URL..."
railway variables set DATABASE_URL="$DB_URL" --service demona-backend

# ตั้งค่า ALLOWED_ORIGINS
echo "🌐 กำลังตั้งค่า ALLOWED_ORIGINS..."
ALLOWED_ORIGINS="$BACKEND_URL,http://localhost:3000"
railway variables set ALLOWED_ORIGINS="$ALLOWED_ORIGINS" --service demona-backend

echo ""
echo "✅ ตั้งค่าเสร็จแล้ว!"
echo ""
echo "📋 ตรวจสอบ:"
railway variables --service demona-backend

echo ""
echo "🎉 Railway จะ auto-deploy ใหม่ภายใน 1-2 นาที"

