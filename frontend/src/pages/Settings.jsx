import { useState, useEffect } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Settings.css";

import {
  User,
  Bell,
  Moon,
  LogOut,
  HelpCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";



function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const [showGuide, setShowGuide] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(8);
const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "system";
});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  
  const [dailyReminder, setDailyReminder] = useState(true);

const [streakReminder, setStreakReminder] = useState(true);

const [goalReminder, setGoalReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("07:00");
  const [defaultCategory, setDefaultCategory] = useState("Health");
  const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
  const [showPassword, setShowPassword] = useState({
  current: false,
  new: false,
  confirm: false,
});


useEffect(() => {

  fetchProfile();

  fetchReminderSettings();

}, []);



useEffect(() => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    return;
  }

  if (theme === "light") {
    root.classList.remove("dark");
    return;
  }

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const applyTheme = () => {
    root.classList.toggle("dark", media.matches);
  };

  applyTheme();

  media.addEventListener("change", applyTheme);

  return () => {
    media.removeEventListener("change", applyTheme);
  };

}, [theme]);

        useEffect(() => {

      if (!dailyReminder) return;

      const interval = setInterval(() => {

        const now = new Date();

        const currentTime =
          now.toTimeString().slice(0,5);

        if (

          currentTime === reminderTime &&

          Notification.permission === "granted"

        ) {

          new Notification(

            "📌 HabitMetric Reminder",

            {

              body:
              "Don't forget to complete today's habits!",

              icon: "/logo192.png"

            }

          );

        }

      },60000);

      return ()=>clearInterval(interval);

    },[

      dailyReminder,

      reminderTime

    ]);
  
  
  
  
  
    const fetchProfile = async () => {
      try {

  const res = await api.get("/users/profile");

        setProfile({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          profileImage: res.data.profileImage || "",
        });
        setDailyGoal(res.data.dailyGoal || 8);

        setDefaultCategory(
          res.data.defaultCategory || "Health"
        );

        setDailyReminder(
    res.data.reminder ?? true
);

setStreakReminder(
    res.data.streakReminder ?? true
);

setGoalReminder(
    res.data.goalReminder ?? true
);

        setReminderTime(
          res.data.reminderTime || "07:00"
        );

        const serverTheme = res.data.theme || "system";

if (serverTheme !== theme) {
  setTheme(serverTheme);
}

localStorage.setItem("theme", serverTheme);
        

      } catch (err) {
        console.log(err);
      }
    };

    const fetchReminderSettings = async () => {
  try {

    const res = await api.get("/users/reminder-settings");

    setDailyReminder(res.data.reminder);

setStreakReminder(res.data.streakReminder ?? true);

setGoalReminder(res.data.goalReminder ?? true);
    setReminderTime(res.data.reminderTime);

  } catch (err) {
    console.log(err);
  }
};

const saveReminderSettings = async () => {

  try {

    await api.put("/users/reminder-settings", {

  reminder: dailyReminder,

  streakReminder,

  goalReminder,

  reminderTime,

  timeZone: "Asia/Kolkata",

});

    Swal.fire({

      icon: "success",

      title: "Reminder Saved",

      timer: 1500,

      showConfirmButton: false,

    });

  } catch (err) {

    Swal.fire({

      icon: "error",

      title: "Unable to save reminder",

    });

  }

};
    

  const handleProfileChange = (e) => {
      setProfile({
        ...profile,
        [e.target.name]: e.target.value,
      });
    };
  const handlePasswordChange = (e) => {
        setPasswordData({
          ...passwordData,
          [e.target.name]: e.target.value,
        });
      };

      const getPasswordStrength = (password) => {

  let score = 0;

  if (password.length >= 8) score++;

  if (/[A-Z]/.test(password)) score++;

  if (/[0-9]/.test(password)) score++;

  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score === 0)
    return {
      text: "",
      width: "0%",
      color: "bg-gray-300",
    };

  if (score === 1)
    return {
      text: "Weak",
      width: "25%",
      color: "bg-red-500",
    };

  if (score === 2)
    return {
      text: "Fair",
      width: "50%",
      color: "bg-yellow-500",
    };

  if (score === 3)
    return {
      text: "Good",
      width: "75%",
      color: "bg-blue-500",
    };

  return {
    text: "Strong",
    width: "100%",
    color: "bg-green-500",
  };
};

  const saveProfile = async () => {

if (!/^\d{10}$/.test(profile.phone)) {

  Swal.fire({
    icon: "error",
    title: "Invalid Phone Number",
    text: "Phone number must contain exactly 10 digits.",
  });

  return;
}

    console.log("Saving theme:", theme);
  try {

    await api.put("/users/profile", {
      ...profile,
      dailyGoal,
      defaultCategory,
      reminder: dailyReminder,
      reminderTime,
      theme,
      
    });

    // Save theme locally
localStorage.setItem("theme", theme);
setTheme(theme);

// Apply immediately
if (theme === "dark") {
  document.documentElement.classList.add("dark");
}
else if (theme === "light") {
  document.documentElement.classList.remove("dark");
}
else {
  const prefersDark =
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.documentElement.classList.toggle("dark", prefersDark);
}

    

    Swal.fire({
      icon: "success",
      title: "Profile Updated",
      timer: 1500,
      showConfirmButton: false,
    });

  } catch (err) {

    Swal.fire({
      icon: "error",
      title: "Update Failed",
    });

  }

  };

  const updatePassword = async () => {

  if (passwordData.newPassword !== passwordData.confirmPassword) {

    Swal.fire({
      icon: "error",
      title: "Passwords do not match",
    });

    return;
  }

  try {

    await api.put("/users/change-password", {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });

    Swal.fire({
      icon: "success",
      title: "Password Updated",
      timer: 1500,
      showConfirmButton: false,
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  } catch (err) {

    Swal.fire({
      icon: "error",
      title: err.response?.data?.message || "Update Failed",
    });

  }

};

    const deleteAccount = async () => {

      const result = await Swal.fire({
        title: "Delete Account?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Delete",
      });

      if (!result.isConfirmed) return;

      try {

        await api.delete("/users/delete-account");

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
sessionStorage.removeItem("user");

        Swal.fire({
          icon: "success",
          title: "Account Deleted",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/register");

      } catch (err) {

        Swal.fire({
          icon: "error",
          title: "Delete Failed",
        });

      }

    };

    const uploadProfileImage = async () => {

  if (!selectedImage) {
    Swal.fire({
      icon: "warning",
      title: "Please select an image",
    });
    return;
  }

  try {

    const formData = new FormData();

    formData.append("profileImage", selectedImage);

    const res = await api.post(
      "/users/upload-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setProfile({
      ...profile,
      profileImage: res.data.profileImage,
    });

    Swal.fire({
      icon: "success",
      title: "Profile picture updated",
      timer: 1500,
      showConfirmButton: false,
    });

  } catch (err) {

    console.log(err);

    Swal.fire({
      icon: "error",
      title: "Upload Failed",
    });

  }

};

const enableNotifications = async () => {

  if (!("Notification" in window)) {

    Swal.fire({
      icon: "error",
      title: "Browser doesn't support notifications",
    });

    return;

  }

  const permission =
    await Notification.requestPermission();

  if (permission === "granted") {

    Swal.fire({
      icon: "success",
      title: "Notifications Enabled",
    });

  } else {

    Swal.fire({
      icon: "warning",
      title: "Permission Denied",
    });

  }

};

const handleLogout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  navigate("/login");

};



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
bg-gradient-to-br
from-slate-50
to-indigo-50
dark:from-gray-700
dark:via-gray-700
dark:to-gray-700
transition-colors
duration-300
">

      <Navbar
    setSidebarOpen={setSidebarOpen}
/>

      <main className="p-4 dark:bg-gray-700  sm:p-6 lg:p-8">

    

      <div className="flex justify-between items-center">

    <div>

          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold dark:text-white text-gray-800 ">
            Settings 
          </h1>

          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
            Manage your account and personalize HabitMetric.
          </p>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">

        {/* Profile */}
        <div className="bg-white dark:bg-gray-900  rounded-2xl shadow-lg p-6 border border-transparent dark:border-gray-700 transition-all duration-300">
          <h2 className="text-xl font-bold dark:text-white mb-5" >👤 Profile Photo</h2>

          <div className="flex flex-col items-center">

  <div className="relative">

    <img
      src={
        profile.profileImage
          ? `${import.meta.env.VITE_BACKEND_URL}${profile.profileImage}`
          : "https://placehold.co/200x200?text=User"
      }
      alt="Profile"
      className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full
      object-cover
      border-4
      border-purple-500
      shadow-xl
      "
    />

    <label
      className="
      absolute
      bottom-2
      right-2
      bg-purple-600
      hover:bg-purple-700
      w-10
      h-10
      rounded-full
      flex
      items-center
      justify-center
      text-white
      cursor-pointer
      shadow-lg
      "
    >
       📷

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e)=>setSelectedImage(e.target.files[0])}
      />

    </label>

  </div>

  <h3 className="mt-5 text-xl dark:text-white font-bold ">

    {profile.name || "User"}

  </h3>

  <p className="text-gray-800 dark:text-white ">

    {profile.email}

  </p>

  <button
    onClick={uploadProfileImage}
    className="
    mt-6
    w-full
    bg-gradient-to-r
    from-purple-600
    to-pink-600
    hover:from-purple-700
    hover:to-pink-700
    text-white
    py-3
    rounded-xl
    shadow-lg
    transition
    "
  >
    Upload Profile Photo
  </button>

</div>

          </div>
          {/* Profile Information Form */}
          <div className="bg-white dark:bg-gray-900 dark:text-white border border-transparent dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-all duration-300">
            <h2 className="text-xl dark:text-white font-bold mb-5">
              👤 Profile Information
              </h2>
          <label>Full Name</label>
          <input
          className="
w-full
mt-2
mb-4
px-4
py-3
rounded-xl
border
border-gray-300
dark:bg-gray-700
focus:outline-none
focus:ring-2
focus:ring-purple-500
transition-all
"
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
          />

          <label>Email</label>

<div className="relative mt-2 mb-4">

  <input
    type="email"
    value={profile.email}
    disabled
    className="
      w-full
      px-4
      py-3
      dark:bg-gray-700
      rounded-xl
      border
      border-gray-300
      bg-gray-100
      text-gray-500
      cursor-not-allowed
      pr-36
    "
  />

  <button
    type="button"
    onClick={() => navigate("/change-email")}
    className="
      absolute
      right-2
      top-1/2
      -translate-y-1/2
      bg-purple-600
      hover:bg-purple-700
      text-white
      px-4
      py-2
      rounded-lg
      text-sm
      transition
    "
  >
    Change Email
  </button>

</div>

          <label>Phone</label>
          <input
          className="
w-full
mt-2
mb-4
px-4
py-3
rounded-xl
border
border-gray-300
dark:bg-gray-700
focus:outline-none
focus:ring-2
focus:ring-purple-500
transition-all
"
             type="tel"
  name="phone"
  value={profile.phone}
  maxLength={10}
  inputMode="numeric"
  pattern="[0-9]{10}"
  placeholder="9876543210"
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setProfile({
      ...profile,
      phone: value,
    });
  }}
/>

          <button
              onClick={saveProfile}
              className="
w-full
bg-gradient-to-r
from-purple-600
to-indigo-600
hover:from-purple-700
hover:to-indigo-700
text-white
font-semibold
py-3
rounded-xl
shadow-lg
hover:shadow-xl
transition-all
duration-300
hover:scale-[1.02]
"
            >
            Save Changes
          </button>
        </div>
        </div>
        

        {/* Habit Preferences */}
        {/* Habit Preferences */}
        <div className="bg-white dark:bg-gray-900 border dark:text-white border-transparent dark:border-gray-700 rounded-2xl font-semibold shadow-lg p-6 transition-all duration-300">
          <h2>🎯 Habit Preferences</h2>

          <label className="font-semibold text-gray-700 dark:text-gray-300 ">



</label>

<div className="mt-4">

<input

type="range"

min="1"

max="20"

value={dailyGoal}

onChange={(e)=>setDailyGoal(e.target.value)}

className="w-full  accent-purple-600"

/>

<div className="flex justify-between mt-2">

<span>1</span>

<span
className="font-bold text-purple-600 text-lg"
>

{dailyGoal} Habits

</span>

<span>20</span>

</div>

</div>

<label className="font-semibold dark:text-gray-300 ">

Category

</label>

<div className="grid grid-cols-2 gap-3 mt-4">

{[
"Health",
"Fitness",
"Study",
"Work",
"Personal"
].map((item)=>(

<button

key={item}

onClick={()=>setDefaultCategory(item)}

className={`

p-3

dark:text-gray-300


rounded-xl

border

transition-all

${
defaultCategory===item

?

"bg-purple-600 text-white border-purple-600"

:

"bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-gray-600"

}

`}

>

{item}

</button>

))}

</div>          

         <button
onClick={saveProfile}
className="
mt-6
w-full
bg-gradient-to-r
from-purple-600
to-indigo-600
hover:from-purple-700
hover:to-indigo-700
text-white
py-3
rounded-xl
font-semibold
shadow-lg
transition-all
duration-300
hover:scale-[1.02]
"
>
            Save Preferences
          </button>
        </div>
        

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-900 dark:text-white border border-transparent dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-all duration-300">
          <h2>🔔 Notifications</h2>
          {/* Streak Reminder */}
<div className="flex justify-between items-center py-3 border-b">

  <div>
    <h3 className="font-semibold">
       Streak Reminder
    </h3>
    <p className="text-sm text-gray-500">
      Notify me if today's habits are incomplete.
    </p>
  </div>

  <button
onClick={() => setStreakReminder(!streakReminder)}
className={`
relative
w-14
h-7
rounded-full
transition-all
duration-300
${streakReminder ? "bg-purple-600" : "bg-gray-300"}
`}
>

<span
className={`
absolute
top-1
left-1
w-5
h-5
bg-white
rounded-full
transition-all
duration-300
${streakReminder ? "translate-x-7" : ""}
`}
/>

</button>

</div>

{/* Goal Achievement */}
<div className="flex justify-between items-center py-3 border-b">

  <div>
    <h3 className="font-semibold">
       Goal Achievement
    </h3>
    <p className="text-sm text-gray-500">
      Notify when daily goal is completed.
    </p>
  </div>

  <button
onClick={() => setGoalReminder(!goalReminder)}
className={`
relative
w-14
h-7
rounded-full
transition-all
duration-300
${goalReminder ? "bg-purple-600" : "bg-gray-300"}
`}
>

<span
className={`
absolute
top-1
left-1
w-5
h-5
bg-white
rounded-full
transition-all
duration-300
${goalReminder ? "translate-x-7" : ""}
`}
/>

</button>

</div>

{/* Daily Reminder */}
<div className="flex justify-between items-center py-3">

  <div>
    <h3 className="font-semibold">
       Daily Reminder
    </h3>
    <p className="text-sm text-gray-500">
      Receive reminder every day.
    </p>
  </div>

  <button
onClick={() => setDailyReminder(!dailyReminder)}
className={`
relative
w-14
h-7
rounded-full
transition-all
duration-300
${dailyReminder ? "bg-green-500" : "bg-gray-300"}
`}
>

<span
className={`
absolute
top-1
left-1
w-5
h-5
bg-white
rounded-full
transition-all
duration-300
${dailyReminder ? "translate-x-7" : ""}
`}
/>

</button>

</div>

          <label>Reminder Time</label>

          <input
          className="
w-full
mt-2
mb-4
px-4
py-3
rounded-xl
border
dark:bg-gray-700
border-gray-300
focus:outline-none
focus:ring-2
focus:ring-purple-500
transition-all
"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />

          <button
onClick={async()=>{

  await saveReminderSettings();

  await enableNotifications();

}}
            className="
w-full
bg-gradient-to-r
from-purple-600
to-indigo-600
hover:from-purple-700
hover:to-indigo-700
text-white
font-semibold
py-3
rounded-xl
shadow-lg
hover:shadow-xl
transition-all
duration-300
hover:scale-[1.02]
"
            >

            Save Notification

            </button>
        </div>

{/* Security */}
          <div className="bg-white dark:bg-gray-900 border dark:text-white border-transparent dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-all duration-300">

            <h2>🔒 Security</h2>

            <div className="relative">

<input
className="
w-full
mt-2
mb-2
px-4
py-3
rounded-xl
border
border-gray-300
focus:outline-none
focus:ring-2
focus:ring-purple-500
dark:bg-gray-700
transition-all
pr-12
"
type={
showPassword.current
? "text"
: "password"
}
name="currentPassword"
placeholder="Current Password"
value={passwordData.currentPassword}
onChange={handlePasswordChange}
/>

<button
type="button"
className="absolute right-4 top-6 text-gray-500"
onClick={() =>
setShowPassword({
...showPassword,
current: !showPassword.current
})
}
>
{
showPassword.current
?
<EyeOff size={20}/>
:
<Eye size={20}/>
}
</button>

</div>

            <div className="relative">

<input
className="
w-full
mt-2
mb-2
px-4
py-3
rounded-xl
border
border-gray-300
focus:outline-none
focus:ring-2
focus:ring-purple-500
dark:bg-gray-700
transition-all
pr-12
"
type={
showPassword.new
? "text"
: "password"
}
name="newPassword"
placeholder="New Password"
value={passwordData.newPassword}
onChange={handlePasswordChange}
/>

<button
type="button"
className="absolute right-4 top-6 text-gray-500"
onClick={() =>
setShowPassword({
...showPassword,
new: !showPassword.new
})
}
>
{
showPassword.new
?
<EyeOff size={20}/>
:
<Eye size={20}/>
}
</button>

</div>

{passwordData.newPassword && (

<div className="mb-2">

<div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-gray-600">

<div
className={`h-2.5 rounded-full ${
getPasswordStrength(passwordData.newPassword).color
}`}
style={{
width:
getPasswordStrength(passwordData.newPassword).width
}}
/>

</div>

<p className="text-sm mt-2 font-medium">

Strength :

<span className="ml-2">

{
getPasswordStrength(passwordData.newPassword).text
}

</span>

</p>

</div>

)}


    <div className="relative">

<input
className="
w-full
mt-2
mb-4
px-4
py-3
rounded-xl
border
border-gray-300
focus:outline-none
focus:ring-2
focus:ring-purple-500
dark:bg-gray-700
transition-all
pr-12
"
type={
showPassword.confirm
? "text"
: "password"
}
name="confirmPassword"
placeholder="Confirm Password"
value={passwordData.confirmPassword}
onChange={handlePasswordChange}
/>

<button
type="button"
className="absolute right-4 top-6 text-gray-500"
onClick={() =>
setShowPassword({
...showPassword,
confirm: !showPassword.confirm
})
}
>
{
showPassword.confirm
?
<EyeOff size={20}/>
:
<Eye size={20}/>
}
</button>

</div>

            <button onClick={updatePassword}
            className="
w-full
bg-gradient-to-r
from-purple-600
to-indigo-600
hover:from-purple-700
hover:to-indigo-700
text-white

font-semibold
py-3
rounded-xl
shadow-lg
hover:shadow-xl
transition-all
duration-300
hover:scale-[1.02]
">
              Update Password
            </button>

          </div>

        
        {/* Appearance */}

<div className="bg-white dark:bg-gray-900 border dark:text-white border-transparent dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-all duration-300">

<h2 className="text-xl font-bold mb-6">
🎨 Appearance
</h2>

<div className="grid  grid-cols-3 gap-3">

{/* Light */}

<button
onClick={() => {
  console.log("Clicked Light");
  setTheme("light");
}}
className={`

rounded-xl
border
p-5
transition-all
duration-300

${theme==="light"

?

"bg-purple-600 text-white border-purple-600"

:

"bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"

}

`}
>

<div className="text-3xl mb-2">
☀️
</div>

<div className="font-semibold">
Light
</div>

</button>

{/* Dark */}

<button
onClick={() => {
  console.log("Clicked Dark");
  setTheme("dark");
}}
className={`

rounded-xl
border
p-5
transition-all
duration-300

${theme==="dark"

?

"bg-purple-600 text-white border-purple-600"

:

"bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"

}

`}
>

<div className="text-3xl mb-2">
🌙
</div>

<div className="font-semibold">
Dark
</div>

</button>

{/* Device */}

<button
onClick={() => {
  console.log("Clicked System");
  setTheme("system");
}}
className={`

rounded-xl
border
p-5
transition-all
duration-300

${theme==="system"

?

"bg-purple-600 text-white border-purple-600"

:

"bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"

}

`}
>

<div className="text-3xl mb-2">
💻
</div>

<div className="font-semibold">
Device
</div>

</button>

</div>

<p className="text-sm text-gray-500 dark:text-gray-400 mt-5">

Choose how HabitMetric should appear.

</p>

<button

onClick={saveProfile}

className="

w-full

mt-6

bg-gradient-to-r

from-purple-600

to-indigo-600

hover:from-purple-700

hover:to-indigo-700

text-white

font-semibold

py-3

rounded-xl

shadow-lg

transition-all

duration-300

"

>

Save Theme

</button>

</div>

        


          <div
          onClick={() => setShowGuide(true)}
          className="bg-white dark:bg-gray-900 dark:text-gray-300 border border-transparent dark:border-gray-700 rounded-2xl shadow-md p-5 flex justify-between items-center cursor-pointer dark:hover:bg-gray-800 hover:bg-purple-50 transition"
        >

          <div className="flex items-center gap-4">

            <HelpCircle
              className="text-purple-600"
              size={28}
            />

            <div>

              <h2 className="font-bold">
                How to Use HabitMetric
              </h2>

              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Learn how HabitMetric works
              </p>

            </div>

          </div>

          <span className="text-purple-600 font-bold">
            →
          </span>

        </div>

        {/* Account */}
        <div className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-700 dark:text-white rounded-2xl shadow-lg p-6 transition-all duration-300">
          <h2>⚠ Account</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-00">

            Version : 1.0

            </p>

            <p className="text-gray-500">

            Member Since : July 2026

            </p>

            <hr className="my-4"/>

          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r
          from-blue-600
          to-cyan-600
          hover:from-blue-700
          hover:to-cyan-700
          shadow-lg
          hover:shadow-xl
          text-white
          py-3
          rounded-xl
          mt-4
          transition"
          >
            Logout
          </button>

          <button
            className="
w-full
mt-4
bg-gradient-to-r
from-red-600
to-rose-600
hover:from-red-700
hover:to-rose-700
text-white
font-semibold
py-3
rounded-xl
shadow-lg
transition-all
duration-300
hover:scale-[1.02]
"
            onClick={deleteAccount}
          >
            Delete Account
          </button>
        </div>


        
        {/* About */}
        <div className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-700 dark:text-white rounded-2xl shadow-lg p-6 transition-all duration-300">

          <h2>ℹ️ About HabitMetric</h2>

          <div className="space-y-3 mt-4">

            <p>
              <strong>Version:</strong> 1.0.0
            </p>

            <p>
              <strong>Framework:</strong> React + Node.js
            </p>

            <p>
              <strong>Database:</strong> MongoDB
            </p>

            <p>
              <strong>Developer:</strong> Dhayalan
            </p>
              <p>
              HabitMetric helps you build
              better habits and track your
              daily consistency.
            </p>


          </div>

        </div>
            
            </div>
            
            <div className="text-center text-gray-500 dark:text-white mt-10 mb-6">

            HabitMetric © 2026.
            Built by Dhayalan

        </div>

            {showGuide && (

            <div className="fixed inset-0 bg-black/50 flex justify-center  items-center z-50">

            <div className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-700 rounded-3xl shadow-2xl w-[700px] max-h-[85vh] overflow-y-auto p-8">

            <div className="flex justify-between items-center mb-6">

            <h2 className="text-3xl dark:text-white font-bold">
            📘 How to Use HabitMetric
            </h2>

            <button
            onClick={() => setShowGuide(false)}
            className="text-red-500 text-2xl font-bold cursor-pointer"
            >
            ✕
            </button>

            </div>

            <div className="space-y-6">

            <div className="bg-purple-50 dark:bg-gray-100  rounded-xl p-5">

            <h3 className="font-bold text-xl">
            ① Create Your Habits
            </h3>

            <ul className="list-disc ml-6 mt-3 space-y-2">

            <li>Create Good or Bad habits.</li>

            <li>Select Yes/No or Target habit.</li>

            <li>Set your daily target.</li>

            </ul>

            </div>

            <div className="bg-green-50 dark:bg-gray-300  rounded-xl p-5">

            <h3 className="font-bold text-xl">
            ② Complete Daily Habits
            </h3>

            <ul className="list-disc ml-6 mt-3 space-y-2">

            <li>Good Habit Completed → +10</li>

            <li>Good Habit Pending → 0</li>

            <li>Bad Habit Completed → -10</li>

            <li>Bad Habit Pending → +10</li>

            </ul>

            </div>

            <div className="bg-blue-50 dark:bg-gray-100  rounded-xl p-5">

            <h3 className="font-bold text-xl">
            ③ Daily Reset
            </h3>

            <p className="mt-3">

            Every new day HabitMetric automatically saves yesterday's progress and starts a fresh day.

            </p>

            </div>

            <div className="bg-yellow-50 dark:bg-gray-300  rounded-xl p-5">

            <h3 className="font-bold text-xl">
            ④ Habit Score
            </h3>

            <p className="mt-3">

            Maximum Score = Number of Habits × 10

            </p>

            <p>

            Complete Good Habits and Avoid Bad Habits to get the highest score.

            </p>

            </div>

            <div className="bg-pink-50 dark:bg-gray-100  rounded-xl p-5">

            <h3 className="font-bold text-xl">
            ⑤ History
            </h3>

            <ul className="list-disc ml-6 mt-3 space-y-2">

            <li>Daily Performance</li>

            <li>Habit Score</li>

            <li>Completion Rate</li>

            <li>Weekly Charts</li>

            <li>Heatmap</li>

            </ul>

            </div>

            <div className="bg-indigo-50 dark:bg-gray-300  rounded-xl p-5">

            <h3 className="font-bold text-xl">
            ⑥ Analytics
            </h3>

            <ul className="list-disc ml-6 mt-3 space-y-2">

            <li>Weekly Performance</li>

            <li>Completion Percentage</li>

            <li>Category Analysis</li>

            <li>Overall Progress</li>

            </ul>

            </div>

            <div className="bg-orange-50 dark:bg-gray-100  rounded-xl p-5">

            <h3 className="font-bold text-xl">
            💡 Tips
            </h3>

            <ul className="list-disc ml-6 mt-3 space-y-2">

            <li>Open HabitMetric every day.</li>

            <li>Complete Good Habits.</li>

            <li>Avoid Bad Habits.</li>

            <li>Maintain your streak.</li>

            <li>Try to achieve a perfect score.</li>

            </ul>

            </div>

            </div>

            <div className="mt-8 text-center">

            <button

            onClick={() => setShowGuide(false)}
              
            className=" text-white px-8 py-3 rounded-xl bg-purple-700"

            >

            Got It 👍

            </button>

            </div>

            </div>

            </div>

            )}
      </main>
      

    </div>

  </div>
);
}

export default Settings;