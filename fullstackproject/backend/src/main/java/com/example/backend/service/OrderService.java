package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    private final Random random = new Random();

    @Transactional
    public Order createOrder(User user, Long restaurantId, List<OrderItemRequest> itemRequests, 
                            String deliveryAddress, Double deliveryLat, Double deliveryLng) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(deliveryAddress);
        order.setDeliveryLatitude(deliveryLat);
        order.setDeliveryLongitude(deliveryLng);
        order.setStatus(Order.OrderStatus.PENDING);

        // Calculate order totals
        double itemTotal = 0.0;
        for (OrderItemRequest itemReq : itemRequests) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(menuItem.getPrice());
            orderItem.setSpecialInstructions(itemReq.getSpecialInstructions());

            order.getItems().add(orderItem);
            itemTotal += menuItem.getPrice() * itemReq.getQuantity();
        }

        // Calculate fees
        double distance = calculateDistance(restaurant.getLatitude(), restaurant.getLongitude(), 
                                           deliveryLat, deliveryLng);
        double deliveryFee = calculateDeliveryFee(itemTotal, distance);
        double platformFee = itemTotal * 0.02; // 2% platform fee
        double tax = itemTotal * 0.05; // 5% GST

        order.setTotal(itemTotal);
        order.setDeliveryFee(deliveryFee);
        order.setPlatformFee(platformFee);
        order.setTax(tax);
        order.setEstimatedDeliveryTime(calculateEstimatedDeliveryTime(distance));

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Order> getRestaurantOrders(Long restaurantId) {
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus) {
        Order order = getOrderById(orderId);
        order.setStatus(newStatus);

        // Assign delivery partner when order goes out for delivery
        if (newStatus == Order.OrderStatus.OUT_FOR_DELIVERY && order.getDeliveryPartnerName() == null) {
            assignDeliveryPartner(order);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId, String reason) {
        Order order = getOrderById(orderId);
        
        // Check if order can be cancelled
        if (order.getStatus() == Order.OrderStatus.DELIVERED || 
            order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new RuntimeException("Order cannot be cancelled");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancellationReason(reason);
        
        return orderRepository.save(order);
    }

    public OrderTrackingInfo getOrderTracking(Long orderId) {
        Order order = getOrderById(orderId);
        
        OrderTrackingInfo tracking = new OrderTrackingInfo();
        tracking.setOrderId(order.getId());
        tracking.setStatus(order.getStatus());
        tracking.setRestaurantName(order.getRestaurant().getName());
        tracking.setDeliveryAddress(order.getDeliveryAddress());
        tracking.setEstimatedDeliveryTime(calculateRemainingTime(order));
        
        if (order.getDeliveryPartnerName() != null) {
            tracking.setDeliveryPartnerName(order.getDeliveryPartnerName());
            tracking.setDeliveryPartnerPhone(order.getDeliveryPartnerPhone());
            tracking.setDeliveryPartnerRating(order.getDeliveryPartnerRating());
        }
        
        tracking.setTimeline(buildTimeline(order));
        
        return tracking;
    }

    private void assignDeliveryPartner(Order order) {
        String[] partnerNames = {"Rajesh Kumar", "Amit Singh", "Priya Sharma", "Vikram Patel", 
                                "Sanjay Reddy", "Deepak Verma", "Rahul Gupta", "Suresh Yadav"};
        String[] vehicles = {"Bike", "Scooter", "Bike", "Scooter"};
        
        order.setDeliveryPartnerName(partnerNames[random.nextInt(partnerNames.length)]);
        order.setDeliveryPartnerPhone("+91 " + (9000000000L + random.nextInt(100000000)));
        order.setDeliveryPartnerRating(4.0 + random.nextDouble() * 1.0); // 4.0 to 5.0
    }

    private double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            return 3.0; // Default 3km
        }
        
        // Haversine formula for distance calculation
        double R = 6371; // Radius of the earth in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private double calculateDeliveryFee(double itemTotal, double distance) {
        if (itemTotal >= 199) {
            return 0.0; // Free delivery for orders above ₹199
        }
        double baseFee = 40.0;
        double perKmCharge = 8.0;
        return baseFee + (distance * perKmCharge);
    }

    private int calculateEstimatedDeliveryTime(double distance) {
        // Base preparation time + delivery time
        int preparationTime = 15 + random.nextInt(10); // 15-25 minutes
        int deliveryTime = (int) (distance * 3); // 3 minutes per km
        return preparationTime + deliveryTime;
    }

    private int calculateRemainingTime(Order order) {
        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            return 0;
        }
        
        long minutesSinceOrder = ChronoUnit.MINUTES.between(order.getCreatedAt(), LocalDateTime.now());
        int remaining = order.getEstimatedDeliveryTime() - (int) minutesSinceOrder;
        return Math.max(0, remaining);
    }

    private List<TimelineEvent> buildTimeline(Order order) {
        List<TimelineEvent> timeline = new java.util.ArrayList<>();
        
        timeline.add(new TimelineEvent("Order Placed", order.getCreatedAt(), true));
        
        if (order.getConfirmedAt() != null) {
            timeline.add(new TimelineEvent("Order Confirmed", order.getConfirmedAt(), true));
        }
        
        if (order.getPreparingAt() != null) {
            timeline.add(new TimelineEvent("Preparing Food", order.getPreparingAt(), true));
        }
        
        if (order.getReadyAt() != null) {
            timeline.add(new TimelineEvent("Ready for Pickup", order.getReadyAt(), true));
        }
        
        if (order.getOutForDeliveryAt() != null) {
            timeline.add(new TimelineEvent("Out for Delivery", order.getOutForDeliveryAt(), true));
        }
        
        if (order.getDeliveredAt() != null) {
            timeline.add(new TimelineEvent("Delivered", order.getDeliveredAt(), true));
        }
        
        return timeline;
    }

    // DTOs
    public static class OrderItemRequest {
        private Long menuItemId;
        private Integer quantity;
        private String specialInstructions;

        public Long getMenuItemId() {
            return menuItemId;
        }

        public void setMenuItemId(Long menuItemId) {
            this.menuItemId = menuItemId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public String getSpecialInstructions() {
            return specialInstructions;
        }

        public void setSpecialInstructions(String specialInstructions) {
            this.specialInstructions = specialInstructions;
        }
    }

    public static class OrderTrackingInfo {
        private Long orderId;
        private Order.OrderStatus status;
        private String restaurantName;
        private String deliveryAddress;
        private Integer estimatedDeliveryTime;
        private String deliveryPartnerName;
        private String deliveryPartnerPhone;
        private Double deliveryPartnerRating;
        private List<TimelineEvent> timeline;

        // Getters and Setters
        public Long getOrderId() {
            return orderId;
        }

        public void setOrderId(Long orderId) {
            this.orderId = orderId;
        }

        public Order.OrderStatus getStatus() {
            return status;
        }

        public void setStatus(Order.OrderStatus status) {
            this.status = status;
        }

        public String getRestaurantName() {
            return restaurantName;
        }

        public void setRestaurantName(String restaurantName) {
            this.restaurantName = restaurantName;
        }

        public String getDeliveryAddress() {
            return deliveryAddress;
        }

        public void setDeliveryAddress(String deliveryAddress) {
            this.deliveryAddress = deliveryAddress;
        }

        public Integer getEstimatedDeliveryTime() {
            return estimatedDeliveryTime;
        }

        public void setEstimatedDeliveryTime(Integer estimatedDeliveryTime) {
            this.estimatedDeliveryTime = estimatedDeliveryTime;
        }

        public String getDeliveryPartnerName() {
            return deliveryPartnerName;
        }

        public void setDeliveryPartnerName(String deliveryPartnerName) {
            this.deliveryPartnerName = deliveryPartnerName;
        }

        public String getDeliveryPartnerPhone() {
            return deliveryPartnerPhone;
        }

        public void setDeliveryPartnerPhone(String deliveryPartnerPhone) {
            this.deliveryPartnerPhone = deliveryPartnerPhone;
        }

        public Double getDeliveryPartnerRating() {
            return deliveryPartnerRating;
        }

        public void setDeliveryPartnerRating(Double deliveryPartnerRating) {
            this.deliveryPartnerRating = deliveryPartnerRating;
        }

        public List<TimelineEvent> getTimeline() {
            return timeline;
        }

        public void setTimeline(List<TimelineEvent> timeline) {
            this.timeline = timeline;
        }
    }

    public static class TimelineEvent {
        private String event;
        private LocalDateTime timestamp;
        private boolean completed;

        public TimelineEvent(String event, LocalDateTime timestamp, boolean completed) {
            this.event = event;
            this.timestamp = timestamp;
            this.completed = completed;
        }

        public String getEvent() {
            return event;
        }

        public void setEvent(String event) {
            this.event = event;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }

        public boolean isCompleted() {
            return completed;
        }

        public void setCompleted(boolean completed) {
            this.completed = completed;
        }
    }
}
