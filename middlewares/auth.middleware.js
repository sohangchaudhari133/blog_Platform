
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("authorization header: ",authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    // Extract token from the header
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token: ",decoded);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};
