const nodemailer = require("nodemailer");

console.log("📧 Brevo Email Config Loaded");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log("❌ Brevo SMTP Error:", error);
  } else {
    console.log("✅ Brevo SMTP Connected");
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