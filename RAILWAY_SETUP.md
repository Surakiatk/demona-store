# 🚂 Railway Setup Guide - บังคับใช้ Dockerfile

## ⚠️ ปัญหา: Railway ใช้ Railpack แทน Dockerfile

ถ้า Railway ยังใช้ Railpack แทน Dockerfile ให้ทำตามขั้นตอนนี้:

---

## 📋 ขั้นตอนการตั้งค่าใน Railway Dashboard

### 1. ตั้งค่า Root Directory (สำคัญมาก!)

#### สำหรับ Frontend Service (`demona-frontend`):
1. ไปที่ Railway Dashboard
2. คลิกที่ service `demona-frontend`
3. ไปที่ **Settings** tab
4. หา **Root Directory** section
5. ตั้งค่าเป็น: `frontend`
6. **Save**

#### สำหรับ Backend Service (`demona-backend`):
1. ไปที่ Railway Dashboard
2. คลิกที่ service `demona-backend`
3. ไปที่ **Settings** tab
4. หา **Root Directory** section
5. ตั้งค่าเป็น: `backend`
6. **Save**

---

### 2. ตั้งค่า Build Command (ถ้ายังใช้ Railpack)

#### สำหรับ Frontend:
1. ไปที่ **Settings** → **Build**
2. **Build Command**: (ว่างไว้ - ไม่ต้องใส่)
3. **Start Command**: (ว่างไว้ - ไม่ต้องใส่)
4. **Save**

#### สำหรับ Backend:
1. ไปที่ **Settings** → **Build**
2. **Build Command**: (ว่างไว้ - ไม่ต้องใส่)
3. **Start Command**: (ว่างไว้ - ไม่ต้องใส่)
4. **Save**

---

### 3. ตรวจสอบว่า Dockerfile อยู่ใน Root Directory

#### Frontend:
- Root Directory = `frontend`
- Dockerfile ต้องอยู่ที่: `frontend/Dockerfile` ✅

#### Backend:
- Root Directory = `backend`
- Dockerfile ต้องอยู่ที่: `backend/Dockerfile` ✅

---

### 4. ตรวจสอบ railway.toml

#### Frontend:
- `frontend/railway.toml` ต้องมี:
```toml
[build]
builder = "DOCKERFILE"
```

#### Backend:
- `backend/railway.toml` ต้องมี:
```toml
[build]
builder = "DOCKERFILE"
```

---

### 5. ลบ Build Cache (ถ้ายังมีปัญหา)

1. ไปที่ **Settings** → **Advanced**
2. คลิก **Clear Build Cache**
3. **Save**

---

### 6. Redeploy

1. ไปที่ **Deployments** tab
2. คลิก **Redeploy** หรือ
3. Push commit ใหม่ไปที่ GitHub (Railway จะ auto-deploy)

---

## ✅ ตรวจสอบว่าใช้ Dockerfile แล้ว

หลังจาก deploy ใหม่ ตรวจสอบ Logs:
- ควรเห็น: `Building Docker image...`
- ควรเห็น: `Step 1/5 : FROM node:18-alpine AS builder` (frontend)
- ควรเห็น: `Step 1/4 : FROM python:3.11-slim` (backend)

**ไม่ควรเห็น**: `Railpack` หรือ `Nixpacks`

---

## 🔧 Environment Variables

### Backend:
- `DATABASE_URL` = PostgreSQL connection string
- `ALLOWED_ORIGINS` = Frontend URL (เช่น: `https://demona-frontend-production-xxx.up.railway.app`)

### Frontend:
- `VITE_API_URL` = Backend URL (เช่น: `https://demona-backend-production-xxx.up.railway.app`)

---

## ❌ ถ้ายังไม่ได้ผล

1. ลบ service ทั้งหมด
2. สร้าง service ใหม่
3. ตั้งค่า Root Directory ทันที
4. Deploy ใหม่

