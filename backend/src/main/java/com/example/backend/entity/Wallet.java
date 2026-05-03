package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallets")
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private Double balance = 0.0;

    private Double totalAdded = 0.0;
    private Double totalSpent = 0.0;
    private Integer loyaltyPoints = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime lastUpdated = LocalDateTime.now();

    public Wallet() {}

    public Wallet(User user) {
        this.user = user;
        this.balance = 0.0;
        this.loyaltyPoints = 0;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { 
        this.balance = balance;
        this.lastUpdated = LocalDateTime.now();
    }

    public Double getTotalAdded() { return totalAdded; }
    public void setTotalAdded(Double totalAdded) { this.totalAdded = totalAdded; }

    public Double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(Double totalSpent) { this.totalSpent = totalSpent; }

    public Integer getLoyaltyPoints() { return loyaltyPoints; }
    public void setLoyaltyPoints(Integer loyaltyPoints) { 
        this.loyaltyPoints = loyaltyPoints;
        this.lastUpdated = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public void addBalance(Double amount) {
        this.balance += amount;
        this.totalAdded += amount;
        this.lastUpdated = LocalDateTime.now();
    }

    public void deductBalance(Double amount) {
        this.balance -= amount;
        this.totalSpent += amount;
        this.lastUpdated = LocalDateTime.now();
    }

    public void addLoyaltyPoints(Integer points) {
        this.loyaltyPoints += points;
        this.lastUpdated = LocalDateTime.now();
    }

    public void redeemLoyaltyPoints(Integer points) {
        this.loyaltyPoints -= points;
        this.lastUpdated = LocalDateTime.now();
    }
}
