# 🚀 Quick Start Guide - Phone + OTP Authentication

## Prerequisites

- **Java 21 LTS** installed
- **Node.js 16+** with npm
- **MySQL 8.0+** running
- **Git** (optional)

---

## Step 1: Setup Database (30 seconds)

### Ensure MySQL is running

```bash
# Windows - if MySQL Service not running
net start MySQL80

# Or start MySQL Workbench
```

### Create database

```sql
CREATE DATABASE IF NOT EXISTS fooddelivery;
USE fooddelivery;
```

No need to create tables - Hibernate will auto-create them on first run.

---

## Step 2: Start Backend (1 minute)

### Open Terminal 1 - Backend

```bash
cd backend
mvnw spring-boot:run
```

**Expected Output:**
```
[INFO] Tomcat started on port(s): 8080 (http)
[INFO] Started BackendApplication in XX.XXX seconds
```

✅ **Backend running on:** http://localhost:8080

---

## Step 3: Start Frontend (1 minute)

### Open Terminal 2 - Frontend

```bash
cd frontend
npm install   # First time only
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view fooddelivery in the browser.

  Local:            http://localhost:3000
```

✅ **Frontend running on:** http://localhost:3000

---

## Step 4: Test OTP Flow (2 minutes)

### Scenario: User Login with OTP

**Step 1:** Open browser to `http://localhost:3000`

You should see:
```
🔐 Food Delivery App
Secure Phone + OTP Authentication

[Input: Enter phone number (10 digits)]
[Button: 📱 Send OTP]

---OR---

[Google Sign-In Button]
```

**Step 2:** Enter a phone number

```
Phone: 9876543210
```

**Step 3:** Click "📱 Send OTP"

**In Browser:**
- Message appears: "✅ OTP sent to 9876543210. Check your SMS."
- UI switches to OTP verification screen

**In Backend Terminal:**
- Log shows: `[Backend] OTP for 9876543210: 123456`

**Step 4:** Copy the OTP from backend console

```
OTP: 123456
```

**Step 5:** Enter OTP in frontend and click "✅ Verify OTP"

**Expected Result:**
- ✅ Message: "Logged in successfully!"
- ✅ Page redirects to Home page
- ✅ You see the food ordering interface

---

## Step 5: Explore App (Optional)

### Available Pages

| Page | Path | Protected |
|------|------|-----------|
| Home | `/` | ✅ Yes |
| Menu | `/menu` | ✅ Yes |
| Cart | `/cart` | ✅ Yes |
| Orders | `/orders` | ✅ Yes |
| Login | `/auth` | ❌ No |

### Logout

Click **Logout** in Navbar → Returns to `/auth` page

---

## Troubleshooting

### Issue: "Cannot connect to server"

```bash
# Check if backend is running
netstat -an | findstr :8080

# Restart backend
cd backend
mvnw spring-boot:run
```

### Issue: Database connection error

```bash
# Verify MySQL connection
mysql -u root -p -e "USE fooddelivery; SELECT * FROM user;"

# If database doesn't exist
mysql -u root -p -e "CREATE DATABASE fooddelivery;"
```

### Issue: Frontend shows blank page

```bash
# Check for console errors (Dev Tools → Console)
# Verify backend is accessible
curl http://localhost:8080/api/auth/send-otp

# Restart frontend
cd frontend
npm start
```

### Issue: OTP not appearing in backend console

```bash
# Make sure you're looking at the correct terminal
# Look for line: "[Backend] OTP for <phone>: <otp>"

# If not there, check backend logs for errors
# Scroll up in backend terminal
```

---

## Testing Other Features

### Test Google Sign-In

1. Click "Google Sign-In" button on AuthPage
2. Select your Google account
3. Should auto-login and redirect

**Note:** Requires Google Client ID to be configured (see IMPLEMENTATION_SUMMARY.md)

### Test Protected Routes

1. After logging in, click on "Menu" → See restaurants
2. Click on a restaurant → See menu items
3. Add items to cart → Go to Cart page
4. Logout → Try accessing `/menu` directly
5. Should redirect to `/auth` page

### Test Multiple Logins

1. Logout from current session
2. Login with different phone number
3. Each user has separate cart and orders

---

## Project Structure

```
fullstackproject/
├── backend/                    # Spring Boot 3.2.12, Java 21
│   ├── pom.xml                # Maven dependencies
│   ├── mvnw & mvnw.cmd        # Maven wrapper
│   └── src/
│       ├── main/java/com/example/backend/
│       │   ├── entity/
│       │   │   ├── User.java (phoneNumber + OTP)
│       │   │   ├── Order.java
│       │   │   └── OrderItem.java
│       │   ├── dto/
│       │   │   ├── SendOtpRequest.java (NEW)
│       │   │   ├── VerifyOtpRequest.java (NEW)
│       │   │   ├── LoginRequest.java
│       │   │   └── RegisterRequest.java
│       │   ├── service/
│       │   │   ├── AuthService.java (sendOtp, verifyOtp)
│       │   │   └── OrderService.java
│       │   ├── controller/
│       │   │   ├── AuthController.java (/send-otp, /verify-otp, /google)
│       │   │   ├── MenuController.java
│       │   │   ├── OrderController.java
│       │   │   └── RestaurantController.java
│       │   ├── repository/
│       │   │   ├── UserRepository.java (findByPhoneNumber)
│       │   │   └── OrderRepository.java
│       │   └── security/
│       │       ├── JwtUtil.java (phoneNumber-based tokens)
│       │       ├── JwtAuthFilter.java (phone extraction)
│       │       └── SecurityConfig.java
│       └── resources/
│           └── application.properties
│
└── frontend/                   # React + React Router v6
    ├── package.json           # Dependencies + scripts
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js (GoogleOAuthProvider wrapper)
        ├── Root.js (BrowserRouter + Routes)
        ├── App.js (Route definitions)
        ├── pages/
        │   ├── AuthPage.js (Phone + OTP + Google)
        │   ├── Home.js (Restaurant listing)
        │   ├── Menu.js (Menu items)
        │   ├── Cart.js (Cart management)
        │   ├── Orders.js (Order history)
        │   ├── Login.js (deprecated)
        │   ├── Register.js (deprecated)
        │   └── Checkout.js (deprecated)
        └── components/
            ├── Navbar.js (Auth status + Logout)
            ├── PrivateRoute.js (Protected routes)
            ├── RestaurantCard.js
            ├── MenuItem.js
            └── CartItem.js
```

---

## Key Files Changed

### Backend OTP Implementation

**User.java** - Added OTP fields
```java
@Column(unique = true)
private String phoneNumber;
private String otp;
private Long otpExpiry;
private Boolean otpVerified = false;
```

**AuthService.java** - OTP logic
```java
public String sendOtp(String phoneNumber) { ... }
public String verifyOtp(String phoneNumber, String otp) { ... }
public String googleLogin(String email, String name) { ... }
```

**AuthController.java** - New endpoints
```java
@PostMapping("/send-otp")    // Send OTP to phone
@PostMapping("/verify-otp")  // Verify OTP, return JWT
@PostMapping("/google")      // Google OAuth
```

### Frontend OTP Implementation

**AuthPage.js** - 2-step OTP flow
```javascript
const [step, setStep] = useState("phone"); // or "otp" or "success"

// Phone entry → Send OTP
// OTP entry → Verify OTP → Get JWT → Redirect
```

**Navbar.js** - Show auth status
```javascript
{token ? <LogoutButton /> : <LoginLink />}
```

**PrivateRoute.js** - Protect routes
```javascript
const token = localStorage.getItem("token");
return token ? <Outlet /> : <Navigate to="/auth" />;
```

---

## Security Configuration

### JWT Settings (Update for Production)

**File:** `backend/src/main/java/com/example/backend/security/JwtUtil.java`

```java
private static final String SECRET_KEY = "your_secret_key_here";  // ← Change this
private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;  // 24 hours
```

### OTP Settings (Update for Production)

**File:** `backend/src/main/java/com/example/backend/service/AuthService.java`

```java
private static final int OTP_LENGTH = 6;
private static final long OTP_EXPIRY_TIME = 5 * 60 * 1000;  // 5 minutes

// TODO: Replace System.out.println() with actual SMS service
twilioService.sendSms(phoneNumber, "Your OTP is: " + otp);
```

---

## Next Steps (After Testing)

### 1. Configure Google Sign-In
```bash
# Get Client ID from Google Cloud Console
# Update: frontend/src/index.js
<GoogleOAuthProvider clientId="YOUR_ACTUAL_CLIENT_ID">
```

### 2. Setup SMS Integration
```bash
# Choose SMS provider (Twilio, AWS SNS, etc.)
# Replace System.out.println() in AuthService.java
# Add SMS credentials to application.properties
```

### 3. Deploy to Production
```bash
# Backend: Package as JAR, deploy to server
mvnw package -DskipTests

# Frontend: Build and deploy to CDN/hosting
npm run build
```

---

## Useful Commands

### Backend

```bash
# Build only
mvnw clean compile

# Build + Run Tests
mvnw clean package

# Run server
mvnw spring-boot:run

# Stop server
Ctrl + C
```

### Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Stop dev server
Ctrl + C
```

### Database

```bash
# Login to MySQL
mysql -u root -p

# Check users
USE fooddelivery;
SELECT phone_number, otp_verified, provider FROM user;

# Backup database
mysqldump -u root -p fooddelivery > backup.sql
```

---

## API Testing with cURL

### Send OTP
```bash
curl -X POST http://localhost:8080/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210","otp":"123456"}'
```

### Access Protected Route
```bash
TOKEN="<jwt_token_from_verify_otp>"
curl -X GET http://localhost:8080/api/menu \
  -H "Authorization: Bearer $TOKEN"
```

---

## Support & Documentation

- **Backend Testing Guide:** See `TESTING_OTP.md`
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`
- **API Reference:** See AuthController.java comments
- **JWT Docs:** https://github.com/jwtk/jjwt
- **React Docs:** https://react.dev

---

## ✅ Checklist

- [ ] MySQL running and database created
- [ ] Backend started successfully (port 8080)
- [ ] Frontend started successfully (port 3000)
- [ ] Can see AuthPage with phone input
- [ ] Can send OTP and see code in backend console
- [ ] Can verify OTP and get JWT token
- [ ] Logged in and redirected to Home page
- [ ] Can logout and return to auth page

---

**Ready to start? Run these 3 commands in separate terminals:**

```bash
# Terminal 1 - Backend
cd backend && mvnw spring-boot:run

# Terminal 2 - Frontend
cd frontend && npm start

# Terminal 3 - Open in browser
start http://localhost:3000
```

Enjoy your phone + OTP authentication system! 🎉

