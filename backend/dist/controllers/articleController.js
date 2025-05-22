"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.getAllArticlesByUser = exports.getAllArticles = exports.createArticle = void 0;
const articleModel_1 = require("../models/articleModel");
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, status } = req.body;
        const article = new articleModel_1.Article({ title, content, status, author: req.user.userId });
        yield article.save();
        res.status(201).json(article);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create article' });
    }
});
exports.createArticle = createArticle;
const getAllArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield articleModel_1.Article.find().populate('author', 'username');
        res.json(articles);
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});
exports.getAllArticles = getAllArticles;
const getAllArticlesByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req user role', req.user.role);
        const filter = req.user.role === 'admin'
            ? {}
            : { status: 'published', author: req.user.userId };
        const articles = yield articleModel_1.Article.find(filter).populate('author', 'username');
        res.json(articles);
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to fetch articles of user' });
    }
});
exports.getAllArticlesByUser = getAllArticlesByUser;
const getArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield articleModel_1.Article.findById(req.params.id).populate('author', 'username');
        if (!article)
            return res.status(404).json({ error: 'Not found' });
        const isOwner = article.author.toString() === req.user.userId;
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin)
            return res.status(403).json({ error: 'Permission denied' });
        res.json(article);
    }
    catch (_a) {
        res.status(500).json({ error: 'Error retrieving article' });
    }
});
exports.getArticleById = getArticleById;
const updateArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield articleModel_1.Article.findById(req.params.id);
        if (!article)
            return res.status(404).json({ error: 'Not found' });
        // Only admins or the original author can update
        if (req.user.role !== 'admin' && article.author.toString() !== req.user.userId)
            return res.status(403).json({ error: 'Permission denied' });
        const { title, content, status } = req.body;
        article.title = title;
        article.content = content;
        article.status = status;
        yield article.save();
        res.json(article);
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to update article' });
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield articleModel_1.Article.findById(req.params.id);
        if (!article)
            return res.status(404).json({ error: 'Not found' });
        if (req.user.role !== 'admin' && article.author.toString() !== req.user.userId)
            return res.status(403).json({ error: 'Permission denied' });
        yield article.deleteOne();
        res.status(204).send();
    }
    catch (_a) {
        res.status(500).json({ error: 'Delete failed' });
    }
});
exports.deleteArticle = deleteArticle;
