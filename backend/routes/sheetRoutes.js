// routes/sheetRoutes.js

const express = require("express");
const router = express.Router();

// Impor middleware protect dan restrictTo
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { getSheet, updateSheet, deleteSheet } = require("../controllers/sheetController");

// Route ini bisa diakses oleh semua role yang sudah login
router.get("/sheet", protect, getSheet);

// Route ini hanya bisa diakses oleh 'admin' dan 'superadmin'
router.post(
    "/sheet",
    protect,
    restrictTo("admin", "superadmin"),
    updateSheet
);

// Contoh: Route ini hanya bisa diakses oleh 'superadmin'
router.delete(
    "/sheet/:rowId",
    protect,
    restrictTo("superadmin"),
    deleteSheet // Asumsi Anda punya controller untuk delete
);

module.exports = router;
