# Shnoor LMS - Full Stack Setup Guide

This repository contains the source code for the **Shnoor Learning Management System (LMS)**. It is a full-stack application built with an Express.js backend and a React/Vite frontend.

## 📂 Project Structure

- **`backend-shnoor/`**: The backend server (Node.js/Express) handling APIs, Database connection, and Authentication verification.
- **`frontend-shnoor/`**: The frontend application (React + Vite) for Students, Instructors, and Admin portals.

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js** (v18 or higher recommended) - [Download Here](https://nodejs.org/)
2.  **PostgreSQL** (Active database server) - [Download Here](https://www.postgresql.org/)
3.  **Git** - [Download Here](https://git-scm.com/)

You will also need:
- A **Firebase Project** for Authentication.
- A **PostgreSQL Database** created for this application (e.g., `shnoor_lms`).

---

## 🚀 Setting Up the Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend-shnoor
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `backend-shnoor` directory. Add the following keys (replace with your actual database details):

    ```env
    # Server Configuration
    PORT=5000

    # Database Configuration (PostgreSQL)
    DB_HOST=localhost
    DB_USER=postgres
    DB_PASSWORD=your_password
    DB_NAME=shnoor_lms
    DB_PORT=5432

    # Firebase Admin SDK (See Step 4)
    # If using environment variables for Firebase credentials, add them here.
    # Otherwise, you will need the service-key.json file.
    ```

4.  **Firebase Admin SDK Setup:**
    - Go to your Firebase Console -> Project Settings -> Service Accounts.
    - Click **"Generate new private key"**.
    - Rename the downloaded file to `service-key.json`.
    - Place this file inside the `backend-shnoor/` directory.

5.  **Run the Server:**
    ```bash
    npm run dev
    ```
    You should see: `✅ Server running on port 5000` and `✅ Database connected`.

---

## 🎨 Setting Up the Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend-shnoor
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `frontend-shnoor` directory. You can find these values in your **Firebase Console -> Project Settings**.

    ```env
    VITE_API_URL=http://localhost:5000

    # Firebase Client Config
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET_ID=your_bucket.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the Request:**
    ```bash
    npm run dev
    ```
    The application will typically start at `http://localhost:5173`.

---

## 🛠️ Folder Structure Overview

```
final_lms/
├── backend-shnoor/       # Backend Logic
│   ├── app.js            # Entry Point
│   ├── config/           # Database & Firebase Config
│   ├── controllers/      # Route Logic (Admin, Student, Instructor)
│   ├── routes/           # API Endpoint Definitions
│   ├── services/         # Business Logic
│   └── service-key.json  # (DO NOT COMMIT THIS)
│
├── frontend-shnoor/      # Frontend Client
│   ├── src/
│   │   ├── api/          # Axios Axios Helper
│   │   ├── auth/         # Firebase Auth Context
│   │   ├── components/   # Reusable UI Components
│   │   ├── pages/        # App Pages (Admin, Student, Instructor)
│   │   └── App.jsx       # Main Router
│   ├── public/           # Static Assets
│   └── vite.config.js    # Vite Configuration
│
├── .gitignore            # Git Ignore Rules
└── README.md             # This Documentation
```

## ⚠️ Common Issues

- **Database Connection Failed:** Check your `DB_PASSWORD` and ensure PostgreSQL service is running.
- **CORS Error:** Ensure the Backend is running on port 5000 and the `VITE_API_URL` in frontend `.env` matches.
- **Firebase Auth Error:** Ensure `service-key.json` is present in backend and client keys are correct in frontend `.env`.

---
**Happy Coding! 🚀**
