const express = require("express");
const {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/suratKeteranganTidakDipidanaController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createRecord).get(protect, getAllRecords);

// Rute untuk update dan delete
router.route("/:id").put(protect, updateRecord).delete(protect, deleteRecord);

module.exports = router;
