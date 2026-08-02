import { useEffect, useState } from "react";
import api from "../services/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import getLocalDate from "../utils/getLocalDate";
import {
 exportPDF,
 exportExcel
} from "../utils/exportHistory";
import HabitHeatmap from "../components/HabitHeatmap";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function History() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [history, setHistory] = useState(null);
  const [user, setUser] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [heatmapData,setHeatmapData] = useState([]);
  useEffect(() => {
  console.log("Heatmap State:", heatmapData);
}, [heatmapData]);
  const [selectedDate, setSelectedDate] = useState(
  getLocalDate()
);

  useEffect(() => {

  fetchHistory(selectedDate);
  fetchHeatmap();
  fetchWeekly();
  fetchUser();

}, []);

  const fetchHistory = async (date) => {

    try {

      const response = await api.get(`/history/${date}`);

      setHistory(response.data);

    }

    catch (error) {

      console.log(error);

      setHistory(null);

    }

  };

const fetchHeatmap = async()=>{

try{

const response =
await api.get("/habits/heatmap");



setHeatmapData(response.data);


}
catch(error){

console.log(error);

}

};
  
  const fetchWeekly = async () => {

  try {

    const response = await api.get("/habits/weekly");

    setWeeklyData(response.data);

  }

  catch(error){

    console.log(error);

  }

};

const fetchUser = async () => {

  try {

    const res = await api.get("/users/profile");
    console.log("User Data:", res.data);
    setUser(res.data);

  } catch (err) {

    console.log(err);

  }

};




const pieData = [

  {
    name: "Completed",
    value: history?.completed || 0,
  },

  {
    name: "Pending",
    value: history?.pending || 0,
  },

];

const COLORS = [
  "#22c55e",
  "#ef4444",
];

const calculatedScore =
  history?.habits?.reduce((score, habit) => {

    if (habit.category === "good") {

      return habit.completed
        ? score + 10
        : score;

    }

    if (habit.category === "bad") {

      return habit.completed
        ? score - 10
        : score + 10;

    }

    return score;

  }, 0) || 0;

const totalScore =
  (history?.habits?.length || 0) * 10;

const scorePercentage =
  totalScore === 0
    ? 0
    : (calculatedScore / totalScore) * 100;
  return (

    <div className="flex">

      <Sidebar
    open={sidebarOpen}
    setOpen={setSidebarOpen}
/>

      <div className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-700 min-h-screen transition-colors duration-300">

        <Navbar
    setSidebarOpen={setSidebarOpen}
/>

        <main 
            id="history-report" 
            className="
pt-5
md:pt-8
px-4
sm:px-6
lg:px-8
pb-8
bg-gradient-to-br
from-slate-50
to-indigo-50
dark:from-gray-700
dark:to-gray-700
transition-colors
duration-300
"
            >

          {/* Header */}

          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold

tracking-tight text-gray-800 dark:text-white">
            Timeline
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and analyze your previous habit performance.
          </p>

<div className="grid lg:grid-cols-2  gap-6 mt-8">

<div className="
bg-white dark:bg-gray-900
rounded-2xl
shadow-md
p-5
flex
flex-col
sm:flex-row
items-center
gap-4
text-center
sm:text-left
">

<img
src={
user?.profileImage
?
`${import.meta.env.VITE_BACKEND_URL}${user.profileImage}`
:
"/default-avatar.png"
}
alt=""
className="w-16 h-16 rounded-full border"
/>

<div>

<h2 className="font-bold dark:text-white text-xl">

{user?.name}

</h2>

<p className="text-gray-500 dark:text-gray-400">

{user?.email}

</p>

</div>

</div>

<div className="bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-md p-5">

<label className="font-semibold">

Select Date

</label>

<input



type="date"

value={selectedDate}

onChange={(e)=>{

setSelectedDate(e.target.value);

fetchHistory(e.target.value);

}}

className="w-full border dark:bg-gray-700 rounded-xl p-3 mt-4"

/>

</div>

</div>

          {

          history &&

          <>

          {/* Summary */}

          <div className="grid grid-cols-2  sm:grid-cols-4 lg:grid-cols-4 gap-6 mt-8">

            <div className="bg-white dark:bg-gray-900 rounded-2xl hover:shadow-xl transition shadow-md p-6">

              <h3 className="text-gray-500 dark:text-white ">
                Total Habits
              </h3>

              <p className="text-3xl dark:text-yellow-600 font-bold mt-3">

                {history.total}

              </p>

            </div>

            <div className="bg-white dark:bg-gray-900  rounded-2xl hover:shadow-xl transition shadow-md p-6">

              <h3 className="text-gray-500 dark:text-white ">
                Completed
              </h3>

              <p className="text-3xl font-bold text-green-600 mt-3">

                {history.completed}

              </p>

            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl hover:shadow-xl transition shadow-md p-6">

              <h3 className="text-gray-500 dark:text-white ">
                Pending
              </h3>

              <p className="text-3xl font-bold text-red-600 mt-3">

                {history.pending}

              </p>

            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl hover:shadow-xl transition shadow-md p-6">

              <h3 className="text-gray-500 dark:text-white ">
                Completion Rate
              </h3>

              <p className="text-3xl font-bold text-purple-600 mt-3">

                {history.completionRate}%

              </p>

            </div>

          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 mt-8">

            <h2 className="font-bold text-xl dark:text-white">

            ⭐ Today's Habit Score

            </h2>

            <div className="flex flex-col lg:flex-row items-center gap-8 mt-6 ">

            <div>

            <h1 className="text-6xl font-bold text-purple-600">

            {calculatedScore}

            </h1>

            <p className="text-gray-500 dark:text-gray-300">

            /{totalScore}

            </p>

            </div>

            <div className="w-2/3">

            <div className="w-full h-5 bg-gray-200 dark:bg-gray-700 rounded-full">

            <div

            className="bg-gradient-to-r from-green-500  to-purple-600 h-5 rounded-full"

            style={{
            width: `${scorePercentage}%`
          }}

            ></div>

            </div>

            <p className="mt-5 text-gray-800  dark:text-white">

            {scorePercentage >= 80
            ? "🚀 Excellent Performance"
            : scorePercentage >= 60
            ? "🔥 Good Progress"
            : "💪 Keep Going"}

            </p>

            </div>

            </div>

            </div>


          {/* Daily Progress */}

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 sm:p-6 mt-8">

            <h2 className="text-xl dark:text-white font-bold">
              Daily Progress
            </h2>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-5 mt-5">

              <div

                className="bg-purple-600  h-5 rounded-full"

                style={{
                  width: `${history.completionRate}%`
                }}

              />

            </div>

            <p className="mt-4 dark:text-gray-400 text-gray-700 font-semibold">

              {history.completed} of {history.total} habits completed ({history.completionRate}%)

            </p>

          </div>

          {/* Heatmap */}

          <div className="mt-8  overflow-x-auto">


            <HabitHeatmap data={heatmapData} />

          </div>


{/* Weekly Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">



        <div
          id="weekly-chart"
          className="bg-white  dark:bg-gray-900 rounded-2xl shadow-md p-6 "
        >

        <h2 className="text-xl dark:text-white font-bold mb-5">

        📊 Weekly Completion

        </h2>

        <div 
        
        className="h-64 sm:h-72 ">

        <ResponsiveContainer width="100%" height="100%">

        <BarChart data={weeklyData}>

        <XAxis dataKey="day"/>

        <YAxis/>

        <Tooltip/>

        <Bar

        dataKey="completed"

        fill="#7c3aed"

        radius={[10,10,0,0]}

        />

        </BarChart>

        </ResponsiveContainer>

        </div>

        </div>

        {/* Pie Chart */}

        <div
          id="pie-chart"
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6"
        >

        <h2 className="text-xl dark:text-white font-bold mb-5">

        🥧 Habit Status

        </h2>

        <div 
        
        className="h-72">

        <ResponsiveContainer width="100%" height="100%">

        <PieChart>

        <Pie

        data={pieData}

        dataKey="value"

        nameKey="name"

        outerRadius={100}

        label

        >

        {

        pieData.map((entry,index)=>(

        <Cell

        key={index}

        fill={COLORS[index]}

        />

        ))

        }

        </Pie>

        <Tooltip/>

        <Legend/>

        </PieChart>

        </ResponsiveContainer>

        </div>

        </div>

        </div>

          {/* Habit Table */}

          <div className="bg-white  dark:bg-gray-900 rounded-2xl shadow-md p-6 mt-8">

            <h2 className="text-xl dark:text-white font-bold mb-5">

              Habit History

            </h2>
            <div className="overflow-x-auto ">
            <table className="min-w-[700px] w-full">

              <thead>

                <tr className="border-b  dark:border-gray-300">

                  <th className="text-left  dark:text-white p-3">
                    Habit
                  </th>

                  <th className="text-center dark:text-white p-3">
                    Type
                  </th>

                  <th className="text-center dark:text-white p-3">
                    Category
                  </th>

                  <th className="text-center dark:text-white p-3">
                    Status
                  </th>

                  <th className="text-center dark:text-white p-3">
                    Progress
                  </th>

                  <th className="text-center dark:text-white p-3">
                    Score
                    </th>
                  

                </tr>
                

              </thead>

              <tbody>

              {

              history.habits.map((habit)=>(

                <tr
                key={habit.habitId}
                className="border-b dark:border-gray-600 dark:text-gray-300"
                >

                  <td className="items-center">

                    {habit.name}

                  </td>

                  <td className="p-2 text-center ">

                    {habit.trackingType === "target"
    ? "Target"
    : "Yes / No"}

                  </td>

                  <td className="text-center">

                    {habit.category === "good"
                      ? "Good"
                      : "Bad"} 

                  </td>

                  <td className="text-center ">

                    {

                    habit.completed

                    ?

                    "✅ Completed"

                    :

                    "⏳ Pending"

                    }

                  </td>

                  <td className="text-center ">

                    {

                    habit.trackingType==="target"

                    ?

                    `${habit.progress}/${habit.target.value} ${habit.target.unit}`

                    :

                    "-"

                    }

                  </td>

                 <td className="text-center text-lg">

                  {

                  habit.category==="good"

                  ?

                  habit.completed

                  ?

                  <span className="text-green-600 font-bold">

                  +10

                  </span>

                  :

                  <span className="text-gray-500">

                  0

                  </span>

                  :

                  habit.completed

                  ?

                  <span className="text-red-600 font-bold">

                  -10

                  </span>

                  :

                  <span className="text-green-600 font-bold">

                  +10

                  </span>

                  }

                </td>
                    


                </tr>

              ))

              }

              </tbody>

            </table>
            </div>

          </div>
          
          
          {/* Export */}

          <div className="
flex
flex-col
sm:flex-row
gap-4
mt-8
">

            <button
            onClick={() => {
              
              exportPDF(history, user);
            }}
            className="w-full
sm:w-auto
bg-red-600
text-white
px-6
py-3
rounded-lg cursor-pointer"
          >
            Export PDF
          </button> 

            <button
            onClick={() => exportExcel(history)}
            className="
           
w-full
sm:w-auto
bg-green-600
text-white
px-6
py-3
rounded-lg
            cursor-pointer
            
            "
            >
            Export Excel

            </button>

          </div>

          </>

          }

          {

          !history &&

          <div className="bg-white rounded-2xl dark:bg-gray-900 shadow-md p-6 sm:p-10 mt-8 text-center">

            <h2 className="text-2xl text-gray-900 dark:text-gray-300 font-bold">

              No History Available

            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-3">

              No history was saved for the selected date.

            </p>

          </div>

          }

        </main>

      </div>

    </div>

  );

}

export default History;