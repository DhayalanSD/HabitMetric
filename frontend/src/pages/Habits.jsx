import { useEffect, useState } from "react";
import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AddHabit from "../components/AddHabit";
import HabitList from "../components/HabitList";
import { useLocation, useNavigate } from "react-router-dom";

function Habits() {


const location = useLocation();
const navigate = useNavigate();

const selectedHabit = location.state?.selectedHabit;
const navbarSearch = location.state?.search || "";

const [habits, setHabits] = useState([]);
const [search, setSearch] = useState(navbarSearch);
const [statusFilter, setStatusFilter] = useState("All");
const [typeFilter, setTypeFilter] = useState("All");
const [categoryFilter, setCategoryFilter] = useState("All");
const [showScorePopup, setShowScorePopup] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {

    fetchHabits();

  }, []);

  useEffect(() => {
      if (navbarSearch) {
        setSearch(navbarSearch);

        navigate(location.pathname, {
          replace: true,
          state: {},
        });
      }
    }, [navbarSearch, navigate, location.pathname]);

useEffect(() => {

  if (!selectedHabit || habits.length === 0) return;

  const timer = setTimeout(() => {

    const habitCard = document.getElementById(selectedHabit);

    if (habitCard) {

      habitCard.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      habitCard.classList.add(
        "ring-4",
        "ring-purple-500"
      );

      setTimeout(() => {

        habitCard.classList.remove(
          "ring-4",
          "ring-purple-500"
        );

      }, 3000);

      navigate(location.pathname, {
  replace: true,
  state: {},
});

    }

  }, 150);

  return () => clearTimeout(timer);

}, [selectedHabit, habits]);

    


  const fetchHabits = async () => {

    try {

      const response = await api.get("/habits");

      setHabits([...response.data]);

    } 
    catch(error) {

      console.log(error);

    }

  };





  const addHabit = (habit) => {

    setHabits((prev) => [
      ...prev,
      habit
    ]);

  };





  const deleteHabit = async(id)=>{

    try{

      await api.delete(`/habits/${id}`);


      setHabits((prev)=>
        prev.filter(
          habit=>habit._id !== id
        )
      );


    }
    catch(error){

      console.log(error);

    }

  };





  const toggleHabit = async(id)=>{

    try{

      const response =
      await api.put(`/habits/${id}`);


      setHabits((prev)=>
        prev.map(habit=>

          habit._id === id
          ?
          response.data
          :
          habit

        )
      );
      


    }
    catch(error){

      console.log(error);

    }

  };

  const updateHabit = (updatedHabit) => {

  setHabits((prev) =>
    prev.map((habit) =>
      habit._id === updatedHabit._id
        ? updatedHabit
        : habit
    )
  );

};

  const filteredHabits = habits.filter((habit) => {

  const matchesSearch =
    habit.name.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "All"
      ? true
      : statusFilter === "Completed"
      ? habit.completed
      : !habit.completed;

  const matchesType =
    typeFilter === "All"
      ? true
      : habit.trackingType === typeFilter.toLowerCase();

  const matchesCategory =
    categoryFilter === "All"
      ? true
      : habit.category === categoryFilter.toLowerCase();

  return (
    matchesSearch &&
    matchesStatus &&
    matchesType &&
    matchesCategory
  );

});







  return (

    <div className="flex">


      <Sidebar
    open={sidebarOpen}
    setOpen={setSidebarOpen}
/>



      <div className="flex-1 min-h-screen
bg-gradient-to-br from-slate-50 to-indigo-50
dark:from-gray-700 dark:via-slate-700 dark:to-gray-700
transition-colors duration-300">


        <Navbar
    setSidebarOpen={setSidebarOpen}
/>



        <main className="p-5">


          <div className="flex flex-col md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight
text-gray-800
dark:text-white">
  Activities
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Build consistency by managing your daily habits.
            </p>

          </div>
          

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5  mt-8">

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 hover:shadow-xl transition ">

              <p className="text-gray-500 dark:text-white ">
                Total
              </p>

              <h2 className="text-3xl font-bold text-purple-600 mt-2">
                {habits.length}
              </h2>

            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-xl transition p-5">

              <p className="text-gray-500 dark:text-white ">
                Completed
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-2">

                {habits.filter(h=>h.completed).length}

              </h2>

            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl hover:shadow-xl transition shadow p-5">

              <p className="text-gray-500 dark:text-white ">
                Pending
              </p>

              <h2 className="text-3xl font-bold text-red-500 mt-2">

                {habits.filter(h=>!h.completed).length}

              </h2>

            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl hover:shadow-xl transition shadow p-5">

              <p className="text-gray-500 dark:text-white">
                Categories
              </p>

              <h2 className="text-3xl font-bold text-blue-600 mt-2">

                {new Set(habits.map(h=>h.category)).size}

              </h2>

            </div>

          </div>


          <div className="bg-white dark:text-white dark:bg-gray-900 rounded-2xl shadow-md p-6 mt-8">

            <h2 className="text-xl  font-bold mb-5">
              Search & Filters
            </h2>

            <div className="grid dark:text-gray-300 grid-cols-2 md:grid-cols-4 gap-4">

            

              <input
                type="text"
                placeholder="🔍 Search Habit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border dark:bg-gray-700 dark:border-gray-300 dark:text-gray-300 rounded-xl p-3"
              />
              

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border dark:bg-gray-700 dark:border-gray-300 dark:text-gray-300 rounded-xl p-3"
              >
                <option>All</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border dark:bg-gray-700 dark:border-gray-300 dark:text-gray-300 rounded-xl p-3"
              >
                <option value="All">All</option>
                <option value="boolean">Yes/No</option>
                <option value="target">Target</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border dark:bg-gray-700 dark:border-gray-300 dark:text-gray-300 rounded-xl p-3"
              >
                <option value="All">All</option>
                <option value="good">Good</option>
                <option value="bad">Bad</option>
              </select>

            </div>

          </div>


          {/* Habit Score Rules */}

          <div
            onClick={() => setShowScorePopup(true)}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 mt-8 border-l-4 border-purple-600 cursor-pointer hover:shadow-xl transition"
          >

            <div className="flex justify-between items-center">

              <div>

                <h2 className="text-xl font-bold text-purple-700">
                  ⭐ Habit Score Rules
                </h2>

                <p className="text-gray-500 dark:text-gray-300 mt-2">
                  Learn how HabitMetric calculates your daily score.
                </p>

              </div>

              <div className="text-3xl">
                ❔
              </div>

            </div>

          </div>

          {/* Add Habit Form */}

          

          <AddHabit
            onHabitAdded={addHabit}
          />

        
          <div className="flex justify-between items-center mt-8 mb-5">

            <div>

              <h2 className="text-2xl dark:text-white font-bold text-gray-800">
                Today's Habits
              </h2>

              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Manage, complete and track your daily habits.
              </p>

            </div>

            <div className="bg-purple-100  text-purple-700 px-4 py-2 rounded-xl font-semibold">

              {filteredHabits.length} Habits

            </div>

          </div>

          <HabitList
  habits={filteredHabits}
  onDeleteHabit={deleteHabit}
  onToggleHabit={toggleHabit}
  refreshHabits={fetchHabits}
  updateHabit={updateHabit}
/>
          




          {/* Habit List */}

           {/*<div className="bg-white rounded-2xl shadow-md p-6 mt-8">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold text-gray-800">
                Your Habits
              </h2>

              <span className="text-sm text-gray-500">
                {habits.length} Habits
              </span>

            </div>

            <HabitList
              habits={habits}
              habits={filteredHabits}
              onDeleteHabit={deleteHabit}
              onToggleHabit={toggleHabit}
            />

          </div>*/}

          {showScorePopup && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 w-[500px]">

            <h2 className="text-2xl dark:text-white font-bold text-center mb-6">
              ⭐ Habit Score Logic
            </h2>

            <table className="w-full  text-center border">

              <thead>

                <tr className="bg-purple-100 dark:bg-purple-400 ">

                  <th className="p-3 border">
                    Habit
                  </th>

                  <th className="border">
                    Status
                  </th>

                  <th className="border">
                    Score
                  </th>

                </tr>

              </thead>

              <tbody
              className="dark:text-gray-300"
              >

                <tr
                >

                  <td className="border p-3">
                    Good Habit
                  </td>

                  <td className="border">
                    ✅ Completed
                  </td>

                  <td className="border text-green-600 font-bold">
                    +10
                  </td>

                </tr>

                <tr>

                  <td className="border p-3">
                    Good Habit
                  </td>

                  <td className="border">
                    ⏳ Pending
                  </td>

                  <td className="border">
                    0
                  </td>

                </tr>

                <tr>

                  <td className="border p-3">
                    Bad Habit
                  </td>

                  <td className="border">
                    ❌ Completed
                  </td>

                  <td className="border text-red-600 font-bold">
                    -10
                  </td>

                </tr>

                <tr>

                  <td className="border p-3">
                    Bad Habit
                  </td>

                  <td className="border">
                    ✅ Avoided
                  </td>

                  <td className="border text-green-600 font-bold">
                    +10
                  </td>

                </tr>

              </tbody>

            </table>

            <div className="mt-6 bg-purple-50 dark:bg-gray-700 rounded-xl p-4">

              <h3 className="font-bold dark:text-white">
                Maximum Daily Score
              </h3>

              <p className="mt-2 dark:text-white">
                Total Habits × 10
              </p>

              <p className="mt-1 dark:text-white">
                Example:
              </p>

              <p className="font-bold dark:text-purple-300 text-purple-700">
                10 Habits = 100 Points
                
              </p>
              <p className="font-bold dark:text-purple-300 text-purple-700">
                
                15 Habits = 150 Points
              </p>

            </div>

            <button

              onClick={() => setShowScorePopup(false)}

              className="w-full mt-6 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700"

            >

              Close

            </button>

          </div>

        </div>

        )}


        </main>


      </div>


    </div>

  );

}


export default Habits;