const express = require("express");
const router = express.Router();
const {
    getAllDrugs,
    getDrugById,
    createDrug,
    updateDrug,
    deleteDrug,
} = require("../controllers/drugController");

// Get all drugs (with optional search) and create a new drug
router.route('/')
    .get(getAllDrugs)
    .post(createDrug);

// Get, update, or delete a specific drug by its ID
router.route('/:id')
    .get(getDrugById)
    .patch(updateDrug)
    .delete(deleteDrug);

module.exports = router;