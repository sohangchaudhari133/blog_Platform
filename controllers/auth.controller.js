
import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide all fields', code: 400 }
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'User already exists', code: 400 }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({
      success: true,
      data: { message: 'User registered successfully' }
    });

  } catch (err) {
    console.error("Error while registering:", err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while registering user', code: 500 }
    });
  }
};

// Login
export const login = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide all fields', code: 400 }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid credentials', code: 400 }
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid credentials (password mismatch)', code: 400 }
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      }
    });

  } catch (err) {
    console.error("Error while logging in:", err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while logging in', code: 500 }
    });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found', code: 404 }
      });
    }
    const posts = await Post.find({ author: req.user.id });
    const comments = await Comment.find({ author: req.user.id });
    
    res.status(200).json({
      success: true,
      data: { 
        user,
        posts,
        comments,
      }
    });
  } catch (err) {
    console.error("Error while fetching user profile:", err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while fetching profile', code: 500 }
    });
  }
};
