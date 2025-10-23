const express = require("express");
const { register, login } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// Endpoint untuk mendapatkan data pengguna yang sedang login
router.get("/me", protect, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
