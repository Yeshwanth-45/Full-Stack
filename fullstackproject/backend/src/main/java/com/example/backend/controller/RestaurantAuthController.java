package com.example.backend.controller;

import com.example.backend.dto.RestaurantLoginRequest;
import com.example.backend.dto.RestaurantRegisterRequest;
import com.example.backend.entity.Restaurant;
import com.example.backend.repository.RestaurantRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurant")
@CrossOrigin(origins = "http://localhost:3000")
public class RestaurantAuthController {

    private final RestaurantRepository restaurantRepository;
    private final PasswordEncoder passwordEncoder;

    public RestaurantAuthController(RestaurantRepository restaurantRepository, PasswordEncoder passwordEncoder) {
        this.restaurantRepository = restaurantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RestaurantRegisterRequest request) {
        try {
            // Validate input
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password is required"));
            }
            if (request.getRestaurantName() == null || request.getRestaurantName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Restaurant name is required"));
            }

            // Check if restaurant already exists
            if (restaurantRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
            }

            // Create new restaurant
            Restaurant restaurant = new Restaurant();
            restaurant.setEmail(request.getEmail());
            restaurant.setPassword(passwordEncoder.encode(request.getPassword()));
            restaurant.setName(request.getRestaurantName());
            restaurant.setOwnerName(request.getOwnerName());
            restaurant.setPhone(request.getPhone());
            restaurant.setAddress(request.getAddress());
            restaurant.setCuisineType(request.getCuisine());
            restaurant.setDescription(request.getDescription());
            restaurant.setCity("Hyderabad"); // Default city
            restaurant.setRating(4.5);
            restaurant.setDeliveryTime(30);
            restaurant.setDeliveryFee(40.0);
            restaurant.setIsOpen(true);

            restaurantRepository.save(restaurant);

            // Generate JWT token
            String token = JwtUtil.generateToken(restaurant.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("restaurant", Map.of(
                "id", restaurant.getId(),
                "email", restaurant.getEmail(),
                "name", restaurant.getName(),
                "ownerName", restaurant.getOwnerName()
            ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody RestaurantLoginRequest request) {
        try {
            // Validate input
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password is required"));
            }

            // Find restaurant by email
            Restaurant restaurant = restaurantRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));

            // Check password
            if (!passwordEncoder.matches(request.getPassword(), restaurant.getPassword())) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
            }

            // Generate JWT token
            String token = JwtUtil.generateToken(restaurant.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("restaurant", Map.of(
                "id", restaurant.getId(),
                "email", restaurant.getEmail(),
                "name", restaurant.getName(),
                "ownerName", restaurant.getOwnerName()
            ));

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }
}
