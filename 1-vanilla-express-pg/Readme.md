# Part 1: Vanilla Express + PostgreSQL 🎯

> Building a complete authentication and Todo API from scratch using pure Express.js and PostgreSQL with raw SQL queries

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [What You'll Learn](#what-youll-learn)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Database Setup](#database-setup)
7. [Environment Variables](#environment-variables)
8. [Running the Application](#running-the-application)
9. [API Documentation](#api-documentation)
10. [Code Explanation](#code-explanation)
11. [Concepts Deep Dive](#concepts-deep-dive)
12. [Testing with cURL](#testing-with-curl)
13. [Common Issues](#common-issues)

---

## 🎯 Overview

This is the **foundation** of our backend journey. We build everything from scratch using:
- **Express.js** for routing and middleware
- **PostgreSQL** with raw SQL queries using the `pg` library
- **JWT** for stateless authentication
- **bcrypt** for secure password hashing

**No ORM, no TypeScript** - just pure JavaScript to understand the fundamentals.

---

## 🎓 What You'll Learn

### Core Concepts
1. **HTTP Request/Response Cycle**
   - How Express handles incoming requests
   - Middleware execution order
   - Sending responses back to clients

2. **Database Management**
   - Creating PostgreSQL connections
   - Writing raw SQL queries
   - Handling query results
   - Database connection pooling

3. **Authentication Flow**
   - User registration process
   - Password hashing with bcrypt
   - JWT token generation
   - Token verification middleware

4. **RESTful API Design**
   - Resource naming conventions
   - HTTP methods (GET, POST, PUT, DELETE)
   - Status codes (200, 201, 400, 401, 404, 500)
   - Error handling patterns

5. **Security Basics**
   - Password hashing (never store plain text)
   - JWT secret management
   - SQL injection prevention
   - Input validation

---

## 📁 Project Structure

```
1-vanilla-express-pg/
├── src/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection setup
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js              # Login & Signup routes
│   │   └── todos.js             # Todo CRUD routes
│   ├── controllers/
│   │   ├── authController.js    # Auth business logic
│   │   └── todoController.js    # Todo business logic
│   └── server.js                # Main application entry
├── .env                         # Environment variables (not in git)
├── .env.example                 # Example env file
├── .gitignore
├── package.json
└── README.md                    # This file
```

---

## ✅ Prerequisites

Before starting, ensure you have:

1. **Node.js** (v16 or higher)
   ```bash
   node --version  # Should show v16.x or higher
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **PostgreSQL** (v12 or higher)
   ```bash
   psql --version  # Should show 12.x or higher
   ```

4. **Code Editor** (VS Code recommended)

5. **API Testing Tool** (Postman, Insomnia, or cURL)

---

## 📦 Installation

### Step 1: Navigate to Directory
```bash
cd 1-vanilla-express-pg
```

### Step 2: Install Dependencies
```bash
npm install
```

**Dependencies Installed:**
- `express` - Web framework
- `pg` - PostgreSQL client
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT creation/verification
- `dotenv` - Environment variable management
- `nodemon` - Auto-restart during development

---

## 🗄️ Database Setup

### Step 1: Create Database

**On macOS/Linux:**
```bash
# Access PostgreSQL
psql postgres

# Create database
CREATE DATABASE todo_app_db;

# Exit
\q
```

**On Windows:**
```bash
# Open Command Prompt as Administrator
psql -U postgres

# Create database
CREATE DATABASE todo_app_db;

# Exit
\q
```

### Step 2: Create Tables

Create a file `schema.sql`:

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Todos Table
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_todos_user_id ON todos(user_id);
```

**Run the schema:**
```bash
psql -d todo_app_db -f schema.sql
```

**Verify tables created:**
```bash
psql -d todo_app_db -c "\dt"
```

---

## 🔐 Environment Variables

### Step 1: Create .env File
```bash
cp .env.example .env
```

### Step 2: Configure .env
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_app_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Bcrypt Configuration
BCRYPT_ROUNDS=10
```

**Important Security Notes:**
- ⚠️ Never commit `.env` to Git
- ⚠️ Use strong JWT_SECRET in production
- ⚠️ Change default passwords

---

## 🚀 Running the Application

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

**Expected Output:**
```
Server running on port 3000
Database connected successfully
```

---

## 📡 API Documentation

Base URL: `http://localhost:3000/api`

### Authentication Endpoints

#### 1. User Signup
**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response (400):**
```json
{
  "error": "User already exists"
}
```

---

#### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### Todo Endpoints (Protected - Requires Authentication)

**All todo endpoints require the JWT token in the Authorization header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 3. Get All Todos
**Endpoint:** `GET /api/todos`

**Success Response (200):**
```json
{
  "todos": [
    {
      "id": 1,
      "title": "Complete project",
      "description": "Finish the backend API",
      "completed": false,
      "user_id": 1,
      "created_at": "2025-12-06T10:30:00.000Z",
      "updated_at": "2025-12-06T10:30:00.000Z"
    }
  ]
}
```

---

#### 4. Create Todo
**Endpoint:** `POST /api/todos`

**Request Body:**
```json
{
  "title": "Learn Prisma",
  "description": "Study Prisma ORM documentation"
}
```

**Success Response (201):**
```json
{
  "message": "Todo created successfully",
  "todo": {
    "id": 2,
    "title": "Learn Prisma",
    "description": "Study Prisma ORM documentation",
    "completed": false,
    "user_id": 1,
    "created_at": "2025-12-06T11:00:00.000Z",
    "updated_at": "2025-12-06T11:00:00.000Z"
  }
}
```

---

#### 5. Get Single Todo
**Endpoint:** `GET /api/todos/:id`

**Success Response (200):**
```json
{
  "todo": {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the backend API",
    "completed": false,
    "user_id": 1,
    "created_at": "2025-12-06T10:30:00.000Z",
    "updated_at": "2025-12-06T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Todo not found"
}
```

---

#### 6. Update Todo
**Endpoint:** `PUT /api/todos/:id`

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Success Response (200):**
```json
{
  "message": "Todo updated successfully",
  "todo": {
    "id": 1,
    "title": "Updated title",
    "description": "Updated description",
    "completed": true,
    "user_id": 1,
    "created_at": "2025-12-06T10:30:00.000Z",
    "updated_at": "2025-12-06T12:00:00.000Z"
  }
}
```

---

#### 7. Delete Todo
**Endpoint:** `DELETE /api/todos/:id`

**Success Response (200):**
```json
{
  "message": "Todo deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Todo not found"
}
```

---

## 💻 Code Explanation

### 1. server.js - Application Entry Point

```javascript
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.json();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Key Concepts:**
- `express()` - Creates Express application
- `app.json()` - Parses incoming JSON requests
- `app.use()` - Mounts middleware/routes
- `app.listen()` - Starts HTTP server

---

### 2. database.js - PostgreSQL Connection

```javascript
const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

module.exports = pool;
```

**Key Concepts:**
- **Connection Pool**: Reuses database connections for better performance
- **pool.query()**: Executes SQL queries
- **Environment Variables**: Keeps sensitive data secure

---

### 3. auth.js Middleware - JWT Verification

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next(); // Continue to next middleware/route
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

**Key Concepts:**
- **Middleware**: Functions that execute before route handlers
- **req.header()**: Extracts headers from request
- **jwt.verify()**: Validates and decodes JWT token
- **next()**: Passes control to next middleware

---

### 4. authController.js - Registration Logic

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_ROUNDS)
    );
    
    // Insert user
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );
    
    const user = result.rows[0];
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
```

**Key Concepts:**
- **async/await**: Handles asynchronous operations
- **Parameterized Queries ($1, $2)**: Prevents SQL injection
- **bcrypt.hash()**: One-way password encryption
- **jwt.sign()**: Creates authentication token
- **RETURNING**: PostgreSQL returns inserted data

---

### 5. todoController.js - CRUD Operations

```javascript
const pool = require('../config/database');

// CREATE Todo
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId; // From auth middleware
    
    const result = await pool.query(
      'INSERT INTO todos (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, userId]
    );
    
    res.status(201).json({
      message: 'Todo created successfully',
      todo: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// READ All Todos
const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await pool.query(
      'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({ todos: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE Todo
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const userId = req.user.userId;
    
    // Build dynamic query based on provided fields
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }
    
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    
    if (completed !== undefined) {
      updates.push(`completed = $${paramCount}`);
      values.push(completed);
      paramCount++;
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, userId);
    
    const query = `
      UPDATE todos 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({
      message: 'Todo updated successfully',
      todo: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE Todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
```

**Key Concepts:**
- **req.user**: Set by auth middleware
- **req.params**: URL parameters (/todos/:id)
- **req.body**: JSON request body
- **Dynamic Queries**: Build SQL based on provided fields
- **User Isolation**: WHERE user_id ensures users only access their data

---

## 🧠 Concepts Deep Dive

### 1. **HTTP Methods & REST**

REST (Representational State Transfer) uses HTTP methods for CRUD operations:

| HTTP Method | Operation | Example |
|-------------|-----------|---------|
| GET | Read | Get todos |
| POST | Create | Create todo |
| PUT | Update | Update todo |
| DELETE | Delete | Delete todo |

**RESTful URL Design:**
```
GET    /api/todos       - Collection of resources
POST   /api/todos       - Create new resource
GET    /api/todos/5     - Specific resource
PUT    /api/todos/5     - Update specific resource
DELETE /api/todos/5     - Delete specific resource
```

---

### 2. **SQL Parameterized Queries**

**❌ Bad (SQL Injection Vulnerable):**
```javascript
const email = req.body.email;
const query = `SELECT * FROM users WHERE email = '${email}'`;
// User could input: ' OR '1'='1
```

**✅ Good (Safe):**
```javascript
const query = 'SELECT * FROM users WHERE email = $1';
const values = [email];
await pool.query(query, values);
```

**How it works:**
- `$1, $2, $3` are placeholders
- PostgreSQL sanitizes the values
- Prevents malicious SQL code injection

---

### 3. **Password Hashing with bcrypt**

**Never store plain passwords!**

```javascript
// Registration
const hashedPassword = await bcrypt.hash(password, 10);
// Store: $2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa

// Login
const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
// Returns true/false
```

**bcrypt Features:**
- **Salt**: Random data added to password before hashing
- **Cost Factor**: Number of hash iterations (10 = 2^10 = 1024 iterations)
- **Slow by Design**: Makes brute-force attacks impractical

---

### 4. **JWT Token Structure**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTYzOTk5OTk5OSwiZXhwIjoxNjQwNjA0Nzk5fQ.1Y5_iHqW3fID_ZQ4_zo1G_q1lRps_9cGLcZEiGDMVr5
|           HEADER            |                    PAYLOAD                        |         SIGNATURE        |
```

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload (Claims):**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "iat": 1639999999,  // Issued at
  "exp": 1640604799   // Expires at
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET
)
```

---

### 5. **Middleware Chain**

Express processes requests through a middleware chain:

```javascript
Request → Middleware 1 → Middleware 2 → Route Handler → Response

// Example flow:
1. app.json()              // Parse JSON body
2. authMiddleware()        // Verify JWT
3. todoController.getTodos() // Handle request
4. res.json()             // Send response
```

Each middleware can:
- Modify `req` and `res` objects
- End the request-response cycle
- Call `next()` to pass control

---

### 6. **PostgreSQL Connection Pooling**

**Without Pool (Bad):**
```javascript
// Opens new connection for each query
// Slow and resource-intensive
```

**With Pool (Good):**
```javascript
// Maintains pool of connections
// Reuses existing connections
// Much faster and efficient
```

**Pool Configuration:**
```javascript
const pool = new Pool({
  max: 20,          // Maximum connections
  idleTimeoutMillis: 30000,  // Close idle connections
  connectionTimeoutMillis: 2000  // Timeout if no connection available
});
```

---

### 7. **Error Handling Patterns**

**Try-Catch for Async Operations:**
```javascript
const createTodo = async (req, res) => {
  try {
    // Database operations that might fail
    const result = await pool.query(...);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
```

**Validation Before Database:**
```javascript
if (!title || title.trim() === '') {
  return res.status(400).json({ error: 'Title is required' });
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (client error)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## 🧪 Testing with cURL

### 1. Register New User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Save the token from response!**

### 3. Create Todo (with token)
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Learn Express",
    "description": "Complete the tutorial"
  }'
```

### 4. Get All Todos
```bash
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Update Todo
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "completed": true
  }'
```

### 6. Delete Todo
```bash
curl -X DELETE http://localhost:3000/api/todos/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ❗ Common Issues & Solutions

### Issue 1: Database Connection Failed

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. Check if PostgreSQL is running:
   ```bash
   # macOS/Linux
   sudo systemctl status postgresql
   
   # macOS with Homebrew
   brew services list
   ```

2. Verify database credentials in `.env`

3. Check if database exists:
   ```bash
   psql -l | grep todo_app_db
   ```

---

### Issue 2: Token Verification Failed

**Error:**
```json
{ "error": "Invalid token" }
```

**Solutions:**
1. Check token format in header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI...
   ```
   (Note the space after "Bearer")

2. Ensure token hasn't expired

3. Verify JWT_SECRET matches in `.env`

---

### Issue 3: User Already Exists

**Error:**
```json
{ "error": "User already exists" }
```

**Solution:**
Use different email or delete existing user:
```sql
DELETE FROM users WHERE email = 'test@example.com';
```

---

### Issue 4: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
1. Change port in `.env`:
   ```env
   PORT=3001
   ```

2. Or kill process using port 3000:
   ```bash
   # Find process
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

---

## 🎯 Next Steps

Congratulations! You've built a complete backend API from scratch. Now:

1. **Test thoroughly** - Try all API endpoints
2. **Review the code** - Understand every line
3. **Experiment** - Add features like:
   - Email validation
   - Password strength requirements
   - Pagination for todos
   - Search functionality

4. **Move to Part 2** - Learn Prisma ORM to simplify database operations

---

## 📚 Key Takeaways

✅ Express.js handles routing and middleware  
✅ PostgreSQL stores data in relational tables  
✅ Raw SQL queries give full control  
✅ JWT provides stateless authentication  
✅ bcrypt secures passwords  
✅ Middleware chains process requests  
✅ Error handling is critical  
✅ Connection pooling improves performance  

**You now understand the fundamentals of backend development!**

---

Ready to level up? Move to **Part 2: Prisma ORM** to see how ORMs simplify database operations! 🚀