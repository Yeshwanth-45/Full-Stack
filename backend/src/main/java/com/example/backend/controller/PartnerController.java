package com.example.backend.controller;

import com.example.backend.entity.MenuItem;
import com.example.backend.entity.Restaurant;
import com.example.backend.repository.MenuItemRepository;
import com.example.backend.repository.RestaurantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/partner")
@CrossOrigin(origins = "http://localhost:3000")
public class PartnerController {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public PartnerController(RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
    }

    private Restaurant getAuthenticatedRestaurant() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) auth.getPrincipal();
        return restaurantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<Restaurant> getProfile() {
        return ResponseEntity.ok(getAuthenticatedRestaurant());
    }

    @GetMapping("/menu")
    public ResponseEntity<List<MenuItem>> getMenu() {
        Restaurant restaurant = getAuthenticatedRestaurant();
        return ResponseEntity.ok(menuItemRepository.findByRestaurantId(restaurant.getId()));
    }

    @PostMapping("/menu")
    public ResponseEntity<?> addMenuItem(@RequestBody MenuItem item) {
        Restaurant restaurant = getAuthenticatedRestaurant();
        item.setRestaurant(restaurant);
        if (item.getAvailable() == null) item.setAvailable(true);
        MenuItem savedItem = menuItemRepository.save(item);
        return ResponseEntity.ok(savedItem);
    }

    @PutMapping("/menu/{id}")
    public ResponseEntity<?> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem itemDetails) {
        Restaurant restaurant = getAuthenticatedRestaurant();
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!item.getRestaurant().getId().equals(restaurant.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized to update this item"));
        }

        item.setName(itemDetails.getName());
        item.setPrice(itemDetails.getPrice());
        item.setCategory(itemDetails.getCategory());
        item.setDescription(itemDetails.getDescription());
        item.setIsVeg(itemDetails.getIsVeg());
        item.setIsSpicy(itemDetails.getIsSpicy());
        item.setAvailable(itemDetails.getAvailable());
        item.setImageUrl(itemDetails.getImageUrl());
        item.setPreparationTime(itemDetails.getPreparationTime());

        MenuItem updatedItem = menuItemRepository.save(item);
        return ResponseEntity.ok(updatedItem);
    }

    @PatchMapping("/menu/{id}/toggle-availability")
    public ResponseEntity<?> toggleAvailability(@PathVariable Long id) {
        Restaurant restaurant = getAuthenticatedRestaurant();
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!item.getRestaurant().getId().equals(restaurant.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized to update this item"));
        }

        item.setAvailable(!item.getAvailable());
        menuItemRepository.save(item);
        return ResponseEntity.ok(Map.of("id", id, "available", item.getAvailable()));
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        Restaurant restaurant = getAuthenticatedRestaurant();
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!item.getRestaurant().getId().equals(restaurant.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized to delete this item"));
        }

        menuItemRepository.delete(item);
        return ResponseEntity.ok(Map.of("message", "Item deleted successfully"));
    }
}
