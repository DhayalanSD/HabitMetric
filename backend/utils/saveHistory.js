const Habit = require("../models/Habit");
const History = require("../models/History");

async function saveHistory(userId, date = null) {
  try {

    const habits = await Habit.find({
      user: userId,
    });

    const total = habits.length;

    function getLocalDate() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
}

const today = getLocalDate();

    const historyDate =
      date || today;

    let completed = 0;
    let pending = 0;
    let completionRate = 0;

    // If saving today's history
    const isToday = historyDate === today;

if (isToday) {

    completed = habits.filter(h => h.completed).length;

} else {

    completed = habits.filter(h =>
        h.completedDates.some(
            d => d.toLocaleDateString("en-CA") === historyDate
        )
    ).length;

}

pending = total - completed;

completionRate =
    total === 0
        ? 0
        : Math.round((completed / total) * 100);

// ============================
// Calculate Habit Score
// ============================

let totalScore = 0;

habits.forEach((habit) => {

  const completedOnDate =
    historyDate === today
      ? habit.completed
      : habit.completedDates.some(
          d => d.toLocaleDateString("en-CA") === historyDate
        );

  if (habit.category === "good") {

    if (completedOnDate) {
      totalScore += 10;
    }

  } else {

    if (completedOnDate) {
      totalScore -= 10;
    } else {
      totalScore += 10;
    }

  }

});

totalScore = Math.max(totalScore, 0);

    const snapshot = habits.map(habit => ({

      habitId: habit._id,

      name: habit.name,

      category: habit.category,

      trackingType: habit.trackingType,

      completed:
        historyDate === today
            ? habit.completed
            : habit.completedDates.some(
                d =>
                 d.toLocaleDateString("en-CA") === historyDate
              ),


      progress:
  historyDate === today
    ? habit.progress
    : habit.completedDates.some(
        d => d.toLocaleDateString("en-CA") === historyDate
      )
      ? habit.target.value
      : 0,

      target: habit.target

    }));

    // Check if history already exists
    await History.findOneAndUpdate(
  {
    user: userId,
    date: historyDate,
  },
  {
    user: userId,
    date: historyDate,
    total,
    completed,
    pending,
    completionRate,
    score: totalScore,
    habits: snapshot,
  },
  {
    upsert: true,
    returnDocument: "after",
  }
);

    console.log(`✅ History saved for ${historyDate}`);

  }

  catch (err) {

    console.log(err);

  }

}

module.exports = saveHistory;