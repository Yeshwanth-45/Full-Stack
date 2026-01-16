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
                "Authentic Indian Cuisine with traditional spices and flavors",
                "123 MG Road, Indiranagar",
                "Bangalore",
                "Indian"
        );
        spicyHub.setRating(4.8);
        spicyHub.setDeliveryTime(30);
        spicyHub.setDeliveryFee(40.0);
        spicyHub.setImageUrl("https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop");
        spicyHub.setLocation("Bangalore, Indiranagar");
        spicyHub.setLatitude(12.9716);
        spicyHub.setLongitude(77.6412);
        spicyHub = restaurantRepository.save(spicyHub);

        MenuItem m1 = new MenuItem("Butter Chicken", 280.0, "Non-Veg", spicyHub);
        m1.setDescription("Creamy tomato-based curry with tender chicken pieces");
        m1.setImageUrl("https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop");
        m1.setHygieneRating("Excellent");
        m1.setIsVeg(false);
        m1.setIsSpicy(true);
        m1.setIsBestseller(true);
        m1.setPreparationTime(25);
        m1.setIsGlutenFree(true);
        m1.setIsJain(false);
        m1.setIsKeto(false);
        m1.setSpiceLevel("Medium");
        m1.setCalories(420);
        
        MenuItem m2 = new MenuItem("Paneer Tikka", 220.0, "Veg", spicyHub);
        m2.setDescription("Grilled cottage cheese marinated in aromatic spices");
        m2.setImageUrl("https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop");
        m2.setHygieneRating("Excellent");
        m2.setIsVeg(true);
        m2.setIsSpicy(true);
        m2.setIsBestseller(false);
        m2.setPreparationTime(20);
        m2.setIsGlutenFree(true);
        m2.setIsJain(true);
        m2.setIsKeto(true);
        m2.setSpiceLevel("Hot");
        m2.setCalories(280);
        
        MenuItem m3 = new MenuItem("Chicken Biryani", 250.0, "Rice", spicyHub);
        m3.setDescription("Fragrant basmati rice with spiced chicken and saffron");
        m3.setImageUrl("https://images.unsplash.com/photo-1563379091339-03246963d51a?w=300&h=200&fit=crop");
        m3.setHygieneRating("Excellent");
        m3.setIsVeg(false);
        m3.setIsSpicy(true);
        m3.setIsBestseller(true);
        m3.setPreparationTime(35);
        m3.setIsGlutenFree(true);
        m3.setIsJain(false);
        m3.setIsKeto(false);
        m3.setSpiceLevel("Medium");
        m3.setCalories(520);
        
        MenuItem m4 = new MenuItem("Garlic Naan", 50.0, "Bread", spicyHub);
        m4.setDescription("Fresh baked bread with garlic and herbs");
        m4.setImageUrl("https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop");
        m4.setHygieneRating("Good");
        m4.setIsVeg(true);
        m4.setIsSpicy(false);
        m4.setIsBestseller(false);
        m4.setPreparationTime(10);
        m4.setIsGlutenFree(false);
        m4.setIsJain(true);
        m4.setIsKeto(false);
        m4.setSpiceLevel("Mild");
        m4.setCalories(180);
        menuItemRepository.save(m1);
        menuItemRepository.save(m2);
        menuItemRepository.save(m3);
        menuItemRepository.save(m4);

        // Restaurant 2: Pizza Palace - Bangalore, Koramangala
        Restaurant pizzaPalace = new Restaurant(
                "Pizza Palace",
                "Authentic Italian Pizzeria with wood-fired ovens",
                "456 Church Street, Koramangala",
                "Bangalore",
                "Italian"
        );
        pizzaPalace.setRating(4.5);
        pizzaPalace.setDeliveryTime(25);
        pizzaPalace.setDeliveryFee(50.0);
        pizzaPalace.setImageUrl("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop");
        pizzaPalace.setLocation("Bangalore, Koramangala");
        pizzaPalace.setLatitude(12.9352);
        pizzaPalace.setLongitude(77.6245);
        pizzaPalace = restaurantRepository.save(pizzaPalace);

        MenuItem p1 = new MenuItem("Margherita Pizza", 300.0, "Veg", pizzaPalace);
        p1.setDescription("Classic pizza with fresh mozzarella, tomatoes and basil");
        p1.setImageUrl("https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop");
        p1.setHygieneRating("Excellent");
        p1.setIsVeg(true);
        p1.setIsSpicy(false);
        p1.setIsBestseller(true);
        p1.setPreparationTime(18);
        
        MenuItem p2 = new MenuItem("Pepperoni Pizza", 350.0, "Non-Veg", pizzaPalace);
        p2.setDescription("Spicy pepperoni with melted cheese on crispy crust");
        p2.setImageUrl("https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop");
        p2.setHygieneRating("Excellent");
        p2.setIsVeg(false);
        p2.setIsSpicy(true);
        p2.setIsBestseller(true);
        p2.setPreparationTime(20);
        
        MenuItem p3 = new MenuItem("Garlic Bread", 100.0, "Sides", pizzaPalace);
        p3.setDescription("Crispy bread with garlic butter and herbs");
        p3.setImageUrl("https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300&h=200&fit=crop");
        p3.setHygieneRating("Good");
        p3.setIsVeg(true);
        p3.setIsSpicy(false);
        p3.setIsBestseller(false);
        p3.setPreparationTime(8);
        
        MenuItem p4 = new MenuItem("Coca Cola", 50.0, "Beverages", pizzaPalace);
        p4.setDescription("Chilled soft drink");
        p4.setImageUrl("https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=200&fit=crop");
        p4.setHygieneRating("Good");
        p4.setIsVeg(true);
        p4.setIsSpicy(false);
        p4.setIsBestseller(false);
        p4.setPreparationTime(2);
        menuItemRepository.save(p1);
        menuItemRepository.save(p2);
        menuItemRepository.save(p3);
        menuItemRepository.save(p4);

        // Restaurant 3: Burger Barn - Bangalore, Whitefield
        Restaurant burgerBarn = new Restaurant(
                "Burger Barn",
                "Premium Gourmet Burgers & Crispy Fries",
                "789 Commercial Street, Whitefield",
                "Bangalore",
                "American"
        );
        burgerBarn.setRating(4.3);
        burgerBarn.setDeliveryTime(20);
        burgerBarn.setDeliveryFee(30.0);
        burgerBarn.setImageUrl("https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop");
        burgerBarn.setLocation("Bangalore, Whitefield");
        burgerBarn.setLatitude(12.9698);
        burgerBarn.setLongitude(77.7499);
        burgerBarn = restaurantRepository.save(burgerBarn);

        MenuItem b1 = new MenuItem("Classic Cheese Burger", 180.0, "Burgers", burgerBarn);
        b1.setDescription("Juicy beef patty with melted cheese, lettuce and tomato");
        b1.setImageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop");
        b1.setHygieneRating("Good");
        b1.setIsVeg(false);
        b1.setIsSpicy(false);
        b1.setIsBestseller(true);
        b1.setPreparationTime(15);
        
        MenuItem b2 = new MenuItem("Grilled Chicken Burger", 160.0, "Burgers", burgerBarn);
        b2.setDescription("Tender grilled chicken breast with fresh vegetables");
        b2.setImageUrl("https://images.unsplash.com/photo-1606755962773-d324e9a13086?w=300&h=200&fit=crop");
        b2.setHygieneRating("Good");
        b2.setIsVeg(false);
        b2.setIsSpicy(false);
        b2.setIsBestseller(false);
        b2.setPreparationTime(18);
        
        MenuItem b3 = new MenuItem("Crispy French Fries", 80.0, "Sides", burgerBarn);
        b3.setDescription("Golden crispy fries with sea salt");
        b3.setImageUrl("https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop");
        b3.setHygieneRating("Excellent");
        b3.setIsVeg(true);
        b3.setIsSpicy(false);
        b3.setIsBestseller(false);
        b3.setPreparationTime(8);
        
        MenuItem b4 = new MenuItem("Chocolate Milkshake", 100.0, "Beverages", burgerBarn);
        b4.setDescription("Rich chocolate milkshake with whipped cream");
        b4.setImageUrl("https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop");
        b4.setHygieneRating("Good");
        b4.setIsVeg(true);
        b4.setIsSpicy(false);
        b4.setIsBestseller(false);
        b4.setPreparationTime(5);
        menuItemRepository.save(b1);
        menuItemRepository.save(b2);
        menuItemRepository.save(b3);
        menuItemRepository.save(b4);

        // Restaurant 4: Chinese Wok - Hyderabad, Banjara Hills
        Restaurant chineseWok = new Restaurant(
                "Chinese Wok",
                "Authentic Chinese Cuisine with traditional wok cooking",
                "321 Park Road, Banjara Hills",
                "Hyderabad",
                "Chinese"
        );
        chineseWok.setRating(4.6);
        chineseWok.setDeliveryTime(35);
        chineseWok.setDeliveryFee(45.0);
        chineseWok.setImageUrl("https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop");
        chineseWok.setLocation("Hyderabad, Banjara Hills");
        chineseWok.setLatitude(17.3850);
        chineseWok.setLongitude(78.4867);
        chineseWok = restaurantRepository.save(chineseWok);

        MenuItem c1 = new MenuItem("Chicken Fried Rice", 180.0, "Rice", chineseWok);
        c1.setDescription("Wok-tossed rice with chicken, vegetables and soy sauce");
        c1.setImageUrl("https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop");
        c1.setHygieneRating("Excellent");
        c1.setIsVeg(false);
        c1.setIsSpicy(false);
        c1.setIsBestseller(true);
        c1.setPreparationTime(20);
        
        MenuItem c2 = new MenuItem("Hakka Noodles", 150.0, "Noodles", chineseWok);
        c2.setDescription("Stir-fried noodles with vegetables and Chinese spices");
        c2.setImageUrl("https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=200&fit=crop");
        c2.setHygieneRating("Excellent");
        c2.setIsVeg(true);
        c2.setIsSpicy(true);
        c2.setIsBestseller(false);
        c2.setPreparationTime(15);
        
        MenuItem c3 = new MenuItem("Vegetable Spring Rolls", 120.0, "Starters", chineseWok);
        c3.setDescription("Crispy rolls filled with fresh vegetables");
        c3.setImageUrl("https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop");
        c3.setHygieneRating("Good");
        c3.setIsVeg(true);
        c3.setIsSpicy(false);
        c3.setIsBestseller(false);
        c3.setPreparationTime(12);
        
        MenuItem c4 = new MenuItem("Chicken Manchurian", 190.0, "Main Course", chineseWok);
        c4.setDescription("Deep-fried chicken in tangy Manchurian sauce");
        c4.setImageUrl("https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=200&fit=crop");
        c4.setHygieneRating("Good");
        c4.setIsVeg(false);
        c4.setIsSpicy(true);
        c4.setIsBestseller(true);
        c4.setPreparationTime(25);
        menuItemRepository.save(c1);
        menuItemRepository.save(c2);
        menuItemRepository.save(c3);
        menuItemRepository.save(c4);

        // Restaurant 5: South Indian Café - Chennai, Anna Nagar
        Restaurant southIndian = new Restaurant(
                "South Indian Café",
                "Traditional South Indian delicacies and filter coffee",
                "654 MG Road, Anna Nagar",
                "Chennai",
                "South Indian"
        );
        southIndian.setRating(4.7);
        southIndian.setDeliveryTime(25);
        southIndian.setDeliveryFee(35.0);
        southIndian.setImageUrl("https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop");
        southIndian.setLocation("Chennai, Anna Nagar");
        southIndian.setLatitude(13.0827);
        southIndian.setLongitude(80.2107);
        southIndian = restaurantRepository.save(southIndian);

        MenuItem s1 = new MenuItem("Masala Dosa", 100.0, "Breakfast", southIndian);
        s1.setDescription("Crispy crepe with spiced potato filling and chutneys");
        s1.setImageUrl("https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=200&fit=crop");
        MenuItem s2 = new MenuItem("Idli Sambar", 80.0, "Breakfast", southIndian);
        s2.setDescription("Steamed rice cakes with lentil curry and coconut chutney");
        s2.setImageUrl("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=200&fit=crop");
        MenuItem s3 = new MenuItem("Curd Rice", 120.0, "Rice", southIndian);
        s3.setDescription("Comfort rice with yogurt, curry leaves and pickles");
        s3.setImageUrl("https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300&h=200&fit=crop");
        MenuItem s4 = new MenuItem("Medu Vada", 60.0, "Snacks", southIndian);
        s4.setDescription("Crispy lentil donuts served with sambar and chutney");
        s4.setImageUrl("https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop");
        menuItemRepository.save(s1);
        menuItemRepository.save(s2);
        menuItemRepository.save(s3);
        menuItemRepository.save(s4);

        // Restaurant 6: Taco Fiesta - Mumbai, Bandra
        Restaurant tacoFiesta = new Restaurant(
                "Taco Fiesta",
                "Authentic Mexican street food and vibrant flavors",
                "88 Hill Road, Bandra West",
                "Mumbai",
                "Mexican"
        );
        tacoFiesta.setRating(4.4);
        tacoFiesta.setDeliveryTime(28);
        tacoFiesta.setDeliveryFee(55.0);
        tacoFiesta.setImageUrl("https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop");
        tacoFiesta.setLocation("Mumbai, Bandra");
        tacoFiesta.setLatitude(19.0596);
        tacoFiesta.setLongitude(72.8295);
        tacoFiesta = restaurantRepository.save(tacoFiesta);

        MenuItem t1 = new MenuItem("Chicken Tacos", 220.0, "Tacos", tacoFiesta);
        t1.setDescription("Soft tortillas with grilled chicken, salsa and guacamole");
        t1.setImageUrl("https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=300&h=200&fit=crop");
        MenuItem t2 = new MenuItem("Beef Burrito", 280.0, "Burritos", tacoFiesta);
        t2.setDescription("Large flour tortilla with seasoned beef, rice and beans");
        t2.setImageUrl("https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop");
        MenuItem t3 = new MenuItem("Nachos Supreme", 180.0, "Appetizers", tacoFiesta);
        t3.setDescription("Crispy tortilla chips with cheese, jalapeños and sour cream");
        t3.setImageUrl("https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=200&fit=crop");
        MenuItem t4 = new MenuItem("Margarita", 150.0, "Beverages", tacoFiesta);
        t4.setDescription("Classic lime margarita with salt rim");
        t4.setImageUrl("https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=300&h=200&fit=crop");
        menuItemRepository.save(t1);
        menuItemRepository.save(t2);
        menuItemRepository.save(t3);
        menuItemRepository.save(t4);

        // Restaurant 7: Sushi Zen - Delhi, Connaught Place
        Restaurant sushiZen = new Restaurant(
                "Sushi Zen",
                "Fresh Japanese sushi and authentic Asian cuisine",
                "12 Connaught Place, Central Delhi",
                "Delhi",
                "Japanese"
        );
        sushiZen.setRating(4.9);
        sushiZen.setDeliveryTime(40);
        sushiZen.setDeliveryFee(60.0);
        sushiZen.setImageUrl("https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop");
        sushiZen.setLocation("Delhi, Connaught Place");
        sushiZen.setLatitude(28.6315);
        sushiZen.setLongitude(77.2167);
        sushiZen = restaurantRepository.save(sushiZen);

        MenuItem j1 = new MenuItem("Salmon Sushi Roll", 350.0, "Sushi", sushiZen);
        j1.setDescription("Fresh salmon with avocado and cucumber in nori");
        j1.setImageUrl("https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop");
        MenuItem j2 = new MenuItem("Chicken Teriyaki", 280.0, "Main Course", sushiZen);
        j2.setDescription("Grilled chicken glazed with sweet teriyaki sauce");
        j2.setImageUrl("https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop");
        MenuItem j3 = new MenuItem("Miso Soup", 120.0, "Soup", sushiZen);
        j3.setDescription("Traditional soybean paste soup with tofu and seaweed");
        j3.setImageUrl("https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop");
        MenuItem j4 = new MenuItem("Green Tea", 80.0, "Beverages", sushiZen);
        j4.setDescription("Premium Japanese green tea");
        j4.setImageUrl("https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop");
        menuItemRepository.save(j1);
        menuItemRepository.save(j2);
        menuItemRepository.save(j3);
        menuItemRepository.save(j4);

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
