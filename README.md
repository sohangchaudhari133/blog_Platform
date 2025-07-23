# Blog Platform Backend

A powerful and scalable backend built using Node.js, Express, and MongoDB for a full-featured blog platform. It supports user authentication, role-based access, post/comment CRUD, helpful voting, and admin management.

## Features

- User registration, login, and profile
- JWT-based authentication
- Role-based access (user/admin)
- CRUD for posts and comments
- Admin dashboard for managing users, posts, and comments
- Helpful voting on posts
- MongoDB (Mongoose) integration

## Project Structure

```
.
├── config/
│   └── db.js
├── controllers/
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── comment.controller.js
│   └── post.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   └── isAdmin.js
├── models/
│   ├── comment.model.js
│   ├── post.model.js
│   └── user.model.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── commentRoutes.js
│   └── postRoutes.js
├── .env_sample
├── package.json
├── server.js
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB database (local or Atlas)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/sohangchaudhari133/blog_Platform
   cd blog_Platform
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**

   Copy `.env_sample` to `.env` and fill in your values:

   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the server:**

   ```sh
   npm start
   ```

   The server will run on `http://localhost:5000` by default.

## API Endpoints

### Auth

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/profile` — Get user profile (requires auth)

### Posts

- `POST /api/posts/` — Create post (auth required)
- `GET /api/posts/` — List posts (supports `page`, `limit`, `search`)
- `GET /api/posts/:postId` — Get post by ID
- `PUT /api/posts/:postId` — Update post (auth required, owner only)
- `DELETE /api/posts/:postId` — Delete post (auth required, owner/admin)
- `POST /api/posts/:postId/helpful` — Vote helpful/unhelpful (auth required)

### Comments

- `POST /api/comments/:postId` — Add comment to post (auth required)
- `GET /api/comments/:postId` — Get comments for a post
- `PUT /api/comments/:commentId` — Edit comment (auth required, owner/admin)
- `DELETE /api/comments/:commentId` — Delete comment (auth required, owner/admin)

### Admin (all require admin role)

- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/users` — List all users
- `PUT /api/admin/users/:userId` — Update user role
- `DELETE /api/admin/users/:userId` — Delete user
- `GET /api/admin/posts` — List all posts
- `DELETE /api/admin/posts/:postId` — Delete any post
- `GET /api/admin/comments` — List all comments
- `DELETE /api/admin/comments/:commentId` — Delete any comment

## Environment Variables

See [.env_sample](.env_sample) for required environment variables and structure.

## License

This is an open-source project.

**License:** All rights reserved unless otherwise specified.

---

**👨‍💻 Author:** Sohang Chaudhari

GitHub: [@sohangchaudhari133](https://github.com/sohangchaudhari133)
