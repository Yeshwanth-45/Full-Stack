package com.example.backend.controller;

import com.example.backend.entity.Order;
import com.example.backend.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin(origins = "http://localhost:3000")
public class TrackingController {

    private final OrderRepository orderRepository;

    public TrackingController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrderTracking(@PathVariable Long orderId) {
        try {
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Order order = orderOpt.get();
            Map<String, Object> trackingInfo = new HashMap<>();
            trackingInfo.put("orderId", order.getId());
            trackingInfo.put("status", order.getStatus());
            trackingInfo.put("createdAt", order.getCreatedAt());
            trackingInfo.put("updatedAt", order.getUpdatedAt());
            trackingInfo.put("estimatedDeliveryTime", order.getEstimatedDeliveryTime());
            trackingInfo.put("deliveryAddress", order.getDeliveryAddress());
            trackingInfo.put("trackingNotes", order.getTrackingNotes());
            
            // Driver information
            if (order.getDriverName() != null) {
                Map<String, Object> driverInfo = new HashMap<>();
                driverInfo.put("name", order.getDriverName());
                driverInfo.put("phone", order.getDriverPhone());
                driverInfo.put("latitude", order.getDriverLatitude());
                driverInfo.put("longitude", order.getDriverLongitude());
                trackingInfo.put("driver", driverInfo);
            }

            // Delivery location
            if (order.getDeliveryLatitude() != null && order.getDeliveryLongitude() != null) {
                Map<String, Object> deliveryLocation = new HashMap<>();
                deliveryLocation.put("latitude", order.getDeliveryLatitude());
                deliveryLocation.put("longitude", order.getDeliveryLongitude());
                trackingInfo.put("deliveryLocation", deliveryLocation);
            }

            return ResponseEntity.ok(trackingInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching tracking information");
        }
    }

    @PostMapping("/order/{orderId}/update-status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> updateData) {
        try {
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Order order = orderOpt.get();
            
            if (updateData.containsKey("status")) {
                order.setStatus((String) updateData.get("status"));
            }
            
            if (updateData.containsKey("driverName")) {
                order.setDriverName((String) updateData.get("driverName"));
            }
            
            if (updateData.containsKey("driverPhone")) {
                order.setDriverPhone((String) updateData.get("driverPhone"));
            }
            
            if (updateData.containsKey("driverLatitude")) {
                order.setDriverLatitude(((Number) updateData.get("driverLatitude")).doubleValue());
            }
            
            if (updateData.containsKey("driverLongitude")) {
                order.setDriverLongitude(((Number) updateData.get("driverLongitude")).doubleValue());
            }
            
            if (updateData.containsKey("deliveryAddress")) {
                order.setDeliveryAddress((String) updateData.get("deliveryAddress"));
            }
            
            if (updateData.containsKey("deliveryLatitude")) {
                order.setDeliveryLatitude(((Number) updateData.get("deliveryLatitude")).doubleValue());
            }
            
            if (updateData.containsKey("deliveryLongitude")) {
                order.setDeliveryLongitude(((Number) updateData.get("deliveryLongitude")).doubleValue());
            }
            
            if (updateData.containsKey("trackingNotes")) {
                order.setTrackingNotes((String) updateData.get("trackingNotes"));
            }
            
            if (updateData.containsKey("estimatedDeliveryTime")) {
                // For simplicity, we'll add minutes to current time
                int minutesToAdd = ((Number) updateData.get("estimatedDeliveryTime")).intValue();
                order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(minutesToAdd));
            }

            orderRepository.save(order);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Order tracking updated successfully");
            response.put("status", order.getStatus());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating order tracking");
        }
    }

    // Simulate driver location updates (for demo purposes)
    @PostMapping("/order/{orderId}/simulate-delivery")
    public ResponseEntity<?> simulateDelivery(@PathVariable Long orderId) {
        try {
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Order order = orderOpt.get();
            
            // Set demo driver info
            order.setDriverName("John Doe");
            order.setDriverPhone("+1234567890");
            order.setStatus("OUT_FOR_DELIVERY");
            
            // Set demo delivery location (Bangalore coordinates)
            order.setDeliveryLatitude(12.9716);
            order.setDeliveryLongitude(77.5946);
            order.setDeliveryAddress("123 Main Street, Bangalore, India");
            
            // Set demo driver location (slightly offset from delivery)
            order.setDriverLatitude(12.9700);
            order.setDriverLongitude(77.5930);
            
            // Set estimated delivery time (30 minutes from now)
            order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(30));
            order.setTrackingNotes("Driver is on the way to your location");

            orderRepository.save(order);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Delivery simulation started");
            response.put("driverName", order.getDriverName());
            response.put("estimatedTime", "30 minutes");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error starting delivery simulation");
        }
    }
}