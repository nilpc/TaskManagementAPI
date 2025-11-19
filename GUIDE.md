# Task Management API - Complete Guide

A production-ready REST API for task management built with **NestJS**, **PostgreSQL**, **TypeORM**, and **JWT authentication**.

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Port 3000 available

### Run with Docker (30 seconds)

```bash
cd "c:\Users\nilad\OneDrive\Desktop\task management\TaskManagementAPI"
docker-compose up -d
```

**Services running:**
- API: http://localhost:3000
- PostgreSQL Database: localhost:5432
- PgAdmin (Database UI): http://localhost:5050

---

## 🔐 Authentication

### Register User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### Login User

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Response:** Same as register - includes access token

**Save the token for authenticated requests:**
```bash
$TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 👥 User Endpoints

All require: `Authorization: Bearer $TOKEN`

### Get All Users

```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"
```

### Get User Profile

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Get User by ID

```bash
curl -X GET http://localhost:3000/users/:id \
  -H "Authorization: Bearer $TOKEN"
```

### Update User

```bash
curl -X PATCH http://localhost:3000/users/:id \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name",
    "email": "newemail@example.com"
  }'
```

### Delete User

```bash
curl -X DELETE http://localhost:3000/users/:id \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📋 Task Endpoints

All require: `Authorization: Bearer $TOKEN`

### Create Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish API implementation",
    "status": "todo",
    "dueDate": "2025-12-31"
  }'
```

**Response:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project",
  "description": "Finish API implementation",
  "status": "todo",
  "dueDate": "2025-12-31",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "version": 1,
  "createdAt": "2025-11-19T10:00:00Z",
  "updatedAt": "2025-11-19T10:00:00Z"
}
```

### Get All Tasks

```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer $TOKEN"
```

Returns all tasks you own or have access to.

### Get Task by ID

```bash
curl -X GET http://localhost:3000/tasks/:id \
  -H "Authorization: Bearer $TOKEN"
```

### Update Task

```bash
curl -X PATCH http://localhost:3000/tasks/:id \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "status": "in_progress",
    "description": "Updated description",
    "version": 1
  }'
```

**Note:** Include `version` for optimistic locking (prevents conflicts when multiple users edit).

### Delete Task

```bash
curl -X DELETE http://localhost:3000/tasks/:id \
  -H "Authorization: Bearer $TOKEN"
```

### Share Task with User

```bash
curl -X POST http://localhost:3000/tasks/:id/share \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sharedWithId": "550e8400-e29b-41d4-a716-446655440001",
    "permission": "view"
  }'
```

**Permission levels:**
- `view` - Read-only access
- `edit` - Can modify task
- `admin` - Full control

---

## 📊 Task Status Values

- `todo` - Not started
- `in_progress` - Currently working on
- `completed` - Finished

---

## 🛑 Stop & Restart Services

### Stop All Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f app
```

### Restart Services
```bash
docker-compose down
docker-compose up -d
```

### Rebuild Services
```bash
docker-compose up -d --build
```

---

## 🗄️ Database

### PgAdmin Access
- **URL**: http://localhost:5050
- **Email**: admin@example.com
- **Password**: admin123

### Database Credentials
- **Host**: postgres (or localhost:5432)
- **Username**: taskuser
- **Password**: taskpass123
- **Database**: task_management_db

### Tables
- `users` - User accounts
- `tasks` - Tasks with owner and version control
- `task_shares` - Task sharing relationships

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
DB_HOST=postgres                  # 'localhost' if running locally
DB_PORT=5432
DB_USERNAME=taskuser
DB_PASSWORD=taskpass123
DB_NAME=task_management_db
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin123
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRATION=24h
NODE_ENV=development              # 'production' for prod
PORT=3000
```

---

## 🧪 Complete Example Workflow

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "Password123"
  }'
```

Save the access_token from response.

### 2. Login (to get a fresh token)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "Password123"
  }'
```

### 3. Create a task
```bash
$TOKEN = "your_token_here"
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "todo",
    "dueDate": "2025-11-25"
  }'
```

Save the task ID from response.

### 4. Get all tasks
```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Update task status
```bash
curl -X PATCH http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "version": 1
  }'
```

### 6. Get all users
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Share task with another user
```bash
curl -X POST http://localhost:3000/tasks/TASK_ID/share \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sharedWithId": "OTHER_USER_ID",
    "permission": "edit"
  }'
```

### 8. Delete task
```bash
curl -X DELETE http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐳 Running Locally (Alternative to Docker)

### Prerequisites
- Node.js v18+
- npm
- PostgreSQL running on port 5432

### Steps

```bash
# Navigate to project
cd "c:\Users\nilad\OneDrive\Desktop\task management\TaskManagementAPI"

# Install dependencies
npm install

# Start development server
npm run start:dev

# App runs at http://localhost:3000
```

---

## 🏗️ Build for Production

```bash
# Build TypeScript to JavaScript
npm run build

# Run production build
npm run start:prod
```

---

## 📚 Project Structure

```
src/
├── main.ts                     Application entry point
├── app.module.ts              Root module
├── config/
│   └── database.config.ts     Database configuration
├── modules/
│   ├── auth/                  Authentication
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.guard.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   ├── users/                 User management
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.entity.ts
│   │   └── dto/
│   └── tasks/                 Task management
│       ├── tasks.controller.ts
│       ├── tasks.service.ts
│       ├── task.entity.ts
│       ├── task-share.entity.ts
│       └── dto/
└── shared/
    └── decorators/
        └── current-user.decorator.ts
```

---

## 🚨 Troubleshooting

### Port 3000 already in use
```bash
# Option 1: Stop the conflicting service
docker-compose down

# Option 2: Change port in .env
PORT=3001
```

### Database connection failed
```bash
# Check if PostgreSQL is running
docker-compose logs postgres

# Verify credentials in .env match docker-compose.yml
```

### Docker won't start
```bash
# Clean up and rebuild
docker-compose down
docker system prune -a
docker-compose up -d --build
```

### JWT token expired
```bash
# Login again to get a new token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your_email","password":"your_password"}'
```

### Task version conflict
```
Error: "Task has been modified by another user"

Solution: Refresh the task to get the latest version,
then include the correct version in your update request.
```

---

## 🔑 Key Features

✅ **Authentication**: JWT-based with bcrypt password hashing
✅ **Task Management**: Full CRUD operations with status tracking
✅ **Task Sharing**: Share tasks with permission levels (view, edit, admin)
✅ **Concurrency Control**: Optimistic locking to prevent conflicts
✅ **Database**: PostgreSQL with TypeORM
✅ **Type Safety**: TypeScript throughout
✅ **Validation**: Input validation on all endpoints
✅ **Docker**: Complete containerization with Docker Compose

---

## 📋 API Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | ❌ | Register new user |
| POST | /auth/login | ❌ | Login user |
| GET | /users | ✅ | Get all users |
| GET | /users/:id | ✅ | Get user by ID |
| GET | /users/profile | ✅ | Get current profile |
| PATCH | /users/:id | ✅ | Update user |
| DELETE | /users/:id | ✅ | Delete user |
| POST | /tasks | ✅ | Create task |
| GET | /tasks | ✅ | Get all tasks |
| GET | /tasks/:id | ✅ | Get task by ID |
| PATCH | /tasks/:id | ✅ | Update task |
| DELETE | /tasks/:id | ✅ | Delete task |
| POST | /tasks/:id/share | ✅ | Share task |

**✅** = Requires JWT token in Authorization header

---

## 🚀 Next Steps

1. **Start the app**: `docker-compose up -d`
2. **Register a user**: Use the /auth/register endpoint
3. **Create tasks**: Use the /tasks endpoint
4. **Test endpoints**: Use curl commands above
5. **Share tasks**: Use the /tasks/:id/share endpoint
6. **View database**: Visit http://localhost:5050 (PgAdmin)

---

**Framework**: NestJS 10.3  
**Database**: PostgreSQL 15  
**Language**: TypeScript 5.7  
**Status**: ✅ Production Ready
