import express from 'express';
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getAllArticlesByUser
} from '../controllers/articleController';

import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// Public route
router.get('/',getAllArticles);
router.get('/articlesByUser',authenticate,getAllArticlesByUser)
router.get('/:id',authenticate, getArticleById);

// Protected routes
router.post('/', authenticate, createArticle);
router.put('/:id', authenticate, updateArticle);
router.put('/:id/edit', authenticate, updateArticle);
router.delete('/:id', authenticate, deleteArticle);

export default router;
