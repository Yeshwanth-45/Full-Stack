package com.example.backend.controller;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:3000")
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public FavoriteController(FavoriteRepository favoriteRepository, UserRepository userRepository,
                            RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping("/restaurants")
    public ResponseEntity<?> getFavoriteRestaurants(@RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Favorite> favorites = favoriteRepository.findByUserAndFavoriteType(user, "RESTAURANT");
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> addRestaurantToFavorites(@PathVariable Long restaurantId, @RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElseThrow(() -> new RuntimeException("Restaurant not found"));

            // Check if already favorited
            if (favoriteRepository.findByUserAndRestaurantId(user, restaurantId).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Already in favorites"));
            }

            Favorite favorite = new Favorite(user, restaurant);
            favoriteRepository.save(favorite);

            return ResponseEntity.ok(Map.of("message", "Added to favorites", "favorite", favorite));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> removeRestaurantFromFavorites(@PathVariable Long restaurantId, @RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            favoriteRepository.deleteByUserAndRestaurantId(user, restaurantId);
            return ResponseEntity.ok(Map.of("message", "Removed from favorites"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
