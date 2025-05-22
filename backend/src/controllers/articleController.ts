import { Request, Response } from 'express';
import { Article } from '../models/articleModel';

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, status } = req.body;
    const article = new Article({ title, content, status, author: req.user!.userId });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create article' });
  }
};

export const getAllArticles = async (req: Request, res: Response) => {
  try {

    const articles = await Article.find().populate('author', 'username');
    res.json(articles);
  } catch {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

export const getAllArticlesByUser = async (req: Request, res: Response) => {
  try {
    console.log('req user role',req.user!.role)
    const filter = req.user!.role === 'admin'
      ? {}
      : { status: 'published', author: req.user!.userId };

    const articles = await Article.find(filter).populate('author', 'username');
    res.json(articles);
  } catch {
    res.status(500).json({ error: 'Failed to fetch articles of user' });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'username');
    if (!article) return res.status(404).json({ error: 'Not found' });

    res.json(article);
  } catch {
    res.status(500).json({ error: 'Error retrieving article' });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Not found' });

    // Only admins or the original author can update
    if (req.user!.role !== 'admin' && article.author.toString() !== req.user!.userId)
      return res.status(403).json({ error: 'Permission denied' });

    const { title, content, status } = req.body;
    article.title = title;
    article.content = content;
    article.status = status;
    await article.save();

    res.json(article);
  } catch {
    res.status(500).json({ error: 'Failed to update article' });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Not found' });

    if (req.user!.role !== 'admin' && article.author.toString() !== req.user!.userId)
      return res.status(403).json({ error: 'Permission denied' });

    await article.deleteOne();
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
};
