import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";



function Dashboard() {


const [habits,setHabits] = useState([]);
const [user, setUser] = useState(null);
const [currentStreak, setCurrentStreak] = useState(0);
const [longestStreak, setLongestStreak] = useState(0);

const location = useLocation();
const [sidebarOpen, setSidebarOpen] = useState(false);



useEffect(() => {

  fetchHabits();
  fetchStreak();

}, [location.pathname]);



const fetchHabits = async () => {
  try {
    const response = await api.get("/habits");

    console.log("API Response:", response.data.length);
    

    setHabits(response.data);
    console.log(
  response.data.map(h => ({
    name: h.name,
    score: h.score,
    completed: h.completed,
    category: h.category
  }))
);

    const userRes = await api.get("/users/profile");
    setUser(userRes.data);

  } catch (error) {
    console.log(error);
  }
};

const fetchStreak = async () => {

  try {

    const res = await api.get("/habits/dashboard-streak");

    setCurrentStreak(res.data.currentStreak);
    setLongestStreak(res.data.longestStreak);

  } catch (err) {

    console.log(err);

  }

};


const totalHabits =
habits.length;



const completedHabits =
habits.filter(
habit=>habit.completed
).length;
const pendingHabits =
totalHabits - completedHabits;
// ========================
// Habit Score
// ========================

let totalScore = 0;

habits.forEach((habit) => {

  if (habit.category === "good") {

    if (habit.completed) {
      totalScore += 10;
    }

  } else {

    if (habit.completed) {
      totalScore -= 10;
    } else {
      totalScore += 10;
    }

  }

});

totalScore = Math.max(totalScore, 0);

const maxScore = habits.length * 10;

const scorePercentage =
maxScore === 0
? 0
: Math.round((totalScore / maxScore) * 100);


const percentage =
totalHabits===0
?
0
:
Math.round(
(completedHabits/totalHabits)*100
);

// Best Performance - Today Completed

const completedToday = habits.filter(
  habit => habit.completed
).length;



// Calculate Current Streak



console.log("Completed habits:", completedHabits);
console.log("Current streak:", currentStreak);

console.log(
  habits.map(habit => ({
    name: habit.name,
    completed: habit.completed,
    dates: habit.completedDates
  }))
);

return (

<div className="flex">


<Sidebar
    open={sidebarOpen}
    setOpen={setSidebarOpen}
/>



<div
className="
flex-1
min-h-screen
w-full
h-screen
overflow-y-auto
overflow-x-hidden
bg-gradient-to-br
from-slate-50
to-indigo-50
dark:from-gray-700
dark:via-slate-700
dark:to-gray-700
transition-colors
duration-300
"
>


<Navbar
    setSidebarOpen={setSidebarOpen}
/>



<main
className="
pt-5
md:pt-8

px-4
md:px-6
lg:px-8
overflow-x-hidden

pb-8
"
>



<div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

  <div className="text-center lg:text-left">

    <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white">
  Welcome back, {user?.name || "User"} 
</h1>

    <p className="text-gray-500 mt-2 dark:text-gray-400 text-sm sm:text-base lg:text-lg">
      Stay consistent and become 1% better every day.
    </p>

  </div>

  <div className="w-full lg:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white px-6 sm:px-8 py-5 shadow-xl  ">

    <p className="text-sm opacity-90">
      Today's Progress
    </p>

    <h2 className="text-3xl font-bold mt-2">
      {percentage}%
    </h2>

    <p className="mt-2 text-sm">
      {completedHabits} / {totalHabits} Habits Completed
    </p>

  </div>

</div>





{/* Cards */}

<div className="grid grid-cols-1  sm:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4 xl:gap-6 mt-8">




<StatsCard
  title="Total Habits"
  value={habits.length}
  color="#6366F1"
  icon="📋"
  subtitle="Active habits"
/>

<StatsCard
  title="Completed"
  value={completedHabits}
  color="#22C55E"
  icon="✅"
  subtitle="Completed today"
/>

<StatsCard
  title="Habit Score"
  value={`${totalScore}/${maxScore}`}
  color="#8B5CF6"
  icon="🏅"
  subtitle={`${scorePercentage}% Score`}
/>

<StatsCard
  title="Pending"
  value={pendingHabits}
  color="#EF4444"
  icon="⏳"
  subtitle="Need attention"
/>

<StatsCard
  title="Completion"
  value={`${percentage}%`}
  color="#F97316"
  icon="📈"
  subtitle="Keep going!"
/>


</div>







{/* Progress */}

{/* Today's Progress */}

<div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-xl p-5 sm:p-6 lg:p-8 mt-8 text-white">

  <div className="flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">

    {/* Left */}

    <div>

      <h2 className="text-2xl sm:text-3xl font-bold">
        Today's Progress 🚀
      </h2>

      <p className="mt-2 text-sm sm:text-base text-indigo-100">
        Keep building your habits every single day.
      </p>

      <div className="w-full max-w-xl mx-auto lg:mx-0 bg-indigo-300 rounded-full h-4 mt-6">

        <div
          className="bg-white h-4 rounded-full transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <p className="mt-4 text-base sm:text-lg">

        <span className="font-bold">
          {completedHabits}
        </span>

        {" "}of{" "}

        <span className="font-bold">
          {totalHabits}
        </span>

        {" "}habits completed

      </p>

    </div>

    {/* Right */}

    <div className="text-center">

      <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full border-8 border-white flex items-center justify-center mx-auto">

        <div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            {percentage}%
          </h2>

          <p className="text-sm mt-2">
            Completed
          </p>

        </div>

      </div>

    </div>

  </div>

</div>



<div className="
bg-white
dark:bg-gray-900
rounded-3xl
shadow-xl
p-5
sm:p-6
lg:p-8
mt-8
transition-colors
">
<h2 className="text-xl dark:text-white sm:text-2xl font-bold">
🏅 Habit Score
</h2>

<div className="mt-6">

<div className="flex flex-col sm:flex-row sm:justify-between gap-2">

<p className="font-semibold text-gray-800 dark:text-gray-200">
Today's Score
</p>

<p className="text-gray-700 dark:text-gray-300">
{totalScore} / {maxScore}
</p>

</div>

<div className="w-full max-w-3xl h-5 bg-gray-200 dark:bg-gray-700 rounded-full mt-3">

<div
className="bg-gradient-to-r from-yellow-400 to-orange-500 h-5 rounded-full transition-all duration-700"
style={{
width: `${scorePercentage}%`
}}
/>

</div>

<p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">

Your performance score is

<span className="font-bold text-orange-600">
{" "}
{scorePercentage}%
</span>

</p>

</div>

</div>

{/* habit */}

<div className="
bg-white
dark:bg-gray-900
rounded-2xl
shadow-md
p-6
mt-8
transition-colors
">

  

    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
      Recent Habits
    </h2>

  

  <div className="w-full overflow-x-auto">
    

    <table className="min-w-[600px] w-full ">

      <thead>

        <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">

          <th className="text-left py-3">Habit</th>
          <th className="text-left py-3">Category</th>
          <th className="text-left py-3">Type</th>
          <th className="text-left py-3">Progress</th>
          <th className="text-left py-3">Status</th>

        </tr>

      </thead>

      <tbody>

        {console.log(
          habits.map(h => ({
            name: h.name,
            createdAt: h.createdAt,
          }))
        )}

        {habits.map((habit) => (

          <tr
            key={habit._id}
            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >

            <td className="py-2 font-medium text-gray-800 dark:text-gray-100">

              {habit.completed ? "✔️" : "⭕"} {habit.name}

            </td>

            <td className="text-gray-700 dark:text-gray-300">
              {habit.category}</td>

            <td className=" text-gray-700 dark:text-gray-300 capitalize">
              {habit.trackingType === "target"
    ? "Target"
    : "Yes / No"}
            </td>

            <td className="text-gray-700 dark:text-gray-300">

              {habit.trackingType === "target"

                ? `${habit.progress}/${habit.target.value} ${habit.target.unit}`

                : "-"}

            </td>

            <td className="text-gray-700 dark:text-gray-300">

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  habit.completed
                    ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                }`}
              >

                {habit.completed ? "Completed" : "Pending"}

              </span>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>
  

</div>


<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-8">

  {/* Current Streak */}

  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg
hover:shadow-2xl
transition-all
duration-300
hover:-translate-y-1 p-6 ">

    <div className="flex justify-between items-center">

      <div>

        <p className="text-gray-500 dark:text-white text-sm">
          Current Streak
        </p>

        <h2 className="text-5xl font-bold text-orange-500 mt-2">
          {currentStreak}
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Consecutive Days
        </p>

      </div>

      <div className="text-5xl">
        🔥
      </div>

    </div>

  </div>

  {/* Best Performance */}

  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg
hover:shadow-2xl
transition-all
duration-300
hover:-translate-y-1 p-6 ">

    <div className="flex justify-between items-center">

      <div>

        <p className="text-gray-500 dark:text-white text-sm">
          Best Performance
        </p>

        <h2 className="text-5xl font-bold text-purple-600 mt-2">
          {completedToday}
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Habits Completed Today
        </p>

      </div>

      <div className="text-5xl">
        🏆
      </div>

    </div>

  </div>

  {/* Longest Streak */}

  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg
hover:shadow-2xl
transition-all
duration-300
hover:-translate-y-1 p-6 ">

    <div className="flex justify-between items-center">

      <div>

        <p className="text-gray-500 dark:text-white text-sm">
          Longest Streak
        </p>

        <h2 className="text-5xl font-bold text-blue-600 mt-2">
          {longestStreak}
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Best Consecutive Days
        </p>

      </div>

      <div className="text-5xl">
        🥇
      </div>

    </div>

  </div>

</div>



</main>


</div>


</div>


);


}



export default Dashboard;