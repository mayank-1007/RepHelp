// /lib/email.ts

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Replace with your Gmail email address from environment variables
    pass: process.env.EMAIL_PASS,  // Replace with your Gmail password or app-specific password
  },
});

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to,                           // Recipient address
    subject,                      // Subject line
    text: body,                   // Plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
