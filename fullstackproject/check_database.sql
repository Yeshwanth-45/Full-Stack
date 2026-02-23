-- Quick database check queries
USE foodiehub;

-- Check if tables exist
SHOW TABLES;

-- Count records in each table
SELECT 'restaurants' as table_name, COUNT(*) as count FROM restaurants
UNION ALL
SELECT 'menu_items', COUNT(*) FROM menu_items
UNION ALL
SELECT 'promo_codes', COUNT(*) FROM promo_codes;

-- Show restaurant names
SELECT id, name, email FROM restaurants;

-- Show menu items
SELECT id, name, restaurant_id, price FROM menu_items LIMIT 10;
