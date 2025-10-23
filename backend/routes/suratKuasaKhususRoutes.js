const express = require("express");
const {
  createSuratKuasaKhusus,
  getAllSuratKuasaKhusus,
  updateSuratKuasaKhusus,
  deleteSuratKuasaKhusus,
} = require("../controllers/suratKuasaKhususController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, createSuratKuasaKhusus)
  .get(protect, getAllSuratKuasaKhusus);

router
  .route("/:id")
  .put(protect, updateSuratKuasaKhusus)
  .delete(protect, deleteSuratKuasaKhusus);

module.exports = router;
