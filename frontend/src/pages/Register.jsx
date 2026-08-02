import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import api from "../services/api";

function Register() {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
const [emailSuggestion, setEmailSuggestion] = useState("");

const suggestEmail = (email) => {
  const domains = {
    "gamil.com": "gmail.com",
    "gmail.con": "gmail.com",
    "gmail.co": "gmail.com",
    "gnail.com": "gmail.com",

    "outlok.com": "outlook.com",
    "outlook.con": "outlook.com",

    "yahoo.con": "yahoo.com",
    "yaho.com": "yahoo.com",

    "icloud.con": "icloud.com",
  };

  const parts = email.split("@");

  if (parts.length !== 2) return null;

  return domains[parts[1]]
    ? `${parts[0]}@${domains[parts[1]]}`
    : null;
};

const validateEmail = () => {

  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {

    setError("Please enter your email.");
    return false;

  }

  const suggestion = suggestEmail(email);

  if (suggestion) {

    setEmailSuggestion(suggestion);

    setError("Did you mean:");

    return false;

  }

  if (!regex.test(email)) {

    setError("Invalid email address.");

    return false;

  }

  setEmailSuggestion("");

  setError("");

  return true;

};


const handleRegister = async () => {

    if (!email) {

      setError("Please enter your email.");

      return;

    }

    try {

      setLoading(true);

      setError("");

      const res = await api.post(
        "/auth/send-registration-link",
        {
          email,
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

<div className="min-h-screen flex">

  {/* Left Side */}

  <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-700 to-indigo-600 text-white items-center justify-center p-12">

    <div>

      <h1 className="text-5xl font-bold">
        HabitMetric
      </h1>

      <p className="mt-6 text-xl leading-8">
        Build Better Habits.
        <br />
        Receive a secure registration link.
        <br />
        Start your journey today.
      </p>

      <div className="mt-10 text-8xl">
        📧
      </div>

    </div>

  </div>

  {/* Right Side */}

  <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-100 via-purple-50 to-indigo-100 px-4 sm:px-6 py-8">

    <div
      className="
      bg-white/90
      backdrop-blur-xl
      shadow-2xl
      rounded-3xl
      border
      border-white/30
      w-full
      max-w-md
      p-6
      sm:p-8
      lg:p-10
      "
    >
      <div className="lg:hidden text-center mb-6">

<h1 className="text-3xl font-bold text-purple-700">

HabitMetric

</h1>

<p className="text-gray-500 mt-2">

Secure Registration

</p>

</div>

    

    

        <h1 className="text-4xl font-extrabold text-center">

Create Account

</h1>

<p className="text-center text-gray-500 mt-3 leading-7">

Enter your email address.

We'll send a secure registration link.

</p>

        <div className="mt-8">

          <label className="font-semibold">

            Email Address

          </label>

          <div
className="
flex
items-center
border-2
border-gray-200
rounded-xl
px-4
mt-2
focus-within:border-purple-500
transition-all
"
>

            <Mail
              className="text-gray-400"
              size={20}
            />

            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => {

    setEmail(e.target.value);

    setError("");

    setEmailSuggestion("");

}}
              className="w-full p-3 outline-none"
            />

          </div>

          {error && (

<div className="mt-2 text-sm">

    <p className="text-red-600">

        {error}

    </p>

    {emailSuggestion && (

        <button
type="button"
className="
mt-2
text-blue-600
font-semibold
hover:underline
"
            onClick={() => {

                setEmail(emailSuggestion);

                setEmailSuggestion("");

                setError("");

            }}
            className="text-blue-600 underline mt-1"
        >

            {emailSuggestion}

        </button>

    )}

</div>

)}

{message && (

<div className="mt-5 rounded-2xl bg-green-50 border border-green-300 p-5">

<h3 className="font-bold text-green-700 text-lg">

Registration Link Sent

</h3>

<p className="mt-3">

We've sent a secure registration link to

</p>

<p className="font-semibold mt-2">

{email}

</p>

<div className="mt-4 text-sm text-gray-600">

<p>✔ Check Inbox</p>

<p>✔ Check Promotions</p>

<p>✔ Check Spam Folder</p>

<p className="mt-3">

The link expires in <b>15 minutes</b>.

</p>

</div>

</div>

)}
          

        </div>

        <button

          onClick={handleRegister}

          disabled={loading}

        className={`

w-full

mt-8

py-3

rounded-xl

text-white

font-semibold

shadow-xl

transition-all

duration-300

${
loading
? "bg-gray-400 cursor-not-allowed"
: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105"
}`}

        >

          {loading ? (

<div className="flex justify-center items-center gap-3">

<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

Sending Link...

</div>

) : (

" Send Registration Link"

)}

        </button>

        <p className="text-center mt-6 text-gray-600">

Already have an account?

<Link

            to="/login"

            className="ml-2 text-purple-600"

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

export default Register;