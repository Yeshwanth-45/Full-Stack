package com.example.backend.controller;

import com.example.backend.entity.MenuItem;
import com.example.backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/menus")
public class MenuController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getMenuByRestaurant(@PathVariable Long restaurantId) {
        List<MenuItem> menuItems = menuItemRepository.findByRestaurantId(restaurantId);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/restaurant/{restaurantId}/available")
    public ResponseEntity<List<MenuItem>> getAvailableMenuByRestaurant(@PathVariable Long restaurantId) {
        List<MenuItem> menuItems = menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuItem>> getMenuByCategory(@PathVariable String category) {
        List<MenuItem> menuItems = menuItemRepository.findByCategory(category);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        Optional<MenuItem> menuItem = menuItemRepository.findById(id);
        return menuItem.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem menuItem) {
        MenuItem saved = menuItemRepository.save(menuItem);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItemDetails) {
        Optional<MenuItem> menuItem = menuItemRepository.findById(id);
        if (menuItem.isPresent()) {
            MenuItem m = menuItem.get();
            m.setName(menuItemDetails.getName());
            m.setDescription(menuItemDetails.getDescription());
            m.setPrice(menuItemDetails.getPrice());
            m.setCategory(menuItemDetails.getCategory());
            m.setImageUrl(menuItemDetails.getImageUrl());
            m.setIsAvailable(menuItemDetails.getIsAvailable());
            MenuItem updated = menuItemRepository.save(m);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

