package com.example.backend.controller;

import com.example.backend.entity.Order;
import com.example.backend.service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order placeOrder(
            @RequestBody Order order,
            Authentication authentication
    ) {
        return orderService.placeOrder(order, authentication.getName());
    }

    @GetMapping("/my")
    public List<Order> myOrders(Authentication authentication) {
        return orderService.getOrdersForUser(authentication.getName());
    }
}
