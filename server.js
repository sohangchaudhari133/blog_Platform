import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import ConnectDB from './config/db.js';

import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
await ConnectDB()
  .then(() => { console.log("Server connected to MongoDB") })
  .catch(() => {
    console.error("Failed to connect to MongoDB");
    process.exit(1);
  });

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
