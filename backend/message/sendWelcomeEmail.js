// utils/sendWelcomeEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendWelcomeEmail = async (
  userEmail,
  studentName,
  packageName,
  subjects,
  startDate,
  finishDate,
  studyDuration
) => {
  console.log("📨 Preparing to send welcome email to:", userEmail);

  try {
    // ✅ Use Gmail (recommended) or your custom SMTP config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter before sending
    console.log("🔍 Verifying email transporter...");
    await transporter.verify();
    console.log("✅ Transporter verified successfully!");

    const mailOptions = {
      from: `"EduConnectt" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `🎉 Welcome to EduConnectt, ${studentName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; line-height: 1.6;">
          <p>Dear <strong>${studentName}</strong>,</p>

          <p>Congratulations on your successful registration with <strong>EduConnectt</strong>. 
          You have selected the <strong>${packageName}</strong> package, covering 
          <strong>${subjects}</strong> from <strong>${startDate}</strong> to <strong>${finishDate}</strong>, 
          for a <strong>${studyDuration}</strong> study period.</p>

          <p>To ensure a productive learning environment, please adhere to the following guidelines:</p>
          <ul>
            <li>Arrive 15 minutes prior to the start of classes 10 minutes beforehand.</li>
            <li>Bring a notepad and writing instrument to all lessons.</li>
            <li>Use your full name when joining online calls for attendance purposes.</li>
            <li>Ensure a stable internet connection.</li>
            <li>Mute your microphone when a class is in session.</li>
            <li>Participate in lessons from a quiet environment for concentration.</li>
          </ul>

          <p>Please also note the following:</p>
          <ul>
            <li>Maintaining personal decorum during lesson hours is your responsibility; failure to do so may result in removal from the class.</li>
            <li>While keeping your camera on during lessons is not mandatory, if you choose to do so, please ensure you are dressed appropriately to avoid being removed from the class after a prompt.</li>
          </ul>

          <p><a href="#" style="color: #4f46e5; text-decoration: none;">Click here</a> to access your study schedule, a tutorial on how to join classes, and a tour of your dashboard.</p>

          <p>Should you have any questions or encounter any difficulties, please do not hesitate to contact us at 
          <a href="mailto:contactus@EduConnectt.com" style="color: #4f46e5;">contactus@EduConnectt.com</a>.</p>

          <br/>
          <p>Kind regards,<br/><strong>EduConnectt</strong></p>

          <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
          <small>
            The content of this message is confidential. If you have received it by mistake, please inform us by an email reply and then delete the message. 
            It is forbidden to copy, forward, or in any way reveal the contents of this message to anyone. 
            The integrity and security of this email cannot be guaranteed over the Internet. Therefore, the sender will not be held liable for any damage caused by the message.
          </small>
        </div>
      `,
    };

    console.log("📦 Sending email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Welcome email sent successfully to ${userEmail}`);
    console.log("📬 Message ID:", info.messageId);
    console.log("📭 Response:", info.response);

    return info;
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    throw error;
  }
};
