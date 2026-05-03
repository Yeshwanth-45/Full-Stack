-- Update restaurant images with unique Unsplash food images
-- Run this in MySQL Workbench or command line

USE foodiehub;

-- Update Pizza Palace (Italian - Pizza)
UPDATE restaurants 
SET image_url = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop'
WHERE name = 'Pizza Palace';

-- Update Spice Garden (Indian - Curry)
UPDATE restaurants 
SET image_url = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop'
WHERE name = 'Spice Garden';

-- Update Burger Barn (American - Burger)
UPDATE restaurants 
SET image_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop'
WHERE name = 'Burger Barn';

-- Update Sushi Station (Japanese - Sushi)
UPDATE restaurants 
SET image_url = 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop'
WHERE name = 'Sushi Station';

-- Update Taco Fiesta (Mexican - Tacos)
UPDATE restaurants 
SET image_url = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop'
WHERE name = 'Taco Fiesta';

-- Update Noodle House (Chinese - Noodles)
UPDATE restaurants 
SET image_url = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop'
WHERE name = 'Noodle House';

-- Update Biryani Blues (Indian - Biryani)
UPDATE restaurants 
SET image_url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop'
WHERE name = 'Biryani Blues';

-- Update Cafe Delight (Continental - Cafe)
UPDATE restaurants 
SET image_url = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop'
WHERE name = 'Cafe Delight';

-- Verify the updates
SELECT id, name, image_url FROM restaurants ORDER BY id;
