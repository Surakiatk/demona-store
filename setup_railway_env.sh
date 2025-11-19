#!/bin/bash

# 🚀 Script สำหรับตั้งค่า Environment Variables ใน Railway
# ใช้ Railway CLI เพื่อตั้งค่าอัตโนมัติ

echo "🚀 กำลังตั้งค่า Railway Environment Variables..."
echo ""

# ตรวจสอบว่า Railway CLI ติดตั้งแล้วหรือยัง
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI ยังไม่ได้ติดตั้ง"
    echo "📦 กำลังติดตั้ง Railway CLI..."
    npm install -g @railway/cli
    echo "✅ ติดตั้งเสร็จแล้ว"
    echo ""
fi

# ตรวจสอบว่า login แล้วหรือยัง
echo "🔐 ตรวจสอบการ login..."
if ! railway whoami &> /dev/null; then
    echo "⚠️  ยังไม่ได้ login"
    echo "🔑 กำลังเปิด browser เพื่อ login..."
    railway login
    echo ""
fi

# Link project (ถ้ายังไม่ได้ link)
echo "🔗 ตรวจสอบการ link project..."
if ! railway status &> /dev/null; then
    echo "⚠️  ยังไม่ได้ link project"
    echo "🔗 กำลัง link project..."
    railway link
    echo ""
fi

# ตั้งค่า DATABASE_URL
echo "📊 กำลังตั้งค่า DATABASE_URL..."
echo "⚠️  ต้อง copy DATABASE_URL จาก PostgreSQL service ใน Railway Dashboard"
echo "   ไปที่: PostgreSQL service → Variables → Copy DATABASE_URL"
read -p "📋 วาง DATABASE_URL ที่นี่: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ ไม่มี DATABASE_URL"
    exit 1
fi

railway variables set DATABASE_URL="$DATABASE_URL" --service demona-backend
echo "✅ ตั้งค่า DATABASE_URL แล้ว"
echo ""

# ตั้งค่า ALLOWED_ORIGINS
echo "🌐 กำลังตั้งค่า ALLOWED_ORIGINS..."
echo "⚠️  ต้องใส่ Frontend URL"
echo "   ถ้ายังไม่ได้ deploy frontend → ใช้ Backend URL ชั่วคราว"
read -p "📋 ใส่ Frontend URL (หรือ Backend URL ชั่วคราว): " FRONTEND_URL

if [ -z "$FRONTEND_URL" ]; then
    echo "⚠️  ไม่มี Frontend URL → ใช้ localhost"
    FRONTEND_URL="http://localhost:3000"
fi

ALLOWED_ORIGINS="$FRONTEND_URL,http://localhost:3000"
railway variables set ALLOWED_ORIGINS="$ALLOWED_ORIGINS" --service demona-backend
echo "✅ ตั้งค่า ALLOWED_ORIGINS = $ALLOWED_ORIGINS"
echo ""

# ตรวจสอบค่าที่ตั้งไว้
echo "✅ ตั้งค่าเสร็จแล้ว!"
echo ""
echo "📋 ตรวจสอบค่าที่ตั้งไว้:"
railway variables --service demona-backend

echo ""
echo "🎉 เสร็จแล้ว! Railway จะ auto-deploy ใหม่"
echo "📊 ตรวจสอบ Deploy Logs ใน Railway Dashboard"

