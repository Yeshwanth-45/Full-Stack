package com.example.backend.controller;

import com.example.backend.entity.Restaurant;
import com.example.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants(
            @RequestParam(required = false) String location) {
        List<Restaurant> restaurants;
        if (location != null && !location.isEmpty()) {
            restaurants = restaurantRepository.findByLocation(location);
        } else {
            restaurants = restaurantRepository.findAll();
        }
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        Optional<Restaurant> restaurant = restaurantRepository.findById(id);
        return restaurant.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Restaurant>> getRestaurantsByCity(@PathVariable String city) {
        List<Restaurant> restaurants = restaurantRepository.findByCity(city);
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/cuisine/{cuisineType}")
    public ResponseEntity<List<Restaurant>> getRestaurantsByCuisine(@PathVariable String cuisineType) {
        List<Restaurant> restaurants = restaurantRepository.findByCuisineType(cuisineType);
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/open")
    public ResponseEntity<List<Restaurant>> getOpenRestaurants(
            @RequestParam(required = false) String location) {
        List<Restaurant> restaurants;
        if (location != null && !location.isEmpty()) {
            restaurants = restaurantRepository.findByLocationAndIsOpenTrue(location);
        } else {
            restaurants = restaurantRepository.findByIsOpenTrue();
        }
        return ResponseEntity.ok(restaurants);
    }

    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody Restaurant restaurant) {
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return ResponseEntity.ok(savedRestaurant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable Long id, @RequestBody Restaurant restaurantDetails) {
        Optional<Restaurant> restaurant = restaurantRepository.findById(id);
        if (restaurant.isPresent()) {
            Restaurant r = restaurant.get();
            r.setName(restaurantDetails.getName());
            r.setDescription(restaurantDetails.getDescription());
            r.setAddress(restaurantDetails.getAddress());
            r.setCity(restaurantDetails.getCity());
            r.setCuisineType(restaurantDetails.getCuisineType());
            r.setDeliveryTime(restaurantDetails.getDeliveryTime());
            r.setDeliveryFee(restaurantDetails.getDeliveryFee());
            r.setIsOpen(restaurantDetails.getIsOpen());
            Restaurant updated = restaurantRepository.save(r);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

