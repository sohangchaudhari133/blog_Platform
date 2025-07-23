
import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';

// Dashboard: total users, posts, comments

const getDocumentCounts = async () => {
  const [users, posts, comments] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Comment.countDocuments(),
  ]);
  return { users, posts, comments };
};

export const getStats = async (req, res) => {
  try {
    const data = await getDocumentCounts();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch stats', code: 500 }
    });
  }
};

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch users', code: 500 }
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid role', code: 400 }
      });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');

    res.status(200).json({
      success: true,
      data: { updatedUser }
    });
  } catch (error) {
    console.error(`Error updating role for user ${req.params.userId}:`, error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update user role', code: 500 }
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    // If no user is found, return 404
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found', code: 404 }
      });
    }
    res.status(200).json({
      success: true,
      data: { message: 'User deleted successfully' }
    });
  } catch (error) {
    console.error(`Error deleting user ${req.params.userId}:`, error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete user', code: 500 }
    });
  }
};

// Post Management
export const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username email');
    res.status(200).json({
      success: true,
      data: { posts }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch posts', code: 500 }
    });
  }
};

export const deletePostAdmin = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    // If no post is found, return 404
    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found or already deleted', code: 404 }
      });
    }
    res.status(200).json({
      success: true,
      data: { message: 'Post deleted by admin' }
    });
  } catch (error) {
    console.error(`Error deleting post ${req.params.postId}:`, error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete post', code: 500 }
    });
  }
};

// Comment Management
export const getAllCommentsAdmin = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('author', 'username')
      .populate('post', 'title');

    res.status(200).json({
      success: true,
      data: { comments }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch comments', code: 500 }
    });
  }
};

export const deleteCommentAdmin = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);

    if (!deletedComment) {
  return res.status(404).json({
    success: false,
    error: { message: 'Comment not found or already deleted', code: 404 }
  });
}
    res.status(200).json({
      success: true,
      data: { message: 'Comment deleted by admin' }
    });
  } catch (error) {
    console.error(`Error deleting comment ${req.params.commentId}:`, error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete comment', code: 500 }
    });
  }
};
