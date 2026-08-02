const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");

// POST /api/password/forgot
router.post("/forgot", forgotPassword);
router.put("/reset/:token", resetPassword);

module.exports = router;