import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOTPEmail = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: `"AI Blog" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`
  });
};
