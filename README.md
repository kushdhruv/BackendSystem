# PrimeIntern - Task Manager API

A **Scalable REST API** with JWT Authentication & Role-Based Access Control (RBAC), built with Node.js, Express, and MongoDB. Includes a modern React frontend for full interaction.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![Express](https://img.shields.io/badge/Express-v5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v7+-green)
![React](https://img.shields.io/badge/React-v19-blue)

---

## 🏗️ Architecture

```
primeintern/
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── config/           # DB connection, Swagger config
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/        # Auth, error handling, validation
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   ├── validators/        # Input validation rules
│   │   └── server.js          # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/        # Navbar, ProtectedRoute
│   │   ├── context/           # AuthContext (JWT state)
│   │   ├── pages/             # Login, Register, Dashboard, Admin
│   │   ├── services/          # Axios API client
│   │   └── App.jsx            # Root with routing
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **npm** v9+

### 1. Clone & Install

```bash
git clone https://github.com/kushdhruv/BackendSystem.git
cd primeintern

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# In backend/
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/primeintern` |
| `JWT_SECRET` | JWT signing secret | (change this!) |
| `JWT_EXPIRES_IN` | Token expiry | `24h` |
| `NODE_ENV` | Environment | `development` |

### 3. Run

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- **API**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **Swagger Docs**: http://localhost:5000/api-docs

---

## 📚 API Documentation

### Base URL: `/api/v1`

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/me` | Get current user | ✅ |

### Tasks (CRUD)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tasks` | List tasks (filtered) | ✅ |
| POST | `/tasks` | Create task | ✅ |
| GET | `/tasks/:id` | Get task by ID | ✅ |
| PUT | `/tasks/:id` | Update task | ✅ |
| DELETE | `/tasks/:id` | Delete task | ✅ |
| GET | `/tasks/stats` | Task statistics | ✅ |

### Admin (Role: admin only)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/users` | List all users | ✅ Admin |
| DELETE | `/admin/users/:id` | Delete user + tasks | ✅ Admin |
| PATCH | `/admin/users/:id/role` | Update user role | ✅ Admin |

### Query Parameters (Tasks)

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `todo`, `in-progress`, `done` | Filter by status |
| `priority` | `low`, `medium`, `high` | Filter by priority |
| `page` | integer | Page number |
| `limit` | 1-100 | Items per page |
| `sortBy` | field name | Sort field |
| `order` | `asc`, `desc` | Sort order |

---

## 🔐 Security Features

| Feature | Implementation |
|---------|---------------|
| **Password Hashing** | bcrypt with 12 salt rounds |
| **JWT Authentication** | Bearer token in Authorization header |
| **Role-Based Access** | `user` and `admin` roles with middleware guards |
| **Input Validation** | express-validator with sanitization & XSS protection |
| **Rate Limiting** | 100 requests / 15 min per IP |
| **Security Headers** | Helmet.js (CSP, HSTS, X-Frame-Options, etc.) |
| **CORS** | Configured for frontend origin |
| **Body Limit** | 10KB JSON payload limit |
| **Error Handling** | Centralized error handler with proper HTTP status codes |

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name:      String (required, 2-50 chars),
  email:     String (required, unique, validated),
  password:  String (required, min 6 chars, hashed),
  role:      String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Task Model
```javascript
{
  title:       String (required, 3-100 chars),
  description: String (max 500 chars),
  status:      String (enum: ['todo', 'in-progress', 'done'], default: 'todo'),
  priority:    String (enum: ['low', 'medium', 'high'], default: 'medium'),
  dueDate:     Date (optional),
  user:        ObjectId (ref: User, required),
  createdAt:   Date (auto),
  updatedAt:   Date (auto)
}
// Indexes: { user: 1, status: 1 }, { user: 1, createdAt: -1 }
```

---

## 📈 Scalability Notes

### Current Architecture Supports:
1. **API Versioning** – Routes prefixed with `/api/v1/`, easy to add `/api/v2/`
2. **Modular Structure** – Controllers, routes, models, middleware are separated for easy extension
3. **Database Indexing** – Compound indexes on Task for efficient queries

### Future Scaling Strategies:
1. **Caching (Redis)** – Cache frequently accessed data (task lists, user profiles) to reduce DB load
2. **Load Balancing** – Deploy behind Nginx/HAProxy with multiple Node.js instances using PM2 cluster mode
3. **Microservices** – Extract auth, tasks, and notifications into separate services
4. **Message Queues** – Use RabbitMQ/Bull for async operations (emails, notifications)
5. **Docker Deployment** – Containerize with Docker Compose for consistent environments
6. **Database Replication** – MongoDB replica sets for read scaling and failover
7. **CDN** – Serve static frontend via CDN (Cloudflare, AWS CloudFront)

---

## 🧪 Testing the API

### Using Swagger UI
Visit `http://localhost:5000/api-docs` for interactive API testing.

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Create Task (use token from login response)
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Task","priority":"high"}'
```

---

## 📄 License

MIT

---

Built with ❤️ for the PrimeIntern Assignment
