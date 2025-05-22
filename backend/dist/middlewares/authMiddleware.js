"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const token = req.cookies.token; // 👈 read from cookie
    console.log('token', token);
    if (!token)
        return res.status(401).json({ error: 'Missing or invalid token' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('requser', req.user);
        next();
    }
    catch (_a) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
