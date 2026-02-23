package com.example.backend.repository;

import com.example.backend.entity.Referral;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, Long> {
    Optional<Referral> findByReferralCode(String referralCode);
    List<Referral> findByReferrerOrderByCreatedAtDesc(User referrer);
    List<Referral> findByReferrerIdOrderByCreatedAtDesc(Long referrerId);
    Long countByReferrerAndStatus(User referrer, String status);
}
