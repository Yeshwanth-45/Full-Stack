-- FoodieHub Sample Data
-- Run this after starting the backend for the first time

USE foodiehub;

-- Insert Sample Restaurants
INSERT INTO restaurants (name, email, password, owner_name, phone, description, address, city, cuisine_type, rating, delivery_time, delivery_fee, is_open, latitude, longitude) VALUES
('Pizza Palace', 'pizza@foodiehub.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Mario Rossi', '9876543210', 'Authentic Italian pizzas with fresh ingredients. Wood-fired oven, traditional recipes.', '123 MG Road, Banjara Hills', 'Hyderabad', 'Italian', 4.5, 30, 40, true, 17.4239, 78.4738),
('Spice Garden', 'spice@foodiehub.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Raj Kumar', '9876543211', 'Traditional Indian cuisine with authentic spices. Family recipes passed down generations.', '456 Jubilee Hills Road', 'Hyderabad', 'Indian', 4.7, 35, 45, true, 17.4326, 78.4071),
('Burger Barn', 'burger@foodiehub.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'John Smith', '9876543212', 'Juicy burgers made with premium beef. American-style fast food done right.', '789 Gachibowli', 'Hyderabad', 'American', 4.3, 25, 35, true, 17.4400, 78.3489),
('Sushi Station', 'sushi@foodiehub.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Takeshi Yamamoto', '9876543213', 'Fresh sushi and Japanese delicacies. Authentic taste of Japan in Hyderabad.', '321 HITEC City', 'Hyderabad', 'Japanese', 4.8, 40, 50, true, 17.4435, 78.3772),
('Taco Fiesta', 'taco@foodiehub.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Carlos Rodriguez', '9876543214', 'Authentic Mexican street food. Tacos, burritos, and more with fresh ingredients.', '555 Madhapur', 'Hyderabad', 'Mexican', 4.4, 30, 40, true, 17.4485, 78.3908),
('Noodle House', 'noodle@foodiehub.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Li Wei', '9876543215', 'Authentic Chinese noodles and dim sum. Traditional recipes from Beijing.', '888 Kondapur', 'Hyderabad', 'Chinese', 4.6, 35, 40, true, 17.4616, 78.3622),
('Biryani Blues', 'biryani@foodiehub.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Ahmed Khan', '9876543216', 'Hyderabadi Biryani specialists. Authentic dum biryani with aromatic spices.', '999 Old City', 'Hyderabad', 'Indian', 4.9, 45, 50, true, 17.3850, 78.4867),
('Cafe Delight', 'cafe@foodiehub.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Sophie Martin', '9876543217', 'Cozy cafe with sandwiches, coffee, and desserts. Perfect for quick bites.', '777 Begumpet', 'Hyderabad', 'Continental', 4.2, 20, 30, true, 17.4399, 78.4983);

-- Insert Menu Items for Pizza Palace (Restaurant ID: 1)
INSERT INTO menu_items (restaurant_id, name, price, category, description, image_url, is_veg, is_spicy, is_bestseller, preparation_time, hygiene_rating, available, is_gluten_free, is_jain, is_keto, spice_level, calories) VALUES
(1, 'Margherita Pizza', 299, 'Pizza', 'Classic pizza with tomato sauce, mozzarella, and fresh basil', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002', true, false, true, 20, 'Excellent', true, false, true, false, 'Mild', 250),
(1, 'Pepperoni Pizza', 399, 'Pizza', 'Loaded with pepperoni, mozzarella, and Italian herbs', 'https://images.unsplash.com/photo-1628840042765-356cda07504e', false, false, true, 20, 'Excellent', true, false, false, false, 'Mild', 320),
(1, 'Veggie Supreme', 349, 'Pizza', 'Bell peppers, onions, mushrooms, olives, and corn', 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f', true, false, false, 20, 'Excellent', true, false, true, false, 'Mild', 280),
(1, 'BBQ Chicken Pizza', 429, 'Pizza', 'Grilled chicken with BBQ sauce, onions, and cheese', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', false, false, true, 25, 'Excellent', true, false, false, false, 'Medium', 380),
(1, 'Garlic Bread', 129, 'Sides', 'Crispy bread with garlic butter and herbs', 'https://images.unsplash.com/photo-1573140401552-388e3ead0b5e', true, false, false, 10, 'Excellent', true, false, true, false, 'Mild', 180),
(1, 'Cheese Burst Pizza', 449, 'Pizza', 'Extra cheese-filled crust with your choice of toppings', 'https://images.unsplash.com/photo-1513104890138-7c749659a591', true, false, true, 25, 'Excellent', true, false, true, false, 'Mild', 420);

-- Insert Menu Items for Spice Garden (Restaurant ID: 2)
INSERT INTO menu_items (restaurant_id, name, price, category, description, image_url, is_veg, is_spicy, is_bestseller, preparation_time, hygiene_rating, available, is_gluten_free, is_jain, is_keto, spice_level, calories) VALUES
(2, 'Butter Chicken', 349, 'Main Course', 'Creamy tomato curry with tender chicken pieces', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398', false, true, true, 25, 'Excellent', true, true, false, false, 'Medium', 420),
(2, 'Paneer Tikka', 299, 'Starters', 'Grilled cottage cheese marinated in spices', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8', true, true, true, 20, 'Excellent', true, true, true, false, 'Medium', 280),
(2, 'Dal Makhani', 249, 'Main Course', 'Black lentils cooked in butter and cream', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d', true, false, true, 30, 'Excellent', true, true, true, false, 'Mild', 320),
(2, 'Chicken Biryani', 329, 'Rice', 'Aromatic basmati rice with spiced chicken', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8', false, true, true, 35, 'Excellent', true, true, false, false, 'Hot', 480),
(2, 'Naan Bread', 49, 'Breads', 'Soft Indian flatbread baked in tandoor', 'https://images.unsplash.com/photo-1601050690597-df0568f70950', true, false, false, 10, 'Excellent', true, false, true, false, 'Mild', 120),
(2, 'Gulab Jamun', 99, 'Desserts', 'Sweet milk dumplings in sugar syrup', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc', true, false, false, 5, 'Excellent', true, true, true, false, 'Mild', 180);

-- Insert Menu Items for Burger Barn (Restaurant ID: 3)
INSERT INTO menu_items (restaurant_id, name, price, category, description, image_url, is_veg, is_spicy, is_bestseller, preparation_time, hygiene_rating, available, is_gluten_free, is_jain, is_keto, spice_level, calories) VALUES
(3, 'Classic Beef Burger', 249, 'Burgers', 'Juicy beef patty with lettuce, tomato, and special sauce', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', false, false, true, 15, 'Good', true, false, false, false, 'Mild', 520),
(3, 'Veggie Burger', 199, 'Burgers', 'Grilled veggie patty with fresh vegetables', 'https://images.unsplash.com/photo-1520072959219-c595dc870360', true, false, false, 15, 'Good', true, false, true, false, 'Mild', 380),
(3, 'Chicken Burger', 229, 'Burgers', 'Crispy fried chicken with mayo and lettuce', 'https://images.unsplash.com/photo-1606755962773-d324e0a13086', false, false, true, 15, 'Good', true, false, false, false, 'Mild', 480),
(3, 'French Fries', 99, 'Sides', 'Crispy golden fries with ketchup', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877', true, false, true, 10, 'Good', true, true, true, false, 'Mild', 320),
(3, 'Onion Rings', 129, 'Sides', 'Crispy battered onion rings', 'https://images.unsplash.com/photo-1639024471283-03518883512d', true, false, false, 10, 'Good', true, false, true, false, 'Mild', 280),
(3, 'Chocolate Shake', 149, 'Beverages', 'Thick chocolate milkshake', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699', true, false, false, 5, 'Good', true, true, true, false, 'Mild', 420);

-- Insert Menu Items for Sushi Station (Restaurant ID: 4)
INSERT INTO menu_items (restaurant_id, name, price, category, description, image_url, is_veg, is_spicy, is_bestseller, preparation_time, hygiene_rating, available, is_gluten_free, is_jain, is_keto, spice_level, calories) VALUES
(4, 'California Roll', 399, 'Sushi', 'Crab, avocado, and cucumber wrapped in rice', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', false, false, true, 15, 'Excellent', true, true, false, true, 'Mild', 280),
(4, 'Salmon Nigiri', 449, 'Sushi', 'Fresh salmon on seasoned rice', 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', false, false, true, 10, 'Excellent', true, true, false, true, 'Mild', 220),
(4, 'Vegetable Tempura', 329, 'Appetizers', 'Crispy fried vegetables in light batter', 'https://images.unsplash.com/photo-1541529086526-db283c563270', true, false, false, 15, 'Excellent', true, false, true, false, 'Mild', 320),
(4, 'Miso Soup', 149, 'Soups', 'Traditional Japanese soup with tofu', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84', true, false, false, 10, 'Excellent', true, true, true, false, 'Mild', 80),
(4, 'Dragon Roll', 549, 'Sushi', 'Eel, cucumber, avocado with special sauce', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', false, false, true, 20, 'Excellent', true, true, false, true, 'Mild', 380),
(4, 'Green Tea Ice Cream', 179, 'Desserts', 'Traditional Japanese green tea flavored ice cream', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', true, false, false, 5, 'Excellent', true, true, true, false, 'Mild', 180);

-- Insert Menu Items for Taco Fiesta (Restaurant ID: 5)
INSERT INTO menu_items (restaurant_id, name, price, category, description, image_url, is_veg, is_spicy, is_bestseller, preparation_time, hygiene_rating, available, is_gluten_free, is_jain, is_keto, spice_level, calories) VALUES
(5, 'Chicken Tacos', 249, 'Tacos', 'Grilled chicken with salsa and guacamole', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47', false, true, true, 15, 'Good', true, true, false, false, 'Medium', 320),
(5, 'Veggie Burrito', 229, 'Burritos', 'Rice, beans, vegetables wrapped in tortilla', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f', true, false, false, 15, 'Good', true, false, true, false, 'Mild', 420),
(5, 'Beef Quesadilla', 299, 'Quesadillas', 'Grilled tortilla with beef and cheese', 'https://images.unsplash.com/photo-1618040996337-56904b7850b9', false, true, true, 15, 'Good', true, false, false, false, 'Medium', 480),
(5, 'Nachos Supreme', 199, 'Appetizers', 'Tortilla chips with cheese, salsa, and jalapeños', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d', true, true, true, 10, 'Good', true, true, true, false, 'Hot', 520),
(5, 'Churros', 149, 'Desserts', 'Fried dough pastry with cinnamon sugar', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32', true, false, false, 10, 'Good', true, false, true, false, 'Mild', 280),
(5, 'Guacamole & Chips', 179, 'Appetizers', 'Fresh avocado dip with tortilla chips', 'https://images.unsplash.com/photo-1534939561126-855b8675edd7', true, false, false, 10, 'Good', true, true, true, true, 'Mild', 220);

-- Insert Menu Items for Noodle House (Restaurant ID: 6)
INSERT INTO menu_items (restaurant_id, name, price, category, description, image_url, is_veg, is_spicy, is_bestseller, preparation_time, hygiene_rating, available, is_gluten_free, is_jain, is_keto, spice_level, calories) VALUES
(6, 'Hakka Noodles', 229, 'Noodles', 'Stir-fried noodles with vegetables', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', true, true, true, 15, 'Good', true, false, true, false, 'Medium', 380),
(6, 'Chicken Fried Rice', 249, 'Rice', 'Wok-tossed rice with chicken and vegetables', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b', false, false, true, 15, 'Good', true, false, false, false, 'Mild', 420),
(6, 'Spring Rolls', 149, 'Appetizers', 'Crispy vegetable rolls with sweet chili sauce', 'https://images.unsplash.com/photo-1541529086526-db283c563270', true, false, false, 10, 'Good', true, false, true, false, 'Mild', 220),
(6, 'Manchurian', 199, 'Appetizers', 'Fried vegetable balls in spicy sauce', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58', true, true, true, 15, 'Good', true, false, true, false, 'Hot', 320),
(6, 'Schezwan Noodles', 259, 'Noodles', 'Spicy noodles with Schezwan sauce', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', true, true, true, 15, 'Good', true, false, true, false, 'Hot', 420),
(6, 'Honey Chilli Potato', 179, 'Appetizers', 'Crispy potato tossed in honey chili sauce', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877', true, true, false, 15, 'Good', true, true, true, false, 'Medium', 280);

-- Insert Menu Items for Biryani Blues (Restaurant ID: 7)
INSERT INTO menu_items (restaurant_id, name, price, category, description, image_url, is_veg, is_spicy, is_bestseller, preparation_time, hygiene_rating, available, is_gluten_free, is_jain, is_keto, spice_level, calories) VALUES
(7, 'Hyderabadi Chicken Biryani', 349, 'Biryani', 'Authentic dum biryani with tender chicken', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8', false, true, true, 40, 'Excellent', true, true, false, false, 'Hot', 520),
(7, 'Mutton Biryani', 429, 'Biryani', 'Slow-cooked mutton with aromatic rice', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8', false, true, true, 45, 'Excellent', true, true, false, false, 'Hot', 580),
(7, 'Veg Biryani', 279, 'Biryani', 'Mixed vegetables with fragrant basmati rice', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8', true, true, false, 35, 'Excellent', true, true, true, false, 'Medium', 420),
(7, 'Raita', 79, 'Sides', 'Yogurt with cucumber and spices', 'https://images.unsplash.com/photo-1601050690597-df0568f70950', true, false, false, 5, 'Excellent', true, true, true, false, 'Mild', 80),
(7, 'Double Ka Meetha', 129, 'Desserts', 'Traditional Hyderabadi bread pudding', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc', true, false, false, 10, 'Excellent', true, false, true, false, 'Mild', 320),
(7, 'Mirchi Ka Salan', 149, 'Sides', 'Spicy curry with green chilies', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe', true, true, true, 20, 'Excellent', true, true, true, false, 'Hot', 180);

-- Insert Menu Items for Cafe Delight (Restaurant ID: 8)
INSERT INTO menu_items (restaurant_id, name, price, category, description, image_url, is_veg, is_spicy, is_bestseller, preparation_time, hygiene_rating, available, is_gluten_free, is_jain, is_keto, spice_level, calories) VALUES
(8, 'Club Sandwich', 229, 'Sandwiches', 'Triple-decker with chicken, bacon, and veggies', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af', false, false, true, 15, 'Good', true, false, false, false, 'Mild', 420),
(8, 'Cappuccino', 129, 'Beverages', 'Espresso with steamed milk foam', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d', true, false, true, 5, 'Good', true, true, true, false, 'Mild', 120),
(8, 'Caesar Salad', 249, 'Salads', 'Romaine lettuce with Caesar dressing and croutons', 'https://images.unsplash.com/photo-1546793665-c74683f339c1', true, false, false, 10, 'Good', true, false, true, false, 'Mild', 220),
(8, 'Chocolate Brownie', 149, 'Desserts', 'Warm chocolate brownie with ice cream', 'https://images.unsplash.com/photo-1564355808853-1c8c8e0e5b3d', true, false, true, 10, 'Good', true, false, true, false, 'Mild', 380),
(8, 'Pasta Alfredo', 299, 'Pasta', 'Creamy white sauce pasta with herbs', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9', true, false, true, 20, 'Good', true, false, true, false, 'Mild', 480),
(8, 'Iced Latte', 149, 'Beverages', 'Chilled coffee with milk', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7', true, false, false, 5, 'Good', true, true, true, false, 'Mild', 150);

-- Insert Sample Promo Codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, is_active, usage_limit, usage_count) VALUES
('FIRST50', '50% off on first order', 'PERCENTAGE', 50, 200, 100, true, 1000, 0),
('SAVE20', 'Flat ₹20 off', 'FIXED', 20, 100, NULL, true, NULL, 0),
('WELCOME', '30% off up to ₹150', 'PERCENTAGE', 30, 300, 150, true, 5000, 0),
('FREESHIP', 'Free delivery', 'FIXED', 40, 150, NULL, true, NULL, 0),
('MEGA100', '₹100 off on orders above ₹500', 'FIXED', 100, 500, NULL, true, 2000, 0),
('WEEKEND25', '25% off on weekends', 'PERCENTAGE', 25, 250, 125, true, NULL, 0),
('LUNCH15', '15% off on lunch orders', 'PERCENTAGE', 15, 200, 75, true, NULL, 0);

-- Note: Passwords are bcrypt hashed. For testing, use any password when registering through the app.
-- The actual password for these sample restaurants would need to be set through the registration API.
