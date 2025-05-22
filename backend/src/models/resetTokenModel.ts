import mongoose from 'mongoose';

const resetTokenSchema = new mongoose.Schema({
  email:    { type: String, required: true },
  otp:      { type: String, required: true },
  expiresAt:{ type: Date, required: true }
}, { timestamps: true });

export const ResetToken = mongoose.model('ResetToken', resetTokenSchema);
