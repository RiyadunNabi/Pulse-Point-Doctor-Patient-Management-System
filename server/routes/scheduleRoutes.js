const express = require('express');
const router = express.Router();
const {
    getAvailableSlots,
    getSchedulesByDoctor,
    getDoctorScheduleConfig,
    createSchedule,
    createRecurringSchedule,
    createSpecificSchedule,
    updateSchedule,
    deleteSchedule,
    deactivateSchedule,
    activateSchedule
} = require('../controllers/scheduleController');

// Available slots
router.get('/available/:doctorId', getAvailableSlots);

// Schedule management
router.get('/doctor/:doctorId', getSchedulesByDoctor);
router.get('/config/:doctorId', getDoctorScheduleConfig);

// Create schedules
router.post('/', createSchedule);                    // Legacy support
router.post('/recurring', createRecurringSchedule);  // New specific routes
router.post('/specific', createSpecificSchedule);

// Update/Delete
router.patch('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);
router.patch('/:id/deactivate', deactivateSchedule);
router.patch('/:id/activate', activateSchedule);

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const {
//   getSchedulesByDoctor,
//   createSchedule,
//   updateSchedule,
//   deleteSchedule,
// } = require("../controllers/scheduleController");

// router.route("/")
//   .post(createSchedule);

// router.route("/doctor/:doctorId")
//   .get(getSchedulesByDoctor);

// router.route("/:id")
//   .patch(updateSchedule)
//   .delete(deleteSchedule);

// module.exports = router;