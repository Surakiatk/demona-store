#!/bin/bash

# 🚀 Auto Setup Railway Environment Variables

echo "🚀 กำลังตั้งค่า Railway Environment Variables..."
echo ""

# ตรวจสอบ login
if ! npx railway whoami &> /dev/null; then
    echo "❌ ยังไม่ได้ login: npx railway login"
    exit 1
fi

echo "✅ Login แล้ว!"
echo ""

# ตั้งค่า DATABASE_URL จาก Postgres service
echo "📊 กำลังตั้งค่า DATABASE_URL..."
DB_URL="postgresql://postgres:FlEMRktPpLlZAqBjUDPbYccbOfJvSPyr@shinkansen.proxy.rlwy.net:21545/railway"

npx railway variables --set "DATABASE_URL=$DB_URL" --service demona-backend

if [ $? -eq 0 ]; then
    echo "✅ ตั้งค่า DATABASE_URL สำเร็จ"
else
    echo "❌ เกิดข้อผิดพลาด"
    exit 1
fi

# ตั้งค่า ALLOWED_ORIGINS
echo "🌐 กำลังตั้งค่า ALLOWED_ORIGINS..."
BACKEND_URL="https://demona-backend-production-b5c1.up.railway.app"
ALLOWED_ORIGINS="$BACKEND_URL,http://localhost:3000"

npx railway variables --set "ALLOWED_ORIGINS=$ALLOWED_ORIGINS" --service demona-backend

if [ $? -eq 0 ]; then
    echo "✅ ตั้งค่า ALLOWED_ORIGINS สำเร็จ"
else
    echo "❌ เกิดข้อผิดพลาด"
    exit 1
fi

echo ""
echo "✅ ตั้งค่าเสร็จแล้ว!"
echo ""
echo "📋 ตรวจสอบ:"
npx railway variables --service demona-backend | head -20

echo ""
echo "🎉 Railway จะ auto-deploy ใหม่ภายใน 1-2 นาที"

