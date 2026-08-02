const Habit = require("../models/Habit");
const saveHistory = require("./saveHistory");
const SystemSettings = require("../models/SystemSettings");

const dailyReset = async () => {
  try {

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
        // Check whether today's reset has already been completed
    let settings = await SystemSettings.findOne({
      key: "lastResetDate",
    });

    if (settings && settings.value === today) {
      console.log("✅ Today's reset already completed.");
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayDate = yesterday.toLocaleDateString("en-CA", {
  timeZone: "Asia/Kolkata",});

    const users = await Habit.distinct("user");

    for (const userId of users) {

      const habits = await Habit.find({
        user: userId,
      });

      if (!habits.length) continue;

      // Save yesterday
      await saveHistory(userId, yesterdayDate);

      // Reset for today
      for (const habit of habits) {

        habit.completed = false;
        habit.progress = 0;
        habit.lastResetDate = today;

        await habit.save();

      }

    }

    // Save today's reset date
    if (!settings) {
      settings = new SystemSettings({
        key: "lastResetDate",
        value: today,
      });
    } else {
      settings.value = today;
    }

    await settings.save();

    console.log("Daily Reset Completed");

  } catch (err) {

    console.log(err);

  }
};

module.exports = dailyReset;