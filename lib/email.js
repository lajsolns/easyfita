import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    // You can use a service like Gmail, SendGrid, etc.
    // For Gmail, you'll need an App Password if 2FA is enabled.
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // e.g. ezfita@gmail.com
      pass: process.env.EMAIL_PASS, // App Password
    },
  });

  const mailOptions = {
    from: `"EasyFITA Form" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}
