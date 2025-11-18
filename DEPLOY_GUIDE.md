# 🚀 คู่มือ Deploy Demona Store ฟรี (ไม่ต้องเปิดคอม)

> **ต้องการ deploy เร็วๆ?** ดู [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) สำหรับขั้นตอนแบบย่อ

## 📋 ตัวเลือกที่แนะนำ: Vercel + Railway (ฟรี 100%)

### ✅ ข้อดี:
- **ฟรี 100%** - ไม่มีค่าใช้จ่าย
- **ไม่ต้องเปิดคอม** - ทำงานบน cloud
- **Auto-deploy** - อัพเดทอัตโนมัติเมื่อ push code
- **SSL ฟรี** - HTTPS อัตโนมัติ
- **Custom Domain** - ใช้ domain ของตัวเองได้

---

## 🎯 ขั้นตอนการ Deploy

### **ขั้นตอนที่ 1: สร้าง GitHub Repository**

1. ไปที่ https://github.com
2. สร้าง repository ใหม่ชื่อ `demona-store`
3. **สำคัญ**: เลือก **Public** (ถ้าต้องการฟรี) หรือ Private

4. Push โค้ดขึ้น GitHub:
```bash
cd /Users/saber/Desktop/workshop/Demona_Store

# สร้าง .gitignore ถ้ายังไม่มี
git init
git add .
git commit -m "Initial commit: Demona Store"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/demona-store.git
git push -u origin main
```

---

### **ขั้นตอนที่ 2: Deploy Backend + Database บน Railway**

#### 2.1 สร้าง Railway Account
1. ไปที่ https://railway.app
2. คลิก "Start a New Project"
3. Sign up ด้วย **GitHub** (แนะนำ)

#### 2.2 สร้าง PostgreSQL Database
1. ใน Railway dashboard คลิก "New Project"
2. คลิก "+ New" → เลือก "Database" → "Add PostgreSQL"
3. Railway จะสร้าง PostgreSQL ให้อัตโนมัติ
4. คลิกที่ PostgreSQL service → คลิก "Variables" tab
5. **Copy** `DATABASE_URL` (จะได้ค่าประมาณ: `postgresql://postgres:xxx@xxx.railway.app:5432/railway`)

#### 2.3 Deploy Backend
1. ใน Railway project เดียวกัน คลิก "+ New" → "GitHub Repo"
2. เลือก repository `demona-store`
3. Railway จะถาม "Configure Service" → เลือก:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Watch Paths**: `backend/**`

4. **ตั้งค่า Environment Variables:**
   - คลิกที่ Backend service → "Variables" tab
   - เพิ่ม:
     ```
     DATABASE_URL = <paste DATABASE_URL จาก PostgreSQL>
     ALLOWED_ORIGINS = https://your-app.vercel.app,http://localhost:3000
     ```
   - **หมายเหตุ**: ใส่ Vercel URL หลังจาก deploy frontend แล้ว

5. **ตั้งค่า Public Domain:**
   - คลิกที่ Backend service → "Settings" tab
   - เปิด "Generate Domain" หรือ "Custom Domain"
   - **Copy domain URL** (เช่น: `https://demona-store-backend.railway.app`)

6. Railway จะ deploy อัตโนมัติ (ใช้เวลาประมาณ 2-3 นาที)

#### 2.4 สร้างหมวดหมู่เริ่มต้น
หลังจาก deploy เสร็จ:
1. ไปที่ Backend service → "Deployments" tab
2. คลิกที่ deployment ล่าสุด → "View Logs"
3. หรือใช้ Railway CLI:
```bash
# ติดตั้ง Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# รัน script
railway run python init_categories.py
```

---

### **ขั้นตอนที่ 3: Deploy Frontend บน Vercel**

#### 3.1 สร้าง Vercel Account
1. ไปที่ https://vercel.com
2. Sign up ด้วย **GitHub** (แนะนำ)

#### 3.2 Deploy Project
1. คลิก "Add New Project"
2. Import repository `demona-store`
3. **ตั้งค่า Project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (คลิก "Edit" แล้วเปลี่ยน)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables:**
   - คลิก "Environment Variables"
   - เพิ่ม:
     ```
     VITE_API_URL = https://your-backend.railway.app
     ```
   - **หมายเหตุ**: ใส่ Railway backend URL ที่ได้จากขั้นตอนที่ 2

5. คลิก "Deploy"
6. รอประมาณ 1-2 นาที
7. **Copy Vercel URL** (เช่น: `https://demona-store.vercel.app`)

#### 3.3 อัพเดท CORS ใน Backend
1. กลับไปที่ Railway → Backend service → Variables
2. อัพเดท `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS = https://demona-store.vercel.app,http://localhost:3000
   ```
3. Railway จะ restart อัตโนมัติ

---

## 🎉 เสร็จแล้ว!

ตอนนี้เว็บของคุณพร้อมใช้งานแล้ว:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app`
- **API Docs**: `https://your-backend.railway.app/docs`

---

## 📝 หมายเหตุสำคัญ

### Railway Free Tier:
- **$5 credit/เดือน** (ฟรี)
- พอสำหรับ small project
- ถ้าใช้หมดต้อง upgrade หรือรอเดือนถัดไป

### Vercel Free Tier:
- **Unlimited projects**
- **100GB bandwidth/เดือน**
- **SSL ฟรี**

### การอัพเดท:
- เมื่อ push code ขึ้น GitHub → Auto-deploy อัตโนมัติ
- ไม่ต้องทำอะไรเพิ่ม

---

## 🔧 Troubleshooting

### Backend ไม่ทำงาน:
1. ตรวจสอบ Railway logs
2. ตรวจสอบ `DATABASE_URL` ถูกต้องหรือไม่
3. ตรวจสอบ `ALLOWED_ORIGINS` มี Vercel URL หรือไม่

### Frontend ไม่เชื่อมต่อ Backend:
1. ตรวจสอบ `VITE_API_URL` ใน Vercel
2. ตรวจสอบ CORS settings ใน Backend
3. ตรวจสอบ Network tab ใน Browser DevTools

### Database Connection Error:
1. ตรวจสอบ `DATABASE_URL` format
2. Railway ใช้ `postgres://` แต่ SQLAlchemy ต้องการ `postgresql://`
3. Code จะแปลงอัตโนมัติแล้ว

---

## 🌐 Custom Domain (Optional)

### Vercel:
1. ไปที่ Project Settings → Domains
2. เพิ่ม domain ของคุณ
3. ตั้งค่า DNS ตามที่ Vercel บอก

### Railway:
1. ไปที่ Service Settings → Domains
2. เพิ่ม custom domain
3. ตั้งค่า DNS

---

## 📊 Monitoring

- **Vercel**: Dashboard → Analytics
- **Railway**: Dashboard → Metrics
- **Logs**: ดู logs ได้ทั้ง Vercel และ Railway

---

## 💡 Tips

1. **ใช้ Environment Variables** สำหรับ secrets
2. **Monitor usage** บน Railway dashboard
3. **ตั้งค่า alerts** เมื่อมี error
4. **Backup database** เป็นระยะ (Railway มี auto-backup)

---

## 🆘 ต้องการความช่วยเหลือ?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: สร้าง issue ใน repository

