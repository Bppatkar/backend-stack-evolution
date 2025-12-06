# Part 3: TypeScript + Express 💙

> Adding compile-time type safety with TypeScript - Catch errors before runtime

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [What's New in Part 3](#whats-new-in-part-3)
3. [What You'll Learn](#what-youll-learn)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [TypeScript Setup](#typescript-setup)
8. [Running the Application](#running-the-application)
9. [API Documentation](#api-documentation)
10. [Code Comparison](#code-comparison)
11. [TypeScript Concepts Deep Dive](#typescript-concepts-deep-dive)
12. [Type Definitions](#type-definitions)
13. [Interfaces vs Types](#interfaces-vs-types)
14. [Common Issues](#common-issues)

---

## 🎯 Overview

Part 3 adds **TypeScript** to our Express + PostgreSQL stack. TypeScript is JavaScript with syntax for types, providing compile-time error detection and better developer experience.

**What Changed from Part 1:**
- ❌ Removed: `.js` files
- ✅ Added: `.ts` files with type annotations
- ✅ Added: TypeScript compiler (`tsc`)
- ✅ Added: Type definitions for Express, JWT, bcrypt
- ✅ Added: Interface definitions for data models
- ✅ Added: Compile-time type checking

**What Stayed the Same:**
- Express.js for routing (with types)
- PostgreSQL with raw SQL (with types)
- JWT authentication (with types)
- bcrypt for hashing (with types)
- Same API endpoints
- Same functionality

---

## 🆕 What's New in Part 3

### 1. **Type Annotations**

**JavaScript (Part 1):**
```javascript
const signup = async (req, res) => {
  const { email, password, name } = req.body;
  // No type checking - could be anything!
}
```

**TypeScript (Part 3):**
```typescript
const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;
  // Types are known and checked!
}
```

### 2. **Interfaces for Data Models**

```typescript
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: Date;
}

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}
```

### 3. **Type-Safe Request Bodies**

```typescript
interface SignupBody {
  email: string;
  password: string;
  name: string;
}

const signup = async (
  req: Request<{}, {}, SignupBody>, 
  res: Response
): Promise<void> => {
  // TypeScript knows req.body structure
  const { email, password, name } = req.body;
}
```

### 4. **Custom Type Definitions**

```typescript
// Extend Express Request with user property
interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}
```

### 5. **Compilation Step**

```bash
# TypeScript (.ts) → JavaScript (.js)
npm run build

# Output in dist/ folder
dist/
├── config/
├── controllers/
├── middleware/
├── routes/
└── server.js
```

---

## 🎓 What You'll Learn

### Core TypeScript Concepts

1. **Type System Basics**
   - Primitive types (string, number, boolean)
   - Union types (string | number)
   - Literal types ('admin' | 'user')
   - Array types (string[], Array<string>)
   - Object types

2. **Interfaces**
   - Defining object shapes
   - Optional properties
   - Readonly properties
   - Extending interfaces

3. **Type Aliases**
   - Creating custom types
   - Generic types
   - Utility types (Partial, Pick, Omit)

4. **Function Types**
   - Parameter types
   - Return types
   - Optional parameters
   - Async function types

5. **Generics**
   - Generic functions
   - Generic interfaces
   - Constraints

6. **Type Guards**
   - typeof checks
   - instanceof checks
   - Custom type guards

7. **TypeScript Configuration**
   - tsconfig.json settings
   - Compiler options
   - Path mapping

8. **Working with Express Types**
   - Request types
   - Response types
   - Middleware types
   - Custom request extensions

---

## 📁 Project Structure

```
3-typescript-express/
├── src/
│   ├── config/
│   │   └── database.ts          # PostgreSQL with types
│   ├── middleware/
│   │   └── auth.ts              # Typed middleware
│   ├── routes/
│   │   ├── auth.ts              # Typed routes
│   │   └── todos.ts             # Typed routes
│   ├── controllers/
│   │   ├── authController.ts    # Typed controllers
│   │   └── todoController.ts    # Typed controllers
│   ├── types/
│   │   ├── express.d.ts         # Express extensions
│   │   ├── models.ts            # Data model interfaces
│   │   └── requests.ts          # Request body interfaces
│   └── server.ts                # Main app with types
├── dist/                        # Compiled JavaScript (auto-generated)
├── .env
├── .env.example
├── .gitignore
├── tsconfig.json                # TypeScript configuration
├── package.json
└── README.md
```

**Key Differences from Part 1:**
- 🔄 `.js` → `.ts` (TypeScript files)
- ➕ Added `src/types/` folder for type definitions
- ➕ Added `tsconfig.json` configuration
- ➕ Added `dist/` folder for compiled output
- ➕ Added type annotations everywhere

---

## ✅ Prerequisites

Same as Part 1, plus:

1. **Node.js** (v16 or higher)
2. **TypeScript knowledge** (basic understanding)
3. **PostgreSQL** (v12 or higher)
4. **Familiarity with Part 1** (recommended)

---

## 📦 Installation

### Step 1: Navigate to Directory
```bash
cd 3-typescript-express
```

### Step 2: Install Dependencies
```bash
npm install
```

**New Dependencies:**
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `@types/express` - Express type definitions
- `@types/jsonwebtoken` - JWT type definitions
- `@types/bcrypt` - bcrypt type definitions
- `@types/pg` - PostgreSQL type definitions
- `ts-node` - Execute TypeScript directly (dev)
- `ts-node-dev` - Auto-restart TypeScript (dev)

**Existing Dependencies:**
- `express`, `pg`, `jsonwebtoken`, `bcrypt`, `dotenv`

---

## 🔷 TypeScript Setup

### Step 1: Create Database (Same as Part 1)
```bash
psql postgres
CREATE DATABASE todo_typescript_db;
\q
```

### Step 2: Run Schema
```bash
psql -d todo_typescript_db -f schema.sql
```

### Step 3: Configure Environment Variables

Create `.env` file:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_typescript_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Bcrypt
BCRYPT_ROUNDS=10
```

### Step 4: Review TypeScript Configuration

The `tsconfig.json` file configures the TypeScript compiler:

```json
{
  "compilerOptions": {
    // Target JavaScript version
    "target": "ES2020",
    
    // Module system
    "module": "commonjs",
    
    // Output directory
    "outDir": "./dist",
    
    // Source directory
    "rootDir": "./src",
    
    // Enable all strict type checking
    "strict": true,
    
    // Allow importing .json files
    "resolveJsonModule": true,
    
    // Ensure consistent casing
    "forceConsistentCasingInFileNames": true,
    
    // Skip lib checking for faster compilation
    "skipLibCheck": true,
    
    // Enable decorators (for future use)
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    
    // Module resolution strategy
    "moduleResolution": "node",
    
    // Allow default imports
    "esModuleInterop": true,
    
    // Type declaration files
    "declaration": true,
    "declarationMap": true,
    
    // Source maps for debugging
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Key Options Explained:**

- **`strict: true`** - Enables all strict type checking:
  - `strictNullChecks` - null and undefined checking
  - `strictFunctionTypes` - strict function types
  - `strictPropertyInitialization` - properties must be initialized
  - `noImplicitAny` - error on implicit any types
  - `noImplicitThis` - error on implicit this types

- **`target: ES2020`** - Compiles to ES2020 JavaScript

- **`module: commonjs`** - Uses CommonJS modules (require/module.exports)

- **`outDir: ./dist`** - Compiled output goes to dist/

- **`rootDir: ./src`** - Source code is in src/

---

## 🚀 Running the Application

### Development Mode (with TypeScript)
```bash
npm run dev
```

This uses `ts-node-dev` to:
- Run TypeScript directly without compiling
- Auto-restart on file changes
- Fast recompilation

### Build for Production
```bash
npm run build
```

This compiles TypeScript to JavaScript in `dist/` folder.

### Run Production Build
```bash
npm start
```

This runs the compiled JavaScript from `dist/`.

### Type Checking Only (No Compilation)
```bash
npm run type-check
```

**Expected Output:**
```
✅ Database connected successfully
🚀 Server running on port 3000
📍 Health check: http://localhost:3000/health
```

---

## 📡 API Documentation

**All endpoints are identical to Part 1 and Part 2!**

The API interface remains the same; only the implementation has types.

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

All endpoints same as Part 1 & 2.

---

## 🔄 Code Comparison: Part 1 vs Part 3

### **Example 1: Data Model Definitions**

**Part 1 (JavaScript - No Types):**
```javascript
// No explicit type definition
// Structure only known from database schema
const user = {
  id: 1,
  email: 'user@example.com',
  name: 'John Doe'
};
```

**Part 3 (TypeScript - With Interfaces):**
```typescript
// Explicit type definition
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: Date;
}

const user: User = {
  id: 1,
  email: 'user@example.com',
  password: 'hashed',
  name: 'John Doe',
  created_at: new Date()
};
```

**Benefits:**
- ✅ Explicit data structure
- ✅ IDE autocomplete
- ✅ Compile-time validation
- ✅ Self-documenting code

---

### **Example 2: Function with Type Safety**

**Part 1 (JavaScript):**
```javascript
const signup = async (req, res) => {
  const { email, password, name } = req.body;
  // Could receive anything - no type checking
  
  // Typo? Won't catch until runtime
  if (!emial) {  // Typo!
    return res.status(400).json({ error: 'Missing email' });
  }
};
```

**Part 3 (TypeScript):**
```typescript
interface SignupBody {
  email: string;
  password: string;
  name: string;
}

const signup = async (
  req: Request<{}, {}, SignupBody>,
  res: Response
): Promise<void> => {
  const { email, password, name } = req.body;
  // TypeScript knows the structure
  
  // Typo caught at compile time!
  if (!emial) {  // ERROR: Cannot find name 'emial'
    return res.status(400).json({ error: 'Missing email' });
  }
};
```

**Benefits:**
- ✅ Typos caught at compile time
- ✅ Request body structure known
- ✅ Return type checked
- ✅ Better refactoring support

---

### **Example 3: Database Query with Types**

**Part 1 (JavaScript):**
```javascript
const result = await pool.query(
  'SELECT id, email, name FROM users WHERE email = $1',
  [email]
);

const user = result.rows[0];
// user is type 'any' - no type information
// Could access non-existent properties without error
console.log(user.firstName);  // No error, but undefined at runtime
```

**Part 3 (TypeScript):**
```typescript
interface User {
  id: number;
  email: string;
  name: string;
}

const result = await pool.query<User>(
  'SELECT id, email, name FROM users WHERE email = $1',
  [email]
);

const user = result.rows[0];
// user is type 'User' - fully typed
console.log(user.firstName);  // ERROR: Property 'firstName' does not exist
console.log(user.name);        // OK
```

**Benefits:**
- ✅ Query results are typed
- ✅ Property access validated
- ✅ Prevents runtime errors
- ✅ Better IDE support

---

### **Example 4: Middleware with Custom Request Type**

**Part 1 (JavaScript):**
```javascript
const authMiddleware = (req, res, next) => {
  const decoded = jwt.verify(token, secret);
  req.user = decoded;  // Adding property to req
  next();
};

// Later in controller
const getTodos = async (req, res) => {
  const userId = req.user.userId;  // No type checking
};
```

**Part 3 (TypeScript):**
```typescript
// Define custom request type
interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const decoded = jwt.verify(token, secret) as JwtPayload;
  (req as AuthRequest).user = decoded;
  next();
};

// Later in controller
const getTodos = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;  // Type-safe with optional chaining
};
```

**Benefits:**
- ✅ Custom properties typed
- ✅ Optional chaining for safety
- ✅ Autocomplete for user properties
- ✅ Compile-time validation

---

## 🧠 TypeScript Concepts Deep Dive

### 1. **Basic Types**

```typescript
// Primitive types
let name: string = 'John';
let age: number = 30;
let isActive: boolean = true;
let empty: null = null;
let notDefined: undefined = undefined;

// Arrays
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ['a', 'b', 'c'];

// Tuples (fixed-length arrays with specific types)
let tuple: [string, number] = ['age', 30];

// Any (avoid if possible)
let anything: any = 'could be anything';

// Unknown (safer than any)
let uncertain: unknown = 'something';
if (typeof uncertain === 'string') {
  console.log(uncertain.toUpperCase());  // OK after type check
}

// Void (function returns nothing)
function logMessage(msg: string): void {
  console.log(msg);
}

// Never (function never returns)
function throwError(message: string): never {
  throw new Error(message);
}
```

---

### 2. **Union and Intersection Types**

```typescript
// Union - value can be one of several types
type StringOrNumber = string | number;
let value: StringOrNumber = 'hello';
value = 42;  // OK

// Literal union - specific values only
type Status = 'pending' | 'approved' | 'rejected';
let orderStatus: Status = 'pending';  // OK
// orderStatus = 'cancelled';  // ERROR

// Intersection - combine multiple types
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: number;
  department: string;
};

type EmployeePerson = Person & Employee;

const emp: EmployeePerson = {
  name: 'John',
  age: 30,
  employeeId: 123,
  department: 'IT'
};
```

---

### 3. **Interfaces**

```typescript
// Basic interface
interface User {
  id: number;
  email: string;
  name: string;
}

// Optional properties
interface Todo {
  id: number;
  title: string;
  description?: string;  // Optional
  completed: boolean;
}

// Readonly properties
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

const config: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};
// config.apiUrl = 'new url';  // ERROR: readonly

// Extending interfaces
interface TimestampedEntity {
  createdAt: Date;
  updatedAt: Date;
}

interface User extends TimestampedEntity {
  id: number;
  email: string;
  name: string;
}

// Interface for functions
interface SearchFunction {
  (query: string, limit: number): Promise<User[]>;
}

const searchUsers: SearchFunction = async (query, limit) => {
  // Implementation
  return [];
};
```

---

### 4. **Type Aliases**

```typescript
// Type alias for object
type Point = {
  x: number;
  y: number;
};

// Type alias for union
type ID = string | number;

// Type alias for function
type GreetFunction = (name: string) => string;

const greet: GreetFunction = (name) => {
  return `Hello, ${name}`;
};

// Generic type alias
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const userResponse: ApiResponse<User> = {
  success: true,
  data: { id: 1, email: 'user@example.com', name: 'John' }
};
```

---

### 5. **Interfaces vs Type Aliases**

**When to use Interface:**
- Defining object shapes
- Need to extend/implement
- Public API contracts
- OOP patterns

**When to use Type:**
- Unions and intersections
- Mapped types
- Conditional types
- Primitives and tuples

```typescript
// Interface - good for objects
interface User {
  name: string;
  age: number;
}

interface Admin extends User {
  permissions: string[];
}

// Type - good for unions
type Status = 'active' | 'inactive' | 'suspended';

type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };
```

---

### 6. **Generics**

```typescript
// Generic function
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);      // number
const str = identity<string>('hello'); // string
const auto = identity('auto');         // inferred as string

// Generic interface
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: T): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

class UserRepository implements Repository<User> {
  async findById(id: number): Promise<User | null> {
    // Implementation
    return null;
  }
  
  async findAll(): Promise<User[]> {
    return [];
  }
  
  // ... other methods
}

// Generic constraints
interface HasId {
  id: number;
}

function getIds<T extends HasId>(items: T[]): number[] {
  return items.map(item => item.id);
}
```

---

### 7. **Utility Types**

```typescript
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  age: number;
}

// Partial - all properties optional
type PartialUser = Partial<User>;
// { id?: number; email?: string; ... }

// Required - all properties required
type RequiredUser = Required<PartialUser>;

// Pick - select specific properties
type UserCredentials = Pick<User, 'email' | 'password'>;
// { email: string; password: string; }

// Omit - exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;
// { id: number; email: string; name: string; age: number; }

// Record - create object type with specific keys
type UserRoles = Record<string, boolean>;
// { [key: string]: boolean; }

// Readonly - make all properties readonly
type ReadonlyUser = Readonly<User>;

// ReturnType - extract return type of function
type UserId = ReturnType<() => number>;  // number

// Parameters - extract parameter types
type SignupParams = Parameters<typeof signup>;
```

---

### 8. **Type Guards**

```typescript
// typeof guard
function padLeft(value: string, padding: string | number): string {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + value;
  }
  return padding + value;
}

// instanceof guard
class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

function handleError(error: unknown): void {
  if (error instanceof ApiError) {
    console.log(`API Error: ${error.message}, Status: ${error.statusCode}`);
  } else if (error instanceof Error) {
    console.log(`Error: ${error.message}`);
  } else {
    console.log('Unknown error');
  }
}

// Custom type guard
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim();  // TypeScript knows it's Fish
  } else {
    pet.fly();   // TypeScript knows it's Bird
  }
}
```

---

### 9. **Express Type Definitions**

```typescript
import { Request, Response, NextFunction } from 'express';

// Basic controller
const getUser = async (req: Request, res: Response): Promise<void> => {
  res.json({ user: {} });
};

// Controller with route params
interface UserParams {
  id: string;
}

const getUserById = async (
  req: Request<UserParams>,
  res: Response
): Promise<void> => {
  const { id } = req.params;  // Type-safe
  res.json({ id });
};

// Controller with request body
interface CreateUserBody {
  email: string;
  password: string;
  name: string;
}

const createUser = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response
): Promise<void> => {
  const { email, password, name } = req.body;  // Type-safe
  res.status(201).json({ email, name });
};

// Controller with query params
interface SearchQuery {
  q?: string;
  limit?: string;
}

const searchUsers = async (
  req: Request<{}, {}, {}, SearchQuery>,
  res: Response
): Promise<void> => {
  const { q, limit } = req.query;  // Type-safe
  res.json({ query: q, limit });
};

// Complete typed controller
const updateTodo = async (
  req: Request<
    { id: string },           // Params
    {},                       // Response body (can define)
    { title?: string; completed?: boolean },  // Request body
    {}                        // Query params
  >,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { title, completed } = req.body;
  res.json({ id, title, completed });
};

// Middleware typing
const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(`${req.method} ${req.path}`);
  next();
};

// Error handler middleware
interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message
  });
};
```

---

### 10. **Advanced Patterns**

**Discriminated Unions:**
```typescript
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

function handleResponse<T>(response: ApiResponse<T>): void {
  switch (response.status) {
    case 'success':
      console.log(response.data);  // TypeScript knows data exists
      break;
    case 'error':
      console.log(response.error); // TypeScript knows error exists
      break;
    case 'loading':
      console.log('Loading...');   // No extra properties
      break;
  }
}
```

**Mapped Types:**
```typescript
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User {
  id: number;
  name: string;
}

type NullableUser = Nullable<User>;
// { id: number | null; name: string | null; }

type Optional<T> = {
  [K in keyof T]?: T[K];
};
```

**Conditional Types:**
```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type Example1 = NonNullable<string | null>;  // string
type Example2 = NonNullable<number | undefined>;  // number

type IsString<T> = T extends string ? true : false;
type Test1 = IsString<string>;  // true
type Test2 = IsString<number>;  // false
```

---

## ❗ Common Issues & Solutions

### Issue 1: Cannot Find Module

**Error:**
```
TS2307: Cannot find module 'express' or its corresponding type declarations
```

**Solution:**
```bash
npm install --save-dev @types/express
```

---

### Issue 2: Implicit Any Type

**Error:**
```
TS7006: Parameter 'req' implicitly has an 'any' type
```

**Solution:**
Add type annotations:
```typescript
// Before
const handler = (req, res) => {};

// After
const handler = (req: Request, res: Response): void => {};
```

---

### Issue 3: Property Does Not Exist

**Error:**
```
TS2339: Property 'user' does not exist on type 'Request'
```

**Solution:**
Extend Request interface:
```typescript
// src/types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}

export {};
```

---

### Issue 4: Type Assertion Issues

**Error:**
```
Type '{}' is not assignable to type 'User'
```

**Solution:**
Use proper type assertion:
```typescript
// Bad
const user = {} as User;

// Good
const user: User = {
  id: 1,
  email: 'user@example.com',
  password: 'hashed',
  name: 'John',
  created_at: new Date()
};

// Or use Partial for incomplete objects
const partialUser: Partial<User> = {
  email: 'user@example.com'
};
```

---

### Issue 5: Strict Null Checks

**Error:**
```
TS2322: Type 'User | undefined' is not assignable to type 'User'
```

**Solution:**
Handle null/undefined cases:
```typescript
// Bad
const user = await findUser();
console.log(user.name);  // Error: user might be undefined

// Good - Option 1: Optional chaining
console.log(user?.name);

// Good - Option 2: Null check
if (user) {
  console.log(user.name);
}

// Good - Option 3: Non-null assertion (use carefully)
console.log(user!.name);
```

---

## 🎯 TypeScript Best Practices

### 1. **Avoid Any**
```typescript
// Bad
let data: any = fetchData();

// Good
interface ApiData {
  id: number;
  name: string;
}
let data: ApiData = fetchData();
```

### 2. **Use Strict Mode**
Always enable strict mode in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 3. **Prefer Interfaces for Objects**
```typescript
// Good
interface User {
  id: number;
  name: string;
}

// Less preferred for simple objects
type User = {
  id: number;
  name: string;
};
```

### 4. **Use Readonly When Appropriate**
```typescript
interface Config {
  readonly apiKey: string;
  readonly timeout: number;
}
```

### 5. **Leverage Type Inference**
```typescript
// Don't over-specify types
const numbers = [1, 2, 3];  // TypeScript infers number[]

// Do specify when needed
const mixed: (string | number)[] = [1, 'two', 3];
```

### 6. **Use Utility Types**
```typescript
// Instead of manually creating partial types
interface User {
  id: number;
  name: string;
  email: string;
}

// Use built-in utilities
type UpdateUser = Partial<User>;  // All properties optional
type UserKeys = keyof User;        // 'id' | 'name' | 'email'
```

---

## 📊 Benefits of TypeScript

| Aspect | JavaScript | TypeScript |
|--------|-----------|------------|
| Type Safety | Runtime only | Compile + Runtime |
| Error Detection | At runtime | Before compilation |
| IDE Support | Basic | Advanced |
| Refactoring | Risky | Safe |
| Documentation | Comments | Types |
| Learning Curve | Easier | Steeper |
| Code Confidence | Lower | Higher |

---

## 🎓 Key Takeaways

✅ **TypeScript** adds types to JavaScript  
✅ **Compile-time checking** prevents runtime errors  
✅ **Interfaces** define data structures  
✅ **Type annotations** make code self-documenting  
✅ **Generics** enable reusable components  
✅ **Utility types** reduce boilerplate  
✅ **Express types** provide request/response safety  
✅ **Better IDE support** with autocomplete  

---

## 🚀 Next Steps

You've mastered TypeScript with Express! Now you can:

1. **Combine Everything:** Move to **Part 4** for TypeScript + Prisma (the ultimate stack!)

2. **Explore Advanced TypeScript:**
   - Decorators
   - Namespaces
   - Modules
   - Advanced generics

3. **Experiment:**
   - Add input validation with Zod
   - Implement DTOs (Data Transfer Objects)
   - Create custom decorators
   - Add API documentation with types

---

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Express TypeScript Starter](https://github.com/microsoft/TypeScript-Node-Starter)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)

---

**Ready for the ultimate stack?** Move to **Part 4: Prisma + TypeScript** to combine the best of both worlds! 🚀