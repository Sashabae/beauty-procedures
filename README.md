# 💉 Procedure Booking App 💄

This project is a full-stack web application for managing procedures. The platform enables users to browse available procedures, register for them, and view or manage their registrations. The application is built using **React** for the frontend, **Express.js** for the backend, and **PostgreSQL** as the database.

## 🚀 Features

### 👥 Users

- Sign up / Log in with JWT authentication
- View available procedures
- Register for a procedure
- View and manage their own registrations
- Leave reviews of the procedures

### 👤Admin

- Create, edit, or delete procedures
- View all user registrations
- Confirm registrations

### ⚙️ Additional Features

- Pagination for procedures, reviews, registrations
- Role-based access (user/admin)
- Clean and minimal UI for ease of use
- Responsive design using **Tailwind CSS + DaisyUI**
- Search and sorting

## 🛠️ Tech Stack

### Frontend

- [React](https://reactjs.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)

### Backend

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Postgres](https://www.npmjs.com/package/postgres)
- [JWT Authentication ( jsonwebtoken )](https://www.npmjs.com/package/jsonwebtoken)

## 🖥 Installation & Setup

### Environment Variables

There's a file `env-example` in both `backend` and `frontend` folders, which show everything you'll need for `.env`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run start
```
