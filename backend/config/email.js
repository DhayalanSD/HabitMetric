const nodemailer = require("nodemailer");

console.log("📧 Email Config Loaded");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use STARTTLS
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

const dns = require("dns");

dns.lookup("smtp.gmail.com", (err, address) => {
  if (err) {
    console.error("DNS Lookup Error:", err);
  } else {
    console.log("smtp.gmail.com resolved to:", address);
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Error:", error);
  } else {
    console.log("✅ SMTP Server is ready");
  }
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: `"HabitMetric" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.log("❌ Email sending failed:", error);
    throw error;
  }
};

module.exports = sendEmail;