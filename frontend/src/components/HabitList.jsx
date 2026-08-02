import { useState } from "react";
import api from "../services/api";

function HabitList({
  habits,
  onDeleteHabit,
  onToggleHabit,
  refreshHabits,
  updateHabit,
}) {

  const [progressValues, setProgressValues] = useState({});

  const addProgress = async (id) => {

  try {

    const value = Number(progressValues[id]);

    if (!value || value <= 0) return;

    const res = await api.put(`/habits/${id}/progress`, {
  value,
});

updateHabit(res.data);

setProgressValues((prev) => ({
  ...prev,
  [id]: "",
}));

  } catch (error) {

    console.log(error);

  }

};



  const resetHabit = async (id) => {

    try {

      const res = await api.put(`/habits/${id}/reset`);

updateHabit(res.data);

    } catch (error) {

      console.log(error);

    }

  };



  return (

    <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-md p-3">

      {

      habits.length===0

      ?

      (

      <div className="text-center py-16">

        <div className="text-6xl">
          📋
        </div>

        <h2 className="text-2xl dark:text-white font-bold mt-4">
          No Habits Yet
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Create your first habit to start tracking your progress.
        </p>

      </div>

      )

      :

      (

      <div className="space-y-4">

      {

      habits.map((habit) => (

<div
  id={habit._id}
  key={habit._id}
  className="bg-white dark:bg-gray-800 border dark:border-gray-600 border-gray-200 rounded-xl p-5 hover:shadow-md transition"
>

  {/* Top Row */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    {/* Left */}
    <div className="flex items-center gap-4">

      <div
        className={`w-9 h-4 rounded-full ${
          habit.completed ? "bg-green-500" : "bg-red-500"
        }`}
      />

      <div>

        <h3 className="text-lg dark:text-white font-semibold text-gray-800">
          {habit.name}
        </h3>

        <div className="flex gap-2 mt-1">

          <span
            className={`text-xs px-3 py-1 rounded-full ${
              habit.category === "good"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {habit.category === "good" ? "Good Habit" : "Bad Habit"}
          </span>

          <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">
            {habit.trackingType === "boolean" ? "Yes/No" : "Target"}
          </span>

        </div>

      </div>

    </div>

    {/* Right */}

    <div className="flex items-center gap-3 flex-wrap">

      <span
        className={`font-medium ${
          habit.completed
            ? "text-green-600"
            : "text-red-500"
        }`}
      >
        {habit.completed ? "Completed" : "Pending"}
      </span>

      {habit.trackingType === "boolean" && (
        <>
          <button
            onClick={() => onToggleHabit(habit._id)}
            className={`px-4 py-2 rounded-lg text-white ${
              habit.completed
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {habit.completed ? "Undo" : "Complete"}
          </button>

          <button
            onClick={() => onDeleteHabit(habit._id)}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </button>
        </>
      )}

    </div>

  </div>

  {/* Target Habit */}

  {habit.trackingType === "target" && (

    <div className="mt-5 dark:text-gray-300">

      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">

        <span>
          Progress
        </span>

        <span>
          {habit.progress}/{habit.target.value} {habit.target.unit}
        </span>

      </div>

      <div className="w-full h-3 rounded-full dark:bg-gray-600 bg-gray-200">

        <div
          className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"
          style={{
            width: `${Math.min(
              (habit.progress / habit.target.value) * 100,
              100
            )}%`
          }}
        />

      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">

        <input
          type="number"
          placeholder="Amount"
          value={progressValues[habit._id] || ""}
          onChange={(e) =>
            setProgressValues({
              ...progressValues,
              [habit._id]: e.target.value,
            })
          }
          className="border rounded-lg px-3 py-2 w-32"
        />

        <button
          onClick={() => addProgress(habit._id)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>

        <button
          onClick={() => resetHabit(habit._id)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
        >
          Reset
        </button>

        <button
          onClick={() => onDeleteHabit(habit._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Delete
        </button>

      </div>

    </div>

  )}

</div>

))}

      

      </div>

      )

      }

    </div>

  );

}

export default HabitList;