require("dns").setDefaultResultOrder("ipv4first");
require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
// Routes
const habitRoutes = require("./routes/habitRoutes");
const historyRoutes = require("./routes/historyRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const app = express();
const cron = require("node-cron");
const dailyReset = require("./utils/dailyReset");
const notificationRoutes = require("./routes/notificationRoutes");
const startReminderJob = require("./jobs/reminderJob");

// Middleware
app.use(cors({
  origin: "https://habitmetric.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// MongoDB Connection
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    
    startReminderJob();



    // Check if a reset was missed while the server was offline
    console.log("🔍 Checking daily reset...");

    await dailyReset();

    console.log("✅ Daily reset check completed");

    // Run every midnight
    cron.schedule(
      "0 0 * * *",
      async () => {
        console.log("⏰ Running Daily Reset...");
        await dailyReset();
      },
      {
        timezone: "Asia/Kolkata",
      }
    );

    console.log("✅ Daily Reset Scheduler Started");
  })
  .catch((error) => {
    console.log("❌ MongoDB Connection Error");
    console.log(error.message);
  });


// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "HabitMetric Backend Running 🚀",
  });
});

// API Routes
app.use("/api/habits", habitRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/notifications", notificationRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

