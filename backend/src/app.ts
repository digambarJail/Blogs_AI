import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import articleRoutes from './routes/articleRoutes';
import userRoutes from './routes/userRoutes';
import aiRoutes from './routes/aiRoutes';
import resetRoutes from './routes/resetRoutes';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true, // 👈 allows cookies to be sent
  })
);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/ai', aiRoutes);

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export default app;
