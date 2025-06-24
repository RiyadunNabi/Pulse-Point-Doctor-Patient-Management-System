const express = require("express");
const router = express.Router();
const {
    getAllInvestigations,
    getInvestigationById,
    createInvestigation,
    updateInvestigation,
    deleteInvestigation,
} = require("../controllers/investigationController");

router.route('/')
    .get(getAllInvestigations)
    .post(createInvestigation);

router.route('/:id')
    .get(getInvestigationById)
    .patch(updateInvestigation)
    .delete(deleteInvestigation);

module.exports = router;