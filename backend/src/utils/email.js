const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,    
    pass: process.env.EMAIL_PASS      
  }
});

exports.sendReminderEmail = async (to, subject, message) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: message,
    });

    console.log("📧 Reminder email sent to:", to);
  } catch (err) {
    console.error("Email error:", err);
  }
};
