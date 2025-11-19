# 🚀 วิธีตั้งค่า Railway Environment Variables อัตโนมัติ

## วิธีที่ 1: ใช้ Script (แนะนำ)

### ขั้นตอน:

1. **ติดตั้ง Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login:**
```bash
railway login
```

3. **Link Project:**
```bash
cd /Users/saber/Desktop/workshop/Demona_Store
railway link
```
- เลือก project: `demona-store` หรือ project ที่สร้างไว้

4. **รัน Script:**
```bash
chmod +x setup_railway_env.sh
./setup_railway_env.sh
```

5. **ทำตามคำแนะนำ:**
   - ใส่ DATABASE_URL จาก PostgreSQL service
   - ใส่ Frontend URL (หรือ Backend URL ชั่วคราว)

---

## วิธีที่ 2: ใช้ Railway CLI โดยตรง

### ขั้นตอน:

1. **Copy DATABASE_URL จาก PostgreSQL:**
   - ไปที่ Railway Dashboard
   - คลิก PostgreSQL service
   - Variables tab
   - Copy `DATABASE_URL`

2. **ตั้งค่า DATABASE_URL:**
```bash
railway variables set DATABASE_URL="<paste DATABASE_URL>" --service demona-backend
```

3. **ตั้งค่า ALLOWED_ORIGINS:**
```bash
# ถ้ายังไม่มี Frontend URL → ใช้ Backend URL ชั่วคราว
railway variables set ALLOWED_ORIGINS="https://demona-backend-production-xxx.up.railway.app,http://localhost:3000" --service demona-backend

# หรือถ้ามี Frontend URL แล้ว
railway variables set ALLOWED_ORIGINS="https://your-app.vercel.app,http://localhost:3000" --service demona-backend
```

4. **ตรวจสอบ:**
```bash
railway variables --service demona-backend
```

---

## วิธีที่ 3: ใช้ Railway Dashboard (Manual)

### ขั้นตอน:

1. **Copy DATABASE_URL:**
   - ไปที่ Railway Dashboard
   - คลิก **PostgreSQL service**
   - ไปที่ **Variables** tab
   - Copy `DATABASE_URL` (จะได้ค่าประมาณ: `postgresql://postgres:xxx@xxx.railway.app:5432/railway`)

2. **ตั้งค่า Backend Variables:**
   - ไปที่ **Backend service** (`demona-backend`)
   - ไปที่ **Variables** tab
   - แก้ไข `DATABASE_URL`:
     - ลบค่าเก่า: `postgresql://demona_user:demona_password@db:5432/demona_store`
     - ใส่ค่าใหม่: (ค่าที่ copy จาก PostgreSQL)
   - แก้ไข `ALLOWED_ORIGINS`:
     - ถ้ายังไม่มี Frontend: `https://demona-backend-production-xxx.up.railway.app,http://localhost:3000`
     - ถ้ามี Frontend แล้ว: `https://your-app.vercel.app,http://localhost:3000`
   - คลิก **✓** เพื่อ Save

3. **Railway จะ auto-deploy ใหม่**

---

## 🔍 ตรวจสอบว่าใส่ถูกต้องหรือไม่

### ตรวจสอบใน Railway Dashboard:
1. ไปที่ Backend service → **Variables** tab
2. ตรวจสอบ:
   - `DATABASE_URL` = ต้องเริ่มด้วย `postgresql://` และมี hostname เป็น `.railway.app` (ไม่ใช่ `db:5432`)
   - `ALLOWED_ORIGINS` = ต้องมี URL จริง (ไม่ใช่ `your-frontend.onrender.com`)

### ตรวจสอบใน Deploy Logs:
1. ไปที่ **Deployments** tab
2. คลิก deployment ล่าสุด → **View Logs**
3. ควรเห็น:
   - `Starting server on port XXX`
   - `DATABASE_URL exists: True`
   - `Database tables created successfully`

---

## ❓ ถ้ายังมีปัญหา

1. **ตรวจสอบ Root Directory:**
   - Settings → Root Directory = `backend`

2. **ตรวจสอบ DATABASE_URL:**
   - ต้อง copy จาก PostgreSQL service (ไม่ใช่ backend service)
   - ต้องมี format: `postgresql://postgres:xxx@xxx.railway.app:5432/railway`

3. **Redeploy:**
   - Deployments → Redeploy

