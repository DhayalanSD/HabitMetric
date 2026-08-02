const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const createNotification = require("../utils/createNotification");
const sendEmail = require("../config/email");
const emailTemplate = require("../utils/emailTemplate");

const {

  getReminderSettings,

  updateReminderSettings,

  requestEmailChange,

  verifyEmailChange,

  deleteAccount,

} = require("../controllers/userController");
// =============================
// GET PROFILE
// =============================
router.get("/profile", protect, async (req, res) => {

    try {

        const user = await User.findById(req.user._id).select("-password");

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

});


// =============================
// UPDATE PROFILE
// =============================
router.put("/profile", protect, async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({
                message: "User not found",
            });

        }

        user.name = req.body.name;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.theme = req.body.theme;

        user.dailyGoal = req.body.dailyGoal;
        user.defaultCategory = req.body.defaultCategory;

        user.reminder = req.body.reminder;
        user.reminderTime = req.body.reminderTime;

        

        await user.save();
        await createNotification(

        user._id,

        "👤 Profile Updated",

        "Your profile has been updated successfully."

      );

        res.json({

          message: "Profile Updated",

          user: {

              name: user.name,
              email: user.email,
              phone: user.phone,
              theme: user.theme,
              dailyGoal: user.dailyGoal,
              defaultCategory: user.defaultCategory,
              reminder: user.reminder,
              reminderTime: user.reminderTime,
              
              

          }

      });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

});

// =============================
// password change
// =============================

router.put("/change-password", protect, async (req, res) => {

  try {

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
      newPassword,
      salt
    );

    await user.save();

    await createNotification(

      user._id,

      "🔒 Password Changed",

      "Your password was updated successfully."

    );

    await sendEmail({

  email: user.email,

  subject: "🔒 Your HabitMetric Password Was Changed",

  message: emailTemplate({

    title: "Password Updated",

    heading: "Your Password Has Been Changed 🔒",

    message: `

      <p>

      Hello <strong>${user.name}</strong> 👋

      </p>

      <p>

      Your HabitMetric password has been changed successfully.

      </p>

      <div
      style="
      background:#ECFDF5;
      border-left:5px solid #16A34A;
      padding:18px;
      border-radius:10px;
      margin:25px 0;
      ">

      <h3
      style="
      margin:0;
      color:#16A34A;
      ">

      ✅ Password Updated Successfully

      </h3>

      <p style="margin-top:10px;">

      Your account is now protected with your new password.

      </p>

      </div>

      <p>

      If you made this change, no further action is required.

      </p>

      <p style="color:#DC2626;">

      If you did NOT change your password,
      please reset it immediately.

      </p>

    `,

    buttonText: "Login to HabitMetric",

    buttonLink: `${process.env.FRONTEND_URL}/login`,

  }),

});

    res.json({
      message: "Password updated successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

    // ===========================
// DELETE ACCOUNT
// ===========================
router.delete(
  "/delete-account",
  protect,
  deleteAccount
);

// ===============================
// Upload Profile Image
// ===============================
router.post(
  "/upload-profile",
  protect,
  upload.single("profileImage"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded"
        });
      }

      const user = await User.findById(req.user._id);

      if (!user) {

        return res.status(404).json({
          message: "User not found",
        });

      }

      user.profileImage =
        `/uploads/${req.file.filename}`;

      await user.save();

      res.json({

        message: "Profile image uploaded",

        profileImage: user.profileImage,

      });

    } catch (err) {

      res.status(500).json({

        message: err.message,

      });

    }

  }
);

// ===============================
// Reminder Settings
// ===============================

router.get(
  "/reminder-settings",
  protect,
  getReminderSettings
);

router.put(
  "/reminder-settings",
  protect,
  updateReminderSettings
);

// ===============================
// Request Email Change
// ===============================

router.post(
  "/change-email-request",
  protect,
  requestEmailChange
);

// ===============================
// Verify Email Change
// ===============================

router.get(
  "/verify-email-change/:token",
  verifyEmailChange
);

module.exports = router;