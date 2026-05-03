package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String planType; // BASIC, PREMIUM, GOLD

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, PAUSED, CANCELLED, EXPIRED

    private Double monthlyFee;
    private Integer deliveriesPerMonth;
    private Double discountPercentage;
    private Boolean freeDelivery = false;
    private Boolean prioritySupport = false;

    private LocalDateTime startDate = LocalDateTime.now();
    private LocalDateTime endDate;
    private LocalDateTime nextBillingDate;
    private LocalDateTime cancelledAt;

    private Integer deliveriesUsed = 0;

    public Subscription() {}

    public Subscription(User user, String planType, Double monthlyFee) {
        this.user = user;
        this.planType = planType;
        this.monthlyFee = monthlyFee;
        this.startDate = LocalDateTime.now();
        this.endDate = LocalDateTime.now().plusMonths(1);
        this.nextBillingDate = LocalDateTime.now().plusMonths(1);
        this.status = "ACTIVE";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getMonthlyFee() { return monthlyFee; }
    public void setMonthlyFee(Double monthlyFee) { this.monthlyFee = monthlyFee; }

    public Integer getDeliveriesPerMonth() { return deliveriesPerMonth; }
    public void setDeliveriesPerMonth(Integer deliveriesPerMonth) { this.deliveriesPerMonth = deliveriesPerMonth; }

    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }

    public Boolean getFreeDelivery() { return freeDelivery; }
    public void setFreeDelivery(Boolean freeDelivery) { this.freeDelivery = freeDelivery; }

    public Boolean getPrioritySupport() { return prioritySupport; }
    public void setPrioritySupport(Boolean prioritySupport) { this.prioritySupport = prioritySupport; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public LocalDateTime getNextBillingDate() { return nextBillingDate; }
    public void setNextBillingDate(LocalDateTime nextBillingDate) { this.nextBillingDate = nextBillingDate; }

    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }

    public Integer getDeliveriesUsed() { return deliveriesUsed; }
    public void setDeliveriesUsed(Integer deliveriesUsed) { this.deliveriesUsed = deliveriesUsed; }

    public void incrementDeliveries() {
        this.deliveriesUsed++;
    }
}
