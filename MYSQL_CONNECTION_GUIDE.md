# 🔌 MySQL Connection Guide - FoodieHub

## Current Configuration

### Connection Details
```properties
Host: localhost
Port: 3306
Database: foodiehub
Username: root
Password: (empty/no password)
```

### Spring Boot Configuration
**File**: `backend/src/main/resources/application.properties`

```properties
# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/foodiehub?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true
```

---

## How to Change MySQL Connection

### Option 1: Change Password

If your MySQL root user has a password:

1. Open `backend/src/main/resources/application.properties`
2. Update this line:
   ```properties
   spring.datasource.password=your_password_here
   ```

### Option 2: Change Username

If you want to use a different MySQL user:

1. Open `backend/src/main/resources/application.properties`
2. Update these lines:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### Option 3: Change Database Name

If you want to use a different database:

1. Open `backend/src/main/resources/application.properties`
2. Update this line:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   ```

### Option 4: Change Host/Port

If MySQL is on a different server or port:

1. Open `backend/src/main/resources/application.properties`
2. Update this line:
   ```properties
   spring.datasource.url=jdbc:mysql://your_host:your_port/foodiehub?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   ```

---

## Connection String Breakdown

```
jdbc:mysql://localhost:3306/foodiehub?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
```

| Part | Description | Current Value |
|------|-------------|---------------|
| `jdbc:mysql://` | Protocol | MySQL JDBC |
| `localhost` | Host | Local machine |
| `3306` | Port | Default MySQL port |
| `foodiehub` | Database name | foodiehub |
| `createDatabaseIfNotExist=true` | Auto-create DB | Enabled |
| `useSSL=false` | SSL connection | Disabled (local dev) |
| `serverTimezone=UTC` | Timezone | UTC |

---

## Testing MySQL Connection

### Method 1: Using MySQL Workbench
1. Open MySQL Workbench
2. Click "+" to create new connection
3. Enter:
   - Connection Name: FoodieHub
   - Hostname: localhost
   - Port: 3306
   - Username: root
   - Password: (leave empty or enter your password)
4. Click "Test Connection"
5. If successful, click "OK"

### Method 2: Using Command Line
```bash
mysql -u root -p
# Press Enter (no password) or type your password
```

Then check the database:
```sql
SHOW DATABASES;
USE foodiehub;
SHOW TABLES;
```

### Method 3: Using Backend API
```bash
# Test if backend can connect
curl http://localhost:8080/api/test
```

If you get "Backend is running successfully", the connection works!

---

## Common Connection Issues

### Issue 1: "Access denied for user 'root'@'localhost'"
**Cause**: Wrong username or password

**Solution**:
1. Reset MySQL root password
2. Or update `application.properties` with correct credentials

### Issue 2: "Communications link failure"
**Cause**: MySQL server not running

**Solution**:
```bash
# Windows
net start MySQL80

# Or start from Services (services.msc)
```

### Issue 3: "Unknown database 'foodiehub'"
**Cause**: Database doesn't exist and auto-create failed

**Solution**:
```sql
CREATE DATABASE foodiehub;
```

### Issue 4: "Connection refused"
**Cause**: Wrong host or port

**Solution**:
1. Check MySQL is running on port 3306
2. Update `application.properties` with correct port

### Issue 5: "The server time zone value 'XXX' is unrecognized"
**Cause**: Timezone issue

**Solution**: Already handled in config with `serverTimezone=UTC`

---

## Verify Connection Status

### Check Backend Logs
When backend starts, look for:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

This means connection is successful!

### Check Database Tables
After backend starts, verify tables were created:
```sql
USE foodiehub;
SHOW TABLES;
```

You should see 13 tables:
- addresses
- favorites
- menu_items
- order_items
- orders
- promo_codes
- referrals
- restaurants
- reviews
- subscriptions
- users
- wallet_transactions
- wallets

---

## Connection Pool Settings (Advanced)

If you need to tune connection pool:

```properties
# HikariCP Settings
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
```

---

## Security Best Practices

### For Development
✅ Current setup is fine:
- No password for local MySQL
- SSL disabled for localhost
- Debug logging enabled

### For Production
⚠️ You should:
1. Use strong password
2. Enable SSL
3. Use environment variables
4. Disable debug logging
5. Use connection pooling

Example production config:
```properties
spring.datasource.url=jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=true&requireSSL=true
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.show-sql=false
logging.level.com.example.backend=INFO
```

---

## Quick Reference

### Current Setup
```
✅ Host: localhost
✅ Port: 3306
✅ Database: foodiehub
✅ User: root
✅ Password: (empty)
✅ Auto-create DB: Yes
✅ SSL: Disabled
✅ Timezone: UTC
```

### Connection Status
- Backend: http://localhost:8080
- Database: localhost:3306/foodiehub
- Tables: 13 created
- Data: Initialized

### Quick Commands
```bash
# Test backend
curl http://localhost:8080/api/test

# Test database
mysql -u root -e "USE foodiehub; SHOW TABLES;"

# Check restaurants
curl http://localhost:8080/api/restaurants
```

---

## Need Help?

### Check Connection
1. Is MySQL running? → Check Services
2. Is database created? → Run `SHOW DATABASES;`
3. Are tables created? → Run `SHOW TABLES;`
4. Is backend running? → Check http://localhost:8080/api/test

### Still Having Issues?
1. Check backend logs for errors
2. Verify MySQL credentials
3. Test connection in MySQL Workbench
4. Check firewall settings
5. Verify MySQL port 3306 is open

---

**Last Updated**: February 23, 2026  
**Status**: ✅ Connected and Working
