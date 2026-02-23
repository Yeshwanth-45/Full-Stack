package com.example.backend.controller;

import com.example.backend.entity.Order;
import com.example.backend.entity.User;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.ok(List.of()); // Return empty list if not authenticated
            }
            
            String email = authentication.getName();
            User user = userService.findByEmail(email);
            
            List<Order> orders = orderService.getUserOrders(user);
            
            List<Map<String, Object>> orderDTOs = orders.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of()); // Return empty list on error
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email);
            
            Order order = orderService.createOrder(
                user,
                request.getRestaurantId(),
                request.getItems(),
                request.getDeliveryAddress(),
                request.getDeliveryLatitude(),
                request.getDeliveryLongitude()
            );
            
            return ResponseEntity.ok(convertToDTO(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderById(orderId);
            return ResponseEntity.ok(convertToDTO(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{orderId}/tracking")
    public ResponseEntity<?> getOrderTracking(@PathVariable Long orderId) {
        try {
            OrderService.OrderTrackingInfo tracking = orderService.getOrderTracking(orderId);
            return ResponseEntity.ok(tracking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(request.get("status"));
            Order order = orderService.updateOrderStatus(orderId, newStatus);
            return ResponseEntity.ok(convertToDTO(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        try {
            String reason = request.getOrDefault("reason", "User cancelled");
            Order order = orderService.cancelOrder(orderId, reason);
            return ResponseEntity.ok(convertToDTO(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> getRestaurantOrders(@PathVariable Long restaurantId) {
        try {
            List<Order> orders = orderService.getRestaurantOrders(restaurantId);
            List<Map<String, Object>> orderDTOs = orders.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> convertToDTO(Order order) {
        Map<String, Object> dto = new java.util.HashMap<>();
        dto.put("id", order.getId());
        dto.put("restaurantId", order.getRestaurant().getId());
        dto.put("restaurantName", order.getRestaurant().getName());
        dto.put("status", order.getStatus().toString());
        dto.put("total", order.getTotal() + order.getDeliveryFee() + order.getPlatformFee() + order.getTax() - order.getDiscount());
        dto.put("itemTotal", order.getTotal());
        dto.put("deliveryFee", order.getDeliveryFee());
        dto.put("platformFee", order.getPlatformFee());
        dto.put("tax", order.getTax());
        dto.put("discount", order.getDiscount());
        dto.put("deliveryAddress", order.getDeliveryAddress());
        dto.put("estimatedDeliveryTime", order.getEstimatedDeliveryTime());
        dto.put("createdAt", order.getCreatedAt().toString());
        dto.put("items", order.getItems().stream()
                .map(item -> {
                    Map<String, Object> itemDto = new java.util.HashMap<>();
                    itemDto.put("id", item.getId());
                    itemDto.put("name", item.getMenuItem().getName());
                    itemDto.put("quantity", item.getQuantity());
                    itemDto.put("price", item.getPrice());
                    return itemDto;
                })
                .collect(Collectors.toList()));
        return dto;
    }

    public static class CreateOrderRequest {
        private Long restaurantId;
        private List<OrderService.OrderItemRequest> items;
        private String deliveryAddress;
        private Double deliveryLatitude;
        private Double deliveryLongitude;

        public Long getRestaurantId() {
            return restaurantId;
        }

        public void setRestaurantId(Long restaurantId) {
            this.restaurantId = restaurantId;
        }

        public List<OrderService.OrderItemRequest> getItems() {
            return items;
        }

        public void setItems(List<OrderService.OrderItemRequest> items) {
            this.items = items;
        }

        public String getDeliveryAddress() {
            return deliveryAddress;
        }

        public void setDeliveryAddress(String deliveryAddress) {
            this.deliveryAddress = deliveryAddress;
        }

        public Double getDeliveryLatitude() {
            return deliveryLatitude;
        }

        public void setDeliveryLatitude(Double deliveryLatitude) {
            this.deliveryLatitude = deliveryLatitude;
        }

        public Double getDeliveryLongitude() {
            return deliveryLongitude;
        }

        public void setDeliveryLongitude(Double deliveryLongitude) {
            this.deliveryLongitude = deliveryLongitude;
        }
    }
}
