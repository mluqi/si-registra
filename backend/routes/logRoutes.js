const express = require("express");
const router = express.Router();
const {
  getAccessLogs,
  getActivityLogs,
} = require("../controllers/logController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Semua rute di sini dilindungi dan hanya untuk admin/superadmin
router.use(protect, restrictTo("admin", "superadmin"));

router.get("/access", getAccessLogs);
router.get("/activity", getActivityLogs);

module.exports = router;
