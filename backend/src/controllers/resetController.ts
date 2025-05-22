import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { ResetToken } from '../models/resetTokenModel';
import { hashPassword } from '../utils/passwordUtils';
import { sendOTPEmail } from '../utils/emailUtils';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const requestReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await ResetToken.deleteMany({ email }); // Remove old OTPs
  await ResetToken.create({ email, otp, expiresAt });

  await sendOTPEmail(email, otp);

  res.json({ message: 'OTP sent to email' });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  const record = await ResetToken.findOne({ email, otp });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.password = await hashPassword(newPassword);
  await user.save();

  await ResetToken.deleteMany({ email }); // Cleanup OTPs

  res.json({ message: 'Password reset successful' });
};
