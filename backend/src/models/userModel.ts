import mongoose from 'mongoose';

export type UserRole = 'admin' | 'editor';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'editor'], default: 'editor' }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
