# Learning Tracker

A personal learning time tracker to monitor hours invested in **Programming** and **Language** learning. Built for motivation — see your accumulated hours grow over time.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express.js
- **Database:** SQLite + Prisma ORM
- **Auth:** JWT + bcryptjs

## Setup

### 1. Server

```bash
cd server
npm install
npx prisma migrate dev --name init
npm run dev
```

Server runs on `http://localhost:3001`

### 2. Client

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173`

### 3. Production Build

```bash
cd client
npm run build
```

## Features

- Register / Login / Logout with secure password hashing
- Track **Programming** and **Language** learning sessions
- Timestamp-based timer (accurate even if tab is inactive)
- Only one active session at a time
- Active session persists across page refreshes
- Dashboard statistics: Today, Past 2 Weeks, Total Hours
- Separate totals for each category
- Dark theme with modern design
