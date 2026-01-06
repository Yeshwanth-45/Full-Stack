package com.example.backend.service;

import com.example.backend.entity.Restaurant;
import com.example.backend.entity.MenuItem;
import com.example.backend.repository.RestaurantRepository;
import com.example.backend.repository.MenuItemRepository;
import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

@Service
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

        @Autowired
        private ProductRepository productRepository;

    @Autowired
    private com.example.backend.repository.CouponRepository couponRepository;

    @Override
    public void run(String... args) throws Exception {
        if (restaurantRepository.count() == 0) {
            initializeRestaurants();
        }
    }

    private void initializeRestaurants() {
        // Restaurant 1: Spicy Hub - Bangalore, Indiranagar
        Restaurant spicyHub = new Restaurant(
                "Spicy Hub",
                "Authentic Indian Cuisine",
                "123 MG Road",
                "Bangalore",
                "Indian"
        );
        spicyHub.setRating(4.8);
        spicyHub.setDeliveryTime(30);
        spicyHub.setDeliveryFee(40.0);
        spicyHub.setImageUrl("https://via.placeholder.com/300?text=Spicy+Hub");
        spicyHub.setLocation("Bangalore, Indiranagar");
        spicyHub.setLatitude(12.9716);
        spicyHub.setLongitude(77.6412);
        spicyHub = restaurantRepository.save(spicyHub);

        MenuItem m1 = new MenuItem("Butter Chicken", 280.0, "Non-Veg", spicyHub);
        MenuItem m2 = new MenuItem("Paneer Tikka", 220.0, "Veg", spicyHub);
        MenuItem m3 = new MenuItem("Biryani", 250.0, "Rice", spicyHub);
        MenuItem m4 = new MenuItem("Naan", 50.0, "Bread", spicyHub);
        menuItemRepository.save(m1);
        menuItemRepository.save(m2);
        menuItemRepository.save(m3);
        menuItemRepository.save(m4);

        // Restaurant 2: Pizza Palace - Bangalore, Koramangala
        Restaurant pizzaPalace = new Restaurant(
                "Pizza Palace",
                "Italian Pizzeria",
                "456 Church Street",
                "Bangalore",
                "Italian"
        );
        pizzaPalace.setRating(4.5);
        pizzaPalace.setDeliveryTime(25);
        pizzaPalace.setDeliveryFee(50.0);
        pizzaPalace.setImageUrl("https://via.placeholder.com/300?text=Pizza+Palace");
        pizzaPalace.setLocation("Bangalore, Koramangala");
        pizzaPalace.setLatitude(12.9352);
        pizzaPalace.setLongitude(77.6245);
        pizzaPalace = restaurantRepository.save(pizzaPalace);

        MenuItem p1 = new MenuItem("Margherita Pizza", 300.0, "Veg", pizzaPalace);
        MenuItem p2 = new MenuItem("Pepperoni Pizza", 350.0, "Non-Veg", pizzaPalace);
        MenuItem p3 = new MenuItem("Garlic Bread", 100.0, "Sides", pizzaPalace);
        MenuItem p4 = new MenuItem("Coke", 50.0, "Beverages", pizzaPalace);
        menuItemRepository.save(p1);
        menuItemRepository.save(p2);
        menuItemRepository.save(p3);
        menuItemRepository.save(p4);

        // Restaurant 3: Burger Barn - Bangalore, Whitefield
        Restaurant burgerBarn = new Restaurant(
                "Burger Barn",
                "Premium Burgers & Fries",
                "789 Commercial Street",
                "Bangalore",
                "American"
        );
        burgerBarn.setRating(4.3);
        burgerBarn.setDeliveryTime(20);
        burgerBarn.setDeliveryFee(30.0);
        burgerBarn.setImageUrl("https://via.placeholder.com/300?text=Burger+Barn");
        burgerBarn.setLocation("Bangalore, Whitefield");
        burgerBarn.setLatitude(12.9698);
        burgerBarn.setLongitude(77.7499);
        burgerBarn = restaurantRepository.save(burgerBarn);

        MenuItem b1 = new MenuItem("Cheese Burger", 180.0, "Burgers", burgerBarn);
        MenuItem b2 = new MenuItem("Chicken Burger", 160.0, "Burgers", burgerBarn);
        MenuItem b3 = new MenuItem("French Fries", 80.0, "Sides", burgerBarn);
        MenuItem b4 = new MenuItem("Milkshake", 100.0, "Beverages", burgerBarn);
        menuItemRepository.save(b1);
        menuItemRepository.save(b2);
        menuItemRepository.save(b3);
        menuItemRepository.save(b4);

        // Restaurant 4: Chinese Wok - Hyderabad, Banjara Hills
        Restaurant chineseWok = new Restaurant(
                "Chinese Wok",
                "Authentic Chinese Cuisine",
                "321 Park Road",
                "Hyderabad",
                "Chinese"
        );
        chineseWok.setRating(4.6);
        chineseWok.setDeliveryTime(35);
        chineseWok.setDeliveryFee(45.0);
        chineseWok.setImageUrl("https://via.placeholder.com/300?text=Chinese+Wok");
        chineseWok.setLocation("Hyderabad, Banjara Hills");
        chineseWok.setLatitude(17.3850);
        chineseWok.setLongitude(78.4867);
        chineseWok = restaurantRepository.save(chineseWok);

        MenuItem c1 = new MenuItem("Fried Rice", 180.0, "Rice", chineseWok);
        MenuItem c2 = new MenuItem("Chow Mein", 150.0, "Noodles", chineseWok);
        MenuItem c3 = new MenuItem("Spring Rolls", 120.0, "Starters", chineseWok);
        MenuItem c4 = new MenuItem("Manchurian", 190.0, "Main Course", chineseWok);
        menuItemRepository.save(c1);
        menuItemRepository.save(c2);
        menuItemRepository.save(c3);
        menuItemRepository.save(c4);

        // Restaurant 5: South Indian Café - Chennai, Anna Nagar
        Restaurant southIndian = new Restaurant(
                "South Indian Café",
                "Traditional South Indian Food",
                "654 MG Road",
                "Chennai",
                "South Indian"
        );
        southIndian.setRating(4.7);
        southIndian.setDeliveryTime(25);
        southIndian.setDeliveryFee(35.0);
        southIndian.setImageUrl("https://via.placeholder.com/300?text=South+Indian");
        southIndian.setLocation("Chennai, Anna Nagar");
        southIndian.setLatitude(13.0827);
        southIndian.setLongitude(80.2107);
        southIndian = restaurantRepository.save(southIndian);

        MenuItem s1 = new MenuItem("Dosa", 100.0, "Breakfast", southIndian);
        MenuItem s2 = new MenuItem("Idli", 80.0, "Breakfast", southIndian);
        MenuItem s3 = new MenuItem("Sambar Rice", 120.0, "Rice", southIndian);
        MenuItem s4 = new MenuItem("Vada", 60.0, "Snacks", southIndian);
        menuItemRepository.save(s1);
        menuItemRepository.save(s2);
        menuItemRepository.save(s3);
        menuItemRepository.save(s4);

        // QuickMart sample products (Blinkit/Zepto style instant delivery)
        Product milk = new Product("Full Cream Milk 1L", 60.0, "Dairy", "QuickMart Indiranagar");
        milk.setDescription("Fresh farm milk");
        milk.setStock(50);
        milk.setImageUrl("https://via.placeholder.com/200?text=Milk");

        Product bread = new Product("Whole Wheat Bread", 40.0, "Bakery", "QuickMart Indiranagar");
        bread.setStock(40);
        bread.setImageUrl("https://via.placeholder.com/200?text=Bread");

        Product eggs = new Product("Eggs (6 pcs)", 60.0, "Grocery", "QuickMart Indiranagar");
        eggs.setStock(60);
        eggs.setImageUrl("https://via.placeholder.com/200?text=Eggs");

        Product chips = new Product("Potato Chips 100g", 30.0, "Snacks", "QuickMart Indiranagar");
        chips.setStock(100);
        chips.setImageUrl("https://via.placeholder.com/200?text=Chips");

        productRepository.save(milk);
        productRepository.save(bread);
        productRepository.save(eggs);
        productRepository.save(chips);

        // Seed some sample coupons
        if (couponRepository.count() == 0) {
            com.example.backend.entity.Coupon coupon1 = new com.example.backend.entity.Coupon("NEWUSER10", "PERCENT", 10.0);
            com.example.backend.entity.Coupon coupon2 = new com.example.backend.entity.Coupon("FLAT50", "FLAT", 50.0);
            couponRepository.save(coupon1);
            couponRepository.save(coupon2);
        }
    }
}
