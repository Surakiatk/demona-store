# 🔧 แก้ปัญหา Railway ใช้ Railpack แทน Dockerfile

## ⚠️ ปัญหา
Railway ยังใช้ Railpack แทน Dockerfile แม้ว่าจะมี `railway.toml` และ `Dockerfile` แล้ว

## ✅ วิธีแก้ไข (ทำใน Railway Dashboard)

### ขั้นตอนที่ 1: ตั้งค่า Root Directory (สำคัญมาก!)

#### Frontend Service (`demona-frontend`):
1. ไปที่ Railway Dashboard: https://railway.app
2. คลิกที่ service `demona-frontend`
3. ไปที่ **Settings** tab (แท็บที่ 4)
4. เลื่อนลงหา **"Root Directory"** section
5. ตั้งค่าเป็น: `frontend` (พิมพ์ `frontend` ลงไป)
6. คลิก **Save** หรือ **Update**

#### Backend Service (`demona-backend`):
1. ไปที่ Railway Dashboard
2. คลิกที่ service `demona-backend`
3. ไปที่ **Settings** tab
4. เลื่อนลงหา **"Root Directory"** section
5. ตั้งค่าเป็น: `backend` (พิมพ์ `backend` ลงไป)
6. คลิก **Save** หรือ **Update**

---

### ขั้นตอนที่ 2: ลบ Build/Start Commands

#### Frontend:
1. ไปที่ **Settings** → **Build** section
2. **Build Command**: (ลบออก - ให้ว่างเปล่า)
3. **Start Command**: (ลบออก - ให้ว่างเปล่า)
4. **Save**

#### Backend:
1. ไปที่ **Settings** → **Build** section
2. **Build Command**: (ลบออก - ให้ว่างเปล่า)
3. **Start Command**: (ลบออก - ให้ว่างเปล่า)
4. **Save**

---

### ขั้นตอนที่ 3: Clear Build Cache

1. ไปที่ **Settings** → **Advanced** section
2. คลิก **"Clear Build Cache"** หรือ **"Clear Cache"**
3. **Save**

---

### ขั้นตอนที่ 4: Redeploy

1. ไปที่ **Deployments** tab
2. คลิก **"Redeploy"** หรือ
3. Push commit ใหม่ไปที่ GitHub (Railway จะ auto-deploy)

---

## ✅ ตรวจสอบว่าใช้ Dockerfile แล้ว

หลังจาก deploy ใหม่ ไปที่ **Deployments** → คลิก deployment ล่าสุด → **View Logs**

**ควรเห็น:**
- `Building Docker image...`
- `Step 1/5 : FROM node:18-alpine AS builder` (frontend)
- `Step 1/4 : FROM python:3.11-slim` (backend)

**ไม่ควรเห็น:**
- `Railpack` หรือ `Nixpacks`
- `Error creating build plan with Railpack`

---

## 📸 ภาพตัวอย่างการตั้งค่า Root Directory

ใน Railway Dashboard:
```
Settings Tab
├── Service
│   └── Root Directory: [frontend]  ← ตั้งค่านี้!
├── Build
│   ├── Build Command: [ว่างเปล่า]   ← ลบออก
│   └── Start Command: [ว่างเปล่า]   ← ลบออก
└── Advanced
    └── Clear Build Cache            ← คลิกนี้
```

---

## ❓ ถ้ายังไม่ได้ผล

1. **ตรวจสอบว่า Root Directory ถูกต้อง:**
   - Frontend: `frontend` (ไม่ใช่ `./frontend` หรือ `/frontend`)
   - Backend: `backend` (ไม่ใช่ `./backend` หรือ `/backend`)

2. **ตรวจสอบว่า Dockerfile อยู่ใน Root Directory:**
   - `frontend/Dockerfile` ✅
   - `backend/Dockerfile` ✅

3. **ตรวจสอบว่า railway.toml อยู่ใน Root Directory:**
   - `frontend/railway.toml` ✅
   - `backend/railway.toml` ✅

4. **ลองลบ service และสร้างใหม่:**
   - ลบ service ทั้งหมด
   - สร้าง service ใหม่
   - ตั้งค่า Root Directory ทันที
   - Deploy ใหม่

---

## 🎯 สรุป

**ปัญหาหลัก:** Root Directory ไม่ถูกต้อง → Railway ไม่เห็น `railway.toml` และ `Dockerfile`

**วิธีแก้:** ตั้งค่า Root Directory ใน Railway Dashboard ให้ถูกต้อง

