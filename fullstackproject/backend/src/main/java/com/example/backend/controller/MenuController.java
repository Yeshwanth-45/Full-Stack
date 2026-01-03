package com.example.backend.controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@CrossOrigin
@RestController
@RequestMapping("/api/menus")
public class MenuController {


    @GetMapping("/{restaurantId}")
    public List<Map<String, Object>> getMenu(@PathVariable int restaurantId) {

        if (restaurantId == 1) {
            return List.of(
                    Map.of("id", 1, "name", "Chicken Biryani", "price", 250),
                    Map.of("id", 2, "name", "Paneer Curry", "price", 200)
            );
        } else if (restaurantId == 2) {
            return List.of(
                    Map.of("id", 3, "name", "Burger", "price", 150),
                    Map.of("id", 4, "name", "Fries", "price", 100)
            );
        } else {
            return List.of(
                    Map.of("id", 5, "name", "Tandoori Chicken", "price", 300),
                    Map.of("id", 6, "name", "Butter Naan", "price", 50)
            );
        }
    }
}
