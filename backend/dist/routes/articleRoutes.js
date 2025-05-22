"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articleController_1 = require("../controllers/articleController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Public route
router.get('/', articleController_1.getAllArticles);
router.get('/:id', articleController_1.getArticleById);
router.get('/articlesByUser', authMiddleware_1.authenticate, articleController_1.getAllArticlesByUser);
// Protected routes
router.post('/', authMiddleware_1.authenticate, articleController_1.createArticle);
router.put('/:id', authMiddleware_1.authenticate, articleController_1.updateArticle);
router.delete('/:id', authMiddleware_1.authenticate, articleController_1.deleteArticle);
exports.default = router;
