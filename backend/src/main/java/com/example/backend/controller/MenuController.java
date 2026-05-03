package com.example.backend.controller;

import com.example.backend.entity.MenuItem;
import com.example.backend.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
@CrossOrigin(origins = "http://localhost:3000")
public class MenuController {

    private final RestaurantService restaurantService;

    public MenuController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getMenuByRestaurant(@PathVariable Long restaurantId) {
        try {
            var restaurant = restaurantService.getRestaurantById(restaurantId);
            return ResponseEntity.ok(restaurant.getMenuItems());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}