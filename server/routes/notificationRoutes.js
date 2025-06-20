const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/", notificationController.createNotification);
router.get("/:userType/:id", notificationController.getNotifications);

module.exports = router;
