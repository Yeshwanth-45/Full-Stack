package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    // "PERCENT" or "FLAT"
    @Column(nullable = false)
    private String type;

    // amount meaning depends on type: percent (10 for 10%), flat amount otherwise
    @Column(nullable = false)
    private Double amount;

    private Boolean active = true;

    public Coupon() {}

    public Coupon(String code, String type, Double amount) {
        this.code = code;
        this.type = type;
        this.amount = amount;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
