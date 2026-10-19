const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// หมวดหมู่ที่อนุญาตสำหรับชุดที่ 4 (D) - กิจกรรม
const ALLOWED_CATEGORIES = ["อบรม", "สัมมนา", "จิตอาสา"];

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notNull: { msg: "กรุณาระบุชื่อกิจกรรม (title)" },
        notEmpty: { msg: "ชื่อกิจกรรมต้องไม่เป็นค่าว่าง" },
        len: {
          args: [1, 150],
          msg: "ชื่อกิจกรรมต้องมีความยาวระหว่าง 1 ถึง 150 ตัวอักษร",
        },
      },
    },
    organizer: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: { msg: "กรุณาระบุผู้จัด (organizer)" },
        notEmpty: { msg: "ผู้จัดต้องไม่เป็นค่าว่าง" },
        len: {
          args: [1, 100],
          msg: "ผู้จัดต้องมีความยาวระหว่าง 1 ถึง 100 ตัวอักษร",
        },
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: { msg: "กรุณาระบุหมวดหมู่ (category)" },
        isIn: {
          args: [ALLOWED_CATEGORIES],
          msg: `หมวดหมู่ต้องเป็นหนึ่งใน: ${ALLOWED_CATEGORIES.join(", ")}`,
        },
      },
    },
    eventDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: { msg: "กรุณาระบุวันที่จัด (eventDate)" },
        isDate: { msg: "รูปแบบวันที่ไม่ถูกต้อง ต้องเป็น YYYY-MM-DD" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "กรุณาระบุรายละเอียด (description)" },
        notEmpty: { msg: "รายละเอียดต้องไม่เป็นค่าว่าง" },
        len: {
          args: [1, 2000],
          msg: "รายละเอียดต้องมีความยาวระหว่าง 1 ถึง 2,000 ตัวอักษร",
        },
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "events",
    timestamps: true, // สร้าง createdAt และ updatedAt ให้อัตโนมัติตามเกณฑ์
  },
);

module.exports = { Event, ALLOWED_CATEGORIES };

