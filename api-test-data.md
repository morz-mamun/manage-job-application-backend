# API Test Data & Examples

Use these examples to test the endpoints defined in `api-doc.md`.

## 🔐 Auth Sync

Send this after the user logs in via Clerk for the first time.

**Endpoint:** `POST /auth/sync`

**Request Body:**

```json
{
  "clerkId": "user_2lV...",
  "email": "test@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Expected Response (201 Created):**

```json
{
  "success": true,
  "message": "User synced successfully",
  "data": {
    "clerkId": "user_2lV...",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "cv": { ... },
    "preferences": { ... }
  }
}
```

---

## 💼 Create a Job

**Endpoint:** `POST /jobs`

**Request Body:**

```json
{
  "title": "Full Stack Developer",
  "company": "Tech Corp",
  "location": "Remote",
  "jobType": "full-time",
  "description": "We are looking for a senior developer proficient in React and Node.js. Minimum 5 years experience required.",
  "requirements": ["React", "Node.js", "MongoDB", "TypeScript"],
  "salary": {
    "min": 100000,
    "max": 150000,
    "currency": "USD"
  },
  "tags": ["Full-Stack", "Remote"],
  "source": "LinkedIn"
}
```

**Expected Response (201 Created):**

```json
{
  "success": true,
  "message": "Job saved successfully",
  "data": {
    "id": "64f...",
    "title": "Full Stack Developer",
    "status": "saved",
    "createdAt": "..."
  }
}
```

---

## 🤖 AI: Generate Email

**Endpoint:** `POST /ai/generate-email`

**Request Body:**

```json
{
  "jobDescription": "Tech Corp is hiring a Full Stack Developer. Must have experience with React and Node.js. Passion for clean code and teamwork is a must.",
  "tone": "professional",
  "additionalContext": "I have worked on a similar project for 3 years using MERN stack."
}
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "Email generated successfully",
  "data": {
    "email": "SUBJECT: Application for Full Stack Developer position\n---\nDear Hiring Manager,\n\nI am writing to express my strong interest in the Full Stack Developer position at Tech Corp..."
  }
}
```

---

## 📄 Update CV

**Endpoint:** `PATCH /cv`

**Request Body:**

```json
{
  "title": "Senior Software Engineer",
  "summary": "Experienced developer with a track record of building scalable web applications.",
  "skills": ["JavaScript", "TypeScript", "React", "Node.js", "Docker"],
  "experiences": [
    {
      "company": "PrevTech",
      "position": "Web Developer",
      "startDate": "2020-01-01T00:00:00.000Z",
      "current": true,
      "description": "Developed and maintained several high-traffic websites.",
      "technologies": ["PHP", "Laravel", "MySQL"]
    }
  ]
}
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "CV updated successfully",
  "data": {
    "title": "Senior Software Engineer",
    "updatedAt": "..."
  }
}
```
