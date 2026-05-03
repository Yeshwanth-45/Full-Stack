package com.example.backend.repository;

import com.example.backend.entity.Favorite;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserAndFavoriteType(User user, String favoriteType);
    Optional<Favorite> findByUserAndRestaurantId(User user, Long restaurantId);
    Optional<Favorite> findByUserAndMenuItemId(User user, Long menuItemId);
    void deleteByUserAndRestaurantId(User user, Long restaurantId);
    void deleteByUserAndMenuItemId(User user, Long menuItemId);
}
