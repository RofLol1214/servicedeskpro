# 🖥️ ServiceDeskPro — ITSM & CMDB Platform

A full-stack IT Service Management app built with the MERN stack.

---

## 📁 Project Structure

```
servicedeskpro/
├── frontend/          ← React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── App.jsx          Root component & routing
│   │   ├── main.jsx         Vite entry point
│   │   ├── pages.jsx        All page components
│   │   ├── components.jsx   Shared UI: Badge, Avatar, Icon
│   │   ├── service.js       Business logic & helper functions
│   │   ├── mockData.js      Demo seed data
│   │   ├── constants.js     Colours, dropdown lists, graph config
│   │   └── index.css        Tailwind base styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── backend/           ← Node.js + Express + MongoDB
    ├── src/
    │   ├── server.js              Entry point
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Ticket.js
    │   │   └── ConfigItem.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── ticketController.js
    │   │   ├── cmdbController.js
    │   │   └── userController.js
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── tickets.js
    │   │   ├── cmdb.js
    │   │   └── users.js
    │   └── middleware/
    │       └── auth.js
    ├── .env
    └── package.json
```

---

## 🚀 Quick Start

### Step 1 — Install Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → **http://localhost:5173**

---

### Step 2 — Install & Run Backend (optional — app works with mock data by default)

Make sure MongoDB is running locally first:
- Download from https://www.mongodb.com/try/download/community
- Or run with Docker: `docker run -d -p 27017:27017 mongo`

```bash
cd backend
npm install
npm run dev
```

Backend runs at → **http://localhost:5000**

---

### Step 3 — Open the App

Go to **http://localhost:5173** in your browser.

**Demo login credentials:**
| Email | Role |
|---|---|
| alice@corp.com | Admin |
| bob@corp.com | IT Staff |
| carol@corp.com | IT Staff |
| dave@corp.com | User |
| eva@corp.com | User |

Password for all demo accounts: **`password`**

---

## 🔌 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/tickets | List tickets |
| POST | /api/tickets | Create ticket |
| PUT | /api/tickets/:id | Update ticket |
| DELETE | /api/tickets/:id | Delete ticket |
| POST | /api/tickets/:id/comments | Add comment |
| GET | /api/cmdb | List CIs |
| POST | /api/cmdb | Create CI |
| PUT | /api/cmdb/:id | Update CI |
| DELETE | /api/cmdb/:id | Delete CI |
| POST | /api/cmdb/relationship | Add CI relationship |
| GET | /api/cmdb/:id/impact | Get impact analysis |
| GET | /api/users | List users (admin) |
| PUT | /api/users/:id | Update user (admin) |
| DELETE | /api/users/:id | Delete user (admin) |

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS  
**Backend:** Node.js, Express.js, JWT Auth  
**Database:** MongoDB with Mongoose
