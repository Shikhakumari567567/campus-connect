# Campus Connect

A full-stack campus complaint management application built with React, Express, MongoDB, JWT and Cloudinary.

## Features
- Student registration and login
- JWT authentication and role-based authorization
- Student complaint submission and complaint history
- Optional image uploads through Cloudinary
- Admin complaint list, filters, statistics, priority and status management

## Requirements
- Node.js 18+
- MongoDB Atlas or local MongoDB
- Cloudinary account for image uploads

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env` with your MongoDB URI, a long random JWT secret, frontend URL and Cloudinary credentials.

Start backend:

```bash
npm run dev
```

API runs at `http://localhost:5000`.

Health check: `http://localhost:5000/api/health`

## 2. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

## 3. Create an admin account

1. Register a normal account using the app.
2. Stop the backend.
3. Add that exact email to `ADMIN_EMAIL` in `backend/.env`.
4. Restart the backend. On startup, the matching account is promoted to admin.
5. Remove `ADMIN_EMAIL` after promotion if you do not want the bootstrap setting to remain.

Do not expose admin creation or role selection in public registration.

## API summary

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Student complaints (Bearer token required)
- `POST /api/complaints` (multipart form; image field optional)
- `GET /api/complaints/my`
- `GET /api/complaints/:id`
- `PUT /api/complaints/:id` (only while Pending)
- `DELETE /api/complaints/:id` (only while Pending)

### Admin (admin Bearer token required)
- `GET /api/admin/complaints?status=Pending&search=wifi`
- `PATCH /api/admin/complaints/:id/status`
- `PATCH /api/admin/complaints/:id/priority`
- `GET /api/admin/stats`
- `GET /api/admin/users`

## Important security notes
- Never commit `.env` files. Use `.env.example` for placeholders.
- Use HTTPS in production and set `CLIENT_URL` to your deployed frontend origin.
- Use a strong, private `JWT_SECRET`.
- Configure Cloudinary credentials in the backend only.
- This is a learning project starter. Before real institutional use, add rate limiting, stronger validation, audit logs, account recovery, CSRF-aware cookie/session strategy where appropriate, and a formal privacy/access-control review.
