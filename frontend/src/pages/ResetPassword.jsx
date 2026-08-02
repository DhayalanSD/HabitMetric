import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import api from "../services/api";

function ResetPassword() {

  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const getPasswordStrength = (password) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2)
    return {
      text: "Weak",
      color: "bg-red-500",
      width: "w-1/3",
      textColor: "text-red-600",
    };

  if (score <= 4)
    return {
      text: "Medium",
      color: "bg-yellow-500",
      width: "w-2/3",
      textColor: "text-yellow-600",
    };

  return {
    text: "Strong",
    color: "bg-green-500",
    width: "w-full",
    textColor: "text-green-600",
  };
};

const strength = getPasswordStrength(formData.password);

  const handleReset = async () => {

    if (
      !formData.password ||
      !formData.confirmPassword
    ) {

      alert("Please fill all fields.");
      return;

    }

    if (
      formData.password !== formData.confirmPassword
    ) {

      alert("Passwords do not match.");
      return;

    }

    try {

      setLoading(true);

      await api.put(
        `/password/reset/${token}`,
        {
          password: formData.password,
        }
      );

      alert("Password Updated Successfully");

      navigate("/login");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Reset Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Left Side */}

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-700 to-indigo-600 text-white items-center justify-center p-12">

        <div>

          <h1 className="text-5xl font-bold">
            HabitMetric
          </h1>

          <p className="mt-6 text-xl leading-8">
            Create a new password.
            <br />
            Keep your account secure.
            <br />
            Continue your habit journey.
          </p>

          <div className="mt-10 text-8xl">
            🔐
          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-10 py-8">

        <div
          className="
            bg-white/90
            backdrop-blur-xl
            shadow-2xl
            rounded-3xl
            w-full
            max-w-md md:max-w-lg
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
              Secure Password Reset
            </p>

          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
            Reset Password
          </h2>

          <p className="text-gray-500 text-center mt-2 leading-6">
            Create a strong password for your account.
          </p>

          {/* New Password */}

          <div className="mt-8">

            <label className="font-semibold">
              New Password
            </label>

            <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 mt-2 focus-within:border-purple-500 transition">

              <Lock
                className="text-gray-400"
                size={20}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full p-3 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >

                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}

              </button>

            </div>

          </div>

          <div className="mt-3">

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

          <div
            className={`${strength.color} ${strength.width} h-full transition-all duration-500`}
          />

        </div>

        <p className={`mt-2 font-semibold ${strength.textColor}`}>
          Password Strength : {strength.text}
        </p>

      </div>

      <div className="mt-4 text-sm space-y-2">

  <p className={formData.password.length >= 8 ? "text-green-600" : "text-gray-500"}>
    {formData.password.length >= 8 ? "✅" : "⭕"} Minimum 8 characters
  </p>

  <p className={/[A-Z]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>
    {/[A-Z]/.test(formData.password) ? "✅" : "⭕"} One uppercase letter
  </p>

  <p className={/[a-z]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>
    {/[a-z]/.test(formData.password) ? "✅" : "⭕"} One lowercase letter
  </p>

  <p className={/[0-9]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>
    {/[0-9]/.test(formData.password) ? "✅" : "⭕"} One number
  </p>

  <p className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>
    {/[^A-Za-z0-9]/.test(formData.password) ? "✅" : "⭕"} One special character
  </p>

</div>

{formData.confirmPassword && (

<p
  className={`mt-2 font-medium ${
    formData.password === formData.confirmPassword
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {formData.password === formData.confirmPassword
    ? "✅ Passwords Match"
    : "❌ Passwords Don't Match"}
</p>

)}

          {/* Confirm Password */}

          <div className="mt-5">

            <label className="font-semibold">
              Confirm Password
            </label>

            <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 mt-2 focus-within:border-purple-500 transition">

              <Lock
                className="text-gray-400"
                size={20}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full p-3 outline-none"
              />

            </div>

          </div>

          {/* Button */}

          <button
            onClick={handleReset}
            disabled={loading ||
  formData.password !== formData.confirmPassword ||
  formData.password.length < 8}
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

                Updating...

              </div>

            ) : (

              "Update Password"

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

export default ResetPassword;