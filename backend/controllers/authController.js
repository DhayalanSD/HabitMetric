const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const PendingUser = require("../models/PendingUser");
const sendEmail = require("../config/email");
const emailTemplate = require("../utils/emailTemplate");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check all fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};



// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Success
    res.status(200).json({
      message: "Login successful",

      token: generateToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

//checkemail

const checkEmail = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {

      return res.json({
        available: false,
        message: "Email already registered.",
      });

    }

    return res.json({
      available: true,
      message: "Email available.",
    });

  } catch (err) {

    res.status(500).json({
      message: "Server Error",
    });

  }

};
const sendRegistrationLink = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered.",
      });
    }

    // Remove old pending request
    await PendingUser.deleteMany({ email });

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Token expiry (15 mins)
    const expiresAt = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // Save pending registration
    await PendingUser.create({
      email,
      token,
      expiresAt,
    });

    // Registration link
    const registerURL =
      `${process.env.FRONTEND_URL}/register/${token}`;

    // Send Email
    await sendEmail({

  email,

  subject: "Complete your HabitMetric Registration",

  message: emailTemplate({

    title: "Complete Registration",

    heading: "Welcome to HabitMetric 🎉",

    message: `

      <p>Hello,</p>

      <p>

      Thank you for choosing <strong>HabitMetric</strong>.

      </p>

      <p>

      You're just one step away from creating your account and starting your habit-building journey.

      </p>

      <p>

      Click the button below to complete your registration.

      </p>

      <p>

      This secure link will expire in <strong>15 minutes</strong>.

      </p>

    `,

    buttonText: "Complete Registration",

    buttonLink: registerURL,

  }),

});

    res.json({
      message:
        "Registration link sent successfully.",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

const completeRegistration = async (req, res) => {

  try {

    const { token } = req.params;

    const {
      name,
      password
    } = req.body;

    const pending =
      await PendingUser.findOne({
        token,
      });

    if (!pending) {

      return res.status(400).json({
        message:
          "Invalid registration link.",
      });

    }

    if (pending.expiresAt < new Date()) {

      await PendingUser.deleteOne({
        _id: pending._id,
      });

      return res.status(400).json({
        message:
          "Registration link expired.",
      });

    }

    const existing =
      await User.findOne({
        email: pending.email,
      });

    if (existing) {

      return res.status(400).json({
        message:
          "Account already exists.",
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await User.create({

      name,

      email: pending.email,

      password: hashedPassword,

    });

    await PendingUser.deleteOne({
      _id: pending._id,
    });

    await sendEmail({

  email: pending.email,

  subject: "🎉 Welcome to HabitMetric",

  message: emailTemplate({

    title: "Welcome",

    heading: `Welcome ${name}! 🎉`,

    message: `

      <p>

      Congratulations! Your <strong>HabitMetric</strong> account has been created successfully.

      </p>

      <p>

      You're now ready to build better habits, stay consistent, and track your progress every day.

      </p>

      <ul>

        <li>✅ Create unlimited habits</li>

        <li>📊 View beautiful analytics</li>

        <li>🔥 Build daily streaks</li>

        <li>📅 Track your yearly progress</li>

        <li>📄 Export reports to PDF & Excel</li>

      </ul>

      <p>

      We’re excited to be part of your self-improvement journey.

      </p>

    `,

    buttonText: "Login to HabitMetric",

    buttonLink: `${process.env.FRONTEND_URL}/login`,

  }),

});

    res.json({

      message:
        "Account created successfully.",

    });

  }

  catch(err){

    console.log(err);

    res.status(500).json({

      message:"Server Error",

    });

  }

};

const registrationInfo = async (req, res) => {
  try {

    const { token } = req.params;

    const pending = await PendingUser.findOne({ token });

    if (!pending) {
      return res.status(400).json({
        message: "Invalid registration link.",
      });
    }

    if (pending.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Registration link expired.",
      });
    }

    res.json({
      email: pending.email,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

const verifyRegistrationToken = async (req, res) => {

  try {

    const { token } = req.params;

    const pending = await PendingUser.findOne({
      token,
    });

    if (!pending) {

      return res.status(400).json({
        message: "Invalid registration link.",
      });

    }

    if (pending.expiresAt < new Date()) {

      await PendingUser.deleteOne({
        _id: pending._id,
      });

      return res.status(400).json({
        message: "Registration link expired.",
      });

    }

    res.json({
      email: pending.email,
    });

  }

  catch(err){

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

module.exports = {

  registerUser,

  loginUser,

  checkEmail,

  sendRegistrationLink,
  registrationInfo,

  verifyRegistrationToken,

  completeRegistration,

};