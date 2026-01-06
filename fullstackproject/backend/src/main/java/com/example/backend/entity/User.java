package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = true)
    private String email;

    @Column(nullable = true)
    private String password;

    @Column
    private String name;

    @Column
    private String provider;

    @Column
    private String role = "USER";

    // OTP fields
    @Column(unique = true, nullable = true)
    private String phoneNumber;

    @Column
    private String otp;

    @Column
    private Long otpExpiry;

    @Column
    private Boolean otpVerified = false;

    public User() {
    }

    public User(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.provider = "LOCAL";
    }

    public User(String email, String name) {
        this.email = email;
        this.name = name;
        this.provider = "GOOGLE";
        this.password = null;
    }

    // Constructor for phone-based users
    public User(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        this.provider = "PHONE";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public Long getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(Long otpExpiry) {
        this.otpExpiry = otpExpiry;
    }

    public Boolean getOtpVerified() {
        return otpVerified;
    }

    public void setOtpVerified(Boolean otpVerified) {
        this.otpVerified = otpVerified;
    }
}
