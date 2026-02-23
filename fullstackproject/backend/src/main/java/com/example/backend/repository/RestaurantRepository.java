package com.example.backend.repository;

import com.example.backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByCity(String city);
    List<Restaurant> findByCuisineType(String cuisineType);
    Optional<Restaurant> findByEmail(String email);
    boolean existsByEmail(String email);
}