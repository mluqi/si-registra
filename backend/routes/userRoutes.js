const express = require("express");
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rute ini hanya butuh login, tidak perlu role admin
router.put("/change-password/:id", protect, changePassword);

// Rute di bawah ini dilindungi dan hanya untuk admin/superadmin
router.use(protect, restrictTo("admin", "superadmin"));

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").put(updateUser).delete(deleteUser);

module.exports = router;
