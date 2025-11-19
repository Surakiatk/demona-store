#!/bin/bash

# 🚀 Script สำหรับตั้งค่า Railway Environment Variables
# ใช้หลังจาก login Railway แล้ว

echo "🚀 กำลังตั้งค่า Railway Environment Variables..."
echo ""

# ตรวจสอบว่า login แล้วหรือยัง
if ! npx railway whoami &> /dev/null; then
    echo "❌ ยังไม่ได้ login Railway"
    echo "🔐 กรุณา login ก่อน:"
    echo "   npx railway login"
    echo ""
    echo "   (จะเปิด browser ให้ login)"
    exit 1
fi

echo "✅ Login แล้ว!"
echo ""

# Link project (ถ้ายังไม่ได้ link)
if ! npx railway status &> /dev/null; then
    echo "🔗 กำลัง link project..."
    npx railway link
    echo ""
fi

echo "📋 ต้อง copy ค่าเหล่านี้จาก Railway Dashboard:"
echo ""
echo "1. DATABASE_URL:"
echo "   → ไปที่ Railway Dashboard"
echo "   → คลิก PostgreSQL service"
echo "   → Variables tab"
echo "   → Copy DATABASE_URL"
echo ""
echo "2. Backend URL:"
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

# ตรวจสอบ format
if [[ ! "$DB_URL" =~ ^postgresql:// ]]; then
    echo "⚠️  警告: DATABASE_URL ควรเริ่มด้วย postgresql://"
    read -p "ดำเนินการต่อหรือไม่? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        exit 1
    fi
fi

# ตั้งค่า DATABASE_URL
echo ""
echo "📊 กำลังตั้งค่า DATABASE_URL..."
npx railway variables set DATABASE_URL="$DB_URL" --service demona-backend

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

