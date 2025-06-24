const express = require("express");
const router = express.Router();
const {
    createNotification,
    getNotifications,
    markNotificationAsRead,
    deleteNotification,
} = require("../controllers/notificationController");

// Create a new notification
router.post("/", createNotification);

// Get all notifications for a specific user
router.get("/:userType/:id", getNotifications);

// Mark a notification as read or delete it by its own ID
router.route("/:id")
    .patch(markNotificationAsRead)
    .delete(deleteNotification);

module.exports = router;