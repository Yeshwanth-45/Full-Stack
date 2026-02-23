package com.example.backend.repository;

import com.example.backend.entity.Subscription;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByUserAndStatus(User user, String status);
    List<Subscription> findByUserOrderByStartDateDesc(User user);
    List<Subscription> findByStatus(String status);
}
