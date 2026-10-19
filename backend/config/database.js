const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DATABASE_URL) {
  // เชื่อมต่อผ่าน DATABASE_URL (เช่น บน Render / Neon / Supabase)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: process.env.DB_DIALECT || "postgres",
    protocol: process.env.DB_DIALECT || "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      ssl:
        process.env.DB_SSL === "false"
          ? false
          : {
              require: true,
              rejectUnauthorized: false,
            },
    },
  });
} else {
  // เชื่อมต่อผ่านตัวแปรแยก (สำหรับ Local Database)
  sequelize = new Sequelize(
    process.env.DB_NAME || "web_exam_db",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "postgres",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      dialect: process.env.DB_DIALECT || "postgres",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      dialectOptions:
        process.env.NODE_ENV === "production"
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }
          : {},
    },
  );
}

module.exports = sequelize;
