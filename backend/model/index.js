const sequelize = require("../config/database");
const { Event, ALLOWED_CATEGORIES } = require("./eventModel");

module.exports = {
  sequelize,
  Event,
  ALLOWED_CATEGORIES,
};
