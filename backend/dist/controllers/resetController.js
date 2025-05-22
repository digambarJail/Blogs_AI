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
exports.resetPassword = exports.requestReset = void 0;
const userModel_1 = require("../models/userModel");
const resetTokenModel_1 = require("../models/resetTokenModel");
const passwordUtils_1 = require("../utils/passwordUtils");
const emailUtils_1 = require("../utils/emailUtils");
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
const requestReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield userModel_1.User.findOne({ email });
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    yield resetTokenModel_1.ResetToken.deleteMany({ email }); // Remove old OTPs
    yield resetTokenModel_1.ResetToken.create({ email, otp, expiresAt });
    yield (0, emailUtils_1.sendOTPEmail)(email, otp);
    res.json({ message: 'OTP sent to email' });
});
exports.requestReset = requestReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword } = req.body;
    const record = yield resetTokenModel_1.ResetToken.findOne({ email, otp });
    if (!record || record.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    const user = yield userModel_1.User.findOne({ email });
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    user.password = yield (0, passwordUtils_1.hashPassword)(newPassword);
    yield user.save();
    yield resetTokenModel_1.ResetToken.deleteMany({ email }); // Cleanup OTPs
    res.json({ message: 'Password reset successful' });
});
exports.resetPassword = resetPassword;
