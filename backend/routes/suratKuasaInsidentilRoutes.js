const express = require("express");
const {
  createSuratKuasaInsidentil,
  getAllSuratKuasaInsidentil,
  updateSuratKuasaInsidentil,
  deleteSuratKuasaInsidentil,
} = require("../controllers/suratKuasaInsidentilController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, createSuratKuasaInsidentil)
  .get(protect, getAllSuratKuasaInsidentil);

router
  .route("/:id")
  .put(protect, updateSuratKuasaInsidentil)
  .delete(protect, deleteSuratKuasaInsidentil);

module.exports = router;
