import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import api from "../services/api";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const handleChange = (e) => {

  setFormData({

    ...formData,

    [e.target.name]: e.target.value,

  });

};

const handleLogin = async () => {

  if (!formData.email || !formData.password) {

    alert("Please enter Email & Password");

    return;

  }

  try {

    setLoading(true);

    const response =
      await api.post("/auth/login", formData);

    if (rememberMe) {

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

    } else {

      sessionStorage.setItem(
        "token",
        response.data.token
      );

      sessionStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

    }

    alert("Login Successful");

    navigate("/dashboard");

  }

  catch (error) {

    alert(
      error.response?.data?.message ||
      "Login Failed"
    );

  }

  finally {

    setLoading(false);

  }

};

  return (
    <div className="min-h-screen flex">

      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-700 to-indigo-600 text-white items-center justify-center p-12">

        <div>

          <h1 className="text-4xl xl:text-5xl font-bold">
            HabitMetric
          </h1>

          <p className="mt-6 text-lg xl:text-xl leading-8">
            Build better habits.
            <br />
            Track your progress.
            <br />
            Become your best self.
          </p>

          <div className="mt-10 text-6xl xl:text-8xl">
           🚀
          </div>

        </div>

      </div>

      {/* Right Section */}

      <div
className="
w-full
lg:w-1/2
flex
items-center
justify-center
bg-gray-100
px-4
sm:px-6
py-8
"
>
        <div
className="
bg-white/90
backdrop-blur-xl
shadow-2xl
rounded-3xl

w-full
max-w-md

p-6
sm:p-8
lg:p-10
"
>

  {/*
Mobile Logo
*/}
<div className="lg:hidden text-center mb-6">

    <h1 className="text-3xl font-bold text-purple-700">
        HabitMetric
    </h1>

    <p className="text-gray-500 mt-2">
        Track. Improve. Repeat.
    </p>

</div>

          <h2 className="text-2xl sm:text-3xl font-bold text-center">
            Welcome Back 👋
          </h2>

          <p className="text-gray-500 text-center mt-2">
            Login to continue your journey.
          </p>

          {/* Email */}

          <div className="mt-8">

            <label className="font-semibold">
              Email
            </label>

            <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 mt-2 focus-within:border-purple-500 transition">

              <Mail className="text-gray-400" size={20} />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 outline-none"
              />

            </div>

          </div>

          {/* Password */}

          <div className="mt-5">

            <label className="font-semibold">
              Password
            </label>

            <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 mt-2 focus-within:border-purple-500 transition">

              <Lock className="text-gray-400" size={20} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full p-3 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Remember */}

          <div
className="
flex
flex-col
sm:flex-row
gap-3
sm:gap-0
justify-between
sm:items-center
mt-5
"
>

            <label className="flex items-center gap-2">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />

            Remember Me

          </label>

            <Link
              to="/forgot-password"
              className="text-purple-600 hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Login */}

          <button
          onClick={handleLogin}
          disabled={loading}
          className="
w-full
mt-4
py-3
text-base
sm:text-lg
bg-gradient-to-r
from-purple-600
to-indigo-600
hover:scale-105
transition-all
duration-300
text-white
rounded-xl
font-semibold
shadow-lg
"
          >

          {loading ? (

          <div className="flex justify-center items-center gap-3">

          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

          Signing In...

          </div>

          ) : (

          "Login"

          )}

          </button>

          <p className="text-center text-sm sm:text-base mt-6">

            Don't have an account?

            <Link
              to="/register"
              className="text-purple-600 font-semibold ml-2"
            >
              Register
            </Link>

          </p>
          <p className="text-center text-gray-400 text-sm mt-8">

            HabitMetric © 2026

            </p>

        </div>
        

      </div>
      

    </div>
    
  );
}

export default Login;