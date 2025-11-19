#!/bin/bash

# 🚀 Script สำหรับตั้งค่า Railway Environment Variables ทั้งหมด

echo "🚀 กำลังตั้งค่า Railway Environment Variables..."
echo ""

# ตรวจสอบว่า login แล้วหรือยัง
if ! npx railway whoami &> /dev/null; then
    echo "❌ ยังไม่ได้ login Railway"
    echo "🔐 กรุณา login ก่อน: npx railway login"
    exit 1
fi

echo "✅ Login แล้ว!"
echo ""

# List all services
echo "📋 Services ที่มีอยู่:"
npx railway service 2>&1 | grep -E "Service|Name" || npx railway list 2>&1 | head -10
echo ""

# หา PostgreSQL service
echo "🔍 กำลังหา PostgreSQL service..."
POSTGRES_SERVICE=$(npx railway service 2>&1 | grep -i "postgres" | head -1 | awk '{print $NF}' || echo "Postgres")

if [ -z "$POSTGRES_SERVICE" ]; then
    POSTGRES_SERVICE="Postgres"
fi

echo "📊 PostgreSQL service: $POSTGRES_SERVICE"
echo ""

# Copy DATABASE_URL จาก PostgreSQL
echo "📋 กำลัง copy DATABASE_URL จาก PostgreSQL service..."
DATABASE_URL=$(npx railway variables --service "$POSTGRES_SERVICE" 2>&1 | grep -i "DATABASE_URL\|POSTGRES_URL" | head -1 | awk -F'=' '{print $2}' | tr -d ' ')

if [ -z "$DATABASE_URL" ]; then
    # ลองวิธีอื่น
    DATABASE_URL=$(npx railway variables --service "$POSTGRES_SERVICE" 2>&1 | grep -E "postgresql://|postgres://" | head -1 | awk '{print $NF}')
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ ไม่พบ DATABASE_URL ใน PostgreSQL service"
    echo "📋 กรุณา copy DATABASE_URL จาก Railway Dashboard:"
    echo "   1. ไปที่ PostgreSQL service → Variables"
    echo "   2. Copy DATABASE_URL"
    echo ""
    read -p "📋 วาง DATABASE_URL ที่นี่: " DATABASE_URL
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ ต้องมี DATABASE_URL"
    exit 1
fi

echo "✅ พบ DATABASE_URL: ${DATABASE_URL:0:30}..."
echo ""

# หา Backend URL
echo "🔍 กำลังหา Backend URL..."
BACKEND_URL=$(npx railway domain --service demona-backend 2>&1 | grep -E "https://|http://" | head -1 | awk '{print $NF}')

if [ -z "$BACKEND_URL" ]; then
    echo "⚠️  ไม่พบ Backend URL อัตโนมัติ"
    echo "📋 กรุณา copy Backend URL จาก Railway Dashboard:"
    echo "   1. ไปที่ demona-backend service"
    echo "   2. Copy URL ที่แสดงด้านบน"
    echo ""
    read -p "📋 วาง Backend URL ที่นี่: " BACKEND_URL
fi

if [ -z "$BACKEND_URL" ]; then
    echo "⚠️  ใช้ localhost ชั่วคราว"
    BACKEND_URL="http://localhost:3000"
fi

# ตั้งค่า DATABASE_URL
echo ""
echo "📊 กำลังตั้งค่า DATABASE_URL ใน backend service..."
npx railway variables set DATABASE_URL="$DATABASE_URL" --service demona-backend

if [ $? -eq 0 ]; then
    echo "✅ ตั้งค่า DATABASE_URL สำเร็จ"
else
    echo "❌ เกิดข้อผิดพลาดในการตั้งค่า DATABASE_URL"
    exit 1
fi

# ตั้งค่า ALLOWED_ORIGINS
echo "🌐 กำลังตั้งค่า ALLOWED_ORIGINS..."
ALLOWED_ORIGINS="$BACKEND_URL,http://localhost:3000"
npx railway variables set ALLOWED_ORIGINS="$ALLOWED_ORIGINS" --service demona-backend

if [ $? -eq 0 ]; then
    echo "✅ ตั้งค่า ALLOWED_ORIGINS สำเร็จ"
else
    echo "❌ เกิดข้อผิดพลาดในการตั้งค่า ALLOWED_ORIGINS"
    exit 1
fi

echo ""
echo "✅ ตั้งค่าเสร็จแล้ว!"
echo ""
echo "📋 ตรวจสอบค่าที่ตั้งไว้:"
npx railway variables --service demona-backend

echo ""
echo "🎉 Railway จะ auto-deploy ใหม่ภายใน 1-2 นาที"
echo "📊 ตรวจสอบ Deploy Logs ใน Railway Dashboard"

