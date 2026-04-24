# Task Management API

A secure, scalable RESTful API for managing tasks, built with Node.js and Express.js. This project uses a dual-database architecture: user data is stored securely in PostgreSQL using Sequelize, and tasks are stored in MongoDB using Mongoose.

## Features

- **User Management**: Registration with hashed passwords (bcryptjs), login with JWT authentication, and user profile retrieval.
- **Task Management**: Authenticated users can create, read, update (partial), and delete tasks.
- **Data Isolation**: Users can only access and modify their own tasks.
- **Validation**: Server-side request validation using `express-validator`.
- **Security**: Includes basic security practices such as JWT validation, password hashing, Helmet, and Rate Limiting.
- **API Documentation**: Interactive Swagger/OpenAPI documentation.

## Design Decisions & Folder Structure

### Design Decisions
- **Dual Database Strategy**: Implemented PostgreSQL (via Sequelize ORM) for structured user data and relational integrity, and MongoDB (via Mongoose ODM) for flexible task documents.
- **Global Error Handling**: A centralized error handling middleware (`errorHandler.js`) is used to catch and format exceptions consistently, mapping database and validation errors to appropriate HTTP status codes (e.g., 400, 401, 403, 404, 500).
- **Security First**: Passwords are never returned in queries, sensitive routes are protected by a JWT authorization middleware, and Helmet is used for HTTP headers.

### Folder Structure
```text
backend/
├── src/
│   ├── config/          # Database configuration and Swagger setup
│   ├── controllers/     # Route handlers for Authentication and Tasks
│   ├── middleware/      # Custom middlewares (Auth, Error Handling, Validation)
│   ├── models/          # Sequelize models (User) and Mongoose models (Task)
│   ├── routes/          # Express routers for auth and tasks
│   ├── validators/      # express-validator schemas
│   └── server.js        # Main Express application entry point
├── .env.example         # Template for environment variables
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## Setup & Run Instructions

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v14 or above)
- [MongoDB](https://www.mongodb.com/) (running locally or via MongoDB Atlas)
- [PostgreSQL](https://www.postgresql.org/) (running locally)

### 1. Database Setup

**PostgreSQL:**
Create a database named `taskmanager`.
```bash
psql -U postgres
CREATE DATABASE taskmanager;
\q
```

**MongoDB:**
Ensure your local MongoDB instance is running on port 27017, or obtain an Atlas connection string.

### 2. Environment Variables

Create a `.env` file in the `backend` directory based on `.env.example`:
```bash
cd backend
cp .env.example .env
```
Update the `.env` file with your credentials:
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager?directConnection=true

# PostgreSQL Connection
POSTGRES_URI=postgres://<YOUR_POSTGRES_USER>:<YOUR_POSTGRES_PASSWORD>@localhost:5432/taskmanager

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h
```

### 3. Install Dependencies & Start Server

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The server should start on `http://localhost:5000`.

## API Documentation

The API includes a built-in Swagger UI. Once the server is running, navigate to:
**[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

This interactive documentation allows you to explore all endpoints, view required request bodies, and test the API directly from your browser. Example endpoints include:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`

