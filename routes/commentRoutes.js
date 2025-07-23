import express from 'express';
import {
  addComment,
  getCommentsByPost,
  deleteComment,
  editComment
} from '../controllers/comment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// /api/comments

router.post('/:postId', authMiddleware, addComment);
router.get('/:postId', getCommentsByPost);
router.delete('/:commentId', authMiddleware, deleteComment);
router.put('/:commentId', authMiddleware, editComment);
export default router;
