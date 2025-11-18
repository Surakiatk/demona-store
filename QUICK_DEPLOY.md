# 🚀 Deploy เร็วๆ ใน 5 นาที

## วิธีที่ง่ายที่สุด: Vercel + Railway

### ⚡ ขั้นตอนเร็วๆ:

#### 1. Push ขึ้น GitHub (2 นาที)
```bash
git init
git add .
git commit -m "Ready to deploy"
git remote add origin https://github.com/YOUR_USERNAME/demona-store.git
git push -u origin main
```

#### 2. Deploy Backend บน Railway (2 นาที)
1. ไปที่ https://railway.app → Sign up with GitHub
2. New Project → Deploy from GitHub repo
3. เลือก repo → เลือก `backend` folder
4. Add PostgreSQL Database (คลิก + New → Database → PostgreSQL)
5. Copy `DATABASE_URL` จาก PostgreSQL → ใส่ใน Backend Variables
6. Generate Domain → Copy URL (เช่น: `https://xxx.railway.app`)

#### 3. Deploy Frontend บน Vercel (1 นาที)
1. ไปที่ https://vercel.com → Sign up with GitHub
2. Add New Project → Import repo
3. Root Directory: `frontend`
4. Environment Variable: `VITE_API_URL` = Railway URL จากขั้นตอน 2
5. Deploy!

#### 4. อัพเดท CORS
- กลับไป Railway → Backend Variables
- เพิ่ม: `ALLOWED_ORIGINS` = Vercel URL

#### 5. สร้างหมวดหมู่
```bash
railway run python init_categories.py
```

**เสร็จแล้ว!** 🎉

---

## 📝 Checklist

- [ ] GitHub repo สร้างแล้ว
- [ ] Railway backend deploy แล้ว
- [ ] Railway database สร้างแล้ว
- [ ] Vercel frontend deploy แล้ว
- [ ] Environment variables ตั้งค่าแล้ว
- [ ] CORS อัพเดทแล้ว
- [ ] หมวดหมู่สร้างแล้ว

---

## 🔗 Links ที่ได้

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`
- API Docs: `https://your-backend.railway.app/docs`

---

## 💰 ราคา

- **Vercel**: ฟรี (unlimited)
- **Railway**: ฟรี $5/เดือน (พอใช้)

---

## 🆘 ปัญหาที่พบบ่อย

**Backend ไม่เชื่อมต่อ Database:**
- ตรวจสอบ `DATABASE_URL` format
- Railway ใช้ `postgres://` แต่ต้องเป็น `postgresql://`
- Code จะแปลงอัตโนมัติแล้ว

**Frontend ไม่เชื่อมต่อ Backend:**
- ตรวจสอบ `VITE_API_URL` ใน Vercel
- ตรวจสอบ CORS ใน Backend
- ตรวจสอบ Network tab

**404 Not Found:**
- ตรวจสอบ Root Directory ใน Vercel = `frontend`
- ตรวจสอบ Build Command = `npm run build`

