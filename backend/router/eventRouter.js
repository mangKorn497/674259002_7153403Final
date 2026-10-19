const express = require("express");
const router = express.Router();
const eventController = require("../controller/eventController");

// เส้นทาง API ครบ 5 Endpoints ตามข้อกำหนด
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.post("/", eventController.createEvent);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

module.exports = router;

