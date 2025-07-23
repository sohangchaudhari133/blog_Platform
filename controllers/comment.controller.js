
import { Comment } from '../models/comment.model.js';
import { Post } from '../models/post.model.js';

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;

    if (!text || !postId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Text and Post ID are required', code: 400 }
      });
    }

    if (text.length < 1 || text.length > 200) {
      return res.status(400).json({
        success: false,
        error: { message: 'Comment text must be between 1 and 200 characters', code: 400 }
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found', code: 404 }
      });
    }

    const comment = new Comment({
      text,
      author: req.user.id,
      post: postId,
    });

    await comment.save();
    res.status(201).json({
      success: true,
      data: { comment }
    });
  } catch (err) {
    console.error("Error while adding comment:", err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while adding comment', code: 500 }
    });
  }
};

export const getCommentsByPost = async (req, res) => {
  const postId = req.params.postId;

  if (!postId) {
    return res.status(400).json({
      success: false,
      error: { message: 'Post ID is required', code: 400 }
    });
  }

  try {
    const comments = await Comment.find({ post: postId }).populate('author', 'username');
    res.status(200).json({
      success: true,
      data: { comments }
    });
  } catch (err) {
    console.error("Error while fetching comments:", err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while fetching comments', code: 500 }
    });
  }
};

export const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;

  if (!commentId) {
    return res.status(400).json({
      success: false,
      error: { message: 'Comment ID is required', code: 400 }
    });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Comment not found', code: 404 }
      });
    }

    const isOwnerOrAdmin = comment.author.toString() === req.user.id || req.user.role === 'admin';
    if (!isOwnerOrAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Unauthorized', code: 403 }
      });
    }

  const deletedComment = await comment.deleteOne();
    if (!deletedComment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Comment not found or already deleted', code: 404 }
      });
    }

    res.status(200).json({
      success: true,
      data: { message: 'Comment deleted successfully' }
    });
  } catch (err) {
    console.error("Error while deleting comment:", err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while deleting comment', code: 500 }
    });
  }
};

export const editComment = async (req, res) => {
  const commentId = req.params.commentId;

  if (!commentId) {
    return res.status(400).json({
      success: false,
      error: { message: 'Comment ID is required', code: 400 }
    });
  }

  try {
    const { text } = req.body;

    if (!text || text.length < 1 || text.length > 200) {
      return res.status(400).json({
        success: false,
        error: { message: 'Comment text must be between 1 and 200 characters', code: 400 }
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Comment not found', code: 404 }
      });
    }

    const isOwnerOrAdmin = comment.author.toString() === req.user.id || req.user.role === 'admin';
    if (!isOwnerOrAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Unauthorized', code: 403 }
      });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({
      success: true,
      data: { comment }
    });
  } catch (err) {
    console.error("Error while editing comment:", err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while editing comment', code: 500 }
    });
  }
};
