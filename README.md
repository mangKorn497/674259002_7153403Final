# รายงานการส่งข้อสอบปฏิบัติการพัฒนาระบบเว็บ (Web Services Technology)
**รหัสวิชา:** 7153403 | ภาคเรียนที่ 1 ปีการศึกษา 2569  
**ชื่อชุดโจทย์:** ชุดที่ 4 (D) — ระบบบริหารจัดการข้อมูลกิจกรรม (Events Management)  
**ชื่อ Repository:** `<รหัสนักศึกษา>_7153403_Final_D`

---

## 1. ข้อมูลการนำระบบขึ้นใช้งานจริง (Production Deployment)
* **Frontend Production URL (Vercel):** `https://<your-project>.vercel.app`
* **Backend Base URL (Render):** `https://<your-backend>.onrender.com`
* **Endpoint ตัวอย่างที่เปิดทดสอบได้:** `https://<your-backend>.onrender.com/api/events`

> [!NOTE]  
> เซิร์ฟเวอร์ Backend บน Render เป็น Free Tier หากไม่ได้ใช้งานเป็นเวลาระบบอาจเข้าสู่ Sleep Mode เมื่อเปิดใช้งานครั้งแรกจะใช้เวลาเริ่มต้นทำงาน (Cold Start) ประมาณ 30-50 วินาที

---

## 2. เครื่องมือและเทคโนโลยีที่ใช้ (Tech Stack)
* **Frontend:** React 18, Vite, Axios, Pure CSS (Responsive & Glassmorphism Design)
* **Backend:** Node.js, Express 4, Sequelize ORM 6, CORS, Dotenv
* **Database:** PostgreSQL (บน Render Postgres / Neon / Supabase หรือ Docker Local)
* **Hosting:** Vercel (Frontend) และ Render (Backend Web Service)

---

## 3. เอกสารและข้อกำหนด RESTful API
ทรัพยากรหลัก: `/api/events`

| Method | Endpoint | หน้าที่ | Success Status | Error Codes |
|---|---|---|---|---|
| `GET` | `/api/events` | อ่านรายการทั้งหมด ค้นหาตามชื่อ และกรองตามหมวดหมู่ | `200 OK` | `500` |
| `GET` | `/api/events/:id` | อ่านรายละเอียดหนึ่งรายการ | `200 OK` | `400`, `404`, `500` |
| `POST` | `/api/events` | เพิ่มรายการกิจกรรมใหม่ | `201 Created` | `400`, `500` |
| `PUT` | `/api/events/:id` | แก้ไขข้อมูลทุกฟิลด์ที่ผู้ใช้กรอก | `200 OK` | `400`, `404`, `500` |
| `DELETE` | `/api/events/:id` | ลบข้อมูลกิจกรรม | `200 OK` | `400`, `404`, `500` |

### ข้อมูลฟิลด์ของชุดที่ 4 (D) - กิจกรรม (Events):
* `id`: `INTEGER` (Primary Key, Auto Increment)
* `title`: `STRING(150)` (ชื่อกิจกรรม, 1–150 ตัวอักษร)
* `organizer`: `STRING(100)` (ผู้จัด, 1–100 ตัวอักษร)
* `category`: `STRING(50)` (หมวดหมู่: `อบรม`, `สัมมนา`, `จิตอาสา`)
* `eventDate`: `DATEONLY` (วันที่จัด รูปแบบ `YYYY-MM-DD`)
* `description`: `TEXT` (รายละเอียด, 1–2,000 ตัวอักษร)
* `status`: `BOOLEAN` (สถานะข้อมูล, `true` = เผยแพร่, `false` = ฉบับร่าง)

### ตัวอย่าง Query Parameters สำหรับ GET /api/events:
* `GET /api/events?search=Web` (ค้นหาบางส่วนจากชื่อกิจกรรม)
* `GET /api/events?category=อบรม` (กรองตามหมวดหมู่)
* `GET /api/events?search=ปัญญาประดิษฐ์&category=สัมมนา` (ค้นหาและกรองร่วมกัน)

---

## 4. ขั้นตอนการติดตั้งและรันด้วย Docker (แนะนำและง่ายที่สุด)

ระบบรองรับการรันแบบครบวงจรผ่าน **Docker Compose** (PostgreSQL Database, Backend API, Frontend React):

1. **สั่งรันระบบทั้งหมด:**
   ```bash
   docker compose up --build -d
   ```
2. **เข้าใช้งาน:**
   * **Frontend:** [http://localhost:5173](http://localhost:5173)
   * **Backend API:** [http://localhost:5000/api/events](http://localhost:5000/api/events)
   * **PostgreSQL:** `localhost:5433` (ภายใน container เชื่อมต่อที่ `postgres:5432`)
3. **ดูสถานะและ Log:**
   ```bash
   docker compose ps
   docker compose logs -f
   ```
4. **หยุดการทำงาน:**
   ```bash
   docker compose down
   ```

---

## 5. ขั้นตอนการติดตั้งและรันแบบ Local (ไม่ผ่าน Docker)

### 5.1 ฝั่ง Backend
1. เข้าไปยังโฟลเดอร์ `backend`:
   ```bash
   cd backend
   ```
2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
3. กำหนดตัวแปรในไฟล์ `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=web_exam_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_DIALECT=postgres
   CLIENT_URL=http://localhost:5173
   ```
4. เริ่มต้นเซิร์ฟเวอร์:
   ```bash
   npm run dev
   ```

### 5.2 ฝั่ง Frontend
1. เข้าไปยังโฟลเดอร์ `frontend`:
   ```bash
   cd frontend
   ```
2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
3. กำหนดตัวแปรในไฟล์ `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. เริ่มต้น Vite Development Server:
   ```bash
   npm run dev
   ```
5. เปิดเบราว์เซอร์ที่ [http://localhost:5173](http://localhost:5173)