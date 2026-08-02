import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Settings,
  History,
  Sparkles,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function SidebarTablet() {

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={24} />,
    },
    {
      name: "Habits",
      path: "/habits",
      icon: <CheckSquare size={24} />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 size={24} />,
    },
    {
      name: "History",
      path: "/history",
      icon: <History size={24} />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={24} />,
    },
  ];

  return (

    <aside
      className="
hidden
md:flex
lg:hidden
w-24
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

      <div
className="
h-24
flex
items-center
justify-center
border-b
border-gray-200
dark:border-gray-700
"
>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r text-white from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">

          <Sparkles
            size={28}
            className="text-white"
          />

        </div>

      </div>

      {/* Navigation */}

      <div className="flex-1 py-8 flex flex-col items-center gap-4">

        {menu.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            title={item.name}
            className={({ isActive }) =>

              `group relative w-14 h-14 hover:shadow-xl transition flex items-center justify-center rounded-2xl transition-all duration-300

              ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg scale-105"
                  : `
text-gray-500
dark:text-gray-400

hover:bg-violet-100
dark:hover:bg-gray-800

hover:text-violet-700
dark:hover:text-violet-300

hover:scale-105
`
              }`

            }
          >

            {({ isActive }) => (

              <>

                {isActive && (

                  <div className="absolute -left-2 w-1 h-8 rounded-full  bg-violet-600" />

                )}

                {item.icon}

              </>

            )}

          </NavLink>

        ))}

      </div>

      {/* Bottom Card */}

      <div
className="
border-t
border-gray-200
dark:border-gray-700
py-6
flex
justify-center
"
>

        <div className="w-14 h-14 text-white rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center shadow-lg">

          V 0.1

        </div>

      </div>

    </aside>

  );

}

export default SidebarTablet;