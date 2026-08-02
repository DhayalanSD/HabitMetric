import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import api from "../services/api";

function CompleteRegistration() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await api.get(
          `/auth/verify-registration/${token}`
        );

        setEmail(res.data.email);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Invalid registration link."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const passwordStrength = () => {
    const pwd = formData.password;

    if (pwd.length < 6)
      return {
        text: "Weak",
        color: "bg-red-500",
        width: "30%",
      };

    if (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /[0-9]/.test(pwd)
    )
      return {
        text: "Strong",
        color: "bg-green-500",
        width: "100%",
      };

    return {
      text: "Medium",
      color: "bg-yellow-500",
      width: "65%",
    };
  };

  const strength = passwordStrength();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateAccount = async () => {
    setError("");

    if (
      !formData.name ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password should contain at least 6 characters."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setCreating(true);

      await api.post(
        `/auth/complete-registration/${token}`,
        {
          name: formData.name,
          password: formData.password,
        }
      );

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (error && email === "") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">

          <h1 className="text-2xl font-bold text-red-600">
            Registration Error
          </h1>

          <p className="mt-5 text-gray-600">
            {error}
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 bg-purple-600 text-white px-6 py-3 rounded-xl"
          >
            Back to Register
          </Link>

        </div>

      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center w-full max-w-md animate-pulse">

          <CheckCircle
            size={80}
            className="mx-auto text-green-500"
          />

          <h1 className="text-3xl font-bold mt-5">
            Welcome to HabitMetric 🎉
          </h1>

          <p className="mt-4 text-gray-600">
            Your account has been created successfully.
          </p>

          <p className="mt-2 text-gray-500">
            Redirecting to Login...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center">
          Complete Registration
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Finish creating your HabitMetric account.
        </p>

        <div className="mt-8">

          <label className="font-semibold">
            Email
          </label>

          <input
            value={email}
            disabled
            className="w-full mt-2 p-3 rounded-xl bg-gray-100 text-gray-600"
          />

        </div>

        <div className="mt-5">

          <label className="font-semibold">
            Full Name
          </label>

          <div className="flex items-center border rounded-xl px-4 mt-2">

            <User size={20} className="text-gray-400"/>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 outline-none"
              placeholder="Enter your name"
            />

          </div>

        </div>

        <div className="mt-5">

          <label className="font-semibold">
            Password
          </label>

          <div className="flex items-center border rounded-xl px-4 mt-2">

            <Lock size={20} className="text-gray-400"/>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 outline-none"
              placeholder="Create password"
            />

            <button
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeOff size={20}/>
              ) : (
                <Eye size={20}/>
              )}
            </button>

          </div>

          <div className="mt-3 flex justify-between text-sm">

            <span>Password Strength</span>

            <span>{strength.text}</span>

          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">

            <div
              className={`${strength.color} h-2 rounded-full`}
              style={{
                width: strength.width,
              }}
            />

          </div>

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

        <div className="mt-5">

          <label className="font-semibold">
            Confirm Password
          </label>

          <div className="flex items-center border rounded-xl px-4 mt-2">

            <Lock size={20} className="text-gray-400"/>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 outline-none"
              placeholder="Confirm password"
            />

          </div>

        </div>

        {error && (
          <p className="text-red-600 mt-4 text-sm">
            {error}
          </p>
        )}

        <button
          onClick={handleCreateAccount}
          disabled={creating}
          className="w-full mt-8 py-3 rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 transition"
        >
          {creating
            ? "Creating Account..."
            : "Create Account"}
        </button>

      </div>

    </div>
  );
}

export default CompleteRegistration;