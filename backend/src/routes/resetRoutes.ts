import express from 'express';
import { requestReset, resetPassword } from '../controllers/resetController';

const router = express.Router();

router.post('/request-reset', requestReset);
router.post('/reset-password', resetPassword);

export default router;
