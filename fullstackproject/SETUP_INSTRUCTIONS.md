# 🚀 FoodieHub Setup Instructions

## Current Status
✅ Backend entities created (13 tables)
✅ Sample data SQL file ready
✅ Data initialization service created
⏳ Need to populate database with restaurants and menu items

## Option 1: Using API Endpoint (Easiest! ⭐)

1. Make sure backend is running on port 8080
2. Open your browser or use curl:
   ```bash
   curl -X POST http://localhost:8080/api/init-data
   ```
   Or simply visit in browser: http://localhost:8080/api/init-data (use POST method)

3. You should see: "Sample data initialized successfully! Added 8 restaurants, 48 menu items, and 7 promo codes."

4. Refresh your frontend - restaurants should appear!

## Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL server (localhost:3306, user: root, no password)
3. Select the `foodiehub` database
4. Open the SQL file: `backend/src/main/resources/sample-data.sql`
5. Click "Execute" (⚡ lightning bolt icon)
6. Verify data:
   ```sql
   SELECT COUNT(*) FROM restaurants;  -- Should show 8
   SELECT COUNT(*) FROM menu_items;   -- Should show 48
   SELECT COUNT(*) FROM promo_codes;  -- Should show 7
   ```

## Option 2: Using Command Line

If MySQL is in your PATH, run:
```bash
mysql -u root foodiehub < backend/src/main/resources/sample-data.sql
```

## Option 3: Manual Copy-Paste

1. Open MySQL Workbench
2. Connect to `foodiehub` database
3. Open a new SQL tab
4. Copy the entire content from `backend/src/main/resources/sample-data.sql`
5. Paste and execute

## What Gets Added

### 8 Sample Restaurants:
1. **Pizza Palace** - Italian pizzas (4.5⭐)
2. **Spice Garden** - Indian cuisine (4.7⭐)
3. **Burger Barn** - American burgers (4.3⭐)
4. **Sushi Station** - Japanese sushi (4.8⭐)
5. **Taco Fiesta** - Mexican food (4.4⭐)
6. **Noodle House** - Chinese noodles (4.6⭐)
7. **Biryani Blues** - Hyderabadi biryani (4.9⭐)
8. **Cafe Delight** - Continental cafe (4.2⭐)

### 48 Menu Items:
- 6 items per restaurant
- Mix of veg and non-veg
- Various categories (starters, mains, desserts, beverages)
- Realistic pricing (₹49 - ₹549)

### 7 Promo Codes:
- FIRST50 - 50% off on first order
- SAVE20 - Flat ₹20 off
- WELCOME - 30% off up to ₹150
- FREESHIP - Free delivery
- MEGA100 - ₹100 off on orders above ₹500
- WEEKEND25 - 25% off on weekends
- LUNCH15 - 15% off on lunch orders

## Verify Setup

After executing the SQL:

1. **Check Backend Logs**
   - Restart backend if needed: `cd backend && ./mvnw spring-boot:run`
   - Should see "Hibernate: select..." queries

2. **Test API Endpoints**
   ```bash
   # Get all restaurants
   curl http://localhost:8080/api/restaurants
   
   # Get menu items for Pizza Palace (ID: 1)
   curl http://localhost:8080/api/menu/restaurant/1
   ```

3. **Check Frontend**
   - Open http://localhost:3000
   - Home page should show 8 restaurants
   - Click any restaurant to see menu items

## Troubleshooting

### If restaurants don't show up:
1. Check if backend is running on port 8080
2. Check MySQL connection in backend logs
3. Verify tables exist: `SHOW TABLES;` in MySQL
4. Check if data was inserted: `SELECT * FROM restaurants;`

### If you see "Empty Set":
- Make sure you executed the SQL file in the correct database (`foodiehub`)
- Check for SQL errors in MySQL Workbench output

### Restaurant Login Credentials:
The sample restaurants have placeholder passwords. To test restaurant features:
1. Use the Restaurant Registration page
2. Register a new restaurant
3. Or update passwords in database manually

## Next Steps After Setup

Once data is loaded:
1. ✅ Browse restaurants on home page
2. ✅ View menu items
3. ✅ Add items to cart
4. ✅ Place orders
5. ✅ Test promo codes
6. ✅ Add addresses
7. ✅ Save favorites
8. ✅ Write reviews

## Database Schema

All 13 tables should exist:
- users
- restaurants ⭐ (8 sample records)
- menu_items ⭐ (48 sample records)
- orders
- order_items
- addresses
- favorites
- reviews
- promo_codes ⭐ (7 sample records)
- wallets
- wallet_transactions
- referrals
- subscriptions

---

**Ready to go!** Execute the SQL file and your FoodieHub will be fully populated with sample data.
