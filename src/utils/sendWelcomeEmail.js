// utils/sendWelcomeEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a welcome email to new users
 * @param {string} userEmail - User's email
 * @param {string} userName - User's full name
 */
export const sendWelcomeEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: `"EduConnect" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "🎉 Welcome to EduConnect!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to <span style="color: #4f46e5;">EduConnect</span>, ${userName}!</h2>
        <p>We’re thrilled to have you on board. Your journey toward better learning and connection starts now!</p>
        <p>Here’s what you can do next:</p>
        <ul>
          <li>🧭 Explore your dashboard</li>
          <li>📚 Enroll in subjects</li>
          <li>💬 Connect with teachers and classmates</li>
        </ul>
        <p>If you ever need help, just reply to this email — we’re always here for you.</p>
        <p>Best,<br/>The EduConnect Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
  }
};
