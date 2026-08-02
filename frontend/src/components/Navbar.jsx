import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, Menu } from "lucide-react";
import api from "../services/api";


function Navbar({
    setSidebarOpen
}) {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

    const pageTitles = {
      "/dashboard": "Dashboard",
      "/habits": "Habits",
      "/analytics": "Analytics",
      "/history": "History",
      "/settings": "Settings",
    };

    const pageTitle =
      pageTitles[location.pathname] || "HabitMetric";

    const fetchNotifications = async () => {

      try {

        const res = await api.get("/notifications");

        setNotifications(res.data);

      }

      catch (err) {

        console.log(err);

      }

    };

    const markRead = async () => {

  try {

    await api.put("/notifications/read");

    fetchNotifications();

    setShowNotification(false);

  } catch (err) {

    console.log(err);

  }



    };

    const clearNotifications = async () => {

      await api.delete("/notifications");

      fetchNotifications();

    };

    const unreadCount =
    notifications.filter(n => !n.read).length;

    const searchHabits = async (value) => {

      setSearch(value);

      if (value.trim() === "") {

        setSearchResults([]);

        setShowResults(false);

        return;

      }

      try {

        const res = await api.get(
          `/habits/search?q=${value}`
        );

        setSearchResults(res.data);

        setShowResults(true);

      }

      catch (err) {

        console.log(err);

      }

    };

useEffect(() => {

  const fetchUser = async () => {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  fetchUser();
  fetchNotifications();

  // Refresh notifications every 5 seconds
  const interval = setInterval(() => {
    fetchNotifications();
  }, 5000);

  // Cleanup when component unmounts
  return () => clearInterval(interval);

}, []);

  return (
    <nav
className="
sticky
top-0
z-30
bg-white/80
dark:bg-gray-900/80
backdrop-blur-xl
border-b
border-gray-100
dark:border-gray-700
shadow-lg
transition-colors
duration-300
px-1
sm:px-3
md:px-6
lg:px-8
py-3
sm:py-6
lg:py-6
flex
justify-between
items-center
"
>

      {/* Left */}

      <div className="flex items-center px-1 gap-3">

    {/* Mobile Menu */}

    <button
    onClick={() => setSidebarOpen(true)}
    className="
        md:hidden
        
        w-11
        h-11
        rounded-xl
        bg-gray-100
        hover:bg-purple-100
        dark:bg-gray-700
        dark:hover:bg-gray-400
        dark:text-white
        flex
        items-center
        justify-center
        transition
    "
>
    <Menu size={24} />
</button>

    <h2 className="text-l md:text-2xl dark:text-white lg:text-3xl font-bold text-gray-800">
        {pageTitle}
    </h2>

</div>

      {/* Right */}

      <div className="flex items-center gap-2 md:gap-4 lg:gap-5">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            strokeWidth={2.5}
            className="absolute left-4 top-3.5 text-gray-400"
          />

          <input
          type="text"
          placeholder="Search habits..."
          value={search}
          onChange={(e) => searchHabits(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
            navigate("/habits", {
              state: {
                search,
              },
            });

            setShowResults(false);
            setSearch("");
          }
          }}
          className="
            w-25
  sm:w-48
  md:w-56
  lg:w-72

  pl-10
  pr-4
  py-2.5

  rounded-xl
  bg-gray-50
  dark:bg-gray-800
text-gray-800
dark:text-white

placeholder:text-gray-400
dark:placeholder:text-gray-500
border
border-transparent
dark:border-gray-700


focus:bg-white
dark:focus:bg-gray-800
focus:border-purple-300
focus:ring-4
focus:ring-purple-100
dark:focus:ring-purple-900

shadow-sm
transition-all
duration-300

  focus:outline-none
  
  
            
            "
        />

        {showResults && (

          <div
          className="
          absolute
          top-14
          left-0
          w-45
sm:w-72
md:w-full
          bg-white
          dark:text-white
dark:bg-gray-900

rounded-xl

shadow-xl

border
border-gray-200
dark:border-gray-700

transition-colors
          z-50
          max-h-80
          overflow-y-auto
          "
          >

          {searchResults.length === 0 ? (

          <p className="p-4 text-gray-500">

          No habits found

          </p>

          ) : (

          searchResults.map((habit) => (

          <div

          key={habit._id}

          onClick={() => {

          navigate("/habits", {

            state: {

              selectedHabit: habit._id,

            },

          });

          setShowResults(false);

          setSearch("");

        }}

          className="
          p-4
          cursor-pointer
          hover:bg-purple-50
          dark:hover:bg-gray-700
          border-b
          "

          >

          <h3 className="font-semibold">

          {habit.name}

          </h3>

          <p className="text-sm text-gray-500">

          {habit.category} • {habit.trackingType}

          </p>

          </div>

          ))

          )}

          </div>

          )}

        </div>

        {/* Notification */}

        <div className="relative">

        <button

        onClick={() =>
        setShowNotification(!showNotification)
        }

        className="
        w-10
        h-10
        md:w-11
        md:h-11
        rounded-xl
        
hover:shadow-md
border
bg-gray-50
dark:bg-gray-800

hover:bg-purple-50
dark:hover:bg-gray-700

border-gray-200
dark:border-gray-700

text-gray-700
dark:text-white
transition-all
duration-300
focus:border-purple-300
focus:ring-4
focus:ring-purple-100
        transition
        flex
        items-center
        justify-center
        cursor-pointer
        "

        >

        <div className="relative">

        <Bell size={20} />

        {unreadCount > 0 && (

        <span
        className="
        absolute
        -top-2
        -right-2
        bg-red-500
        text-white
        text-xs
        rounded-full
        w-5
        h-5
        flex
        items-center
        justify-center
        "
        >

        {unreadCount}

        </span>

        )}

        </div>

        </button>

        {showNotification && (

        <div
        className="
        absolute
        right-0
        mt-3
        w-[70vw]
max-w-sm
        md:w-80
        lg:w-96
        bg-white
dark:bg-gray-900

rounded-2xl

shadow-2xl

border
border-gray-200
dark:border-gray-700
        z-50
        "
        >

        <div className="p-4 border-b border-gray-200 dark:border-gray-700">

        <h2 className="font-bold text-gray-800 dark:text-white">

        Notifications

        </h2>

        </div>

        <div className="max-h-96 overflow-y-auto">

        {notifications.length === 0 ? (

        <p className="p-6 text-center text-gray-500 dark:text-gray-400">

        No Notifications

        </p>

        ) : (

        notifications.map((item) => (

        <div

        key={item._id}

        className={`p-4 border-b border-gray-200
dark:border-gray-500

        ${!item.read
        ? "bg-purple-50 dark:bg-gray-700"
        : ""
        }

        `}

        >

        <h3 className="font-semibold text-gray-800 dark:text-white ">

        {item.title}

        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300">

        {item.message}

        </p>

        <p className="text-xs text-gray-400 mt-2 dark:text-gray-400">

        {new Date(
        item.createdAt
        ).toLocaleString()}

        </p>

        </div>

        ))

        )}

        </div>

        <div className="flex">

        <button

        onClick={markRead}

        className="
        flex-1
        bg-purple-600
        text-white
        py-2
        rounded-2xl
        cursor-pointer
        "

        >

        Mark Read

        </button>

        <button

        onClick={clearNotifications}

        className="
        flex-1
        bg-red-500
        text-white
        py-2
        rounded-2xl
        cursor-pointer
        "

        >

        Clear

        </button>

        </div>

        </div>

        )}

        </div>

        {/* User */}

        <div className="flex items-center gap-2 md:gap-3">

          <img
            src={
              user?.profileImage
                ? `${import.meta.env.VITE_BACKEND_URL}${user.profileImage}`
                : `https://ui-avatars.com/api/?name=${user?.name}`
            }
            alt="Profile"
            className="w-10 h-10 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full object-cover border-2 border-purple-500 hover:scale-105 active:scale-95 transition-all "
          />

          <div className="hidden md:block">

             <p className="font-semibold text-gray-800 dark:text-white">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;