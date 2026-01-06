package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@CrossOrigin
@RestController
@RequestMapping("/api/cart")
public class CartController {

    // Simple in-memory cart storage per user email
    private static final Map<String, List<Map<String, Object>>> carts = new ConcurrentHashMap<>();

    @PostMapping("/add")
    public Map<String, Object> addToCart(@RequestParam String userEmail, @RequestBody Map<String, Object> item) {
        carts.putIfAbsent(userEmail, new ArrayList<>());
        List<Map<String, Object>> userCart = carts.get(userEmail);
        userCart.add(item);
        
        return Map.of(
                "success", true,
                "message", "Item added to cart",
                "cartSize", userCart.size()
        );
    }

    @GetMapping("/{userEmail}")
    public List<Map<String, Object>> getCart(@PathVariable String userEmail) {
        return carts.getOrDefault(userEmail, new ArrayList<>());
    }

    @DeleteMapping("/{userEmail}/item/{itemId}")
    public Map<String, Object> removeFromCart(@PathVariable String userEmail, @PathVariable Long itemId) {
        List<Map<String, Object>> userCart = carts.get(userEmail);
        if (userCart != null) {
            userCart.removeIf(item -> item.get("id").equals(itemId));
        }
        return Map.of("success", true, "message", "Item removed from cart");
    }

    @PostMapping("/{userEmail}/clear")
    public Map<String, Object> clearCart(@PathVariable String userEmail) {
        carts.remove(userEmail);
        return Map.of("success", true, "message", "Cart cleared");
    }

    @PostMapping("/{userEmail}/update/{itemId}")
    public Map<String, Object> updateCartItem(
            @PathVariable String userEmail,
            @PathVariable Long itemId,
            @RequestParam int quantity) {
        List<Map<String, Object>> userCart = carts.get(userEmail);
        if (userCart != null) {
            for (Map<String, Object> item : userCart) {
                if (item.get("id").equals(itemId)) {
                    item.put("quantity", quantity);
                    break;
                }
            }
        }
        return Map.of("success", true, "message", "Item quantity updated");
    }
}
