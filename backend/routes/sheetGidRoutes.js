const express = require("express");
const router = express.Router();
const { getSheetGidByName } = require("../controllers/sheetGidController");
const { protect } = require("../middlewares/authMiddleware");

// Rute untuk mendapatkan GID berdasarkan nama sheet
router.route("/:sheetName").get(protect, getSheetGidByName);

module.exports = router;
