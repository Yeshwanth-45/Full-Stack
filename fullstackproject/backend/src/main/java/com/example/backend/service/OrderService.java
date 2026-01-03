package com.example.backend.service;

import com.example.backend.entity.Order;
import com.example.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // PLACE ORDER
    public Order placeOrder(Order order, String email) {
        order.setUserEmail(email);
        order.setStatus("PLACED");
        return orderRepository.save(order);
    }

    // GET ORDERS FOR LOGGED-IN USER
    public List<Order> getOrdersForUser(String email) {
        return orderRepository.findByUserEmail(email);
    }
}
