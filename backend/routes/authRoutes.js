const express = require("express");

const {
  registerUser,
  loginUser,
  checkEmail,
  sendRegistrationLink,
  verifyRegistrationToken,
  completeRegistration,
  registrationInfo,
} = require("../controllers/authController");

const router = express.Router();

router.post("/check-email", checkEmail);
router.post("/register", registerUser);

router.post("/login", loginUser);
router.post("/send-registration-link", sendRegistrationLink);
router.get(
  "/registration-info/:token",
  registrationInfo
);
router.post("/complete-registration/:token", completeRegistration);
router.get(
  "/verify-registration/:token",
  verifyRegistrationToken
);

module.exports = router;