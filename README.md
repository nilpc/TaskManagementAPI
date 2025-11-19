# Task Management API

A comprehensive task management application built with NestJS, PostgreSQL, TypeORM, and JWT authentication.

## Features

- ✅ **User Authentication**: JWT-based authentication with secure password hashing
- ✅ **User Management**: Create, read, update, delete user accounts
- ✅ **Task Management**: Full CRUD operations for tasks
- ✅ **Task Sharing**: Share tasks with other users with permission levels (view, edit, admin)
- ✅ **Concurrency Control**: Optimistic locking with version columns to prevent conflicts
- ✅ **Database**: PostgreSQL with TypeORM
- ✅ **Docker Support**: Complete Docker and Docker Compose setup
- ✅ **PgAdmin**: Database management interface

## Technology Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Security**: bcrypt for password hashing
- **Database Client**: PgAdmin 4
- **Containerization**: Docker & Docker Compose

## Project Structure

```
task-management-api/
├── src/
│   ├── config/
│   │   └── database.config.ts       # TypeORM configuration
│   ├── modules/
│   │   ├── auth/                    # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt.guard.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   ├── users/                   # User module
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       └── user.dto.ts
│   │   ├── tasks/                   # Task module
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.module.ts
│   │   │   ├── entities/
│   │   │   │   ├── task.entity.ts
│   │   │   │   └── task-share.entity.ts
│   │   │   └── dto/
│   │   │       └── task.dto.ts
│   │   └── shared/
│   │       └── decorators/
│   │           └── current-user.decorator.ts
│   ├── app.module.ts
│   └── main.ts
├── docker-compose.yml
├── Dockerfile
├── .env
└── package.json
```

## Setup Instructions

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (if running locally without Docker)
- npm or yarn package manager

### Option 1: Setup with Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management
   ```

2. **Install dependencies**
   ```bash
   cd task-management-api
   npm install
   ```

3. **Create .env file** (already provided)
   ```bash
   cp .env.example .env
   ```

4. **Start all services**
   ```bash
   # From root directory
   docker-compose up -d
   ```

5. **Access the application**
   - API: http://localhost:3000
   - PgAdmin: http://localhost:5050
   - PgAdmin credentials: admin@example.com / admin123

6. **View logs**
   ```bash
   docker-compose logs -f app
   ```

7. **Stop services**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development Setup (Without Docker)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Install PostgreSQL**
   - macOS: `brew install postgresql`
   - Windows: Download from postgresql.org
   - Linux: `sudo apt-get install postgresql`

3. **Create database**
   ```bash
   createdb task_management_db
   ```

4. **Configure .env**
   ```bash
   DB_HOST=localhost
   DB_USERNAME=postgres
   DB_PASSWORD=yourpassword
   ```

5. **Run migrations (if applicable)**
   ```bash
   npm run typeorm migration:run
   ```

6. **Start development server**
   ```bash
   npm run start:dev
   ```

7. **Access the API**
   - API: http://localhost:3000

## API Documentation

### Authentication Endpoints

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### User Endpoints (Requires JWT Token)

#### Get Profile
```
GET /users/profile
Authorization: Bearer {token}
```

#### Update Profile
```
PATCH /users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "password": "newpassword123"
}
```

#### Delete Account
```
DELETE /users/:id
Authorization: Bearer {token}
```

### Task Endpoints (Requires JWT Token)

#### Create Task
```
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management API",
  "status": "todo",
  "dueDate": "2025-12-31"
}
```

#### Get All Tasks
```
GET /tasks
Authorization: Bearer {token}

Response: Returns all tasks owned by user or shared with user
```

#### Get Single Task
```
GET /tasks/:id
Authorization: Bearer {token}
```

#### Update Task
```
PATCH /tasks/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in_progress",
  "version": 1  // Used for optimistic locking
}
```

#### Delete Task
```
DELETE /tasks/:id
Authorization: Bearer {token}

Note: Only task owner can delete
```

### Task Sharing Endpoints

#### Share Task
```
POST /tasks/:id/share
Authorization: Bearer {token}
Content-Type: application/json

{
  "sharedWithId": "user-uuid",
  "permission": "view|edit|admin"
}

Permissions:
- view: Read-only access
- edit: Can update task
- admin: Can edit and manage shares
```

#### Get Shared Users
```
GET /tasks/:id/shares
Authorization: Bearer {token}

Response: List of users task is shared with and their permissions
```

#### Remove Share
```
DELETE /tasks/:taskId/share/:shareId
Authorization: Bearer {token}

Note: Only task owner can remove shares
```

## Concurrency Control: Optimistic Locking

The task entity uses optimistic locking to prevent conflicts when multiple users try to update the same task simultaneously.

**How it works:**
1. Each task has a `version` column
2. When fetching a task, the current version is returned
3. When updating, include the current version in the request
4. If version doesn't match, a `ConflictException` is thrown
5. Client must refresh and retry with the new version

**Example:**
```javascript
// User A fetches task (version: 1)
GET /tasks/123
// Returns: { id: "123", title: "Task", version: 1 }

// User B fetches same task (version: 1)
// User B updates and increments version
PATCH /tasks/123
{ "title": "Updated by B", "version": 1 }
// Returns: { version: 2 }

// User A tries to update with old version
PATCH /tasks/123
{ "title": "Updated by A", "version": 1 }
// Returns: ConflictException - version mismatch
// User A must refetch to get version: 2
```

## Database Schema

### Users Table
```
id (UUID, PK)
name (VARCHAR)
email (VARCHAR, UNIQUE)
password (VARCHAR - hashed)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

### Tasks Table
```
id (UUID, PK)
title (VARCHAR)
description (TEXT)
status (ENUM: todo, in_progress, completed)
dueDate (TIMESTAMP)
ownerId (UUID, FK -> users.id)
version (INTEGER - for optimistic locking)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

### TaskShares Table
```
id (UUID, PK)
taskId (UUID, FK -> tasks.id)
sharedWithId (UUID, FK -> users.id)
permission (ENUM: view, edit, admin)
sharedAt (TIMESTAMP)
```

## PgAdmin Setup

1. Access PgAdmin at http://localhost:5050
2. Login with credentials from .env (admin@example.com / admin123)
3. Create new server connection:
   - **Host**: postgres
   - **Port**: 5432
   - **Username**: taskuser
   - **Password**: taskpass123
   - **Database**: task_management_db

## Environment Variables

```
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=taskuser
DB_PASSWORD=taskpass123
DB_NAME=task_management_db

# PgAdmin
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin123

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=24h

# App
NODE_ENV=development
PORT=3000
```

## Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start              # Start production build
npm run start:debug        # Start with debugger

# Build
npm run build              # Build the project

# Testing
npm run test               # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Generate coverage report
npm run test:e2e          # Run end-to-end tests

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format with Prettier
```

## Common Issues and Solutions

### Port 5432 already in use
```bash
# Kill process using port 5432
# macOS/Linux:
lsof -ti:5432 | xargs kill -9

# Windows:
netstat -ano | findstr :5432
taskkill /PID <PID> /F
```

### Docker container won't start
```bash
# Check logs
docker-compose logs postgres

# Rebuild container
docker-compose down -v
docker-compose up --build
```

### Database connection error
```bash
# Verify database is running
docker-compose ps

# Recreate database
docker-compose exec postgres dropdb -U taskuser task_management_db
docker-compose exec postgres createdb -U taskuser task_management_db
```

## Security Best Practices

- ✅ JWT tokens expire after 24 hours
- ✅ Passwords are hashed with bcrypt
- ✅ Email addresses are unique
- ✅ Row-level permissions on tasks
- ✅ Shared tasks are access-controlled
- ✅ CORS is enabled for safe cross-origin requests
- ⚠️ Always change JWT_SECRET in production
- ⚠️ Use environment-specific .env files

## Performance Considerations

- Database indexes on frequently queried fields (owner, status)
- Connection pooling for database
- Optimistic locking prevents N+1 queries on concurrent updates
- Lazy loading of task shares to minimize data transfer

## License

MIT
