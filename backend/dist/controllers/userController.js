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
exports.getCurrentUser = exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
const passwordUtils_1 = require("../utils/passwordUtils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Register new user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (yield userModel_1.User.findOne({ email }))
            return res.status(400).json({ error: 'Email already registered' });
        const hashed = yield (0, passwordUtils_1.hashPassword)(password);
        const user = new userModel_1.User({ username, email, password: hashed });
        yield user.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (_a) {
        res.status(500).json({ error: 'Registration failed' });
    }
});
exports.registerUser = registerUser;
// Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.User.findOne({ email });
        if (!user)
            return res.status(400).json({ error: 'Invalid credentials' });
        const valid = yield (0, passwordUtils_1.comparePasswords)(password, user.password);
        if (!valid)
            return res.status(400).json({ error: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({ message: 'Login successful' });
    }
    catch (_a) {
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.loginUser = loginUser;
// Get all users (Admin only)
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.User.find().select('-password');
    res.json(users);
});
exports.getAllUsers = getAllUsers;
// Update user role (Admin only)
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.body;
        const user = yield userModel_1.User.findById(req.params.id);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        user.role = role;
        yield user.save();
        res.json({ message: 'User role updated' });
    }
    catch (_a) {
        res.status(500).json({ error: 'Update failed' });
    }
});
exports.updateUserRole = updateUserRole;
// Delete user (Admin only)
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userModel_1.User.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }
    catch (_a) {
        res.status(500).json({ error: 'Delete failed' });
    }
});
exports.deleteUser = deleteUser;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = yield userModel_1.User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
exports.getCurrentUser = getCurrentUser;
