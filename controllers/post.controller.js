
import { Post } from '../models/post.model.js';

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: { message: 'Title and content are required', code: 400 }
      });
    }

    const post = new Post({ title, content, author: req.user.id });
    await post.save();

    res.status(201).json({
      success: true,
      data: { post }
    });
  } catch (err) {
    console.error('Error while creating post:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while creating post', code: 500 }
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 9, search = '' } = req.query;

    const query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    };

    const posts = await Post.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: { posts }
    });
  } catch (err) {
    console.error('Error while fetching posts:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while fetching posts', code: 500 }
    });
  }
};

export const getPostById = async (req, res) => {
  const postId = req.params.postId;

  if (!postId) {
    return res.status(400).json({
      success: false,
      error: { message: 'Post ID is required', code: 400 }
    });
  }

  try {
    const post = await Post.findById(postId).populate('author', 'username');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found', code: 404 }
      });
    }

    res.status(200).json({
      success: true,
      data: { post }
    });
  } catch (err) {
    console.error('Error while fetching post by ID:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while fetching post', code: 500 }
    });
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.postId;

  if (!postId) {
    return res.status(400).json({
      success: false,
      error: { message: 'Post ID is required', code: 400 }
    });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found', code: 404 }
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'Unauthorized', code: 403 }
      });
    }

    const { title, content } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    res.status(200).json({
      success: true,
      data: { post }
    });
  } catch (err) {
    console.error('Error while updating post:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while updating post', code: 500 }
    });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.postId;

  if (!postId) {
    return res.status(400).json({
      success: false,
      error: { message: 'Post ID is required', code: 400 }
    });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found', code: 404 }
      });
    }

    const isOwnerOrAdmin = post.author.toString() === req.user.id || req.user.role === 'admin';

    if (!isOwnerOrAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Unauthorized', code: 403 }
      });
    }

   const deletedPost = await post.deleteOne();

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found or already deleted', code: 404 }
      });
    }

    res.status(200).json({
      success: true,
      data: { message: 'Post deleted successfully' }
    });
  } catch (err) {
    console.error('Error while deleting post:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while deleting post', code: 500 }
    });
  }
};

// Vote helpful or not
export const voteHelpful = async (req, res) => {
  const userId = req.user.id;
  if(!userId) {
    return res.status(401).json({ success: false, error: { message: "Unauthorized", code: 401 } });
  }
  const { postId } = req.params;
  if(!postId) {
    return res.status(400).json({ success: false, error: { message: "Post ID is required", code: 400 } });
  }
  
  const { value } = req.body; // should be 'up' or 'down'

  if (!['up', 'down'].includes(value)) {
    return res.status(400).json({ success: false, error: { message: "Invalid vote value", code: 400 } });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, error: { message: "Post not found", code: 404 } });

    // Check if user has already voted
    const existingVote = post.helpfulVotes.find(v => v.user.toString() === userId);

    if (existingVote) {
      existingVote.value = value; // update existing vote
    } else {
      post.helpfulVotes.push({ user: userId, value }); // new vote
    }

    await post.save();

    // Recalculate upVotes and downVotes
    const upVotes = post.helpfulVotes.filter(v => v.value === 'up').length;
    const downVotes = post.helpfulVotes.filter(v => v.value === 'down').length;

    res.status(200).json({
      success: true,
      message: "Vote recorded",
      data: { upVotes, downVotes }
    });
  } catch (err) {
    console.error("Error voting helpful:", err);
    res.status(500).json({ success: false, error: { message: "Server error", code: 500 } });
  }
};

