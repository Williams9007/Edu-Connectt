import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: `"EduConnectt" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: "Test Gmail SMTP",
  text: "If you receive this, Gmail SMTP works!",
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) return console.error("❌ Error:", err);
  console.log("✅ Email sent:", info.response);
});
