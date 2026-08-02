const express = require("express");
const router = express.Router();
const createNotification =
require("../utils/createNotification");
const Habit = require("../models/Habit");
const saveHistory = require("../utils/saveHistory");
const dailyReset = require("../utils/dailyReset");
const calculateStreak = require("../utils/streakCalculator");
const History = require("../models/History");
const getLocalDate = require("../utils/getLocalDate");
const protect = require("../middleware/authMiddleware");
console.log("✅ habitRoutes.js loaded");

// ==========================
// SEARCH HABITS
// ==========================
router.get("/search", protect, async (req, res) => {

  try {

    const query = req.query.q || "";

    const habits = await Habit.find({

      user: req.user._id,

      $or: [

        {
          name: {
            $regex: query,
            $options: "i",
          },
        },

        {
          category: {
            $regex: query,
            $options: "i",
          },
        },

        {
          trackingType: {
            $regex: query,
            $options: "i",
          },
        },

      ],

    }).limit(8);

    res.json(habits);

  }

  catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

});


// ==========================
// GET ALL HABITS
// ==========================
router.get("/", protect, async (req, res) => {
  try {

    // Reset automatically if a new day starts
    

    const habits = await Habit.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(habits);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

// ==========================
// CREATE HABIT
// ==========================
router.post("/", protect, async (req, res) => {

  try {

    const habit = new Habit({
      
      user: req.user._id,

      name: req.body.name,

      category: req.body.category || "good",

      trackingType: req.body.trackingType || "boolean",

      target: req.body.target || {
        value: 0,
        unit: "",
      },

      progress: 0,

      completed: false,
      score: req.body.category === "bad" ? 10 : 0,

      completedDates: [],

      lastResetDate: getLocalDate()

    });

    const savedHabit = await habit.save();

    await saveHistory(req.user._id);
    await createNotification(

      req.user._id,

      "✨ New Habit Created",

      `"${savedHabit.name}" has been added.`

    );

    res.json(savedHabit);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

// ==========================
// TOGGLE BOOLEAN HABIT
// ==========================
router.put("/:id", protect, async (req, res) => {

  try {

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!habit) {

      return res.status(404).json({
        message: "Habit not found",
      });

    }

    if (habit.trackingType !== "boolean") {

      return res.status(400).json({
        message: "Use progress endpoint",
      });

    }

    habit.completed = !habit.completed;

    const today = getLocalDate();

    if (habit.completed) {

      // Score Logic
      if (habit.category === "good") {
        habit.score = 10;
      } else {
        habit.score = -10;
      }

      const exists =
        habit.completedDates.some(
          d =>
            d.toLocaleDateString("en-CA") === today
        );

      if (!exists) {

        habit.completedDates.push(
          new Date()
        );

      }

    } else {

      // Score Logic
      if (habit.category === "good") {
        habit.score = 0;
      } else {
        habit.score = 10;
      }

      habit.completedDates =
        habit.completedDates.filter(
          d =>
            d.toLocaleDateString("en-CA") !== today
        );

    }

    await habit.save();

    await saveHistory(req.user._id);

    if (habit.completed) {

        await createNotification(

          req.user._id,

          "🏆 Habit Completed",

          `You completed "${habit.name}". Keep it up!`

        );

      }

    res.json(habit);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

// ==========================
// UPDATE TARGET PROGRESS
// ==========================
router.put("/:id/progress", protect, async (req, res) => {

  try {

    const habit =
      await Habit.findOne({
  _id: req.params.id,
  user: req.user._id,
})

    if (!habit) {

      return res.status(404).json({
        message: "Habit not found",
      });

    }

    const value =
      Number(req.body.value);

    habit.progress += value;

    if (
      habit.progress >= habit.target.value
    ) {

      habit.progress =
        habit.target.value;

      habit.completed = true;

      // Score Logic
      if (habit.category === "good") {
        habit.score = 10;
      } else {
        habit.score = -10;
      }

      const today = getLocalDate();

      const exists =
        habit.completedDates.some(
          d =>
            d.toLocaleDateString("en-CA") === today
        );

      if (!exists) {

        habit.completedDates.push(
          new Date()
        );

      }

    }

    await habit.save();

    await saveHistory(req.user._id);

    res.json(habit);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

// ==========================
// RESET TARGET HABIT
// ==========================
router.put("/:id/reset", protect, async (req, res) => {

  try {

    const habit =
      await Habit.findOne({
  _id: req.params.id,
  user: req.user._id,
})

    if (!habit) {

      return res.status(404).json({
        message: "Habit not found",
      });

    }

    habit.progress = 0;

    habit.completed = false;

      // Score Logic
      if (habit.category === "good") {
        habit.score = 0;
      } else {
        habit.score = 10;
      }

    const today = getLocalDate();

    habit.completedDates =
      habit.completedDates.filter(
        d =>
          d.toLocaleDateString("en-CA") !== today
      );

    await habit.save();

    await saveHistory(req.user._id);

    res.json(habit);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

// ==========================
// DELETE HABIT
// ==========================
router.delete("/:id", protect, async (req, res) => {

  try {

    await Habit.findOneAndDelete({
  _id: req.params.id,
  user: req.user._id,
    });

    await saveHistory(req.user._id);

    await createNotification(

      req.user._id,

      "🗑 Habit Deleted",

      "One habit has been removed."

    );

    res.json({
      message:
        "Habit deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

// ==========================
// ANALYTICS
// ==========================
router.get("/analytics", protect, async (req, res) => {

  try {

    const habits = await Habit.find({
      user: req.user._id
    });

    const total = habits.length;

    const completed = habits.filter(
      h => h.completed
    ).length;

    const pending = total - completed;

    const completionRate =
      total === 0
        ? 0
        : Math.round((completed / total) * 100);

    let score = 0;

    habits.forEach(habit => {

      if (habit.category === "good") {

        if (habit.completed)
          score += 10;

      } else {

        if (habit.completed)
          score -= 10;
        else
          score += 10;

      }

    });

    score = Math.max(score, 0);

    res.json({

      total,
      completed,
      pending,
      completionRate,
      score

    });

}
catch(err){

    res.status(500).json({
      message: err.message
    });

} 

});

// ==========================
// WEEKLY ANALYTICS
// ==========================


router.get("/weekly", protect, async (req, res) => {

  try {

    const History = require("../models/History");

    const today = new Date(getLocalDate());

    const week = [];

    // Monday -> Sunday
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

    // Find Monday of current week
    const monday = new Date(today);

    const day = monday.getDay(); // Sunday=0

    const diff = day === 0 ? -6 : 1 - day;

    monday.setDate(monday.getDate() + diff);

    for (let i = 0; i < 7; i++) {

      const current = new Date(monday);

      current.setDate(monday.getDate() + i);

      const dateString = getLocalDate(current);

      const history = await History.findOne({
        user: req.user._id,
        date: dateString,
      });

      week.push({
        day: days[i],
        completed: history ? history.completed : 0,
      });

    }

    res.json(week);

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }

});

// ==========================
// HEATMAP DATA
// ==========================

router.get("/heatmap", protect, async (req, res) => {

  try {

    const history = await History.find({
      user: req.user._id,
    });

    const heatmap = history.map(item => ({

      date: item.date,

      count: item.completed

    }));

    res.json(heatmap);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});


// ==========================
// DASHBOARD STREAK
// ==========================
router.get("/dashboard-streak", protect, async (req, res) => {

  try {

    const history = await History.find({
      user: req.user._id,
    }).sort({ date: 1 });

    if (history.length === 0) {

      return res.json({
        currentStreak: 0,
        longestStreak: 0,
      });

    }

    // Convert completed days into a Set
    const completedDays = new Set();

    history.forEach((day) => {

      if (day.completed > 0) {

        completedDays.add(day.date);

      }

    });

    // -------------------------
    // Current Streak
    // -------------------------

    let currentStreak = 0;

    let currentDate = new Date();

    while (true) {

      const dateString = getLocalDate(currentDate);

      if (completedDays.has(dateString)) {

        currentStreak++;

        currentDate.setDate(
          currentDate.getDate() - 1
        );

      } else {

        break;

      }

    }

    // -------------------------
    // Longest Streak
    // -------------------------

    const dates = [...completedDays].sort();

    let longestStreak = 0;

    let streak = 0;

    let previous = null;

    dates.forEach((date) => {

      if (!previous) {

        streak = 1;

      } else {

        const diff =
          (new Date(date) - new Date(previous)) /
          (1000 * 60 * 60 * 24);

     if (Math.round(diff) === 1) {

          streak++;

        } else {

          streak = 1;

        }

      }

      longestStreak = Math.max(
        longestStreak,
        streak
      );

      previous = date;

    });

    res.json({

      currentStreak,

      longestStreak,

    });

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

});



// ==========================
// HABIT STREAK
// ==========================
router.get("/:id/streak", protect, async (req, res) => {

  try {

    const habit =
      await Habit.findOne({
  _id: req.params.id,
  user: req.user._id,
})

    if (!habit) {

      return res.status(404).json({

        message: "Habit not found"

      });

    }

    const streak =
      calculateStreak(
        habit.completedDates
      );

    res.json({

      habit: habit.name,

      ...streak,

      totalCompletedDays:
        habit.completedDates.length

    });

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

});

// ==========================
// GET HABIT BY ID
// ==========================
router.get("/:id", protect, async (req, res) => {

  try {

    const habit =
      await Habit.findOne({
  _id: req.params.id,
  user: req.user._id,
})

    if (!habit) {

      return res.status(404).json({

        message: "Habit not found"

      });

    }

    res.json(habit);

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

});

module.exports = router;