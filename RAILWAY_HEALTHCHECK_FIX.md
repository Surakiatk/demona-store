# 🔧 แก้ปัญหา Railway Healthcheck Failed

## ⚠️ ปัญหา
Backend build สำเร็จแล้ว แต่ healthcheck ล้มเหลว ("service unavailable")

## 🔍 สาเหตุที่เป็นไปได้

### 1. **DATABASE_URL ไม่ถูกต้องหรือไม่มี**
Railway ต้องมี `DATABASE_URL` environment variable

### 2. **Backend crash ตอน startup**
Backend อาจ crash เพราะ database connection error

### 3. **PORT environment variable ไม่ถูกต้อง**
Railway กำหนด PORT อัตโนมัติ แต่ backend อาจไม่ได้รับ

---

## ✅ วิธีแก้ไข

### ขั้นตอนที่ 1: ตรวจสอบ Environment Variables

#### ไปที่ Railway Dashboard:
1. คลิกที่ `demona-backend` service
2. ไปที่ **Variables** tab
3. ตรวจสอบว่ามี:
   - `DATABASE_URL` = PostgreSQL connection string
   - `PORT` = (Railway กำหนดอัตโนมัติ - ไม่ต้องตั้งเอง)
   - `ALLOWED_ORIGINS` = Frontend URL

#### ถ้าไม่มี DATABASE_URL:
1. ไปที่ PostgreSQL service ใน Railway
2. คลิก **Variables** tab
3. Copy `DATABASE_URL` หรือ `POSTGRES_URL`
4. กลับไปที่ Backend service → **Variables**
5. เพิ่ม:
   ```
   DATABASE_URL = <paste ค่าที่ copy มา>
   ```

---

### ขั้นตอนที่ 2: ตรวจสอบ Deploy Logs

1. ไปที่ **Deployments** tab
2. คลิก deployment ล่าสุด
3. คลิก **View Logs** หรือ **Deploy Logs**
4. ดูว่ามี error อะไร:
   - `Starting server on port XXX` ← ควรเห็น
   - `Database tables created successfully` ← ควรเห็น
   - Error messages ← ตรวจสอบ

---

### ขั้นตอนที่ 3: ตรวจสอบ HTTP Logs

1. ไปที่ **HTTP Logs** tab
2. ดูว่ามี request มาหรือไม่
3. ถ้าไม่มี request = backend ไม่ได้รัน

---

### ขั้นตอนที่ 4: ลอง Disable Healthcheck ชั่วคราว

ถ้ายังไม่ได้ผล ลอง disable healthcheck:

1. ไปที่ **Settings** tab
2. หา **Healthcheck** section
3. ลบหรือปิด healthcheck path
4. Save และ Redeploy

---

### ขั้นตอนที่ 5: ตรวจสอบ Root Directory

1. ไปที่ **Settings** tab
2. ตรวจสอบ **Root Directory** = `backend`
3. ถ้าไม่ใช่ → เปลี่ยนเป็น `backend` แล้ว Save

---

## 🔍 ตรวจสอบ Logs

### ควรเห็นใน Deploy Logs:
```
Starting server on port 8000
DATABASE_URL exists: True
Database tables created successfully
Application startup complete.
```

### ถ้าเห็น Error:
- `DATABASE_URL exists: False` → ต้องตั้งค่า DATABASE_URL
- `Error creating database tables` → ตรวจสอบ DATABASE_URL
- `Connection refused` → Database ไม่พร้อม

---

## 🎯 Quick Fix

### ถ้า backend ไม่ได้รันเลย:

1. **ตั้งค่า DATABASE_URL:**
   - PostgreSQL service → Variables → Copy `DATABASE_URL`
   - Backend service → Variables → เพิ่ม `DATABASE_URL`

2. **Redeploy:**
   - Deployments → Redeploy

3. **ตรวจสอบ Logs:**
   - Deploy Logs → ดูว่า backend รันหรือไม่

---

## 📝 Checklist

- [ ] Root Directory = `backend`
- [ ] DATABASE_URL ถูกตั้งค่าแล้ว
- [ ] ALLOWED_ORIGINS ถูกตั้งค่าแล้ว
- [ ] Deploy Logs แสดง "Starting server on port XXX"
- [ ] HTTP Logs มี request

---

## ❓ ถ้ายังไม่ได้ผล

1. ลบ service และสร้างใหม่
2. ตั้งค่า Root Directory = `backend` ทันที
3. ตั้งค่า DATABASE_URL
4. Deploy ใหม่

