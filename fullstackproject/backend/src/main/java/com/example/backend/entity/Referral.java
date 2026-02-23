package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "referrals")
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "referrer_id", nullable = false)
    private User referrer;

    @ManyToOne
    @JoinColumn(name = "referred_id")
    private User referred;

    @Column(unique = true, nullable = false)
    private String referralCode;

    private String referredEmail;
    private String referredPhone;

    private String status = "PENDING"; // PENDING, COMPLETED, EXPIRED

    private Double referrerReward = 0.0;
    private Double referredReward = 0.0;
    private Integer referrerPoints = 0;
    private Integer referredPoints = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;
    private LocalDateTime expiresAt;

    public Referral() {}

    public Referral(User referrer, String referralCode) {
        this.referrer = referrer;
        this.referralCode = referralCode;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusDays(30);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getReferrer() { return referrer; }
    public void setReferrer(User referrer) { this.referrer = referrer; }

    public User getReferred() { return referred; }
    public void setReferred(User referred) { this.referred = referred; }

    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }

    public String getReferredEmail() { return referredEmail; }
    public void setReferredEmail(String referredEmail) { this.referredEmail = referredEmail; }

    public String getReferredPhone() { return referredPhone; }
    public void setReferredPhone(String referredPhone) { this.referredPhone = referredPhone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getReferrerReward() { return referrerReward; }
    public void setReferrerReward(Double referrerReward) { this.referrerReward = referrerReward; }

    public Double getReferredReward() { return referredReward; }
    public void setReferredReward(Double referredReward) { this.referredReward = referredReward; }

    public Integer getReferrerPoints() { return referrerPoints; }
    public void setReferrerPoints(Integer referrerPoints) { this.referrerPoints = referrerPoints; }

    public Integer getReferredPoints() { return referredPoints; }
    public void setReferredPoints(Integer referredPoints) { this.referredPoints = referredPoints; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
