const express = require("express");
const {
  getAllSalinanPutusan,
  createSalinanPutusan,
  updateSalinanPutusan,
  deleteSalinanPutusan,
} = require("../controllers/salinanPutusanController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Semua rute di bawah ini dilindungi dan memerlukan login
router.use(protect);

router.route("/").get(getAllSalinanPutusan).post(createSalinanPutusan);

router.route("/:id").put(updateSalinanPutusan).delete(deleteSalinanPutusan);

module.exports = router;
