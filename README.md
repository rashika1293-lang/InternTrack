# InternTrack – Internship & Application Management System

InternTrack is a full-stack web application that helps students manage internship and job applications from one dashboard.

## Features
- Student registration and login
- JWT-based authentication
- Add, edit and delete applications
- Track application status
- Search and filter applications
- Dashboard statistics
- Responsive UI

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT

## Project Structure
```text
InternTrack/
├── frontend/
└── backend/
```

## Setup

### 1. Backend
```bash
cd backend
npm install
```

Create `.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/interntrack
JWT_SECRET=change_this_secret
```

Run:
```bash
npm run dev
```

### 2. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite.

## Notes
- Never commit `.env`.
- The repository should be public before submitting it to the recruiter.
