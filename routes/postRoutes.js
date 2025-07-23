import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  voteHelpful,
} from '../controllers/post.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// /api/posts

router.post('/', authMiddleware, createPost);
router.get('/', getAllPosts);
router.get('/:postId', getPostById);
router.put('/:postId', authMiddleware, updatePost);
router.delete('/:postId', authMiddleware, deletePost);
router.post('/:postId/helpful', authMiddleware, voteHelpful);

export default router;
