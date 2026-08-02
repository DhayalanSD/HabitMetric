const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmail = require("../config/email");
const emailTemplate = require("../utils/emailTemplate");

const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({

  email: user.email,

  subject: "🔒 Reset Your HabitMetric Password",

  message: emailTemplate({

    title: "Password Reset",

    heading: "Reset Your Password 🔒",

    message: `

      <p>Hello <strong>${user.name}</strong>,</p>

      <p>

      We received a request to reset your HabitMetric password.

      </p>

      <p>

      If you made this request, click the button below to create a new password.

      </p>

      <p>

      This password reset link will expire in
      <strong>15 minutes</strong>.

      </p>

      <p>

      If you didn't request a password reset,
      you can safely ignore this email.
      Your account will remain secure.

      </p>

    `,

    buttonText: "Reset Password",

    buttonLink: resetUrl,

  }),

});

    res.json({
      message: "Password reset email sent. Please check your inbox and spam folder.",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

const resetPassword = async (req, res) => {
  try {

    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or Expired Reset Link",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    /* ===== PASTE HERE ===== */

await sendEmail({

  email: user.email,

  subject: "🔒 Your HabitMetric Password Was Changed",

  message: emailTemplate({

    title: "Password Updated",

    heading: "Your Password Has Been Changed 🔒",

    message: `

      <p>

      Hello <strong>${user.name}</strong> 👋

      </p>

      <p>

      Your HabitMetric password has been changed successfully.

      </p>

      <div
      style="
      background:#ECFDF5;
      border-left:5px solid #16A34A;
      padding:18px;
      border-radius:10px;
      margin:25px 0;
      ">

      <h3
      style="
      margin:0;
      color:#16A34A;
      ">

      ✅ Password Updated Successfully

      </h3>

      <p style="margin-top:10px;">

      Your account is now protected with your new password.

      </p>

      </div>

      <p>

      If you made this change, no further action is required.

      </p>

      <p style="color:#DC2626;">

      If you did NOT change your password,
      please reset it immediately.

      </p>

    `,

    buttonText: "Login to HabitMetric",

    buttonLink: `${process.env.FRONTEND_URL}/login`,

  }),

});

/* ===== END ===== */

    res.json({
      message: "Password Updated Successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};