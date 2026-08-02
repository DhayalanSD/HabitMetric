require("dotenv").config();
const nodemailer = require("nodemailer");

async function test() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ Login Success");
  } catch (err) {
    console.log("❌ Login Failed");
    console.log(err);
  }
}

test();