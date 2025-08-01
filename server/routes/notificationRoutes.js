const express = require("express");
const router = express.Router();
const {
    createNotification,
    getNotifications,
    markNotificationAsRead,
    getUnreadCount,
    deleteNotification,
} = require("../controllers/notificationController");

router.post("/", createNotification);

router.get("/:userType/:id", getNotifications);
router.get('/:userType/:id/unread-count', getUnreadCount);

router.route("/:id")
    .patch(markNotificationAsRead)
    .delete(deleteNotification);

module.exports = router;