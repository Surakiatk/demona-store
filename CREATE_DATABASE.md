# 🗄️ สร้าง PostgreSQL Database ใน Railway

## วิธีที่ 1: สร้างผ่าน Railway Dashboard (แนะนำ)

### ขั้นตอน:

1. **ไปที่ Railway Dashboard:**
   - https://railway.app
   - Login (ถ้ายังไม่ได้ login)

2. **เลือก Project:**
   - คลิก project `demona-store` หรือ project ที่สร้างไว้

3. **สร้าง PostgreSQL Database:**
   - คลิกปุ่ม **"+ New"** (มุมบนขวา)
   - เลือก **"Database"**
   - เลือก **"Add PostgreSQL"**
   - Railway จะสร้าง PostgreSQL service ให้อัตโนมัติ

4. **Copy DATABASE_URL:**
   - คลิกที่ PostgreSQL service ที่สร้างขึ้น
   - คลิกแท็บ **"Variables"**
   - Copy `DATABASE_URL` (จะได้ค่าประมาณ: `postgresql://postgres:xxx@xxx.railway.app:5432/railway`)

5. **ตั้งค่าใน Backend:**
   - ไปที่ Backend service (`demona-backend`)
   - คลิกแท็บ **"Variables"**
   - เพิ่มหรือแก้ไข `DATABASE_URL` = (ค่าที่ copy จาก PostgreSQL)
   - คลิก ✓ เพื่อ Save

---

## วิธีที่ 2: ใช้ Railway CLI

### ขั้นตอน:

1. **Login Railway (ถ้ายังไม่ได้ login):**
```bash
cd /Users/saber/Desktop/workshop/Demona_Store
npx railway login
```

2. **Link Project:**
```bash
npx railway link
```

3. **สร้าง PostgreSQL:**
```bash
npx railway add postgres
```

4. **Copy DATABASE_URL:**
```bash
npx railway variables --service postgres
```
- Copy `DATABASE_URL` ที่แสดง

5. **ตั้งค่าใน Backend:**
```bash
npx railway variables set DATABASE_URL="<paste DATABASE_URL>" --service demona-backend
```

---

## ✅ หลังจากสร้าง Database:

1. **Railway จะ auto-deploy backend ใหม่**
2. **ตรวจสอบ Deploy Logs:**
   - ไปที่ Backend service → Deployments
   - ดู deployment ล่าสุด → View Logs
   - ควรเห็น: `🔗 Database URL configured: postgresql://postgres:xxx@...`

3. **Healthcheck ควรผ่านแล้ว**

---

## 📋 Checklist:

- [ ] สร้าง PostgreSQL service ใน Railway
- [ ] Copy DATABASE_URL จาก PostgreSQL service
- [ ] ตั้งค่า DATABASE_URL ใน Backend service
- [ ] ตรวจสอบ Deploy Logs → Backend รันสำเร็จ
- [ ] Healthcheck ผ่าน

---

## ❓ ถ้ายังมีปัญหา:

1. **ตรวจสอบ Root Directory:**
   - Backend service → Settings → Root Directory = `backend`

2. **ตรวจสอบ DATABASE_URL:**
   - ต้องเริ่มด้วย `postgresql://`
   - ต้องมี hostname เป็น `.railway.app`

3. **Redeploy:**
   - Deployments → Redeploy

