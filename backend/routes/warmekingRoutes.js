const express = require("express");
const {
  createWarmeking,
  getAllWarmeking,
  updateWarmeking,
  deleteWarmeking,
} = require("../controllers/warmekingController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createWarmeking).get(protect, getAllWarmeking);

router
  .route("/:id")
  .put(protect, updateWarmeking)
  .delete(protect, deleteWarmeking);

module.exports = router;
