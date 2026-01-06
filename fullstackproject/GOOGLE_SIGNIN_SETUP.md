# Google Sign-In Setup Guide

## Frontend Setup (React)

Your frontend now has Google Sign-In integrated! To make it work, you need to:

### Step 1: Get Google Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:3000/auth`
7. Copy your **Client ID**

### Step 2: Update Frontend
Replace `YOUR_GOOGLE_CLIENT_ID` in `src/index.js`:
```javascript
<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
```

### Step 3: How Google Sign-In Works

**Frontend (AuthPage.js):**
- Shows "Sign in with Google" button (OR option)
- On success, decodes the Google JWT token
- Sends to backend: `googleToken`, `email`, `name`
- Receives JWT token back and stores in localStorage
- Redirects to home page

**Backend (AuthService):**
- Receives email from Google token
- Creates new user if doesn't exist (auto-signup)
- Or logs in existing user
- Returns JWT token for app authentication

## Backend Endpoints

### POST `/api/auth/login`
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}

Error (401):
"Invalid password" or "User not found"
```

### POST `/api/auth/register`
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "message": "User registered successfully"
}

Error (400):
"Email already registered"
```

### POST `/api/auth/google`
```json
Request:
{
  "googleToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9...",
  "email": "user@gmail.com",
  "name": "User Name"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}

Error (401):
"Missing googleToken or email"
```

## Features Added

✅ **Email/Password Auth:**
- Register new account
- Login with credentials
- Proper error handling (401/400 responses)
- JWT token generation and validation

✅ **Google Sign-In:**
- One-click login/signup with Google
- Auto-creates user if new
- Same JWT token system
- Provider tracking (local vs google)

✅ **Response Format:**
- Unified JSON response format
- Proper HTTP status codes
- Error messages in response body

## Testing

1. **Local Registration/Login:**
   - Register: email@example.com / password123
   - Login with same credentials
   - Check console for token

2. **Google Login:**
   - Click "Sign in with Google" button
   - Authenticate with Google account
   - Should redirect to home automatically

3. **Check Token:**
   - Open DevTools → Application → localStorage
   - Should see `token` with JWT value

## Environment Variables (Optional)

You can set Google Client ID as environment variable:
```bash
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
```

Then in `index.js`:
```javascript
<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Google login failed" | Check Client ID in index.js |
| CORS error | Backend CORS config needed |
| Token not stored | Check browser console for errors |
| 403 response on login | User doesn't exist, register first |
| 400 on register | Email already exists, try login instead |

---

**Next Steps:**
- Set up Google Client ID
- Update `clientId` in frontend
- Test with Google account
- Deploy to production with production URLs
