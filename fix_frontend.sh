#!/bin/bash

# 🔧 Fix Frontend Deployment Issues

echo "🔧 กำลังแก้ไขปัญหา Frontend..."
echo ""

# ตรวจสอบ login
if ! npx railway whoami &> /dev/null; then
    echo "❌ ยังไม่ได้ login: npx railway login"
    exit 1
fi

echo "✅ Login แล้ว!"
echo ""

# ตรวจสอบ Root Directory
echo "📋 ตรวจสอบ Root Directory..."
echo "⚠️  ต้องตรวจสอบใน Railway Dashboard:"
echo "   1. ไปที่ demona-frontend service → Settings"
echo "   2. ตรวจสอบ Root Directory = 'frontend'"
echo "   3. ถ้าไม่ใช่ → เปลี่ยนเป็น 'frontend' แล้ว Save"
echo ""

# ตรวจสอบ VITE_API_URL
echo "📋 ตรวจสอบ VITE_API_URL..."
VITE_API_URL=$(npx railway variables --service demona-frontend 2>&1 | grep -i "VITE_API_URL" -A 2 | tail -2 | tr -d '│║' | tr '\n' '' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')

if [ -z "$VITE_API_URL" ]; then
    echo "⚠️  VITE_API_URL ไม่ถูกตั้งค่า"
    echo "📊 กำลังตั้งค่า VITE_API_URL..."
    npx railway variables --set "VITE_API_URL=https://demona-backend-production-b5c1.up.railway.app" --service demona-frontend
    echo "✅ ตั้งค่า VITE_API_URL แล้ว"
else
    echo "✅ VITE_API_URL: $VITE_API_URL"
fi

echo ""
echo "✅ ตรวจสอบเสร็จแล้ว!"
echo ""
echo "📋 ขั้นตอนถัดไป:"
echo "   1. ตรวจสอบ Root Directory ใน Railway Dashboard = 'frontend'"
echo "   2. รอ Railway auto-deploy (1-2 นาที)"
echo "   3. ตรวจสอบ Deploy Logs → ควรเห็น build สำเร็จ"
echo "   4. ทดสอบ Frontend URL"

