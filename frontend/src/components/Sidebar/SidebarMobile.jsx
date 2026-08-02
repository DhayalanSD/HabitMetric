import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Settings,
  History,
  Menu,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function SidebarMobile({ open, setOpen }) {
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
    <>
      {/* Mobile Header */}

        <aside
className={`
fixed
top-0
left-0

w-63
h-screen

bg-white
dark:bg-gray-900

shadow-2xl

transition-colors
duration-300

z-50

transform
transition-transform
duration-300

${open ? "translate-x-0" : "-translate-x-full"}

md:hidden
`}
></aside>

      {/* Overlay */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
          fixed
          inset-0
          bg-black/40
          z-40
          md:hidden
          "
        />
      )}

      {/* Drawer */}

      <aside
  className={`
  fixed
  top-0
  left-0
  flex
  flex-col

  w-63
  h-screen

bg-white/95
dark:bg-gray-900/95

backdrop-blur-xl

shadow-2xl

border-r
border-gray-200
dark:border-gray-700

transition-colors
duration-300

  z-50

  transform
  transition-all
  duration-300

  ${
    open
      ? "translate-x-0"
      : "-translate-x-full"
  }

  md:hidden
`}
>

  {/* Header */}

  <div className="px-1 py-4 border-b border-gray-200 dark:border-gray-700">

    <div className="flex justify-between items-start">

      <div className="flex items-center gap-3">

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg">

          ✨

        </div>

        <div>

         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">

            HabitMetric

          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">

            Track.Improve.Repeat.

          </p>

        </div>

      </div>

      <button
        onClick={() => setOpen(false)}
        className="
p-2
rounded-xl
hover:bg-gray-100
dark:hover:bg-gray-800
text-gray-700
dark:text-white
transition
"
      >
        <X 
        size={22}/>
      </button>

    </div>

  </div>

  {/* Navigation */}

  <div className="flex-1 px-5 py-6  space-y-2 overflow-y-auto">

    {menu.map((item)=>(

      <NavLink
        key={item.path}
        to={item.path}
        onClick={()=>setOpen(false)}
        className={({isActive})=>

          `flex items-center gap-4 px-5 py-4 rounded-2xl hover:shadow-xl transition transition-all duration-300 font-medium

          ${
isActive
?
"bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg scale-[1.02]"
:
"text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-gray-800 hover:text-violet-700 dark:hover:text-violet-400"
}`

        }
      >

        {item.icon}

        <span>

          {item.name}

        </span>

      </NavLink>

    ))}

  </div>



  

  

  {/* Footer */}

  <div className="border-t border-gray-200 dark:border-gray-700 mt-5 px-6 py-5 text-center">

    <p className="text-xs text-gray-400 dark:text-gray-500">

      HabitMetric v1.0

    </p>

    <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mt-1">

      Build by Dhayalan

    </p>

  </div>

</aside>
    </>
  );
}

export default SidebarMobile;