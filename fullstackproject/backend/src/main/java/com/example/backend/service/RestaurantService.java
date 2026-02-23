package com.example.backend.service;

import com.example.backend.entity.Restaurant;
import com.example.backend.entity.MenuItem;
import com.example.backend.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
        initializeData();
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    private void initializeData() {
        if (restaurantRepository.count() == 0) {
            createSampleRestaurants();
        }
    }

    private void createSampleRestaurants() {
        // Restaurant 1: Spicy Hub
        Restaurant spicyHub = new Restaurant(
                "Spicy Hub",
                "Authentic Indian Cuisine with traditional spices and flavors",
                "123 Road No 12, Banjara Hills",
                "Hyderabad",
                "Indian"
        );
        spicyHub.setRating(4.8);
        spicyHub.setDeliveryTime(30);
        spicyHub.setDeliveryFee(40.0);
        spicyHub.setImageUrl("https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop");
        spicyHub.setLocation("Hyderabad, Banjara Hills");
        spicyHub.setLatitude(17.4126);
        spicyHub.setLongitude(78.4482);
        spicyHub = restaurantRepository.save(spicyHub);

        List<MenuItem> spicyHubMenu = new ArrayList<>();
        
        MenuItem m1 = new MenuItem("Butter Chicken", 280.0, "Non-Veg", spicyHub);
        m1.setDescription("Creamy tomato-based curry with tender chicken pieces");
        m1.setImageUrl("https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop");
        m1.setIsVeg(false);
        m1.setIsSpicy(true);
        m1.setIsBestseller(true);
        m1.setPreparationTime(25);
        m1.setCalories(420);
        spicyHubMenu.add(m1);

        MenuItem m2 = new MenuItem("Paneer Tikka", 220.0, "Veg", spicyHub);
        m2.setDescription("Grilled cottage cheese marinated in aromatic spices");
        m2.setImageUrl("https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop");
        m2.setIsVeg(true);
        m2.setIsSpicy(true);
        m2.setPreparationTime(20);
        m2.setCalories(280);
        spicyHubMenu.add(m2);

        MenuItem m3 = new MenuItem("Chicken Biryani", 250.0, "Rice", spicyHub);
        m3.setDescription("Fragrant basmati rice with spiced chicken and saffron");
        m3.setImageUrl("https://images.unsplash.com/photo-1563379091339-03246963d51a?w=300&h=200&fit=crop");
        m3.setIsVeg(false);
        m3.setIsSpicy(true);
        m3.setIsBestseller(true);
        m3.setPreparationTime(35);
        m3.setCalories(520);
        spicyHubMenu.add(m3);

        spicyHub.setMenuItems(spicyHubMenu);

        // Restaurant 2: Pizza Palace
        Restaurant pizzaPalace = new Restaurant(
                "Pizza Palace",
                "Authentic Italian Pizzeria with wood-fired ovens",
                "456 Road No 36, Jubilee Hills",
                "Hyderabad",
                "Italian"
        );
        pizzaPalace.setRating(4.5);
        pizzaPalace.setDeliveryTime(25);
        pizzaPalace.setDeliveryFee(50.0);
        pizzaPalace.setImageUrl("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop");
        pizzaPalace.setLocation("Hyderabad, Jubilee Hills");
        pizzaPalace.setLatitude(17.4239);
        pizzaPalace.setLongitude(78.4738);
        pizzaPalace = restaurantRepository.save(pizzaPalace);

        List<MenuItem> pizzaMenu = new ArrayList<>();
        
        MenuItem p1 = new MenuItem("Margherita Pizza", 300.0, "Veg", pizzaPalace);
        p1.setDescription("Classic pizza with fresh mozzarella, tomatoes and basil");
        p1.setImageUrl("https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop");
        p1.setIsVeg(true);
        p1.setIsBestseller(true);
        p1.setPreparationTime(18);
        pizzaMenu.add(p1);

        MenuItem p2 = new MenuItem("Pepperoni Pizza", 350.0, "Non-Veg", pizzaPalace);
        p2.setDescription("Spicy pepperoni with melted cheese on crispy crust");
        p2.setImageUrl("https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop");
        p2.setIsVeg(false);
        p2.setIsSpicy(true);
        p2.setIsBestseller(true);
        p2.setPreparationTime(20);
        pizzaMenu.add(p2);

        pizzaPalace.setMenuItems(pizzaMenu);

        // Restaurant 3: Burger Barn
        Restaurant burgerBarn = new Restaurant(
                "Burger Barn",
                "Premium Gourmet Burgers & Crispy Fries",
                "789 HITEC City, Gachibowli",
                "Hyderabad",
                "American"
        );
        burgerBarn.setRating(4.3);
        burgerBarn.setDeliveryTime(20);
        burgerBarn.setDeliveryFee(30.0);
        burgerBarn.setImageUrl("https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop");
        burgerBarn.setLocation("Hyderabad, Gachibowli");
        burgerBarn.setLatitude(17.4435);
        burgerBarn.setLongitude(78.3772);
        burgerBarn = restaurantRepository.save(burgerBarn);

        List<MenuItem> burgerMenu = new ArrayList<>();
        
        MenuItem b1 = new MenuItem("Classic Cheese Burger", 180.0, "Burgers", burgerBarn);
        b1.setDescription("Juicy beef patty with melted cheese, lettuce and tomato");
        b1.setImageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop");
        b1.setIsVeg(false);
        b1.setIsBestseller(true);
        b1.setPreparationTime(15);
        burgerMenu.add(b1);

        MenuItem b2 = new MenuItem("Crispy French Fries", 80.0, "Sides", burgerBarn);
        b2.setDescription("Golden crispy fries with sea salt");
        b2.setImageUrl("https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop");
        b2.setIsVeg(true);
        b2.setPreparationTime(8);
        burgerMenu.add(b2);

        burgerBarn.setMenuItems(burgerMenu);

        // Restaurant 4: Chinese Wok
        Restaurant chineseWok = new Restaurant(
                "Chinese Wok",
                "Authentic Chinese Cuisine with traditional wok cooking",
                "321 Cyber Towers, Madhapur",
                "Hyderabad",
                "Chinese"
        );
        chineseWok.setRating(4.6);
        chineseWok.setDeliveryTime(35);
        chineseWok.setDeliveryFee(45.0);
        chineseWok.setImageUrl("https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop");
        chineseWok.setLocation("Hyderabad, Madhapur");
        chineseWok.setLatitude(17.4485);
        chineseWok.setLongitude(78.3908);
        chineseWok = restaurantRepository.save(chineseWok);

        List<MenuItem> chineseMenu = new ArrayList<>();
        
        MenuItem c1 = new MenuItem("Chicken Fried Rice", 180.0, "Rice", chineseWok);
        c1.setDescription("Wok-tossed rice with chicken, vegetables and soy sauce");
        c1.setImageUrl("https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop");
        c1.setIsVeg(false);
        c1.setIsBestseller(true);
        c1.setPreparationTime(20);
        chineseMenu.add(c1);

        MenuItem c2 = new MenuItem("Hakka Noodles", 150.0, "Noodles", chineseWok);
        c2.setDescription("Stir-fried noodles with vegetables and Chinese spices");
        c2.setImageUrl("https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=200&fit=crop");
        c2.setIsVeg(true);
        c2.setIsSpicy(true);
        c2.setPreparationTime(15);
        chineseMenu.add(c2);

        chineseWok.setMenuItems(chineseMenu);

        // Restaurant 5: South Indian Café
        Restaurant southIndian = new Restaurant(
                "South Indian Café",
                "Traditional South Indian delicacies and filter coffee",
                "654 SR Nagar, Ameerpet",
                "Hyderabad",
                "South Indian"
        );
        southIndian.setRating(4.7);
        southIndian.setDeliveryTime(25);
        southIndian.setDeliveryFee(35.0);
        southIndian.setImageUrl("https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop");
        southIndian.setLocation("Hyderabad, Ameerpet");
        southIndian.setLatitude(17.4374);
        southIndian.setLongitude(78.4482);
        southIndian = restaurantRepository.save(southIndian);

        List<MenuItem> southIndianMenu = new ArrayList<>();
        
        MenuItem s1 = new MenuItem("Masala Dosa", 100.0, "Breakfast", southIndian);
        s1.setDescription("Crispy crepe with spiced potato filling and chutneys");
        s1.setImageUrl("https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=200&fit=crop");
        s1.setIsVeg(true);
        s1.setIsBestseller(true);
        southIndianMenu.add(s1);

        MenuItem s2 = new MenuItem("Idli Sambar", 80.0, "Breakfast", southIndian);
        s2.setDescription("Steamed rice cakes with lentil curry and coconut chutney");
        s2.setImageUrl("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=200&fit=crop");
        s2.setIsVeg(true);
        southIndianMenu.add(s2);

        southIndian.setMenuItems(southIndianMenu);
    }
}