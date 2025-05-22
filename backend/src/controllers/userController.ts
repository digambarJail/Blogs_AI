import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { hashPassword, comparePasswords } from '../utils/passwordUtils';
import jwt from 'jsonwebtoken';

// Register new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (await User.findOne({ email })) 
      return res.status(400).json({ error: 'Email already registered' });

    const hashed = await hashPassword(password);

    const user = new User({ username, email, password: hashed });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const valid = await comparePasswords(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,         // must be true on HTTPS
      sameSite: 'none',     // allow cross-site cookie
      maxAge: 1000 * 60 * 60 * 24, // 1 day for example
    });

    res.json({ message: 'Login successful' });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// Update user role (Admin only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (role !== 'admin' && role !== 'editor') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    user.role = role as 'admin' | 'editor';
    await user.save();

    res.json({ message: 'User role updated' });
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};