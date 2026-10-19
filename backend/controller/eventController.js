const { Op } = require("sequelize");
const { Event, ALLOWED_CATEGORIES } = require("../model");

// ฟังก์ชันช่วยตรวจสอบ ID ให้เป็นจำนวนเต็มบวก
const isValidPositiveIntegerId = (id) => {
  const num = Number(id);
  return Number.isInteger(num) && num > 0;
};

// 1. GET /api/events (อ่านรายการ ค้นหา และกรอง)
exports.getAllEvents = async (req, res) => {
  try {
    const { search, category } = req.query;
    const whereConditions = {};

    // ค้นหาบางส่วนจากชื่อกิจกรรม (title)
    if (search && search.trim() !== "") {
      whereConditions.title = {
        [Op.like]: `%${search.trim()}%`,
      };
    }

    // กรองตามหมวดหมู่
    if (category && category.trim() !== "") {
      whereConditions.category = category.trim();
    }

    const events = await Event.findAll({
      where: whereConditions,
      order: [["id", "DESC"]],
    });

    // หากไม่พบรายการ ให้ตอบ 200 พร้อมรายการว่างตามข้อกำหนด
    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในระบบในการดึงข้อมูล",
    });
  }
};

// 2. GET /api/events/:id (อ่านรายละเอียดหนึ่งรายการ)
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบ id ว่าเป็นจำนวนเต็มบวกหรือไม่
    if (!isValidPositiveIntegerId(id)) {
      return res.status(400).json({
        success: false,
        message: "รหัส (id) ต้องเป็นจำนวนเต็มบวกเท่านั้น",
      });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบข้อมูลกิจกรรมรหัส ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในระบบในการค้นหาข้อมูล",
    });
  }
};

// 3. POST /api/events (เพิ่มรายการ)
exports.createEvent = async (req, res) => {
  try {
    let { title, organizer, category, eventDate, description, status } =
      req.body;

    // ตรวจสอบข้อความที่มีเฉพาะช่องว่างถือว่าไม่ได้ระบุข้อมูล (Trim Validation)
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุชื่อกิจกรรม และต้องไม่มีเฉพาะช่องว่าง",
      });
    }

    if (typeof organizer !== "string" || organizer.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุผู้จัด และต้องไม่มีเฉพาะช่องว่าง",
      });
    }

    if (typeof description !== "string" || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุรายละเอียด และต้องไม่มีเฉพาะช่องว่าง",
      });
    }

    // ตรวจสอบหมวดหมู่
    if (!category || !ALLOWED_CATEGORIES.includes(category.trim())) {
      return res.status(400).json({
        success: false,
        message: `หมวดหมู่ไม่ถูกต้อง ต้องเป็นหนึ่งใน: ${ALLOWED_CATEGORIES.join(", ")}`,
      });
    }

    // ตรวจสอบรูปแบบวันที่ YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!eventDate || !dateRegex.test(eventDate)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบวันที่จัดต้องเป็น YYYY-MM-DD",
      });
    }

    // กำหนดค่า status (default true)
    const eventStatus = status !== undefined ? Boolean(status) : true;

    const newEvent = await Event.create({
      title: title.trim(),
      organizer: organizer.trim(),
      category: category.trim(),
      eventDate,
      description: description.trim(),
      status: eventStatus,
    });

    return res.status(201).json({
      success: true,
      message: "เพิ่มข้อมูลกิจกรรมสำเร็จ",
      data: newEvent,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      });
    }
    console.error("Error creating event:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในระบบในการเพิ่มข้อมูล",
    });
  }
};

// 4. PUT /api/events/:id (แก้ไขทุกฟิลด์ที่ผู้ใช้กรอก)
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidPositiveIntegerId(id)) {
      return res.status(400).json({
        success: false,
        message: "รหัส (id) ต้องเป็นจำนวนเต็มบวกเท่านั้น",
      });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบข้อมูลกิจกรรมรหัส ${id} ที่ต้องการแก้ไข`,
      });
    }

    let { title, organizer, category, eventDate, description, status } =
      req.body;

    // ตรวจสอบ Validation
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุชื่อกิจกรรม และต้องไม่มีเฉพาะช่องว่าง",
      });
    }

    if (typeof organizer !== "string" || organizer.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุผู้จัด และต้องไม่มีเฉพาะช่องว่าง",
      });
    }

    if (typeof description !== "string" || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุรายละเอียด และต้องไม่มีเฉพาะช่องว่าง",
      });
    }

    if (!category || !ALLOWED_CATEGORIES.includes(category.trim())) {
      return res.status(400).json({
        success: false,
        message: `หมวดหมู่ไม่ถูกต้อง ต้องเป็นหนึ่งใน: ${ALLOWED_CATEGORIES.join(", ")}`,
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!eventDate || !dateRegex.test(eventDate)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบวันที่จัดต้องเป็น YYYY-MM-DD",
      });
    }

    const eventStatus = status !== undefined ? Boolean(status) : event.status;

    await event.update({
      title: title.trim(),
      organizer: organizer.trim(),
      category: category.trim(),
      eventDate,
      description: description.trim(),
      status: eventStatus,
    });

    return res.status(200).json({
      success: true,
      message: "แก้ไขข้อมูลกิจกรรมสำเร็จ",
      data: event,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      });
    }
    console.error("Error updating event:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในระบบในการแก้ไขข้อมูล",
    });
  }
};

// 5. DELETE /api/events/:id (ลบรายการ)
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidPositiveIntegerId(id)) {
      return res.status(400).json({
        success: false,
        message: "รหัส (id) ต้องเป็นจำนวนเต็มบวกเท่านั้น",
      });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบข้อมูลกิจกรรมรหัส ${id} ที่ต้องการลบ`,
      });
    }

    await event.destroy();

    return res.status(200).json({
      success: true,
      message: `ลบข้อมูลกิจกรรมรหัส ${id} สำเร็จ`,
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในระบบในการลบข้อมูล",
    });
  }
};

