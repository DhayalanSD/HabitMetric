import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Settings,
  History,
  Sparkles,
  Flame,
  User,
} from "lucide-react";


import { NavLink } from "react-router-dom";

function SidebarDesktop() {

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={22} />,
    },
    {
      name: "Habits",
      path: "/habits",
      icon: <CheckSquare size={22} />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 size={22} />,
    },
    {
      name: "History",
      path: "/history",
      icon: <History size={22} />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={22} />,
    },
  ];

  return (

    <aside
      className="
      hidden
      lg:flex
      w-65
    
      h-screen
      sticky
      top-0
      flex-col

      bg-white/90
dark:bg-gray-900

backdrop-blur-xl

border-r
border-gray-200
dark:border-gray-700

shadow-xl

transition-colors
duration-300
      "
    >

      {/* Logo */}

      <div className="p-5 border-b border-gray-200 dark:border-gray-700">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">

            <Sparkles
              size={28}
              className="text-white"
            />

            

          </div>

          <div>

           

            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">

              HabitMetric

            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">

              Track.Improve.Repeat.

            </p>

          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 px-5 py-6 space-y-2">

        {menu.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>

              `group relative flex hover:shadow-xl transition items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300

              ${
isActive
? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
: "text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-gray-800 hover:text-violet-700 dark:hover:text-violet-400"
}`

            }
          >

            {({ isActive }) => (

              <>

                {isActive && (

                  <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-white" />

                )}

                <div
                  className={`transition-transform duration-300 ${
                    isActive
                      ? "scale-110"
                      : "group-hover:scale-110"
                  }`}
                >

                  {item.icon}

                </div>

                <span className="font-semibold">

                  {item.name}

                </span>

              </>

            )}

          </NavLink>

        ))}

      </div>

      

      

      {/* Footer */}

      <div className="mt-5 border-t border-gray-200 dark:border-gray-700 p-5 text-center">

        <p className="text-xs text-gray-400 dark:text-gray-500">

          HabitMetric v1.0

        </p>

        <p className="text-xs font-medium text-violet-600 dark:text-violet-400 mt-1">

          Build by Dhayalan

        </p>

      </div>

    </aside>

  );

}

export default SidebarDesktop;