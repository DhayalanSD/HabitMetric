const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    theme: {
    type: String,
    enum: ["light", "dark", "system"],
    default: "system",
},



    resetPasswordToken: {
  type: String,
},

resetPasswordExpire: {
  type: Date,
},

emailChangeToken: {
  type: String,
},

emailChangeExpire: {
  type: Date,
},

    phone: {
        type: String,
        default: "",},
    profileImage: {
        type: String,
        default: "",
      },
    
    dailyGoal: {
        type: Number,
        default: 8,
      },

      defaultCategory: {
        type: String,
        default: "Health",
      },

      reminder: {
  type: Boolean,
  default: true,
},

reminderTime: {
  type: String,
  default: "20:00",
},

timeZone: {
  type: String,
  default: "Asia/Kolkata",
},

lastReminderSent: {
  type: Date,
  default: null,
},

    
      
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);