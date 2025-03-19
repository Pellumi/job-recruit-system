const nodemailer = require("nodemailer");

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = { from: process.env.GMAIL_ADDRESS, to, subject, html };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
