"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.get('/me', authMiddleware_1.authenticate, userController_1.getCurrentUser);
router.get('/users', authMiddleware_1.authenticate, (0, roleMiddleware_1.authorize)('admin'), userController_1.getAllUsers);
router.put('/users/:id/role', authMiddleware_1.authenticate, (0, roleMiddleware_1.authorize)('admin'), userController_1.updateUserRole);
router.delete('/users/:id', authMiddleware_1.authenticate, (0, roleMiddleware_1.authorize)('admin'), userController_1.deleteUser);
exports.default = router;
