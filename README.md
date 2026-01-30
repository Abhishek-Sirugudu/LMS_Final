# Shnoor LMS Setup Guide

This repository contains the source code for the Shnoor Learning Management System (LMS). It is a full-stack application built with an Express.js backend and a React/Vite frontend.

This guide provides step-by-step instructions to set up the project locally.

## Project Structure

- **backend-shnoor**: This directory contains the Node.js and Express server, which handles API requests, database interactions (PostgreSQL), and authentication.
- **frontend-shnoor**: This directory contains the React application built with Vite, serving the interfaces for students, instructors, and administrators.
- **backend-shnoor/schema.sql**: This file contains the SQL commands required to set up the database structure.

## Prerequisites

Before starting, please ensure you have the following software installed on your machine:

1.  **Node.js** (Version 18 or higher)
2.  **PostgreSQL** (Version 14 or higher)
3.  **Git**

You will also need:
- A **Firebase Project** for handling authentication.
- A **Gmail Account** with an App Password if you intend to test email functionality.

## Step 1: Clone the Repository

Clone the repository to your local machine and navigate into the project folder:

```bash
git clone <repository-url>
cd final_lms
```

## Step 2: Backend Setup

First, we will set up the backend server.

### 1. Install Dependencies

Navigate to the backend directory and install the necessary packages:

```bash
cd backend-shnoor
npm install
```

### 2. Configure Environment Variables

Create a file named `.env` in the `backend-shnoor` directory. You will need to populate this file with your specific configuration details.

Copy the following template into your `.env` file and replace the placeholder values with your actual credentials:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=shnoor_lms
DB_PORT=5432

# Email Service (Nodemailer - Gmail App Password)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
FROM_EMAIL=your_email@gmail.com

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

For the `FIREBASE_PRIVATE_KEY`, ensure that newlines are correctly formatted if you are pasting the key directly.

### 3. Setup Database

The application requires a PostgreSQL database to function.

1.  Open your preferred SQL management tool (such as pgAdmin or DBeaver).
2.  Create a new database. By default, the configuration uses the name `shnoor_lms`.
3.  Open a query tool for your new database.
4.  Open the file `backend-shnoor/schema.sql` from this repository.
5.  Copy the entire contents of `schema.sql` and execute it in your SQL query tool. This will generate all the necessary tables and relationships.

### 4. Run the Backend Server

Start the backend server:

```bash
npm run dev
```

You should see messages indicating that the database is connected and the server is running on port 5000.

## Step 3: Frontend Setup

Next, we will set up the frontend client.

### 1. Install Dependencies

Open a new terminal window, navigate to the frontend directory, and install the dependencies:

```bash
cd frontend-shnoor
npm install
```

### 2. Configure Environment Variables

Create a file named `.env` in the `frontend-shnoor` directory. You can obtain these values from your Firebase Console under Project Settings.

```env
VITE_API_URL=http://localhost:5000

# Firebase Client Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET_ID=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run the Frontend Application

Start the development server:

```bash
npm run dev
```

The application should now be accessible at `http://localhost:5173`.

## Troubleshooting

If you encounter issues, here are some common solutions:

*   **Database Connection Failed**: Double-check that the `DB_PASSWORD` in your backend `.env` file matches your local PostgreSQL password. Also, verify that the PostgreSQL service is running.
*   **Tables Missing**: Ensure that you have manually executed the `schema.sql` script in your database. The application does not create these tables automatically.
*   **Firebase Errors**: Confirm that both the frontend and backend are configured with credentials from the same Firebase project.
*   **CORS Errors**: Verify that the `FRONTEND_URL` in the backend `.env` file matches exactly where your frontend is running (usually `http://localhost:5173`).

## Default Users

If you have seeded the database or need to create an admin user manually, you can update a registered user's role directly in the specific database table:

```sql
UPDATE users SET role = 'admin', status = 'active' WHERE email = 'your_email@example.com';
```
