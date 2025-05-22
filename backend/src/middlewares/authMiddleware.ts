import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token; // 👈 read from cookie
  console.log('token',token)
  if (!token) return res.status(401).json({ error: 'Missing or invalid token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.user = decoded;
    console.log('requser',req.user)
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
