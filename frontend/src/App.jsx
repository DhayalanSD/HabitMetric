import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import CompleteRegistration from "./pages/CompleteRegistration";
import ChangeEmail from "./pages/ChangeEmail";
import VerifyEmailChange from "./pages/VerifyEmailChange";
import { useEffect } from "react";
  

function App() {

  useEffect(() => {

    const savedTheme = localStorage.getItem("theme") || "system";

    if (savedTheme === "dark") {

      document.documentElement.classList.add("dark");

    } else if (savedTheme === "light") {

      document.documentElement.classList.remove("dark");

    } else {

      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      document.documentElement.classList.toggle(
        "dark",
        prefersDark
      );

    }

  }, []);

  


  return (

    <BrowserRouter>

      <Routes>


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <Habits />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/register" element={<Register />} />

<Route
  path="/register/:token"
  element={<CompleteRegistration />}
/>
        <Route path="/reset-password/:token" element={<ResetPassword />}/>
  <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route
    path="/change-email"
    element={<ChangeEmail />}
/>
      
      <Route
  path="/verify-email-change/:token"
  element={<VerifyEmailChange />}
/>
</Routes>

    </BrowserRouter>

  );

}

export default App;