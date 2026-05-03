# 🚀 Quick Start Guide

## Initialize Sample Data (3 Easy Ways)

### Method 1: HTML Page (Easiest!)
1. Open `INITIALIZE_DATA.html` in your browser
2. Click "Initialize Sample Data" button
3. Done! ✅

### Method 2: Using curl
```bash
curl -X POST http://localhost:8080/api/init-data
```

### Method 3: Using Browser
Visit: `http://localhost:8080/api/init-data` (use POST method or browser extension)

---

## What Gets Added

### 8 Restaurants 🍽️
1. **Pizza Palace** (Italian) - 4.5⭐
2. **Spice Garden** (Indian) - 4.7⭐
3. **Burger Barn** (American) - 4.3⭐
4. **Sushi Station** (Japanese) - 4.8⭐
5. **Taco Fiesta** (Mexican) - 4.4⭐
6. **Noodle House** (Chinese) - 4.6⭐
7. **Biryani Blues** (Indian) - 4.9⭐
8. **Cafe Delight** (Continental) - 4.2⭐

### 48 Menu Items 🍕
- 6 items per restaurant
- Prices: ₹49 - ₹549
- Mix of veg/non-veg
- Bestsellers marked

### 7 Promo Codes 🎁
- **FIRST50** - 50% off first order
- **SAVE20** - Flat ₹20 off
- **WELCOME** - 30% off up to ₹150
- **FREESHIP** - Free delivery
- **MEGA100** - ₹100 off on ₹500+
- **WEEKEND25** - 25% off weekends
- **LUNCH15** - 15% off lunch

---

## Verify Setup

### Check Backend
```bash
# Test backend
curl http://localhost:8080/api/test

# Get restaurants
curl http://localhost:8080/api/restaurants

# Get menu items for Pizza Palace
curl http://localhost:8080/api/menu/restaurant/1
```

### Check Frontend
1. Open http://localhost:3000
2. You should see 8 restaurants
3. Click any restaurant to see menu
4. Add items to cart
5. Try promo codes at checkout

---

## Database Tables (13 Total)

✅ Core Tables:
- users
- restaurants (8 records)
- menu_items (48 records)
- orders
- order_items

✅ Feature Tables:
- addresses
- favorites
- reviews
- promo_codes (7 records)

✅ Advanced Tables:
- wallets
- wallet_transactions
- referrals
- subscriptions

---

## Next Steps

1. ✅ Initialize data (you're here!)
2. Browse restaurants on home page
3. Add items to cart
4. Create an account
5. Place your first order
6. Try promo codes
7. Add delivery addresses
8. Save favorite restaurants
9. Write reviews

---

## Troubleshooting

### "Backend is not running"
```bash
cd backend
./mvnw spring-boot:run
```

### "Data already exists"
- This is normal! Data won't be duplicated
- Your existing data is safe

### "Connection refused"
- Check if MySQL is running
- Verify database 'foodiehub' exists
- Check backend logs for errors

### "Empty restaurants list"
- Make sure initialization was successful
- Check backend logs
- Verify MySQL connection in application.properties

---

## Tech Stack

- **Backend**: Spring Boot 3.2.12 + Java 17
- **Frontend**: React 18.x
- **Database**: MySQL 8.0
- **Port**: Backend (8080), Frontend (3000)

---

**Ready to order some food? 🍕🍔🍜**

Visit: http://localhost:3000
