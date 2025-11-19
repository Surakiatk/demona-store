# 🚀 คู่มือตั้งค่า Railway Environment Variables (แบบละเอียด)

## ⚠️ สิ่งที่ต้องทำ (5 นาที)

### ขั้นตอนที่ 1: Copy DATABASE_URL (2 นาที)

1. **เปิด Railway Dashboard:**
   - ไปที่ https://railway.app
   - Login (ถ้ายังไม่ได้ login)

2. **หา PostgreSQL Service:**
   - ใน project ของคุณ จะมี service ชื่อ `Postgres` หรือ `PostgreSQL`
   - **คลิกที่ service นี้** (ไม่ใช่ backend service!)

3. **Copy DATABASE_URL:**
   - คลิกแท็บ **"Variables"** (แท็บที่ 2)
   - หา `DATABASE_URL` หรือ `POSTGRES_URL`
   - **คลิกที่ค่า** → จะมีปุ่ม copy ปรากฏ
   - **Copy** ค่านั้น
   - ตัวอย่าง: `postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:5432/railway`

---

### ขั้นตอนที่ 2: Copy Backend URL (1 นาที)

1. **หา Backend Service:**
   - ใน project เดียวกัน หา service ชื่อ `demona-backend`
   - **คลิกที่ service นี้**

2. **Copy URL:**
   - ดูที่ด้านบน จะมี URL แสดงอยู่
   - ตัวอย่าง: `demona-backend-production-xxx.up.railway.app`
   - **Copy URL ทั้งหมด** (รวม `https://` ด้วย)
   - ตัวอย่าง: `https://demona-backend-production-xxx.up.railway.app`

---

### ขั้นตอนที่ 3: ตั้งค่าใน Backend Service (2 นาที)

1. **ไปที่ Backend Service Variables:**
   - ยังอยู่ใน `demona-backend` service
   - คลิกแท็บ **"Variables"** (แท็บที่ 2)

2. **แก้ไข DATABASE_URL:**
   - หา `DATABASE_URL` ในรายการ
   - **คลิกที่ค่า** → จะมีช่องแก้ไข
   - **ลบค่าเก่าทั้งหมด** (ลบ: `postgresql://demona_user:demona_password@db:5432/demona_store`)
   - **วางค่าใหม่** (ค่าที่ copy จาก PostgreSQL service)
   - **คลิก ✓ (checkmark)** เพื่อ Save

3. **แก้ไข ALLOWED_ORIGINS:**
   - หา `ALLOWED_ORIGINS` ในรายการ
   - **คลิกที่ค่า** → จะมีช่องแก้ไข
   - **ลบค่าเก่าทั้งหมด** (ลบ: `https://your-frontend.onrender.com,http://localhost:3000`)
   - **ใส่ค่าใหม่:** `<Backend URL>,http://localhost:3000`
     - ตัวอย่าง: `https://demona-backend-production-xxx.up.railway.app,http://localhost:3000`
   - **คลิก ✓ (checkmark)** เพื่อ Save

4. **เสร็จแล้ว!**
   - Railway จะ auto-deploy ใหม่ภายใน 1-2 นาที
   - ไปตรวจสอบที่ **Deployments** tab

---

## ✅ ตรวจสอบว่าถูกต้องหรือไม่

### DATABASE_URL ต้องมีลักษณะ:
- ✅ เริ่มด้วย `postgresql://`
- ✅ มี hostname เป็น `.railway.app` (เช่น: `containers-us-west-xxx.railway.app`)
- ❌ **ไม่ใช่** `db:5432` หรือ `localhost:5432`

### ALLOWED_ORIGINS ต้องมีลักษณะ:
- ✅ มี Backend URL จริง (เช่น: `https://demona-backend-production-xxx.up.railway.app`)
- ✅ มี `http://localhost:3000` สำหรับ development
- ❌ **ไม่ใช่** `your-frontend.onrender.com` หรือ placeholder อื่นๆ

---

## 📸 ตัวอย่างค่าที่ถูกต้อง

### DATABASE_URL:
```
postgresql://postgres:AbCdEf123456@containers-us-west-123.railway.app:5432/railway
```

### ALLOWED_ORIGINS:
```
https://demona-backend-production-b5c1.up.railway.app,http://localhost:3000
```

---

## 🔍 ตรวจสอบ Deploy Logs

หลังจาก deploy ใหม่:

1. ไปที่ **Deployments** tab
2. คลิก deployment ล่าสุด
3. คลิก **"View Logs"** หรือ **"Deploy Logs"**
4. ควรเห็น:
   - ✅ `Starting server on port XXX`
   - ✅ `DATABASE_URL exists: True`
   - ✅ `Database tables created successfully`
   - ✅ Healthcheck ผ่าน

---

## ❓ ถ้ายังมีปัญหา

### ปัญหา: Healthcheck ยังล้มเหลว
- ตรวจสอบว่า DATABASE_URL ถูกต้อง (copy จาก PostgreSQL service)
- ตรวจสอบ Root Directory = `backend` (Settings tab)

### ปัญหา: Backend ไม่ได้รัน
- ตรวจสอบ Deploy Logs → ดู error message
- ตรวจสอบว่า DATABASE_URL ถูกตั้งค่าแล้ว

### ปัญหา: ไม่พบ DATABASE_URL ใน PostgreSQL service
- ตรวจสอบว่า PostgreSQL service ถูกสร้างแล้ว
- ลอง refresh หน้าเว็บ
- หรือสร้าง PostgreSQL service ใหม่

---

## 🎯 สรุป

1. Copy DATABASE_URL จาก **PostgreSQL service** → Variables
2. Copy Backend URL จาก **Backend service**
3. ไปที่ **Backend service** → Variables
4. แก้ไข `DATABASE_URL` = (ค่าจาก PostgreSQL)
5. แก้ไข `ALLOWED_ORIGINS` = `<Backend URL>,http://localhost:3000`
6. Save และรอ deploy

**ใช้เวลา: 5 นาที** ⏱️

