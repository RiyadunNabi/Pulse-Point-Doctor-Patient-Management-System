const express = require("express");
const router = express.Router();
const {
    getAllDrugs,
    getDrugById,
    createDrug,
    updateDrug,
    deleteDrug,
} = require("../controllers/drugController");

router.route('/')
    .get(getAllDrugs)
    .post(createDrug);

router.route('/:id')
    .get(getDrugById)
    .patch(updateDrug)
    .delete(deleteDrug);

module.exports = router;