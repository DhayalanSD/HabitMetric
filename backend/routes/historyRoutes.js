const express = require("express");
const router = express.Router();

const History = require("../models/History");
const protect = require("../middleware/authMiddleware");

// ======================
// Get All History
// ======================
router.get("/", protect, async (req, res) => {

  try {

    const history = await History.find({
      user: req.user._id,
    })

    res.json(history);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

// ======================
// Get History By Date
// ======================
router.get("/:date", protect, async (req, res) => {

  try {

    const history = await History.findOne({

      user: req.user._id,

      date: req.params.date,

    });

    if (!history) {

      return res.status(404).json({
        message: "No history found",
      });

    }

    res.json(history);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});


module.exports = router;