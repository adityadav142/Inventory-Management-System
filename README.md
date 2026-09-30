# Inventory Management System (MERN)

A simple, database-driven inventory app: React (Vite) + Express + MongoDB (Mongoose) with JWT authentication.

## Features
- Admin login (bcrypt-hashed passwords, JWT), protected routes on both frontend and backend
- Products: add, view, edit, delete (with confirmation), search (name/supplier), category filter
- Categories: add, view, edit, delete (blocked while products use the category)
- Stock: +/- buttons, never below zero, status calculated automatically
  (0 = Out of Stock, 1-10 = Low Stock, above 10 = Available)
- Dashboard: total products, categories, total stock, low stock, out of stock, recent products
- Profile page, logout, loading / error / empty states

## User roles
| | Admin | User |
|---|---|---|
| Dashboard | Full statistics | Basic inventory summary |
| Products | Add (popup), edit, delete, search, filter | View, search by name, filter, view details |
| Categories / Stock | Manage | No access |
| Profile | View and edit name, email, password | View and edit name, email, password |

- The **Register** page always creates a **User** account.
- **Admin** accounts come from `npm run seed`, or by changing `role` to `admin` on a user in MongoDB Atlas.
- Role checks are enforced in the backend as well (403 for users on admin-only APIs), not only hidden in the UI.

## Requirements
- Node.js 18 or newer
- A MongoDB Atlas connection string (or a local MongoDB URI)

## Setup

### 1. Backend
```bash
cd backend
npm install
```
Open `backend/.env` and set your values:
```
PORT=5000
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<any long random string>
JWT_EXPIRES_IN=7d
```
Load sample data (creates the admin user, 5 categories and 10 products):
```bash
npm run seed
```
Start the API:
```bash
npm run dev      # auto-restart with nodemon
# or
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
`frontend/.env` already contains `VITE_API_URL=http://localhost:5000/api`.
Open http://localhost:5173

### Login
```
Email:    admin@gmail.com
Password: admin123
```
(Created by `npm run seed`.) Any account created from the Register page is a normal User.

## API

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register (creates a User) |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/products?search=&category= | List products (search and filter) |
| GET | /api/products/:id | Get one product |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| PATCH | /api/products/:id/stock | Update quantity `{ "quantity": 30 }` |
| GET/POST | /api/categories | List / create categories |
| GET/PUT/DELETE | /api/categories/:id | Get / update / delete category |
| GET | /api/dashboard/stats | Dashboard statistics |
| GET | /api/dashboard/user-stats | Basic summary for users |
| GET / PUT | /api/users/profile | View / update own profile (name, email, password) |

All endpoints except `/api/auth/*` need the header `Authorization: Bearer <token>`.
Responses use `{ success, message, data }`.

## Project structure
```
backend/   config, controllers, middleware, models, routes, seed.js, server.js
frontend/  src/components, src/pages, src/context, src/services
```
