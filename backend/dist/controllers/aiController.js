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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAIContent = void 0;
const axios_1 = __importDefault(require("axios"));
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const promptWrapper = (task, content) => {
    switch (task) {
        case 'suggest_title':
            return `Suggest a catchy blog post title for the following content:\n${content}`;
        case 'summarize':
            return `Summarize the following blog post:\n${content}`;
        case 'improve':
            return `Improve the writing style of this blog post content:\n${content}`;
        default:
            return content;
    }
};
const generateAIContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { task, content } = req.body;
    if (!task || !content)
        return res.status(400).json({ error: 'Task and content are required' });
    const prompt = promptWrapper(task, content);
    try {
        const response = yield axios_1.default.post(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
            contents: [{ parts: [{ text: prompt }] }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        const text = (_e = (_d = (_c = (_b = (_a = response.data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text;
        if (!text)
            throw new Error('No response from AI');
        res.json({ result: text });
    }
    catch (err) {
        res.status(500).json({ error: 'AI request failed', details: err instanceof Error ? err.message : err });
    }
});
exports.generateAIContent = generateAIContent;
