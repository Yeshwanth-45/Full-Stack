package com.example.backend.controller;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final OrderRepository orderRepository;

    public ReviewController(ReviewRepository reviewRepository, UserRepository userRepository,
                          RestaurantRepository restaurantRepository, OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> getRestaurantReviews(@PathVariable Long restaurantId) {
        try {
            List<Review> reviews = reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            Long restaurantId = Long.valueOf(request.get("restaurantId").toString());
            Long orderId = request.get("orderId") != null ? Long.valueOf(request.get("orderId").toString()) : null;
            Integer rating = Integer.valueOf(request.get("rating").toString());
            String comment = (String) request.get("comment");

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElseThrow(() -> new RuntimeException("Restaurant not found"));

            Order order = null;
            if (orderId != null) {
                order = orderRepository.findById(orderId).orElse(null);
            }

            Review review = new Review(user, restaurant, order, rating, comment);
            
            if (request.containsKey("foodRating")) {
                review.setFoodRating(Integer.valueOf(request.get("foodRating").toString()));
            }
            if (request.containsKey("deliveryRating")) {
                review.setDeliveryRating(Integer.valueOf(request.get("deliveryRating").toString()));
            }
            if (request.containsKey("packagingRating")) {
                review.setPackagingRating(Integer.valueOf(request.get("packagingRating").toString()));
            }

            reviewRepository.save(review);

            // Update restaurant rating
            List<Review> allReviews = reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
            double avgRating = allReviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(4.5);
            restaurant.setRating(Math.round(avgRating * 10.0) / 10.0);
            restaurantRepository.save(restaurant);

            return ResponseEntity.ok(Map.of("message", "Review added", "review", review));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
