package com.example.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column
    private String imageUrl;

    @Column
    private String category;

    @Column
    private Boolean isAvailable = true;

    @Column
    private String hygieneRating = "Excellent"; // Excellent, Good, Average

    @Column
    private Boolean isVeg = true;

    @Column
    private Boolean isSpicy = false;

    @Column
    private Boolean isBestseller = false;

    @Column
    private Integer preparationTime = 15; // minutes

    @Column
    private Boolean isGlutenFree = false;

    @Column
    private Boolean isJain = false;

    @Column
    private Boolean isKeto = false;

    @Column
    private String spiceLevel = "Medium"; // Mild, Medium, Hot, Extra Hot

    @Column
    private Integer calories = 0;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    @JsonIgnore
    private Restaurant restaurant;

    public MenuItem() {
    }

    public MenuItem(String name, Double price, String category, Restaurant restaurant) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.restaurant = restaurant;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public String getHygieneRating() {
        return hygieneRating;
    }

    public void setHygieneRating(String hygieneRating) {
        this.hygieneRating = hygieneRating;
    }

    public Boolean getIsVeg() {
        return isVeg;
    }

    public void setIsVeg(Boolean isVeg) {
        this.isVeg = isVeg;
    }

    public Boolean getIsSpicy() {
        return isSpicy;
    }

    public void setIsSpicy(Boolean isSpicy) {
        this.isSpicy = isSpicy;
    }

    public Boolean getIsBestseller() {
        return isBestseller;
    }

    public void setIsBestseller(Boolean isBestseller) {
        this.isBestseller = isBestseller;
    }

    public Integer getPreparationTime() {
        return preparationTime;
    }

    public void setPreparationTime(Integer preparationTime) {
        this.preparationTime = preparationTime;
    }

    public Boolean getIsGlutenFree() {
        return isGlutenFree;
    }

    public void setIsGlutenFree(Boolean isGlutenFree) {
        this.isGlutenFree = isGlutenFree;
    }

    public Boolean getIsJain() {
        return isJain;
    }

    public void setIsJain(Boolean isJain) {
        this.isJain = isJain;
    }

    public Boolean getIsKeto() {
        return isKeto;
    }

    public void setIsKeto(Boolean isKeto) {
        this.isKeto = isKeto;
    }

    public String getSpiceLevel() {
        return spiceLevel;
    }

    public void setSpiceLevel(String spiceLevel) {
        this.spiceLevel = spiceLevel;
    }

    public Integer getCalories() {
        return calories;
    }

    public void setCalories(Integer calories) {
        this.calories = calories;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }
}
