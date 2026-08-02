const mongoose = require("mongoose");
const getLocalDate = require("../utils/getLocalDate");

const habitSchema = new mongoose.Schema({
  // Owner of the habit
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
  // Habit Name
  name: {
    type: String,
    required: true,
  },

  // Good Habit / Bad Habit
  category: {
    type: String,
    enum: ["good", "bad"],
    default: "good",
  },

  // Boolean or Target Habit
  trackingType: {
    type: String,
    enum: ["boolean", "target"],
    default: "boolean",
  },

  // Target Details
  target: {
    value: {
      type: Number,
      default: 0,
    },

    unit: {
      type: String,
      default: "",
    },
  },

  // Current Progress
      progress: {
        type: Number,
        default: 0,
      },

      // Completion Status
    completed: {
      type: Boolean,
      default: false,
    },

    // Habit Score
    score: {
      type: Number,
      default: 0,
    },

  // NEW: Last date this habit was reset
  lastResetDate: {
  type: String,
  default: getLocalDate,
},

  // Used for streak calculation
  completedDates: [
    {
      type: Date,
    },
  ],

  // Created Date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Habit", habitSchema);