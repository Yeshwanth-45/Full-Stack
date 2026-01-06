package com.example.backend.service;

import com.example.backend.dto.OrderItemRequest;
import com.example.backend.dto.OrderRequest;
import com.example.backend.entity.Coupon;
import com.example.backend.entity.MenuItem;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderItem;
import com.example.backend.repository.CouponRepository;
import com.example.backend.repository.MenuItemRepository;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderItemRepository orderItemRepository;
    private final CouponRepository couponRepository;

    public OrderService(OrderRepository orderRepository,
                        MenuItemRepository menuItemRepository,
                        OrderItemRepository orderItemRepository,
                        CouponRepository couponRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderItemRepository = orderItemRepository;
        this.couponRepository = couponRepository;
    }

    // PLACE ORDER from DTO: calculates subtotal/tax/delivery/coupon and saves items
    public Order placeOrder(OrderRequest orderRequest, String email) {
        Order order = new Order();
        order.setUserEmail(email);
        order.setStatus("PLACED");

        double subtotal = 0.0;
        List<OrderItem> toSave = new ArrayList<>();

        for (OrderItemRequest reqItem : orderRequest.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(reqItem.getItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid menu item id: " + reqItem.getItemId()));
            int qty = reqItem.getQuantity() == null ? 1 : reqItem.getQuantity();
            double itemTotal = menuItem.getPrice() * qty;
            subtotal += itemTotal;

            OrderItem oi = new OrderItem();
            oi.setMenuItem(menuItem);
            oi.setQuantity(qty);
            oi.setPrice(menuItem.getPrice());
            toSave.add(oi);
        }

        double discount = 0.0;
        String appliedCoupon = null;
        if (orderRequest.getCouponCode() != null && !orderRequest.getCouponCode().isBlank()) {
            Coupon coupon = couponRepository.findByCode(orderRequest.getCouponCode()).orElse(null);
                if (coupon != null && Boolean.TRUE.equals(coupon.getActive())) {
                appliedCoupon = coupon.getCode();
                if ("PERCENT".equalsIgnoreCase(coupon.getType())) {
                    discount = subtotal * (coupon.getAmount() / 100.0);
                } else { // FLAT
                    discount = coupon.getAmount();
                }
            }
        }

        double deliveryFee = 49.0; // default
        if (subtotal >= 99.0) {
            deliveryFee = 0.0; // waive delivery for subtotal >= 99
        }

        double tax = subtotal * 0.10; // 10% tax
        double total = subtotal - discount + tax + deliveryFee;

        order.setSubtotal(subtotal);
        order.setDeliveryFee(deliveryFee);
        order.setTax(tax);
        order.setCouponCode(appliedCoupon);
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);

        for (OrderItem oi : toSave) {
            oi.setOrder(saved);
            orderItemRepository.save(oi);
        }

        return saved;
    }

    // GET ORDERS FOR LOGGED-IN USER
    public List<Order> getOrdersForUser(String email) {
        return orderRepository.findByUserEmail(email);
    }
}
