import express from 'express';
import { 
    register,
    login,
    getProfile
 } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Authentication routes
// /api/auth prefix

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

export default router;
