const axios = require("axios");

console.log("📧 Brevo API Config Loaded");

const sendEmail = async (options) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "HabitMetric",
          email: process.env.EMAIL_USER,
        },
        to: [
          {
            email: options.email,
          },
        ],
        subject: options.subject,
        htmlContent: options.message,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );

    console.log("✅ Email sent successfully", response.data);
  } catch (error) {
    console.error(
      "❌ Brevo API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = sendEmail;