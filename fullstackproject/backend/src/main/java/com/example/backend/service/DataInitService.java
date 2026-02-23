package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class DataInitService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private PromoCodeRepository promoCodeRepository;

    @Transactional
    public String initializeSampleData() {
        // Check if data already exists
        if (restaurantRepository.count() > 0 && menuItemRepository.count() > 0) {
            return "Sample data already exists. Skipping initialization.";
        }

        // Create sample restaurants
        Restaurant[] restaurants = createSampleRestaurants();
        
        // Create menu items for each restaurant
        createMenuItems(restaurants);
        
        // Create promo codes
        createPromoCodes();

        return "Sample data initialized successfully! Added 8 restaurants, 48 menu items, and 7 promo codes.";
    }

    private Restaurant[] createSampleRestaurants() {
        Restaurant r1 = new Restaurant();
        r1.setName("Pizza Palace");
        r1.setEmail("pizza@foodiehub.com");
        r1.setPassword("$2a$10$abcdefghijklmnopqrstuvwxyz123456");
        r1.setOwnerName("Mario Rossi");
        r1.setPhone("9876543210");
        r1.setDescription("Authentic Italian pizzas with fresh ingredients. Wood-fired oven, traditional recipes.");
        r1.setAddress("123 MG Road, Banjara Hills");
        r1.setCity("Hyderabad");
        r1.setCuisineType("Italian");
        r1.setRating(4.5);
        r1.setDeliveryTime(30);
        r1.setDeliveryFee(40.0);
        r1.setIsOpen(true);
        r1.setLatitude(17.4239);
        r1.setLongitude(78.4738);

        Restaurant r2 = new Restaurant();
        r2.setName("Spice Garden");
        r2.setEmail("spice@foodiehub.com");
        r2.setPassword("$2a$10$abcdefghijklmnopqrstuvwxyz123456");
        r2.setOwnerName("Raj Kumar");
        r2.setPhone("9876543211");
        r2.setDescription("Traditional Indian cuisine with authentic spices. Family recipes passed down generations.");
        r2.setAddress("456 Jubilee Hills Road");
        r2.setCity("Hyderabad");
        r2.setCuisineType("Indian");
        r2.setRating(4.7);
        r2.setDeliveryTime(35);
        r2.setDeliveryFee(45.0);
        r2.setIsOpen(true);
        r2.setLatitude(17.4326);
        r2.setLongitude(78.4071);

        Restaurant r3 = new Restaurant();
        r3.setName("Burger Barn");
        r3.setEmail("burger@foodiehub.com");
        r3.setPassword("$2a$10$abcdefghijklmnopqrstuvwxyz123456");
        r3.setOwnerName("John Smith");
        r3.setPhone("9876543212");
        r3.setDescription("Juicy burgers made with premium beef. American-style fast food done right.");
        r3.setAddress("789 Gachibowli");
        r3.setCity("Hyderabad");
        r3.setCuisineType("American");
        r3.setRating(4.3);
        r3.setDeliveryTime(25);
        r3.setDeliveryFee(35.0);
        r3.setIsOpen(true);
        r3.setLatitude(17.4400);
        r3.setLongitude(78.3489);

        Restaurant r4 = new Restaurant();
        r4.setName("Sushi Station");
        r4.setEmail("sushi@foodiehub.com");
        r4.setPassword("$2a$10$abcdefghijklmnopqrstuvwxyz123456");
        r4.setOwnerName("Takeshi Yamamoto");
        r4.setPhone("9876543213");
        r4.setDescription("Fresh sushi and Japanese delicacies. Authentic taste of Japan in Hyderabad.");
        r4.setAddress("321 HITEC City");
        r4.setCity("Hyderabad");
        r4.setCuisineType("Japanese");
        r4.setRating(4.8);
        r4.setDeliveryTime(40);
        r4.setDeliveryFee(50.0);
        r4.setIsOpen(true);
        r4.setLatitude(17.4435);
        r4.setLongitude(78.3772);

        Restaurant r5 = new Restaurant();
        r5.setName("Taco Fiesta");
        r5.setEmail("taco@foodiehub.com");
        r5.setPassword("$2a$10$abcdefghijklmnopqrstuvwxyz123456");
        r5.setOwnerName("Carlos Rodriguez");
        r5.setPhone("9876543214");
        r5.setDescription("Authentic Mexican street food. Tacos, burritos, and more with fresh ingredients.");
        r5.setAddress("555 Madhapur");
        r5.setCity("Hyderabad");
        r5.setCuisineType("Mexican");
        r5.setRating(4.4);
        r5.setDeliveryTime(30);
        r5.setDeliveryFee(40.0);
        r5.setIsOpen(true);
        r5.setLatitude(17.4485);
        r5.setLongitude(78.3908);

        Restaurant r6 = new Restaurant();
        r6.setName("Noodle House");
        r6.setEmail("noodle@foodiehub.com");
        r6.setPassword("$2a$10$abcdefghijklmnopqrstuvwxyz123456");
        r6.setOwnerName("Li Wei");
        r6.setPhone("9876543215");
        r6.setDescription("Authentic Chinese noodles and dim sum. Traditional recipes from Beijing.");
        r6.setAddress("888 Kondapur");
        r6.setCity("Hyderabad");
        r6.setCuisineType("Chinese");
        r6.setRating(4.6);
        r6.setDeliveryTime(35);
        r6.setDeliveryFee(40.0);
        r6.setIsOpen(true);
        r6.setLatitude(17.4616);
        r6.setLongitude(78.3622);

        Restaurant r7 = new Restaurant();
        r7.setName("Biryani Blues");
        r7.setEmail("biryani@foodiehub.com");
        r7.setPassword("$2a$10$abcdefghijklmnopqrstuvwxyz123456");
        r7.setOwnerName("Ahmed Khan");
        r7.setPhone("9876543216");
        r7.setDescription("Hyderabadi Biryani specialists. Authentic dum biryani with aromatic spices.");
        r7.setAddress("999 Old City");
        r7.setCity("Hyderabad");
        r7.setCuisineType("Indian");
        r7.setRating(4.9);
        r7.setDeliveryTime(45);
        r7.setDeliveryFee(50.0);
        r7.setIsOpen(true);
        r7.setLatitude(17.3850);
        r7.setLongitude(78.4867);

        Restaurant r8 = new Restaurant();
        r8.setName("Cafe Delight");
        r8.setEmail("cafe@foodiehub.com");
        r8.setPassword("$2a$10$abcdefghijklmnopqrstuvwxyz123456");
        r8.setOwnerName("Sophie Martin");
        r8.setPhone("9876543217");
        r8.setDescription("Cozy cafe with sandwiches, coffee, and desserts. Perfect for quick bites.");
        r8.setAddress("777 Begumpet");
        r8.setCity("Hyderabad");
        r8.setCuisineType("Continental");
        r8.setRating(4.2);
        r8.setDeliveryTime(20);
        r8.setDeliveryFee(30.0);
        r8.setIsOpen(true);
        r8.setLatitude(17.4399);
        r8.setLongitude(78.4983);

        Restaurant[] restaurants = {r1, r2, r3, r4, r5, r6, r7, r8};
        for (Restaurant r : restaurants) {
            restaurantRepository.save(r);
        }
        
        return restaurants;
    }

    private void createMenuItems(Restaurant[] restaurants) {
        // Pizza Palace menu items
        createMenuItem(restaurants[0], "Margherita Pizza", 299.0, "Pizza", "Classic pizza with tomato sauce, mozzarella, and fresh basil", true, false, true, 20, 250);
        createMenuItem(restaurants[0], "Pepperoni Pizza", 399.0, "Pizza", "Loaded with pepperoni, mozzarella, and Italian herbs", false, false, true, 20, 320);
        createMenuItem(restaurants[0], "Veggie Supreme", 349.0, "Pizza", "Bell peppers, onions, mushrooms, olives, and corn", true, false, false, 20, 280);
        createMenuItem(restaurants[0], "BBQ Chicken Pizza", 429.0, "Pizza", "Grilled chicken with BBQ sauce, onions, and cheese", false, false, true, 25, 380);
        createMenuItem(restaurants[0], "Garlic Bread", 129.0, "Sides", "Crispy bread with garlic butter and herbs", true, false, false, 10, 180);
        createMenuItem(restaurants[0], "Cheese Burst Pizza", 449.0, "Pizza", "Extra cheese-filled crust with your choice of toppings", true, false, true, 25, 420);

        // Spice Garden menu items
        createMenuItem(restaurants[1], "Butter Chicken", 349.0, "Main Course", "Creamy tomato curry with tender chicken pieces", false, true, true, 25, 420);
        createMenuItem(restaurants[1], "Paneer Tikka", 299.0, "Starters", "Grilled cottage cheese marinated in spices", true, true, true, 20, 280);
        createMenuItem(restaurants[1], "Dal Makhani", 249.0, "Main Course", "Black lentils cooked in butter and cream", true, false, true, 30, 320);
        createMenuItem(restaurants[1], "Chicken Biryani", 329.0, "Rice", "Aromatic basmati rice with spiced chicken", false, true, true, 35, 480);
        createMenuItem(restaurants[1], "Naan Bread", 49.0, "Breads", "Soft Indian flatbread baked in tandoor", true, false, false, 10, 120);
        createMenuItem(restaurants[1], "Gulab Jamun", 99.0, "Desserts", "Sweet milk dumplings in sugar syrup", true, false, false, 5, 180);

        // Burger Barn menu items
        createMenuItem(restaurants[2], "Classic Beef Burger", 249.0, "Burgers", "Juicy beef patty with lettuce, tomato, and special sauce", false, false, true, 15, 520);
        createMenuItem(restaurants[2], "Veggie Burger", 199.0, "Burgers", "Grilled veggie patty with fresh vegetables", true, false, false, 15, 380);
        createMenuItem(restaurants[2], "Chicken Burger", 229.0, "Burgers", "Crispy fried chicken with mayo and lettuce", false, false, true, 15, 480);
        createMenuItem(restaurants[2], "French Fries", 99.0, "Sides", "Crispy golden fries with ketchup", true, false, true, 10, 320);
        createMenuItem(restaurants[2], "Onion Rings", 129.0, "Sides", "Crispy battered onion rings", true, false, false, 10, 280);
        createMenuItem(restaurants[2], "Chocolate Shake", 149.0, "Beverages", "Thick chocolate milkshake", true, false, false, 5, 420);

        // Sushi Station menu items
        createMenuItem(restaurants[3], "California Roll", 399.0, "Sushi", "Crab, avocado, and cucumber wrapped in rice", false, false, true, 15, 280);
        createMenuItem(restaurants[3], "Salmon Nigiri", 449.0, "Sushi", "Fresh salmon on seasoned rice", false, false, true, 10, 220);
        createMenuItem(restaurants[3], "Vegetable Tempura", 329.0, "Appetizers", "Crispy fried vegetables in light batter", true, false, false, 15, 320);
        createMenuItem(restaurants[3], "Miso Soup", 149.0, "Soups", "Traditional Japanese soup with tofu", true, false, false, 10, 80);
        createMenuItem(restaurants[3], "Dragon Roll", 549.0, "Sushi", "Eel, cucumber, avocado with special sauce", false, false, true, 20, 380);
        createMenuItem(restaurants[3], "Green Tea Ice Cream", 179.0, "Desserts", "Traditional Japanese green tea flavored ice cream", true, false, false, 5, 180);

        // Taco Fiesta menu items
        createMenuItem(restaurants[4], "Chicken Tacos", 249.0, "Tacos", "Grilled chicken with salsa and guacamole", false, true, true, 15, 320);
        createMenuItem(restaurants[4], "Veggie Burrito", 229.0, "Burritos", "Rice, beans, vegetables wrapped in tortilla", true, false, false, 15, 420);
        createMenuItem(restaurants[4], "Beef Quesadilla", 299.0, "Quesadillas", "Grilled tortilla with beef and cheese", false, true, true, 15, 480);
        createMenuItem(restaurants[4], "Nachos Supreme", 199.0, "Appetizers", "Tortilla chips with cheese, salsa, and jalapeños", true, true, true, 10, 520);
        createMenuItem(restaurants[4], "Churros", 149.0, "Desserts", "Fried dough pastry with cinnamon sugar", true, false, false, 10, 280);
        createMenuItem(restaurants[4], "Guacamole & Chips", 179.0, "Appetizers", "Fresh avocado dip with tortilla chips", true, false, false, 10, 220);

        // Noodle House menu items
        createMenuItem(restaurants[5], "Hakka Noodles", 229.0, "Noodles", "Stir-fried noodles with vegetables", true, true, true, 15, 380);
        createMenuItem(restaurants[5], "Chicken Fried Rice", 249.0, "Rice", "Wok-tossed rice with chicken and vegetables", false, false, true, 15, 420);
        createMenuItem(restaurants[5], "Spring Rolls", 149.0, "Appetizers", "Crispy vegetable rolls with sweet chili sauce", true, false, false, 10, 220);
        createMenuItem(restaurants[5], "Manchurian", 199.0, "Appetizers", "Fried vegetable balls in spicy sauce", true, true, true, 15, 320);
        createMenuItem(restaurants[5], "Schezwan Noodles", 259.0, "Noodles", "Spicy noodles with Schezwan sauce", true, true, true, 15, 420);
        createMenuItem(restaurants[5], "Honey Chilli Potato", 179.0, "Appetizers", "Crispy potato tossed in honey chili sauce", true, true, false, 15, 280);

        // Biryani Blues menu items
        createMenuItem(restaurants[6], "Hyderabadi Chicken Biryani", 349.0, "Biryani", "Authentic dum biryani with tender chicken", false, true, true, 40, 520);
        createMenuItem(restaurants[6], "Mutton Biryani", 429.0, "Biryani", "Slow-cooked mutton with aromatic rice", false, true, true, 45, 580);
        createMenuItem(restaurants[6], "Veg Biryani", 279.0, "Biryani", "Mixed vegetables with fragrant basmati rice", true, true, false, 35, 420);
        createMenuItem(restaurants[6], "Raita", 79.0, "Sides", "Yogurt with cucumber and spices", true, false, false, 5, 80);
        createMenuItem(restaurants[6], "Double Ka Meetha", 129.0, "Desserts", "Traditional Hyderabadi bread pudding", true, false, false, 10, 320);
        createMenuItem(restaurants[6], "Mirchi Ka Salan", 149.0, "Sides", "Spicy curry with green chilies", true, true, true, 20, 180);

        // Cafe Delight menu items
        createMenuItem(restaurants[7], "Club Sandwich", 229.0, "Sandwiches", "Triple-decker with chicken, bacon, and veggies", false, false, true, 15, 420);
        createMenuItem(restaurants[7], "Cappuccino", 129.0, "Beverages", "Espresso with steamed milk foam", true, false, true, 5, 120);
        createMenuItem(restaurants[7], "Caesar Salad", 249.0, "Salads", "Romaine lettuce with Caesar dressing and croutons", true, false, false, 10, 220);
        createMenuItem(restaurants[7], "Chocolate Brownie", 149.0, "Desserts", "Warm chocolate brownie with ice cream", true, false, true, 10, 380);
        createMenuItem(restaurants[7], "Pasta Alfredo", 299.0, "Pasta", "Creamy white sauce pasta with herbs", true, false, true, 20, 480);
        createMenuItem(restaurants[7], "Iced Latte", 149.0, "Beverages", "Chilled coffee with milk", true, false, false, 5, 150);
    }

    private void createMenuItem(Restaurant restaurant, String name, Double price, String category, 
                                String description, boolean isVeg, boolean isSpicy, boolean isBestseller,
                                int prepTime, int calories) {
        MenuItem item = new MenuItem();
        item.setRestaurant(restaurant);
        item.setName(name);
        item.setPrice(price);
        item.setCategory(category);
        item.setDescription(description);
        item.setIsVeg(isVeg);
        item.setIsSpicy(isSpicy);
        item.setIsBestseller(isBestseller);
        item.setPreparationTime(prepTime);
        item.setCalories(calories);
        item.setAvailable(true);
        item.setHygieneRating(restaurant.getRating() >= 4.5 ? "Excellent" : "Good");
        menuItemRepository.save(item);
    }

    private void createPromoCodes() {
        createPromoCode("FIRST50", "50% off on first order", "PERCENTAGE", 50.0, 200.0, 100.0, 1000);
        createPromoCode("SAVE20", "Flat ₹20 off", "FIXED", 20.0, 100.0, null, null);
        createPromoCode("WELCOME", "30% off up to ₹150", "PERCENTAGE", 30.0, 300.0, 150.0, 5000);
        createPromoCode("FREESHIP", "Free delivery", "FIXED", 40.0, 150.0, null, null);
        createPromoCode("MEGA100", "₹100 off on orders above ₹500", "FIXED", 100.0, 500.0, null, 2000);
        createPromoCode("WEEKEND25", "25% off on weekends", "PERCENTAGE", 25.0, 250.0, 125.0, null);
        createPromoCode("LUNCH15", "15% off on lunch orders", "PERCENTAGE", 15.0, 200.0, 75.0, null);
    }

    private void createPromoCode(String code, String description, String discountType, 
                                 Double discountValue, Double minOrder, Double maxDiscount, Integer usageLimit) {
        PromoCode promo = new PromoCode();
        promo.setCode(code);
        promo.setDescription(description);
        promo.setDiscountType(discountType);
        promo.setDiscountValue(discountValue);
        promo.setMinOrderAmount(minOrder);
        promo.setMaxDiscountAmount(maxDiscount);
        promo.setUsageLimit(usageLimit);
        promo.setUsageCount(0);
        promo.setIsActive(true);
        promo.setValidFrom(LocalDateTime.now());
        promo.setValidUntil(LocalDateTime.now().plusMonths(6));
        promoCodeRepository.save(promo);
    }
}
