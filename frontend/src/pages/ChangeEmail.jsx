import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import api from "../services/api";

function ChangeEmail() {

  const [newEmail, setNewEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async () => {

    if (!newEmail) {

      setError("Please enter a new email.");

      return;

    }

    try {

      setLoading(true);

      setError("");

      const res = await api.post(
        "/users/change-email-request",
        {
          email: newEmail,
        }
      );

      setMessage(res.data.message);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen  flex">

      {/* Left Panel */}

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-700 to-indigo-600 text-white items-center justify-center p-12">

        <div>

          <h1 className="text-5xl font-bold">
            HabitMetric
          </h1>

          <p className="mt-6 text-xl leading-8">

            Change your account email.

            <br />

            Your new email will become

            <br />

            active after verification.

          </p>

          <div className="mt-10 text-8xl">
            📧
          </div>

        </div>

      </div>

      {/* Right Panel */}

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 px-4 sm:px-6 py-8">

        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-6 sm:p-8">

          <div className="lg:hidden text-center mb-6">

            <h1 className="text-3xl font-bold text-purple-700">
              HabitMetric
            </h1>

          </div>

          <Link
            to="/settings"
            className="flex items-center gap-2 text-purple-600 mb-6 hover:underline"
          >

            <ArrowLeft size={18} />

            Back to Settings

          </Link>

          <h2 className="text-3xl font-bold text-center">

            Change Email

          </h2>

          <p className="text-gray-500 text-center mt-2">

            Enter your new email address.

          </p>

          <div className="mt-8">

            <label className="font-semibold">

              New Email Address

            </label>

            <div className="flex items-center border rounded-xl px-4 mt-2">

              <Mail
                className="text-gray-400"
                size={20}
              />

              <input
                type="email"
                value={newEmail}
                onChange={(e)=>setNewEmail(e.target.value)}
                placeholder="Enter new email"
                className="w-full p-3 outline-none"
              />

            </div>

          </div>

          {error && (

            <p className="text-red-600 mt-4">

              {error}

            </p>

          )}

          {message && (

            <div className="mt-5 bg-green-50 border border-green-300 rounded-xl p-4">

              <h3 className="font-bold text-green-700">

                Verification Email Sent

              </h3>

              <p className="text-sm mt-2">

                Check your inbox or spam to verify your new email.

              </p>

            </div>

          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >

            {loading
              ? "Sending..."
              : "Send Verification Link"}

          </button>

        </div>

      </div>

    </div>

  );

}

export default ChangeEmail;