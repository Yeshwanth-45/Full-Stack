# Phone + OTP Authentication Testing Guide

## System Overview

Your application now uses **phone number + OTP verification** instead of email/password for secure authentication.

### Authentication Flow

```
User enters phone number (10 digits)
         ↓
   Send OTP endpoint
         ↓
Backend generates 6-digit OTP, stores with 5-min expiry
Logs to console (todo: integrate SMS)
         ↓
User receives OTP (check console logs)
         ↓
User enters 6-digit OTP
         ↓
Verify OTP endpoint
         ↓
Backend validates OTP & expiry time
         ↓
JWT token returned (24-hour expiry)
         ↓
Token stored in localStorage
         ↓
User redirected to Home page (protected route)
```

---

## Backend Setup

### 1. Database Configuration

Ensure MySQL is running with the `fooddelivery` database:

```sql
USE fooddelivery;

-- User table with OTP fields
CREATE TABLE IF NOT EXISTS user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    phone_number VARCHAR(10) UNIQUE NOT NULL,
    otp VARCHAR(6),
    otp_expiry BIGINT,
    otp_verified BOOLEAN DEFAULT FALSE,
    email VARCHAR(255),
    provider VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Build Backend

```bash
cd backend
mvn clean compile -DskipTests
```

Expected output:
```
[INFO] Building backend 0.0.1-SNAPSHOT
[INFO] BUILD SUCCESS
```

### 3. Run Backend

```bash
# Using Maven wrapper
mvnw spring-boot:run

# Or using Spring Boot jar
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Server runs on: `http://localhost:8080`

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Google Sign-In Configuration (Optional)

For Google OAuth to work, update `src/index.js`:

```javascript
<GoogleOAuthProvider clientId="YOUR_ACTUAL_GOOGLE_CLIENT_ID">
```

Get your Client ID from: https://console.cloud.google.com/

### 3. Start Frontend Dev Server

```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

## Testing OTP Flow

### Test Case 1: Send OTP (Phone Number Entry)

**Step 1:** Open `http://localhost:3000`
- You'll see login page with phone number input

**Step 2:** Enter a phone number
```
Phone: 9876543210
```

**Step 3:** Click "📱 Send OTP"

**Expected Result:**
- ✅ Message: "OTP sent to 9876543210. Check your SMS."
- ✅ UI transitions to OTP verification step
- ✅ Backend console logs: OTP code (e.g., "OTP for 9876543210: 123456")

**Backend Console Output:**
```
[Backend] OTP for 9876543210: 123456
[Backend] OTP expires at: <timestamp>
```

---

### Test Case 2: Verify OTP (OTP Submission)

**Step 1:** After sending OTP, you'll see OTP input field

**Step 2:** Copy the OTP from backend console logs

**Step 3:** Enter the 6-digit OTP
```
OTP: 123456
```

**Step 4:** Click "✅ Verify OTP"

**Expected Result:**
- ✅ Message: "Logged in successfully!"
- ✅ Redirects to Home page (after 1.5 seconds)
- ✅ localStorage contains JWT token under key `token`

**Browser Console (Dev Tools):**
```javascript
localStorage.getItem("token") 
// Output: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwiaWF0IjoxNzA1MDAwMDAwLCJleHAiOjE3MDUwODY0MDB9..."
```

---

### Test Case 3: OTP Expiry (Invalid OTP)

**Step 1:** Enter phone number and send OTP

**Step 2:** Wait 5+ minutes

**Step 3:** Try to verify the old OTP

**Expected Result:**
- ❌ Error: "OTP has expired"
- ℹ️ User can click "↩️ Back" to request new OTP

---

### Test Case 4: Wrong OTP Verification

**Step 1:** Send OTP to phone number

**Step 2:** Enter wrong OTP (e.g., "000000")

**Step 3:** Click "✅ Verify OTP"

**Expected Result:**
- ❌ Error: "Invalid OTP"
- ℹ️ Can retry or go back to enter new phone number

---

### Test Case 5: Protected Routes

**Step 1:** After successful login, you're on Home page

**Step 2:** Try accessing routes without authentication:
- Navigate to `http://localhost:3000/menu` (without token)

**Expected Result:**
- 🚫 Redirected back to `/auth` page
- Auth filter validates JWT token from localStorage

---

### Test Case 6: Google Sign-In (Optional)

**Step 1:** On AuthPage, click Google Sign-In button

**Step 2:** Select a Google account

**Expected Result:**
- ✅ Auto-creates/updates user in database
- ✅ Returns JWT token
- ✅ Redirects to Home page
- Backend creates user with:
  - `phoneNumber`: auto-generated (e.g., "google_" + email hash)
  - `email`: from Google
  - `provider`: "GOOGLE"

---

## Testing Using cURL Commands

### Send OTP via cURL

```bash
curl -X POST http://localhost:8080/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210"}'
```

**Response (200 OK):**
```json
{
  "message": "OTP sent to 9876543210. Check console for OTP (use 000000 for development)"
}
```

### Verify OTP via cURL

```bash
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210","otp":"000000"}'
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwiaWF0IjoxNzA1MDAwMDAwLCJleHAiOjE3MDUwODY0MDB9..."
}
```

---

## Protected Route Testing

### Access Protected Endpoint with JWT

```bash
# Get token from OTP verification first
TOKEN="eyJhbGciOiJIUzI1NiJ9..."

# Access protected route (e.g., /api/menu)
curl -X GET http://localhost:8080/api/menu \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** Returns menu data (if implemented)

### Access Protected Endpoint WITHOUT JWT

```bash
curl -X GET http://localhost:8080/api/menu
```

**Expected Response (403 Forbidden):**
```json
{
  "error": "Unauthorized access - Missing or invalid token"
}
```

---

## Troubleshooting

### Issue: "Cannot connect to server"

**Solution:**
- Ensure backend is running on `http://localhost:8080`
- Check firewall/network connectivity
- Verify backend started successfully: `BUILD SUCCESS` in Maven logs

### Issue: "Invalid OTP" after sending

**Solution:**
- Copy OTP from backend console logs (development mode)
- Ensure you're entering the correct 6-digit code
- OTP is case-sensitive and must be exactly 6 digits

### Issue: "OTP has expired"

**Solution:**
- OTP expires after 5 minutes
- Click "↩️ Back" to request a new OTP
- Each send-otp request generates a new OTP

### Issue: CORS errors in console

**Solution:**
- Ensure backend allows CORS for `http://localhost:3000`
- Check `SecurityConfig.java` for CORS configuration
- Restart backend after any security config changes

### Issue: JWT token not stored in localStorage

**Solution:**
- Check browser DevTools → Application → Local Storage
- Verify response from verify-otp contains `token` field
- Check console for JavaScript errors

### Issue: Frontend shows "Compiled successfully" but pages are blank

**Solution:**
```bash
# Clear node_modules and reinstall
cd frontend
rm -r node_modules package-lock.json
npm install
npm start
```

---

## Security Checklist

- [ ] OTP expires after 5 minutes
- [ ] OTP is 6 digits (numeric only)
- [ ] JWT token expires after 24 hours
- [ ] Phone number is unique in database
- [ ] JWT token required for protected routes
- [ ] CORS disabled for production (or restricted to domain)
- [ ] SMS integration instead of console logging (production)
- [ ] HTTPS/TLS for all communication (production)

---

## Next Steps (Production Ready)

### 1. SMS Integration

Replace console logging with actual SMS provider:

**Options:**
- Twilio (recommended)
- AWS SNS
- Firebase Cloud Messaging
- ClickSend

**Code location:** `backend/src/main/java/com/example/backend/service/AuthService.java`

```java
// Replace:
System.out.println("OTP for " + phoneNumber + ": " + otp);

// With:
twilioService.sendSms(phoneNumber, "Your OTP is: " + otp);
```

### 2. Google Client ID

1. Create project in Google Cloud Console
2. Create OAuth 2.0 credential (Web application)
3. Add `http://localhost:3000` as authorized JavaScript origin
4. Update `frontend/src/index.js` with real Client ID

### 3. Environment Configuration

Create `.env` files for secrets:

**Backend:** `backend/.env`
```
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
SMS_FROM_NUMBER=+1234567890
```

**Frontend:** `frontend/.env`
```
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_GOOGLE_CLIENT_ID=xxx
```

### 4. Database Backup

```bash
mysqldump -u root -p fooddelivery > backup.sql
```

---

## Database Verification

```sql
-- Check if user table exists
SELECT * FROM user;

-- Check OTP fields
DESCRIBE user;

-- Verify OTP record
SELECT phone_number, otp, otp_expiry FROM user WHERE phone_number = '9876543210';
```

---

## API Reference

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/auth/send-otp` | POST | `{"phoneNumber":"9876543210"}` | `{"message":"OTP sent..."}` |
| `/api/auth/verify-otp` | POST | `{"phoneNumber":"9876543210","otp":"123456"}` | `{"token":"..."}` |
| `/api/auth/google` | POST | `{"googleToken":"...","email":"...","name":"..."}` | `{"token":"..."}` |

---

**Last Updated:** After OTP implementation  
**Status:** ✅ Frontend & Backend OTP Flow Complete

