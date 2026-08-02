const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({

  // Owner of this history
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  date: {
    type: String,
    required: true,
    
  },

  total: {
    type: Number,
    default: 0,
  },

  completed: {
    type: Number,
    default: 0,
  },

  pending: {
    type: Number,
    default: 0,
  },

  completionRate: {
    type: Number,
    default: 0,
  },

  score:{
    type:Number,
    default:0
},

  habits: [

    {

      habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habit",
      },

      name: String,

      category: String,

      trackingType: String,

      completed: Boolean,

      progress: Number,

      target: {
        value: Number,
        unit: String,
      },

    },

  ],

}, {
  timestamps: true,
});

// Prevent duplicate history for the same user on the same date
HistorySchema.index(
  {
    user: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("History", HistorySchema);