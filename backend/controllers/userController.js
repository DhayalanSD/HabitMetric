const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../config/email");
const emailTemplate = require("../utils/emailTemplate");

// GET Reminder Settings
const getReminderSettings = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);
    if (!user) {
  return res.status(404).json({
    message: "User not found",
  });
}

    res.json({
  reminder: user.reminder,
  reminderTime: user.reminderTime,
  timeZone: user.timeZone,
});

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// UPDATE Reminder Settings
const updateReminderSettings = async (req, res) => {

  try {

    const {
  reminder,
  reminderTime,
  timeZone,
} = req.body;

    const user = await User.findById(req.user._id);

    user.reminder = reminder;

    user.reminderTime = reminderTime;

    user.timeZone = timeZone;

    await user.save();

    res.json({
      message: "Reminder settings updated successfully.",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

const requestEmailChange = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({
        message: "Email is required",
      });

    }

    const existing = await User.findOne({
      email,
    });

    if (existing) {

      return res.status(400).json({
        message: "Email already exists",
      });

    }

    const token = crypto
      .randomBytes(32)
      .toString("hex");

    user.emailChangeToken = token;

    user.emailChangeExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const verifyUrl =
      `${process.env.FRONTEND_URL}/verify-email-change/${token}?email=${email}`;

    await sendEmail({
  email,

  subject: "📧 Verify Your New HabitMetric Email",

  message: emailTemplate({
    title: "Email Verification",

    heading: "Verify Your New Email Address 📧",

    message: `
      <p>Hello <strong>${user.name}</strong> 👋</p>

      <p>
      We received a request to update the email address
      associated with your HabitMetric account.
      </p>

      <div
      style="
      background:#F5F3FF;
      border-left:5px solid #6D28D9;
      padding:18px;
      border-radius:10px;
      margin:25px 0;
      ">

      <p style="margin:0;">
      <strong>New Email:</strong><br>
      ${email}
      </p>

      </div>

      <p>
      Please verify your new email address by clicking the button below.
      </p>

      <p style="color:#EF4444;">
      ⏳ This verification link expires in <strong>15 minutes</strong>.
      </p>

      <p>
      If you didn't request this change, you can safely ignore this email.
      </p>
    `,

    buttonText: "Verify Email",

    buttonLink: verifyUrl,
  }),
});

    res.json({

      message:
        "Verification email sent successfully.",

    });

  }

  catch (err) {

  console.error("❌ requestEmailChange Error:");
  console.error(err);
  console.error(err.stack);

  res.status(500).json({
    message: err.message,
  });

}

};

const verifyEmailChange = async (req, res) => {
  try {

    const { token } = req.params;
    const { email } = req.query;

    const user = await User.findOne({
      emailChangeToken: token,
      emailChangeExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or Expired verification link",
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    user.email = email;

    user.emailChangeToken = undefined;
    user.emailChangeExpire = undefined;

    await user.save();

    res.json({
      message: "Email updated successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

const Habit = require("../models/Habit");
const History = require("../models/History");

const deleteAccount = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Save email before deleting
    const userEmail = user.email;
    const userName = user.name;

    // Delete user data
    await Habit.deleteMany({ user: req.user._id });
    await History.deleteMany({ user: req.user._id });

    // Delete account
    await User.findByIdAndDelete(req.user._id);

    // Send goodbye email
    await sendEmail({
      email: userEmail,
      subject: "😢 Your HabitMetric Account Has Been Deleted",

      message: emailTemplate({

        title: "Account Deleted",

        heading: "We're Sorry To See You Go 😢",

        message: `
        <p>Hello <strong>${userName}</strong>,</p>

        <p>
        Your HabitMetric account has been permanently deleted.
        </p>

        <div
        style="
        background:#FEF2F2;
        border-left:5px solid #DC2626;
        padding:18px;
        border-radius:10px;
        margin:25px 0;
        ">

        <h3 style="margin:0;color:#DC2626;">
        🗑 Account Deleted
        </h3>

        <p style="margin-top:10px;">

        Your account,

        profile,

        habits,

        analytics,

        history,

        and all related data

        have been permanently removed.

        </p>

        </div>

        <p>

        Thank you for being part of HabitMetric.

        We wish you success in your journey.

        </p>
        `,

        buttonText: "Create New Account",

        buttonLink: `${process.env.FRONTEND_URL}/register`,

      }),
    });

    res.json({
      message: "Account deleted successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {

  getReminderSettings,

  updateReminderSettings,

  requestEmailChange,

  verifyEmailChange,

  deleteAccount,

};