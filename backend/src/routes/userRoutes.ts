import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getCurrentUser
} from '../controllers/userController';

import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me',authenticate,getCurrentUser);
router.put('/:id/:role', authenticate, authorize('admin'), updateUserRole);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);
router.get('/', authenticate, authorize('admin'), getAllUsers);

export default router;
