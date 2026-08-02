const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
  },

  value: String,
});

module.exports = mongoose.model(
  "SystemSettings",
  systemSettingsSchema
);