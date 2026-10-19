const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize, Event } = require("./model");
const eventRouter = require("./router/eventRouter");

const app = express();
const PORT = process.env.PORT || 5000;

// ตั้งค่า CORS ให้อนุญาต Frontend ทั้ง Localhost และ Vercel
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // เพื่อความสะดวกในการทดสอบข้ามโดเมน
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Root Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Web Services Exam API - Events Management (ชุดที่ 4 D) is running smoothly",
    resource: "/api/events",
    timestamp: new Date().toISOString(),
  });
});

// ลงทะเบียน Router สำหรับกิจกรรม (Events)
app.use("/api/events", eventRouter);

// ฟังก์ชัน Seed ข้อมูลตัวอย่างเริ่มต้น 10 รายการตามเกณฑ์ข้อ 5 (ครบ 3 หมวดหมู่ มีทั้งเผยแพร่และฉบับร่าง)
const seedInitialData = async () => {
  try {
    const count = await Event.count();
    if (count === 0) {
      console.log("Seeding initial 10 event records (ชุดที่ 4 - D)...");
      await Event.bulkCreate([
        {
          title: "อบรมเชิงปฏิบัติการพัฒนา Web Services ด้วย Node.js และ Docker",
          organizer: "สาขาวิชาเทคโนโลยีสารสนเทศ",
          category: "อบรม",
          eventDate: "2026-04-10",
          description:
            "การอบรมเข้มข้นเพื่อพัฒนาทักษะการสร้าง RESTful API และการทำ Containerization ด้วย Docker สำหรับนักศึกษาและบุคคลทั่วไป",
          status: true,
        },
        {
          title: "สัมมนาทิศทางปัญญาประดิษฐ์และคลาวด์คอมพิวติง 2026",
          organizer: "สมาคมผู้ประกอบการซอฟต์แวร์ไทย",
          category: "สัมมนา",
          eventDate: "2026-04-18",
          description:
            "เปิดมุมมองใหม่แห่งเทคโนโลยี AI และ Generative AI กับผู้เชี่ยวชาญชั้นนำในอุตสาหกรรมเทคโนโลยีสารสนเทศ",
          status: true,
        },
        {
          title: "จิตอาสาปลูกป่าชายเลน ฟื้นฟูระบบนิเวศชายฝั่ง",
          organizer: "ชมรมอนุรักษ์ธรรมชาติและสิ่งแวดล้อม",
          category: "จิตอาสา",
          eventDate: "2026-04-25",
          description:
            "ร่วมแรงร่วมใจปลูกต้นโกงกาง 1,000 ต้น เพื่ออนุรักษ์ชายฝั่งและสร้างแหล่งอนุบาลสัตว์น้ำ",
          status: true,
        },
        {
          title: "อบรมเทคนิคการวิเคราะห์ข้อมูลด้วย Python และ BigQuery",
          organizer: "ศูนย์นวัตกรรมดิจิทัล",
          category: "อบรม",
          eventDate: "2026-05-02",
          description:
            "หลักสูตรปูพื้นฐาน Data Analysis และ Data Pipeline บนระบบคลาวด์ พร้อมตัวอย่าง Workshop จริง",
          status: true,
        },
        {
          title: "สัมมนาความมั่นคงปลอดภัยไซเบอร์ในยุคดิจิทัล (Cybersecurity Forum)",
          organizer: "สำนักวิทยบริการและเทคโนโลยีสารสนเทศ",
          category: "สัมมนา",
          eventDate: "2026-05-15",
          description:
            "แนวทางการรับมือภัยคุกคามทางไซเบอร์ การคุ้มครองข้อมูลส่วนบุคคล (PDPA) และมาตรฐานความปลอดภัยสากล",
          status: false,
        },
        {
          title: "จิตอาสาสอนน้องเขียนโค้ดและทักษะดิจิทัล",
          organizer: "กลุ่มนักศึกษาพัฒนาชุมชน",
          category: "จิตอาสา",
          eventDate: "2026-05-20",
          description:
            "กิจกรรมถ่ายทอดความรู้พื้นฐานคอมพิวเตอร์และการเขียนโปรแกรมเบื้องต้นแก่เยาวชนในโรงเรียนชนบท",
          status: true,
        },
        {
          title: "อบรมการออกแบบ UI/UX ขั้นสูงสำหรับเว็บแอปพลิเคชัน",
          organizer: "สถาบันพัฒนาวิชาชีพไอที",
          category: "อบรม",
          eventDate: "2026-06-05",
          description:
            "เรียนรู้หลักการ Human-Centered Design การทำ Wireframe และ Interactive Prototype ด้วย Figma",
          status: true,
        },
        {
          title: "สัมมนาสตาร์ตอัปและการระดมทุนในยุค AI",
          organizer: "ศูนย์บ่มเพาะวิสาหกิจ",
          category: "สัมมนา",
          eventDate: "2026-06-12",
          description:
            "พบกับผู้ร่วมก่อตั้งสตาร์ตอัปที่ประสบความสำเร็จ พร้อมแชร์ประสบการณ์การ Pitching และการเข้าถึง Venture Capital",
          status: true,
        },
        {
          title: "จิตอาสาร่วมใจบริจาคโลหิตช่วยชีวิตเพื่อนมนุษย์",
          organizer: "สภากาชาดไทย ร่วมกับ มหาวิทยาลัย",
          category: "จิตอาสา",
          eventDate: "2026-06-25",
          description:
            "โครงการรับบริจาคโลหิตเพื่อสำรองโลหิตในคลังและช่วยเหลือผู้ป่วยวิกฤตในโรงพยาบาล",
          status: false,
        },
        {
          title: "อบรมการพัฒนาแอปพลิเคชันมือถือแบบข้ามแพลตฟอร์มด้วย Flutter",
          organizer: "ชมรมคอมพิวเตอร์",
          category: "อบรม",
          eventDate: "2026-07-01",
          description:
            "สร้าง Mobile App สำหรับ iOS และ Android ได้พร้อมกันด้วย Codebase เดียว เหมาะสำหรับผู้มีพื้นฐานการเขียนโปรแกรม",
          status: true,
        },
      ]);
      console.log("Seed completed successfully!");
    }
  } catch (error) {
    console.error("Failed to seed initial data:", error);
  }
};

// เชื่อมต่อฐานข้อมูลและเริ่ม Express Server
const startServer = async () => {
  const maxRetries = 10;
  const retryInterval = 3000;
  let connected = false;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log("Database connected successfully.");
      connected = true;
      break;
    } catch (error) {
      console.warn(`Database connection attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryInterval / 1000} seconds...`);
        await new Promise((res) => setTimeout(res, retryInterval));
      }
    }
  }

  if (!connected) {
    console.error("Unable to connect to the database after multiple attempts.");
    process.exit(1);
  }

  try {
    // sync ตาราง events ลงฐานข้อมูล
    await sequelize.sync();
    console.log("Database synced successfully.");

    // Seed ข้อมูลเริ่มต้น
    await seedInitialData();

    // ฟังที่ 0.0.0.0 เพื่อรองรับทั้ง Docker และ Cloud
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
