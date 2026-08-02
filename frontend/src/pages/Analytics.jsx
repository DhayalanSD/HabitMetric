import {
useEffect,
useState
} from "react";


import api from "../services/api";

import {
  Trophy,
  Target,
  Flame,
  Rocket,
  Crown,
  Lock,
  CheckCircle2,
} from "lucide-react";


import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,

PieChart,
Pie,
Cell,
Legend

} from "recharts";


import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";



function Analytics(){



const [stats,setStats]=useState({

total:0,
completed:0,
pending:0

});



const [weeklyData,setWeeklyData]=useState([]);
const [habits, setHabits] = useState([]);
const [sidebarOpen, setSidebarOpen] = useState(false);




useEffect(() => {

  fetchAnalytics();

  fetchWeekly();

  fetchHabits();

}, []);






const fetchAnalytics=async()=>{


try{


const response =
await api.get("/habits/analytics");


setStats(response.data);



}
catch(error){

console.log(error);

}


};






const fetchWeekly=async()=>{


try{


const response =
await api.get("/habits/weekly");


setWeeklyData(response.data);



}
catch(error){

console.log(error);

}


};
const fetchHabits = async () => {

  try {

    const response = await api.get("/habits");

    setHabits(response.data);

  } catch (error) {

    console.log(error);

  }

};





const pieData=[


{
name:"Completed",
value:stats.completed
},


{
name:"Pending",
value:stats.pending
}


];



const COLORS=[

"#22c55e",
"#ef4444"

];

const completionRate =
  stats.total === 0
    ? 0
    : Math.round((stats.completed / stats.total) * 100);

const bestDay =
  weeklyData.length > 0
    ? weeklyData.reduce((best, current) =>
        current.completed > best.completed ? current : best
      )
    : null;
const targetHabits = habits.filter(
  habit => habit.trackingType === "target"
);

    const topHabits = [...habits]
  .sort((a, b) => {

    const aScore =
      a.trackingType === "target"
        ? (a.target.value > 0
            ? a.progress / a.target.value
            : 0)
        : (a.completed ? 1 : 0);

    const bScore =
      b.trackingType === "target"
        ? (b.target.value > 0
            ? b.progress / b.target.value
            : 0)
        : (b.completed ? 1 : 0);

    return bScore - aScore;

  })
  .slice(0, 5);

  const goodHabits = habits.filter(h => h.category === "good");
const badHabits = habits.filter(h => h.category === "bad");

const categoryData = [
  {
    category: "Good",
    completed: goodHabits.filter(h => h.completed).length,
    pending: goodHabits.filter(h => !h.completed).length,
  },
  {
    category: "Bad",
    completed: badHabits.filter(h => h.completed).length,
    pending: badHabits.filter(h => !h.completed).length,
  },
];

const goodCompleted = habits.filter(
  h => h.category === "good" && h.completed
).length;

const badAvoided = habits.filter(
  h => h.category === "bad" && !h.completed
).length;

const badCompleted = habits.filter(
  h => h.category === "bad" && h.completed
).length;

const positivePoints =
  (goodCompleted + badAvoided) * 10;

const negativePoints =
  badCompleted * 10;

const habitScore = Math.max(
  positivePoints - negativePoints,
  0
);




    
return(


<div className="flex">


<Sidebar
    open={sidebarOpen}
    setOpen={setSidebarOpen}
/>



<div className="
flex-1
bg-gradient-to-br
from-slate-50
to-indigo-50
dark:from-gray-700
dark:to-gray-700
min-h-screen
transition-colors
duration-300
">


<Navbar
    setSidebarOpen={setSidebarOpen}
/>



<main className="p-5">


<div className="flex justify-between items-center">

  <div>

    <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white ">
      Insights
    </h1>

    <p className="text-gray-500 dark:text-gray-400 mt-2">
      Track your consistency and discover insights about your habits.
    </p>

  </div>

  <div className="flex justify-end mt-6">

  

</div>

  {/*<div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-lg">

    <p className="text-sm opacity-90">
      Overall Score
    </p>

    <h2 className="text-3xl font-bold">
      {completionRate}%
    </h2>

  </div>*/}

</div>





<div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">


<div className="bg-white dark:bg-gray-900 p-6 hover:shadow-xl transition rounded-2xl dark:text-white shadow">

<h2>Total Habits</h2>

<p className="text-4xl dark:text-yellow-200 mt-2 font-bold">

{stats.total}

</p>

</div>



<div className="bg-white dark:text-white dark:bg-gray-900 p-6 hover:shadow-xl transition rounded-2xl shadow">

<h2>Completed</h2>

<p className="text-4xl font-bold mt-2 text-green-500">

{stats.completed}

</p>

</div>



<div className="bg-white dark:text-white dark:bg-gray-900 p-6 hover:shadow-xl transition rounded-2xl shadow">

<h2>Pending</h2>

<p className="text-4xl mt-2 font-bold text-red-500">

{stats.pending}

</p>

</div>
<div className="bg-white dark:text-white dark:bg-gray-900 p-6 hover:shadow-xl transition rounded-2xl shadow">

  <h2>Completion Rate</h2>

  <p className="text-4xl font-bold mt-2 text-purple-600">

    {completionRate}%

  </p>

</div>

</div>




<div className="grid lg:grid-cols-2 gap-6 mt-8">
<div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mt-2">


<h2 className="text-xl dark:text-white font-bold mb-5">

Weekly Completion

</h2>




<ResponsiveContainer


width="100%"

height={300}

>


<BarChart data={weeklyData}>


<XAxis dataKey="day"/>


<YAxis/>


<Tooltip/>


<Bar
dataKey="completed"
fill="#3a67ed"
radius={[10,10,0,0]}
/>


</BarChart>


</ResponsiveContainer>


</div>





<div className="bg-white dark:text-white dark:bg-gray-900 rounded-2xl shadow p-6 mt-2">


<h2 className="text-xl font-bold mb-5">

Habit Status

</h2>




<ResponsiveContainer

width="100%"

height={300}

>


<PieChart>


<Pie

data={pieData}

dataKey="value"

nameKey="name"

outerRadius={120}
label>
{
pieData.map(
(entry,index)=>(

<Cell

key={index}

fill={COLORS[index]}

/>

))}


</Pie>

<Tooltip/>
<Legend/>


</PieChart>

</ResponsiveContainer>

</div>
</div>

{/* ================= TODAY'S HABIT SCORE ================= */}

<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mt-8">

  <div className="flex justify-between items-center">

    <div>

      <h2 className="text-2xl dark:text-white font-bold">
        ⭐ Today's Habit Score
      </h2>

      <p className="text-gray-500 dark:text-gray-400 ">
        Based on today's completed and avoided habits
      </p>

    </div>

    <div className="text-right">

      <h1 className="text-5xl  font-extrabold text-purple-600">
        {stats.score}
      </h1>

      <p className="text-gray-500 dark:text-white ">
        /{stats.total * 10}
      </p>

    </div>

  </div>

  {/* Progress Bar */}

  <div className="w-full h-5 bg-gray-200 dark:bg-gray-700 rounded-full mt-6 overflow-hidden">

    <div
      className="h-5 rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 transition-all duration-700"
      style={{
        width: `${stats.total === 0 ? 0 : (stats.score / (stats.total * 10)) * 100}%`,
      }}
    />

  </div>

  {/* Score Details */}

  <div className="grid md:grid-cols-2 gap-6 mt-8">

    <div className="bg-green-50 dark:text-gray-300 dark:bg-green-900/30 rounded-xl p-5">

      <h3 className="font-bold text-green-700 dark:text-green-300 mb-3">
        🟢 Positive Points
      </h3>

      <div className="flex dark:text-gray-300 justify-between">

        <span>Good Habits Completed</span>

        <strong>
          {goodCompleted} × 10
        </strong>

      </div>

      <div className="flex dark:text-gray-300 justify-between mt-2">

        <span>Bad Habits Avoided</span>

        <strong>
          {badAvoided} × 10
        </strong>

      </div>

      <hr className="my-3"/>

      <div className="flex justify-between font-bold dark:text-green-300 text-green-700">

        <span>Total</span>

        <span>
          +{positivePoints}
        </span>

      </div>

    </div>

    <div className="bg-red-50 dark:text-gray-300 bg-red-50 dark:bg-red-900/30 rounded-xl p-5">

      <h3 className="font-bold dark:text-red-400 text-red-700 mb-3">
        🔴 Negative Points
      </h3>

      <div className="flex justify-between">

        <span>Bad Habits Done</span>

        <strong>
          {badCompleted} × 10
        </strong>

      </div>

      <hr className="my-3"/>

      <div className="flex justify-between dark:text-red-400 font-bold text-red-700">

        <span>Total</span>

        <span>
          -{negativePoints}
        </span>

      </div>

    </div>

  </div>

  {/* Summary */}

  <div className="mt-8 bg-indigo-50 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-5">

    <div className="flex justify-between items-center">

      <div>

        <h3 className="font-bold dark:text-white text-lg">
          Today's Summary
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mt-1">

          {habitScore >= 80
            ? "🚀 Excellent! Keep your momentum."
            : habitScore >= 60
            ? "🔥 Great progress. A little more consistency!"
            : habitScore >= 40
            ? "👍 You're improving. Finish a few more habits."
            : "💪 Start completing your habits to increase your score."}

        </p>

      </div>

      <div className="text-5xl">

        {habitScore >= 80
          ? "🏆"
          : habitScore >= 60
          ? "🥇"
          : habitScore >= 40
          ? "⭐"
          : "💪"}

      </div>

    </div>

  </div>

</div>

<div className="bg-white dark:text-white dark:bg-gray-900 rounded-2xl shadow p-6 mt-8">

  <h2 className="text-xl font-bold mb-6">
    🎯 Goal Progress
  </h2>

  {
    targetHabits.length === 0 ?

    <p className="text-gray-500">
      No target habits available.
    </p>

    :

    <div className="space-y-6">

      {

      targetHabits.map(habit => {

        const percent =
          Math.min(
            (habit.progress / habit.target.value) * 100,
            100
          );

        return (

          <div key={habit._id}>

            <div className="flex justify-between mb-2">

              <h3 className="font-semibold  ">
                {habit.name}
              </h3>

              <span>

                {habit.progress}/{habit.target.value} {habit.target.unit}

              </span>

            </div>

            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full">

              <div

                className="h-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"

                style={{
                  width: `${percent}%`
                }}

              />

            </div>

          </div>

        );

      })

      }

    </div>

  }

</div>

<div className="bg-white dark:bg-gray-900 dark:text-gray-300 rounded-2xl shadow p-6 mt-8">

<h2 className="text-xl dark:text-white font-bold mb-5">

🏆 Top 5 Performing Habits

</h2>

<table className="w-full">

<thead>

<tr>

<th className="text-left">
Habit
</th>

<th>
Progress
</th>

</tr>

</thead>

<tbody>

{

topHabits.map((habit,index)=>(

<tr
key={habit._id}
className="border-t dark:border-gray-600"
>

<td className="py-4 ">

{index+1}.

{habit.name}

</td>

<td>

{

habit.trackingType==="boolean"

?

habit.completed
?
"100%"
:
"0%"

:

`${
  habit.target.value > 0
    ? Math.round(habit.progress / habit.target.value * 100)
    : 0
}%`

}

</td>

</tr>

))

}

</tbody>

</table>

</div>


<div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mt-8">

<h2 className="font-bold dark:text-white text-xl mb-4">
🤖 Smart Insights
</h2>

<div className="space-y-4">

<div className="bg-green-50 dark:bg-green-900/100 dark:text-gray-300 p-4 rounded-xl">

🔥 You're completing

<strong> {completionRate}% </strong>

of your habits.

</div>

<div className=" bg-blue-50 dark:bg-blue-900/100 dark:text-gray-300 p-4 rounded-xl">

🏆 Best Performing Day

<strong> {bestDay?.day || "-"} </strong>

</div>

<div className="bg-yellow-50 dark:text-gray-300 dark:bg-yellow-900/100 p-4 rounded-xl">

💡 Completing just

<strong> 1 more habit/day </strong>

would increase your score significantly.

</div>

</div>

</div>

<div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl text-white p-8 mt-8 text-center">

<h2 className="text-xl">
Productivity Score
</h2>

<div className="text-6xl font-bold mt-5">
{completionRate}
</div>

<p className="mt-4">
Keep your consistency high!
</p>

</div>

<div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 mt-8">

  <div className="flex justify-between items-center mb-6">

    <div>
      <h2 className="text-2xl dark:text-white font-bold text-gray-800">
        🏆 Achievements
      </h2>
      <p className="text-sm dark:text-gray-400 text-gray-500">
        Unlock badges as you stay consistent.
      </p>
    </div>

    <span className="text-sm font-semibold  bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
      4 Badges
    </span>

  </div>

  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">

    {/* Badge 1 */}

    <div
      className={`rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        stats.total >= 1
          ? "bg-gradient-to-br from-green-50 dark:text-balck to-green-100 border border-green-300"
          : "bg-gray-50 dark:bg-gray-800 border dark:text-white border-gray-200 dark:border-gray-500 opacity-70"
      }`}
    >

      <div className="flex justify-between items-center">

        <span className="text-3xl">🎯</span>

        {stats.total >= 1 && (
          <span className="text-green-600 text-xl">
            ✓
          </span>
        )}

      </div>

      <h3 className="font-bold mt-4">
        First Habit
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        Create your first habit
      </p>

    </div>

    {/* Badge 2 */}

    <div
      className={`rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        stats.completed >= 5
          ? "bg-gradient-to-br from-orange-50 dark:text-balck to-orange-100 border border-orange-300"
          : "bg-gray-50 dark:bg-gray-800 border dark:text-white border-gray-200 dark:border-gray-500 opacity-70"
      }`}
    >

      <div className="flex justify-between items-center">

        <span className="text-3xl">🔥</span>

        {stats.completed >= 5 && (
          <span className="text-orange-600 text-xl">
            ✓
          </span>
        )}

      </div>

      <h3 className="font-bold mt-4">
        5 Completed
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        Finish 5 habits
      </p>

    </div>

    {/* Badge 3 */}

    <div
      className={`rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        completionRate >= 80
          ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:text-balck border border-blue-300"
          : "bg-gray-50 dark:bg-gray-800 border dark:text-white border-gray-200 dark:border-gray-500 opacity-70"
      }`}
    >

      <div className="flex justify-between items-center">

        <span className="text-3xl">🚀</span>

        {completionRate >= 80 && (
          <span className="text-blue-600 text-xl">
            ✓
          </span>
        )}

      </div>

      <h3 className="font-bold mt-4">
        80% Rate
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        Reach 80% completion
      </p>

    </div>

    {/* Badge 4 */}

    <div
      className={`rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        stats.total >= 10
          ? "bg-gradient-to-br from-purple-50 dark:text-balck to-purple-100 border border-purple-300"
          : "bg-gray-50 dark:bg-gray-800 border dark:text-white border-gray-200 dark:border-gray-500 opacity-70"
      }`}
    >

      <div className="flex justify-between items-center">

        <span className="text-3xl">👑</span>

        {stats.total >= 10 && (
          <span className="text-purple-600 text-xl">
            ✓
          </span>
        )}

      </div>

      <h3 className="font-bold mt-4">
        Habit Master
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        Create 10 habits
      </p>

    </div>

  </div>

</div>

<div className="bg-white dark:text-white dark:bg-gray-900 rounded-2xl shadow p-6 mt-8">

<h2 className="text-xl font-bold mb-6">
📊 Category Performance
</h2>

<ResponsiveContainer width="100%" height={320}>

<BarChart data={categoryData}>

<XAxis dataKey="category" />

<YAxis />

<Tooltip />

<Legend />

<Bar
dataKey="completed"
fill="#22c55e"
radius={[8,8,0,0]}
/>

<Bar
dataKey="pending"
fill="#ef4444"
radius={[8,8,0,0]}
/>

</BarChart>

</ResponsiveContainer>

</div>

{/* Performance Summary */}

<div className="bg-white dark:bg-gray-900 rounded-3xl  shadow-sm border border-gray-100 dark:border-gray-700 p-6 mt-8">

  <div className="flex items-center justify-between mb-6">

    <div>
      <h2 className="text-2xl dark:text-white font-bold text-gray-800">
        Performance Summary
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
        Your weekly insights at a glance
      </p>
    </div>

    <div className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold">
      This Week
    </div>

  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

    {/* Card 1 */}

    <div className="group border border-gray-200 dark:border-gray-600 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      <div className="flex justify-between items-center">

        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl">
          🏆
        </div>

        <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
          Best
        </span>

      </div>

      <p className="text-gray-500 dark:text-white text-sm mt-5">
        Most Consistent Habit
      </p>

      <h3 className="text-2xl font-bold dark:text-indigo-300 text-gray-800 mt-2 truncate">
        {topHabits[0]?.name || "-"}
      </h3>

    </div>

    {/* Card 2 */}

    <div className="group border border-gray-200 dark:border-gray-600 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      <div className="flex justify-between items-center">

        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
          📈
        </div>

        <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full">
          Success
        </span>

      </div>

      <p className="text-gray-500 dark:text-white text-sm mt-5">
        Completion Rate
      </p>

      <h3 className="text-3xl font-bold text-green-600 mt-2">
        {completionRate}%
      </h3>

    </div>

    {/* Card 3 */}

    <div className="group border border-gray-200 dark:border-gray-600 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      <div className="flex justify-between items-center">

        <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl">
          ⚡
        </div>

        <span className="text-xs bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full">
          Active
        </span>

      </div>

      <p className="text-gray-500 dark:text-white text-sm mt-5">
        Weekly Completed
      </p>

      <h3 className="text-3xl font-bold text-yellow-600 mt-2">
        {weeklyData.reduce(
          (sum, item) => sum + item.completed,
          0
        )}
      </h3>

    </div>

  </div>

</div>


</main>


</div>


</div>


);


}


export default Analytics;