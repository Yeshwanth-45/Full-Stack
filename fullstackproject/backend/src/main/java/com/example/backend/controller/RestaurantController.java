package com.example.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
public class RestaurantController {

    @GetMapping("/api/restaurants")
    public List<Map<String, Object>> getRestaurants() {
        return List.of(
                Map.of("id", 1, "name", "Spicy Hub", "location", "Hyderabad"),
                Map.of("id", 2, "name", "Food Corner", "location", "Bangalore"),
                Map.of("id", 3, "name", "Tandoori Tales", "location", "Chennai")
        );
    }
}
