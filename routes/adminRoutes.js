import express from 'express';
import {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllPostsAdmin,
  deletePostAdmin,
  getAllCommentsAdmin,
  deleteCommentAdmin
} from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Apply both authMiddleware and isAdmin to all admin routes
router.use(authMiddleware, isAdmin);

// Dashboard
router.get('/stats', getStats);

// Users
router.get('/users', getAllUsers);
router.put('/users/:userId', updateUserRole);
router.delete('/users/:userId', deleteUser);

// Posts
router.get('/posts', getAllPostsAdmin);
router.delete('/posts/:postId', deletePostAdmin);

// Comments
router.get('/comments', getAllCommentsAdmin);
router.delete('/comments/:commentId', deleteCommentAdmin);

export default router;