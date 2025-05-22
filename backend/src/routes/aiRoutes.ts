import express from 'express';
import { generateAIContent } from '../controllers/aiController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticate, generateAIContent);

export default router;
