# Tanami Activity Feed Project

## Overview
This is a full-stack project with a backend (Express, TypeScript, Prisma, Socket.IO) and a frontend (Next.js, TypeScript). It features JWT authentication and a real-time activity feed.

## Setup Instructions

### 1. Start the Database
Ensure Docker is installed, then run:
\`\`\`bash
docker-compose up -d
\`\`\`
This starts PostgreSQL on port 5432 with:
- Database: tanami
- User: postgres
- Password: postgres

### 2. Setup and Run the Backend
Open Terminal and run:
\`\`\`bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
\`\`\`
The backend runs on [http://localhost:4000](http://localhost:4000).

### 3. Setup and Run the Frontend
In a new Terminal window/tab, run:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The frontend (Next.js) runs on [http://localhost:3000](http://localhost:3000).

### Default Login Credentials
- **Email:** admin@tanami.com
- **Password:** password
