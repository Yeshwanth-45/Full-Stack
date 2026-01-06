# 🚀 Developer Quick Reference Card

## ⚡ Commands Cheatsheet

### Start Application

```bash
# Terminal 1: Backend
cd backend && mvnw spring-boot:run

# Terminal 2: Frontend  
cd frontend && npm start

# Browser
http://localhost:3000
```

### Build & Package

```bash
# Backend JAR
cd backend && mvnw clean package -DskipTests

# Frontend production build
cd frontend && npm run build
```

### Database

```bash
# Connect to MySQL
mysql -u root -p

# Use database
USE fooddelivery;

# See all users
SELECT phone_number, otp_verified, provider FROM user;

# Check user with OTP
SELECT * FROM user WHERE phone_number = '9876543210';

# Backup database
mysqldump -u root -p fooddelivery > backup.sql
```

---

## 🔌 API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Request | Response | Auth |
|--------|----------|---------|----------|------|
| POST | `/api/auth/send-otp` | `{"phoneNumber":"9876543210"}` | `{"message":"..."}` | ❌ |
| POST | `/api/auth/verify-otp` | `{"phoneNumber":"9876543210","otp":"123456"}` | `{"token":"..."}` | ❌ |
| POST | `/api/auth/google` | `{"googleToken":"...","email":"...","name":"..."}` | `{"token":"..."}` | ❌ |

### Protected Endpoints (Require JWT)

| Method | Endpoint | Purpose | Header |
|--------|----------|---------|--------|
| GET | `/api/menu` | Get restaurants | `Authorization: Bearer <token>` |
| GET | `/api/orders` | Get user orders | `Authorization: Bearer <token>` |
| POST | `/api/orders` | Create order | `Authorization: Bearer <token>` |

---

## 🗄️ Database Quick Reference

### User Table Fields
```
id              → BIGINT AUTO_INCREMENT
phone_number    → VARCHAR(10) UNIQUE NOT NULL
otp             → VARCHAR(6)
otp_expiry      → BIGINT (milliseconds timestamp)
otp_verified    → BOOLEAN DEFAULT FALSE
email           → VARCHAR(255)
provider        → VARCHAR(50) ('LOCAL' or 'GOOGLE')
created_at      → TIMESTAMP
```

### Sample Queries
```sql
-- Find user by phone
SELECT * FROM user WHERE phone_number = '9876543210';

-- Count users
SELECT COUNT(*) FROM user;

-- Users verified via OTP
SELECT COUNT(*) FROM user WHERE otp_verified = TRUE;

-- Google users
SELECT COUNT(*) FROM user WHERE provider = 'GOOGLE';

-- Clear expired OTPs
UPDATE user SET otp = NULL, otp_expiry = NULL 
WHERE otp_expiry < UNIX_TIMESTAMP() * 1000;
```

---

## 📝 Key File Paths

### Backend

```
backend/
├── pom.xml                           ← Dependencies & Java version (21)
├── mvnw & mvnw.cmd                   ← Maven wrapper
└── src/main/java/com/example/backend/
    ├── BackendApplication.java       ← @SpringBootApplication
    ├── controller/
    │   └── AuthController.java       ← /api/auth/* endpoints
    ├── service/
    │   └── AuthService.java          ← sendOtp(), verifyOtp()
    ├── entity/
    │   └── User.java                 ← OTP fields
    ├── dto/
    │   ├── SendOtpRequest.java       ← NEW
    │   └── VerifyOtpRequest.java     ← NEW
    ├── security/
    │   ├── JwtUtil.java              ← Token generation
    │   ├── JwtAuthFilter.java        ← Token validation
    │   └── SecurityConfig.java       ← CORS + Auth config
    └── repository/
        └── UserRepository.java       ← findByPhoneNumber()
```

### Frontend

```
frontend/
├── package.json
├── public/index.html
├── src/
│   ├── index.js                      ← GoogleOAuthProvider wrapper
│   ├── Root.js                       ← BrowserRouter + Routes
│   ├── App.js                        ← Route definitions
│   ├── pages/
│   │   ├── AuthPage.js               ← Phone + OTP flow (REWRITTEN)
│   │   ├── Home.js                   ← Restaurant listing
│   │   ├── Menu.js                   ← Menu items
│   │   ├── Cart.js                   ← Shopping cart
│   │   └── Orders.js                 ← Order history
│   ├── components/
│   │   ├── Navbar.js                 ← Auth status (NEW)
│   │   └── PrivateRoute.js           ← Protected routes
│   └── services/
│       └── api.js                    ← API helpers
```

---

## 🔑 Important Constants

### Backend (JwtUtil.java)
```java
SECRET_KEY = "your_secret_key_here"          // Change for production!
EXPIRATION_TIME = 24 * 60 * 60 * 1000       // 24 hours
```

### Backend (AuthService.java)
```java
OTP_LENGTH = 6                               // 6 digits
OTP_EXPIRY_TIME = 5 * 60 * 1000             // 5 minutes
```

### Frontend (api.js)
```javascript
const API_URL = "http://localhost:8080"      // Update for production
const TOKEN_KEY = "token"                    // localStorage key
```

---

## 🔍 Debugging Guide

### Issue: Backend won't start

```bash
# Check if port 8080 is in use
netstat -an | findstr :8080

# Kill process on port 8080
taskkill /PID <PID> /F

# Check MySQL connection
mysql -u root -p -e "SELECT 1"

# View Maven output
mvnw clean compile
```

### Issue: Frontend shows blank page

```bash
# Check browser console for errors
# Open DevTools → Console tab

# Verify API is reachable
curl http://localhost:8080/api/auth/send-otp

# Clear cache
npm start -- --reset-cache

# Restart dev server
Ctrl+C in frontend terminal
npm start
```

### Issue: OTP not working

```bash
# Verify backend logged OTP
# Check backend terminal for: "[Backend] OTP for..."

# Check database
mysql -e "USE fooddelivery; SELECT phone_number, otp FROM user LIMIT 1;"

# Verify JWT secret matches between generate and validate
# Check JwtUtil.java line with SECRET_KEY
```

### Issue: Protected routes redirect to auth

```bash
# Check localStorage for token
# Open DevTools → Application → Local Storage
# Look for "token" key

# Verify JWT is valid (not expired)
# Use jwt.io to decode token

# Check Authorization header format
# Should be: "Authorization: Bearer <token>"
# Not: "Authorization: <token>"
```

---

## 🛠️ Common Tasks

### Update Google Client ID

**File:** `frontend/src/index.js`

```javascript
// Line ~9: Replace YOUR_GOOGLE_CLIENT_ID
<GoogleOAuthProvider clientId="YOUR_ACTUAL_GOOGLE_CLIENT_ID">
```

### Change JWT Secret

**File:** `backend/src/main/java/com/example/backend/security/JwtUtil.java`

```java
// Line ~15: Update SECRET_KEY
private static final String SECRET_KEY = "your_new_secret_key_at_least_256bits";
```

### Change OTP Expiry Time

**File:** `backend/src/main/java/com/example/backend/service/AuthService.java`

```java
// Line ~30: Update OTP_EXPIRY_TIME (in milliseconds)
private static final long OTP_EXPIRY_TIME = 10 * 60 * 1000;  // 10 minutes
```

### Add SMS Integration

**File:** `backend/src/main/java/com/example/backend/service/AuthService.java`

Replace:
```java
System.out.println("OTP for " + phoneNumber + ": " + otp);
```

With:
```java
twilioService.sendSms(phoneNumber, "Your OTP is: " + otp);
// OR
awsSnsService.publishSms(phoneNumber, "Your OTP is: " + otp);
```

### Add Rate Limiting

**File:** `backend/src/main/java/com/example/backend/security/SecurityConfig.java`

```java
// Add to SecurityFilterChain
http.sessionManagement(session -> 
    session.sessionFixationProtection(SessionFixationProtectionStrategy.MIGRATEATTRIBUTE)
);

// Use @RateLimiter annotation on endpoints
@RateLimiter(limit = 3, timeUnit = TimeUnit.MINUTES)
@PostMapping("/send-otp")
public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest request) { ... }
```

---

## 📊 Performance Tuning

### Database Indexes
```sql
-- Add for faster lookups
CREATE INDEX idx_phone_number ON user(phone_number);
CREATE INDEX idx_email ON user(email);
CREATE INDEX idx_provider ON user(provider);
CREATE INDEX idx_user_id ON order(user_id);
```

### Caching OTP Verification
```java
// Add to AuthService (optional)
@Cacheable(value = "otpCache", key = "#phoneNumber")
public User getUserByPhone(String phoneNumber) {
    return userRepository.findByPhoneNumber(phoneNumber).orElse(null);
}
```

### Frontend Optimization
```bash
# Enable gzip compression (production)
npm run build

# Analyze bundle size
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

---

## 🚀 Deployment Checklist

- [ ] Change JWT_SECRET_KEY to strong random value
- [ ] Setup environment variables (.env files)
- [ ] Enable HTTPS/TLS certificates
- [ ] Configure MySQL for production (not root user)
- [ ] Setup automated backups
- [ ] Enable logging and monitoring
- [ ] Configure rate limiting
- [ ] Setup CORS for production domain
- [ ] Remove debug logs (System.out.println)
- [ ] Set spring.jpa.show-sql=false
- [ ] Test all endpoints with production database
- [ ] Setup CI/CD pipeline
- [ ] Configure load balancer (if needed)
- [ ] Setup SMS provider (Twilio, AWS SNS)
- [ ] Configure Google OAuth for production domain

---

## 📞 Quick Fixes

### "Port 8080 already in use"
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### "Cannot connect to MySQL"
```bash
# Start MySQL service
# Windows Service
net start MySQL80

# Or via Command Line
mysqld --console
```

### "npm dependencies error"
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### "React Router errors"
```bash
# Verify Root.js has BrowserRouter
# Check no duplicate <BrowserRouter> elements
# Ensure App.js uses <Routes> not <BrowserRouter>
```

---

## 📚 Documentation Links

- [Java 21 Docs](https://docs.oracle.com/en/java/javase/21/)
- [Spring Boot 3.2](https://spring.io/projects/spring-boot)
- [JJWT Library](https://github.com/jwtk/jjwt)
- [React 18 Docs](https://react.dev)
- [React Router v6](https://reactrouter.com/en/main)
- [MySQL 8.0](https://dev.mysql.com/doc/refman/8.0/en/)

---

## 🎯 Architecture Decisions

| Decision | Reason |
|----------|--------|
| Phone instead of Email | More direct for users, fewer typos, SMS integration ready |
| OTP 6-digit numeric | Standard, easy to remember, SMS friendly |
| 5-minute OTP expiry | Balance between security and user convenience |
| JWT tokens (not sessions) | Stateless, scalable, works with microservices |
| localStorage (frontend) | Simple for development, use httpOnly cookies in production |
| Spring Security filters | Industry standard, battle-tested, secure |
| MySQL over SQLite | Production-ready, multi-user support, transaction support |

---

## 🔐 Security Best Practices Implemented

✅ OTP expires after 5 minutes
✅ JWT tokens signed with HMAC-SHA256
✅ Phone number is unique in database
✅ OTP cleared after verification
✅ JWT required for protected routes
✅ No passwords stored in database
✅ CORS configured
✅ HTTP-only flag ready (use in production)
✅ No sensitive data in JWT payload
✅ Rate limiting ready (implement in production)

---

## 💾 Backup & Recovery

### Backup Database
```bash
mysqldump -u root -p fooddelivery > backup.sql
```

### Restore Database
```bash
mysql -u root -p < backup.sql
```

### Backup Code
```bash
# Using Git
git status
git add .
git commit -m "Add OTP authentication"
git push origin main

# Manual backup
xcopy /E /I backend backend_backup
xcopy /E /I frontend frontend_backup
```

---

## 📈 Monitoring Commands

### Check Application Health
```bash
# Backend is running
curl http://localhost:8080

# Frontend is running
curl http://localhost:3000

# API is responsive
curl http://localhost:8080/api/auth/send-otp
```

### Monitor Logs
```bash
# Backend logs (check terminal where mvnw runs)
# Look for: "Started BackendApplication"

# Frontend logs (check terminal where npm start runs)
# Look for: "Compiled successfully"
```

### Database Monitoring
```sql
-- Active connections
SHOW PROCESSLIST;

-- Table sizes
SELECT table_name, 
       ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables 
WHERE table_schema = 'fooddelivery';

-- User count
SELECT COUNT(*) as total_users FROM user;
```

---

**Last Updated:** Post-OTP Implementation  
**Status:** ✅ Ready for Development & Testing  
**Version:** 1.0.0

