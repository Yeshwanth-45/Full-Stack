package com.example.backend.repository;

import com.example.backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByCity(String city);
    List<Restaurant> findByCuisineType(String cuisineType);
    List<Restaurant> findByIsOpenTrue();
    List<Restaurant> findByLocation(String location);
    List<Restaurant> findByLocationAndIsOpenTrue(String location);
}
