# Part 2: Prisma ORM 🔷

> Elevating database operations with Prisma - Type-safe queries, auto-migrations, and better developer experience

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [What's New in Part 2](#whats-new-in-part-2)
3. [What You'll Learn](#what-youll-learn)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Prisma Setup](#prisma-setup)
8. [Running the Application](#running-the-application)
9. [API Documentation](#api-documentation)
10. [Code Comparison](#code-comparison)
11. [Prisma Concepts Deep Dive](#prisma-concepts-deep-dive)
12. [Prisma Client API](#prisma-client-api)
13. [Migrations](#migrations)
14. [Common Issues](#common-issues)

---

## 🎯 Overview

Part 2 replaces raw SQL queries with **Prisma ORM** while keeping everything else the same. This demonstrates how ORMs (Object-Relational Mapping) simplify database operations and provide type safety.

**What Changed from Part 1:**
- ❌ Removed: Raw SQL queries with `pg` library
- ❌ Removed: Manual SQL string construction
- ✅ Added: Prisma Client for database operations
- ✅ Added: Prisma Schema for database modeling
- ✅ Added: Automatic migrations
- ✅ Added: Auto-generated type-safe queries

**What Stayed the Same:**
- Express.js for routing
- JWT authentication
- bcrypt for password hashing
- Same API endpoints
- Same functionality

---

## 🆕 What's New in Part 2

### 1. **Prisma Schema** (`schema.prisma`)
Define your database structure in a declarative way:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  todos     Todo[]
  createdAt DateTime @default(now())
}

model Todo {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 2. **Prisma Client**
Auto-generated query builder with IntelliSense:

```javascript
// Old way (Part 1)
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
const user = result.rows[0];

// New way (Part 2)
const user = await prisma.user.findUnique({
  where: { email }
});
```

### 3. **Automatic Migrations**
Version control for your database:

```bash
npx prisma migrate dev --name init
# Creates migration files automatically
# Applies changes to database
# Updates Prisma Client
```

### 4. **Type Safety**
Get autocomplete and type checking:

```javascript
const todo = await prisma.todo.create({
  data: {
    title: 'Learn Prisma',
    // TypeScript knows all available fields
    // IDE suggests: title, description, completed, userId
  }
});
```

---

## 🎓 What You'll Learn

### Core Prisma Concepts

1. **Schema Definition Language (SDL)**
   - Declarative database modeling
   - Defining models and relationships
   - Field types and attributes
   - Indexes and constraints

2. **Prisma Client**
   - Auto-generated query builder
   - CRUD operations
   - Filtering and sorting
   - Relations and includes
   - Aggregations and grouping

3. **Prisma Migrate**
   - Creating migrations
   - Applying migrations
   - Rollback strategies
   - Database synchronization

4. **Prisma Studio**
   - Visual database browser
   - Edit data through GUI
   - Explore relationships

5. **Relations in Prisma**
   - One-to-many relationships
   - Many-to-many relationships
   - Relation fields vs scalar fields
   - Cascade deletes

---

## 📁 Project Structure

```
2-prisma-orm/
├── prisma/
│   ├── schema.prisma            # Database schema definition
│   └── migrations/              # Migration history (auto-generated)
│       └── 20231206_init/
│           └── migration.sql
├── src/
│   ├── config/
│   │   └── prisma.js            # Prisma Client instance
│   ├── middleware/
│   │   └── auth.js              # JWT middleware (same as Part 1)
│   ├── routes/
│   │   ├── auth.js              # Auth routes (same as Part 1)
│   │   └── todos.js             # Todo routes (same as Part 1)
│   ├── controllers/
│   │   ├── authController.js    # Auth logic with Prisma
│   │   └── todoController.js    # Todo CRUD with Prisma
│   └── server.js                # Main app (same as Part 1)
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

**Key Differences from Part 1:**
- ➕ Added `prisma/` folder with schema
- ➕ Added `prisma/migrations/` (auto-generated)
- 🔄 Changed `config/database.js` → `config/prisma.js`
- 🔄 Updated controllers to use Prisma Client

---

## ✅ Prerequisites

Same as Part 1, plus:

1. **Node.js** (v16 or higher)
2. **PostgreSQL** (v12 or higher)
3. **npm** (comes with Node.js)
4. **Familiarity with Part 1** (recommended)

---

## 📦 Installation

### Step 1: Navigate to Directory
```bash
cd 2-prisma-orm
```

### Step 2: Install Dependencies
```bash
npm install
```

**New Dependencies:**
- `@prisma/client` - Prisma Client for queries
- `prisma` - Prisma CLI (dev dependency)

**Existing Dependencies:**
- `express`, `jsonwebtoken`, `bcrypt`, `dotenv`

---

## 🔷 Prisma Setup

### Step 1: Create Database
```bash
# PostgreSQL CLI
psql postgres

# Create database
CREATE DATABASE todo_prisma_db;

# Exit
\q
```

### Step 2: Configure Environment Variables

Create `.env` file:
```env
# Server
PORT=3000
NODE_ENV=development

# Database URL (Prisma format)
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/todo_prisma_db?schema=public"

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Bcrypt
BCRYPT_ROUNDS=10
```

**Important:** Prisma uses `DATABASE_URL` in a specific format:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

### Step 3: Initialize Prisma (Already Done)
If starting from scratch, you would run:
```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Schema file
- `.env` with `DATABASE_URL`

### Step 4: Review Prisma Schema

The `schema.prisma` file defines your database:

```prisma
// Database connection
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Prisma Client generator
generator client {
  provider = "prisma-client-js"
}

// User model
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  todos     Todo[]
  createdAt DateTime @default(now()) @map("created_at")

  @@map("users")
}

// Todo model
model Todo {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      Int      @map("user_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([userId])
  @@map("todos")
}
```

### Step 5: Run Migrations

Create tables in database:
```bash
npx prisma migrate dev --name init
```

**What this does:**
1. Generates SQL migration file
2. Applies migration to database
3. Generates Prisma Client
4. Updates `@prisma/client` package

**Expected output:**
```
✔ Generated Prisma Client
✔ Migration applied: 20231206_init

The following migration(s) have been created:
migrations/
  └─ 20231206_init/
    └─ migration.sql

Your database is now in sync with your schema.
```

### Step 6: Generate Prisma Client
```bash
npx prisma generate
```

This generates the type-safe Prisma Client based on your schema.

### Step 7: Explore Database with Prisma Studio (Optional)
```bash
npx prisma studio
```

Opens a web GUI at `http://localhost:5555` to browse and edit data.

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

**Expected Output:**
```
✅ Prisma Client connected
🚀 Server running on port 3000
📍 Health check: http://localhost:3000/health
```

---

## 📡 API Documentation

**All endpoints are identical to Part 1!**

The API interface remains the same; only the implementation changed.

### Authentication Endpoints

#### 1. Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Todo Endpoints (Authenticated)

#### 3. Get All Todos
```bash
GET /api/todos
Authorization: Bearer <token>
```

#### 4. Create Todo
```bash
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Learn Prisma",
  "description": "Study Prisma documentation"
}
```

#### 5. Get Single Todo
```bash
GET /api/todos/:id
Authorization: Bearer <token>
```

#### 6. Update Todo
```bash
PUT /api/todos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "completed": true
}
```

#### 7. Delete Todo
```bash
DELETE /api/todos/:id
Authorization: Bearer <token>
```

---

## 🔄 Code Comparison: Part 1 vs Part 2

### **Example 1: Finding a User**

**Part 1 (Raw SQL):**
```javascript
const result = await pool.query(
  'SELECT id, email, name FROM users WHERE email = $1',
  [email]
);

if (result.rows.length === 0) {
  return res.status(404).json({ error: 'User not found' });
}

const user = result.rows[0];
```

**Part 2 (Prisma):**
```javascript
const user = await prisma.user.findUnique({
  where: { email },
  select: {
    id: true,
    email: true,
    name: true
  }
});

if (!user) {
  return res.status(404).json({ error: 'User not found' });
}
```

**Benefits:**
- ✅ No SQL string construction
- ✅ Type-safe field selection
- ✅ Cleaner, more readable code
- ✅ Auto-complete in IDE

---

### **Example 2: Creating a Todo**

**Part 1 (Raw SQL):**
```javascript
const result = await pool.query(
  'INSERT INTO todos (title, description, completed, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
  [title, description || null, false, userId]
);

const todo = result.rows[0];
```

**Part 2 (Prisma):**
```javascript
const todo = await prisma.todo.create({
  data: {
    title,
    description,
    userId
  }
});
```

**Benefits:**
- ✅ No SQL syntax
- ✅ Default values handled automatically
- ✅ Cleaner code
- ✅ Type checking

---

### **Example 3: Updating a Todo**

**Part 1 (Raw SQL - Dynamic Query):**
```javascript
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

// ... more field checks

const query = `UPDATE todos SET ${updates.join(', ')} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`;

const result = await pool.query(query, values);
```

**Part 2 (Prisma):**
```javascript
const todo = await prisma.todo.update({
  where: { 
    id: parseInt(id),
    userId 
  },
  data: {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(completed !== undefined && { completed })
  }
});
```

**Benefits:**
- ✅ Much simpler dynamic updates
- ✅ No manual SQL construction
- ✅ Cleaner conditional logic
- ✅ Type-safe

---

### **Example 4: Getting Todos with User Info**

**Part 1 (Raw SQL with JOIN):**
```javascript
const result = await pool.query(
  'SELECT t.*, u.name as user_name, u.email as user_email FROM todos t JOIN users u ON t.user_id = u.id WHERE t.user_id = $1',
  [userId]
);
```

**Part 2 (Prisma with Include):**
```javascript
const todos = await prisma.todo.findMany({
  where: { userId },
  include: {
    user: {
      select: {
        name: true,
        email: true
      }
    }
  }
});
```

**Benefits:**
- ✅ No JOIN syntax needed
- ✅ Nested data structure
- ✅ Intuitive API
- ✅ Type-safe relations

---

## 🧠 Prisma Concepts Deep Dive

### 1. **Prisma Schema File**

The `schema.prisma` file is the single source of truth for your database structure.

**Structure:**
```prisma
// 1. Data source - which database to use
datasource db {
  provider = "postgresql"  // or mysql, sqlite, sqlserver, mongodb
  url      = env("DATABASE_URL")
}

// 2. Generator - what to generate
generator client {
  provider = "prisma-client-js"
}

// 3. Models - your data structure
model User {
  // fields here
}
```

**Field Types:**
- `String` - Text
- `Int` - Integer
- `Boolean` - True/False
- `DateTime` - Timestamp
- `Float` - Decimal numbers
- `Json` - JSON data
- `Bytes` - Binary data

**Field Modifiers:**
- `?` - Optional field (`String?`)
- `[]` - Array/List (`String[]`)

**Attributes:**
- `@id` - Primary key
- `@unique` - Unique constraint
- `@default(value)` - Default value
- `@map("db_name")` - Map to different DB column name
- `@@map("table_name")` - Map to different DB table name
- `@@index([field])` - Create index
- `@updatedAt` - Auto-update timestamp

---

### 2. **Prisma Client API**

#### **CRUD Operations**

**Create:**
```javascript
// Single record
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: 'hashed',
    name: 'John'
  }
});

// With relations
const todo = await prisma.todo.create({
  data: {
    title: 'Learn Prisma',
    user: {
      connect: { id: userId }
    }
  }
});

// Many records
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', password: 'hash', name: 'User 1' },
    { email: 'user2@example.com', password: 'hash', name: 'User 2' }
  ]
});
```

**Read:**
```javascript
// Find unique
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Find first matching
const todo = await prisma.todo.findFirst({
  where: { completed: false }
});

// Find many
const todos = await prisma.todo.findMany({
  where: { userId: 1 },
  orderBy: { createdAt: 'desc' },
  take: 10, // Limit
  skip: 0   // Offset
});

// Find all
const allUsers = await prisma.user.findMany();
```

**Update:**
```javascript
// Update single
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'New Name' }
});

// Update many
const result = await prisma.todo.updateMany({
  where: { completed: false },
  data: { completed: true }
});

// Upsert (update or create)
const user = await prisma.user.upsert({
  where: { email: 'user@example.com' },
  update: { name: 'Updated Name' },
  create: { email: 'user@example.com', password: 'hash', name: 'New User' }
});
```

**Delete:**
```javascript
// Delete single
const todo = await prisma.todo.delete({
  where: { id: 1 }
});

// Delete many
const result = await prisma.todo.deleteMany({
  where: { completed: true }
});
```

---

#### **Filtering**

```javascript
// Equals
const todos = await prisma.todo.findMany({
  where: { completed: true }
});

// Not equals
const todos = await prisma.todo.findMany({
  where: { completed: { not: true } }
});

// In array
const todos = await prisma.todo.findMany({
  where: { id: { in: [1, 2, 3] } }
});

// Contains (case-sensitive)
const todos = await prisma.todo.findMany({
  where: { title: { contains: 'Prisma' } }
});

// Case-insensitive search
const todos = await prisma.todo.findMany({
  where: { 
    title: { 
      contains: 'prisma',
      mode: 'insensitive' 
    } 
  }
});

// AND conditions
const todos = await prisma.todo.findMany({
  where: {
    AND: [
      { completed: false },
      { userId: 1 }
    ]
  }
});

// OR conditions
const todos = await prisma.todo.findMany({
  where: {
    OR: [
      { completed: true },
      { title: { contains: 'urgent' } }
    ]
  }
});

// Greater than / Less than
const recentTodos = await prisma.todo.findMany({
  where: {
    createdAt: {
      gte: new Date('2023-01-01'), // Greater than or equal
      lt: new Date('2024-01-01')   // Less than
    }
  }
});
```

---

#### **Relations**

```javascript
// Include related data
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    todos: true  // Include all todos
  }
});

// Nested includes
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    todos: {
      where: { completed: false },
      orderBy: { createdAt: 'desc' }
    }
  }
});

// Select specific fields
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    name: true,
    email: true,
    todos: {
      select: {
        id: true,
        title: true
      }
    }
  }
});
```

---

#### **Aggregations**

```javascript
// Count
const count = await prisma.todo.count({
  where: { completed: true }
});

// Aggregate
const result = await prisma.todo.aggregate({
  where: { userId: 1 },
  _count: true,
  _avg: { id: true },
  _sum: { id: true },
  _min: { createdAt: true },
  _max: { createdAt: true }
});

// Group by
const groupedTodos = await prisma.todo.groupBy({
  by: ['userId'],
  _count: true,
  _sum: { id: true }
});
```

---

### 3. **Prisma Migrations**

Migrations track changes to your database schema over time.

**Create Migration:**
```bash
npx prisma migrate dev --name add_user_profile
```

**What happens:**
1. Compares schema to database
2. Generates SQL migration file
3. Applies migration to database
4. Regenerates Prisma Client

**Migration File Structure:**
```
prisma/migrations/
├── 20231206120000_init/
│   └── migration.sql
├── 20231207100000_add_user_profile/
│   └── migration.sql
└── migration_lock.toml
```

**Apply Migrations (Production):**
```bash
npx prisma migrate deploy
```

**Reset Database:**
```bash
npx prisma migrate reset
```
⚠️ This drops all data!

**View Migration Status:**
```bash
npx prisma migrate status
```

---

### 4. **Prisma Studio**

Visual database browser:

```bash
npx prisma studio
```

**Features:**
- Browse all tables
- View relationships
- Edit records
- Filter and search
- Execute queries

**Use Cases:**
- Quick data inspection
- Manual data entry
- Testing relationships
- Debugging

---

### 5. **Relations in Detail**

**One-to-Many:**
```prisma
model User {
  id    Int    @id @default(autoincrement())
  todos Todo[] // Virtual field (not in DB)
}

model Todo {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int  // Foreign key (in DB)
}
```

**Key Points:**
- `todos Todo[]` is a **relation field** (virtual, not in DB)
- `userId` is a **scalar field** (actual column in DB)
- `@relation` connects the two

**Cascade Delete:**
```prisma
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
```

When user is deleted, all their todos are deleted too.

**Options:**
- `Cascade` - Delete related records
- `SetNull` - Set foreign key to NULL
- `Restrict` - Prevent deletion if relations exist
- `NoAction` - Database default behavior

---

### 6. **Database Seeding**

Create `prisma/seed.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'hashed_password',
      name: 'Test User',
      todos: {
        create: [
          { title: 'First todo', description: 'Testing' },
          { title: 'Second todo', completed: true }
        ]
      }
    }
  });
  console.log('Seed data created:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

Run seed:
```bash
npx prisma db seed
```

---

## 🧪 Testing Prisma Queries

You can test queries directly in Node REPL:

```bash
node
```

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Test query
await prisma.user.findMany();

// Test with filter
await prisma.todo.findMany({ where: { completed: false } });

// Don't forget to disconnect
await prisma.$disconnect();
```

---

## ❗ Common Issues & Solutions

### Issue 1: Prisma Client Not Generated

**Error:**
```
Error: @prisma/client did not initialize yet
```

**Solution:**
```bash
npx prisma generate
```

---

### Issue 2: Migration Failed

**Error:**
```
P3005: The database schema is not empty
```

**Solution:**
```bash
# Option 1: Reset database (loses data)
npx prisma migrate reset

# Option 2: Create baseline migration
npx prisma migrate resolve --applied "0_init"
```

---

### Issue 3: Database URL Invalid

**Error:**
```
Error: P1001: Can't reach database server
```

**Solution:**
Check `DATABASE_URL` format in `.env`:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

---

### Issue 4: Schema and Database Out of Sync

**Error:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database
Error: P1012: Schema and database are out of sync
```

**Solution:**
```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

---

### Issue 5: Cannot Find Module '@prisma/client'

**Error:**
```
Error: Cannot find module '@prisma/client'
```

**Solution:**
```bash
npm install @prisma/client
npx prisma generate
```

---

## 🎯 Prisma Best Practices

### 1. **Connection Management**

```javascript
// Good - Single instance
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;

// Bad - Multiple instances
// Don't create new PrismaClient in every file
```

### 2. **Error Handling**

```javascript
try {
  const user = await prisma.user.create({ data: { ... } });
} catch (error) {
  if (error.code === 'P2002') {
    // Unique constraint violation
    console.error('Email already exists');
  }
  throw error;
}
```

**Common Error Codes:**
- `P2002` - Unique constraint violation
- `P2025` - Record not found
- `P2003` - Foreign key constraint violation

### 3. **Transactions**

```javascript
// Execute multiple operations atomically
const [user, todo] = await prisma.$transaction([
  prisma.user.create({ data: { ... } }),
  prisma.todo.create({ data: { ... } })
]);

// Interactive transactions
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { ... } });
  await tx.todo.create({ data: { userId: user.id, ... } });
});
```

### 4. **Pagination**

```javascript
const page = 1;
const pageSize = 10;

const todos = await prisma.todo.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' }
});

const totalCount = await prisma.todo.count();
```

### 5. **Select Only Needed Fields**

```javascript
// Good - Select only needed fields
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: { id: true, email: true, name: true }
});

// Avoid - Fetches all fields including password
const user = await prisma.user.findUnique({
  where: { id: 1 }
});
```

---

## 📊 Performance Comparison

### Query Complexity

| Operation | Part 1 (SQL) | Part 2 (Prisma) |
|-----------|--------------|-----------------|
| Simple Select | Medium | Easy |
| Complex Filter | Hard | Easy |
| Relations | Hard (JOINs) | Easy (include) |
| Dynamic Update | Very Hard | Easy |
| Pagination | Medium | Easy |

### Developer Experience

| Aspect | Part 1 | Part 2 |
|--------|--------|--------|
| Type Safety | None | Full |
| Auto-complete | No | Yes |
| Learning Curve | Steep | Gentle |
| Code Lines | More | Less |
| Maintainability | Lower | Higher |

---

## 🎓 Key Takeaways

✅ **Prisma Schema** defines your database structure  
✅ **Prisma Client** provides type-safe queries  
✅ **Migrations** version control database changes  
✅ **Relations** are easy with Prisma  
✅ **No SQL needed** for most operations  
✅ **Better DX** with autocomplete and type safety  
✅ **Same functionality** as raw SQL, cleaner code  
✅ **Production ready** with proper error handling  

---

## 🚀 Next Steps

You've mastered Prisma ORM! Now you can:

1. **Explore Advanced Features:**
   - Full-text search
   - JSON fields
   - Transactions
   - Middleware

2. **Move to Part 3:** Add TypeScript for compile-time safety

3. **Experiment:**
   - Add more models (Categories, Tags)
   - Implement many-to-many relations
   - Try Prisma Studio
   - Write seed data

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Examples](https://github.com/prisma/prisma-examples)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---