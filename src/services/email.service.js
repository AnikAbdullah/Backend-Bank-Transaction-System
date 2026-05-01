require("dotenv").config();
const nodemailer = require("nodemailer");

const requiredEmailEnv = [
  "EMAIL_USER",
  "CLIENT_ID",
  "CLIENT_SECRET",
  "REFRESH_TOKEN",
];

function assertEmailConfig() {
  const missing = requiredEmailEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing email environment variables: ${missing.join(", ")}`);
  }
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    assertEmailConfig();

    const info = await transporter.sendMail({
      from: `"Bank-Transaction-System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Accepted recipients:", info.accepted);
    console.log("Rejected recipients:", info.rejected);

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    return null;
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Bank Transaction System!";
  const text = `Hello ${name},\n\nThank you for registering with our Bank Transaction System. We're excited to have you on board!\n\nBest regards,\nBank Transaction System Team`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering with our Bank Transaction System. We're excited to have you on board!</p><p>Best regards,<br>Bank Transaction System Team</p>`;

  return await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
};
