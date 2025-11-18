# คู่มือ Deploy Demona Store ฟรี

## ตัวเลือกที่แนะนำ: Vercel + Railway (ฟรี 100%)

### ข้อดี:
- ✅ ฟรี 100%
- ✅ ไม่ต้องเปิดคอมไว้
- ✅ Auto-deploy จาก GitHub
- ✅ SSL Certificate ฟรี
- ✅ Custom domain ได้

---

## วิธีที่ 1: Vercel (Frontend) + Railway (Backend + Database)

### ขั้นตอนที่ 1: เตรียม GitHub Repository

1. สร้าง GitHub repository ใหม่
2. Push โค้ดทั้งหมดขึ้น GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/demona-store.git
git push -u origin main
```

### ขั้นตอนที่ 2: Deploy Backend + Database บน Railway

1. ไปที่ https://railway.app
2. Sign up ด้วย GitHub
3. คลิก "New Project" → "Deploy from GitHub repo"
4. เลือก repository ของคุณ
5. เลือก `backend` folder
6. Railway จะ auto-detect และ deploy

**ตั้งค่า Environment Variables:**
- `DATABASE_URL`: Railway จะสร้าง PostgreSQL ให้อัตโนมัติ
- คลิกที่ PostgreSQL service → Variables → Copy `DATABASE_URL`
- ไปที่ Backend service → Variables → เพิ่ม `DATABASE_URL`

**ตั้งค่า Public Domain:**
- คลิกที่ Backend service → Settings → Generate Domain
- Copy domain URL (เช่น: `https://your-app.railway.app`)

### ขั้นตอนที่ 3: Deploy Frontend บน Vercel

1. ไปที่ https://vercel.com
2. Sign up ด้วย GitHub
3. คลิก "Add New Project"
4. Import repository ของคุณ
5. ตั้งค่า:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. **Environment Variables:**
   - `VITE_API_URL`: ใส่ Railway backend URL ที่ได้จากขั้นตอนที่ 2

7. คลิก "Deploy"

8. หลังจาก deploy เสร็จ Vercel จะให้ URL (เช่น: `https://your-app.vercel.app`)

### ขั้นตอนที่ 4: สร้างหมวดหมู่เริ่มต้น

หลังจาก deploy เสร็จ:
```bash
# เข้าไปใน Railway backend container
railway run python init_categories.py
```

หรือใช้ Railway CLI:
```bash
railway login
railway link
railway run python backend/init_categories.py
```

---

## วิธีที่ 2: Vercel (Frontend) + Supabase (Database) + Vercel Serverless Functions (Backend)

### ข้อดี:
- ฟรีทั้งหมด
- Supabase ให้ PostgreSQL ฟรี
- Vercel Serverless Functions สำหรับ API

### ขั้นตอน:

1. **สร้าง Supabase Project:**
   - ไปที่ https://supabase.com
   - สร้าง project ใหม่
   - Copy Database URL

2. **Deploy Frontend บน Vercel:**
   - ทำตามขั้นตอนที่ 3 ด้านบน

3. **Deploy Backend เป็น Vercel Serverless Functions:**
   - ต้อง refactor backend เป็น serverless functions
   - หรือใช้วิธีที่ 1 (Railway) จะง่ายกว่า

---

## วิธีที่ 3: Render (All-in-One)

### ขั้นตอน:

1. ไปที่ https://render.com
2. Sign up ด้วย GitHub
3. สร้าง 3 services:
   - **PostgreSQL Database** (ฟรี)
   - **Web Service** สำหรับ Backend (เลือก Docker)
   - **Static Site** สำหรับ Frontend

---

## วิธีที่ 4: Fly.io (ฟรี tier)

### ขั้นตอน:

1. ไปที่ https://fly.io
2. Install flyctl: `curl -L https://fly.io/install.sh | sh`
3. Deploy:
```bash
fly launch
```

---

## แนะนำ: ใช้วิธีที่ 1 (Vercel + Railway)

### เหตุผล:
- ✅ ง่ายที่สุด
- ✅ ฟรี 100%
- ✅ Auto-deploy
- ✅ Performance ดี
- ✅ SSL ฟรี

### ราคา:
- **Vercel**: ฟรี (unlimited projects)
- **Railway**: ฟรี $5 credit/เดือน (พอสำหรับ small project)

---

## หลัง Deploy:

1. **อัพเดท CORS ใน Backend:**
   - เพิ่ม Vercel domain ใน `allowed_origins`

2. **อัพเดท Frontend API URL:**
   - ตั้งค่า `VITE_API_URL` ใน Vercel environment variables

3. **ทดสอบ:**
   - เปิด Vercel URL
   - ทดสอบการทำงานทั้งหมด

---

## Tips:

- ใช้ GitHub Actions สำหรับ auto-deploy
- ตั้งค่า custom domain (ฟรี)
- ใช้ environment variables สำหรับ secrets
- Monitor usage บน Railway dashboard

