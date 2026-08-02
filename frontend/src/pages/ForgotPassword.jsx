import { useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/password/forgot", {
        email,
      });

      alert(res.data.message);

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Side */}

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-700 to-indigo-600 text-white items-center justify-center p-12">

        <div>

          <h1 className="text-5xl font-bold">
            HabitMetric
          </h1>

          <p className="mt-6 text-xl leading-8">
            Forgot your password?
            <br />
            No worries.
            <br />
            We'll help you recover it.
          </p>

          <div className="mt-10 text-8xl">
            🔑
          </div>

        </div>

      </div>

      {/* Right Side */}

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

          {/* Mobile Logo */}

          <div className="lg:hidden text-center mb-6">

            <h1 className="text-3xl font-bold text-purple-700">
              HabitMetric
            </h1>

            <p className="text-gray-500 mt-2">
              Secure Password Recovery
            </p>

          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-center">
            Forgot Password
          </h2>

          <p className="text-gray-500 text-center mt-2 leading-6">
            Enter your registered email address and we'll send you a password reset link.
          </p>

          {/* Email */}

          <div className="mt-8">

            <label className="font-semibold">
              Email Address
            </label>

            <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 mt-2 focus-within:border-purple-500 transition">

              <Mail
                className="text-gray-400"
                size={20}
              />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full p-3 outline-none"
              />

            </div>

          </div>

          

          {/* Button */}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
            w-full
            mt-8
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
            disabled:opacity-70
            disabled:cursor-not-allowed
          "
          >

            {loading ? (

              <div className="flex justify-center items-center gap-3">

                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                Sending...

              </div>

            ) : (

              "Send Reset Link"

            )}

          </button>

          {/* Back */}

          <p className="text-center mt-6 text-sm sm:text-base">

            Remember your password?

            <Link
              to="/login"
              className="text-purple-600 font-semibold ml-2 hover:underline"
            >
              Login
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

export default ForgotPassword;