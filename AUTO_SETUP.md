# 🚀 ตั้งค่า Railway Environment Variables อัตโนมัติ

## ขั้นตอน (3 นาที)

### 1. Login Railway (ครั้งเดียว)

รันคำสั่งนี้:
```bash
cd /Users/saber/Desktop/workshop/Demona_Store
npx railway login
```

- จะเปิด browser ให้ login
- Login เสร็จแล้วกลับมาที่ terminal

---

### 2. รัน Setup Script

```bash
./setup_env.sh
```

Script จะถาม:
1. **DATABASE_URL** - Copy จาก PostgreSQL service → Variables → DATABASE_URL
2. **Backend URL** - Copy จาก demona-backend service (URL ที่แสดงด้านบน)

---

### 3. เสร็จแล้ว!

Railway จะ auto-deploy ใหม่ภายใน 1-2 นาที

---

## 📋 วิธี Copy ค่า

### DATABASE_URL:
1. ไปที่ Railway Dashboard
2. คลิก **PostgreSQL service** (ไม่ใช่ backend!)
3. คลิกแท็บ **Variables**
4. Copy `DATABASE_URL`

### Backend URL:
1. ไปที่ Railway Dashboard
2. คลิก **demona-backend service**
3. Copy URL ที่แสดงด้านบน (เช่น: `https://demona-backend-production-xxx.up.railway.app`)

---

## ✅ ตรวจสอบ

หลังจาก deploy ใหม่:
1. ไปที่ Railway Dashboard → demona-backend → Deployments
2. ดู deployment ล่าสุด → View Logs
3. ควรเห็น:
   - ✅ `Starting server on port XXX`
   - ✅ `DATABASE_URL exists: True`
   - ✅ Healthcheck ผ่าน

