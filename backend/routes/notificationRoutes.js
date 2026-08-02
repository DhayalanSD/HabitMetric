const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const protect = require("../middleware/authMiddleware");

// ==============================
// GET ALL NOTIFICATIONS
// ==============================
router.get("/", protect, async (req, res) => {

  try {

    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(notifications);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

});

// ==============================
// MARK ALL AS READ
// ==============================
router.put("/read", protect, async (req, res) => {

  try {

    await Notification.updateMany(

      {
        user: req.user._id,
      },

      {
        read: true,
      }

    );

    res.json({
      message: "Notifications marked as read",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

});

// ==============================
// CLEAR ALL NOTIFICATIONS
// ==============================
router.delete("/", protect, async (req, res) => {

  try {

    await Notification.deleteMany({

      user: req.user._id,

    });

    res.json({

      message: "Notifications cleared",

    });

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

});

module.exports = router;