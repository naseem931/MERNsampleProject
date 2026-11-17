import express from 'express';
import {
  register,
  login,
  getMe,
  getAllUsers,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, getAllUsers);
router.put('/profile', protect, updateProfile);

export default router;
