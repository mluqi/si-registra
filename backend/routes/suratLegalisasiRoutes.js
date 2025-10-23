const express = require("express");
const {
  createLegalisasi,
  getAllLegalisasi,
  updateLegalisasi,
  deleteLegalisasi,
} = require("../controllers/suratLegalisasiController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, createLegalisasi)
  .get(protect, getAllLegalisasi);

router
  .route("/:id")
  .put(protect, updateLegalisasi)
  .delete(protect, deleteLegalisasi);

module.exports = router;
