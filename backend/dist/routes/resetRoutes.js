"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resetController_1 = require("../controllers/resetController");
const router = express_1.default.Router();
router.post('/request-reset', resetController_1.requestReset);
router.post('/reset-password', resetController_1.resetPassword);
exports.default = router;
