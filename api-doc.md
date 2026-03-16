# API Documentation

Base URL: `http://localhost:5000/api/v1`

> [!NOTE]
> All endpoints (except `/health`) require an `Authorization` header:
> `Authorization: Bearer <clerk_token>`

## 🏠 General

- **GET** `/health`: Check server status and environment.

## 🔐 Authentication

- **POST** `/auth/sync`: Sync Clerk user data into the local database on first login.
- **GET** `/auth/me`: Retrieve the current user's profile and preferences.

## 💼 Jobs

- **GET** `/jobs`: List all job applications.
  - Queries: `page`, `limit`, `status`, `search`, `sort`, `order`.
- **POST** `/jobs`: Save a new job application.
- **GET** `/jobs/stats`: Get application counts grouped by status.
- **GET** `/jobs/:id`: Get details of a specific job application.
- **PATCH** `/jobs/:id`: Update an existing job application.
- **DELETE** `/jobs/:id`: Remove a job application record.

## 📄 CV / Profile

- **GET** `/cv`: Retrieve your professional profile/CV data.
- **PATCH** `/cv`: Update CV sections (experiences, skills, education, etc.).

## 🤖 AI Features (Gemini)

- **POST** `/ai/generate-email`: Craft a tailored application email.
  - Body: `{ jobDescription, tone, additionalContext, jobId? }`
- **POST** `/ai/generate-cv-summary`: Optimize your professional summary for a job.
  - Body: `{ jobDescription, jobId? }`
