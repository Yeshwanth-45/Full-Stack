// AI Engine for FoodieHub - Personalization & Intelligence Layer

class AIEngine {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.orderHistory = this.loadOrderHistory();
        this.currentMood = null;
    }

    // Load user taste profile from localStorage
    loadUserProfile() {
        const saved = localStorage.getItem('tasteProfile');
        return saved ? JSON.parse(saved) : {
            spiceLevel: 50, // 0-100
            sweetVsSavory: 50, // 0 (savory) - 100 (sweet)
            healthyVsIndulgent: 50, // 0 (healthy) - 100 (indulgent)
            preferredCuisines: [],
            dietaryRestrictions: [],
            budgetRange: { min: 0, max: 1000 },
            favoriteRestaurants: [],
            dislikedIngredients: []
        };
    }

    // Save user profile
    saveUserProfile(profile) {
        this.userProfile = { ...this.userProfile, ...profile };
        localStorage.setItem('tasteProfile', JSON.stringify(this.userProfile));
    }

    // Load order history
    loadOrderHistory() {
        const saved = localStorage.getItem('orderHistory');
        return saved ? JSON.parse(saved) : [];
    }

    // Add order to history
    addToHistory(order) {
        this.orderHistory.unshift(order);
        if (this.orderHistory.length > 50) this.orderHistory.pop();
        localStorage.setItem('orderHistory', JSON.stringify(this.orderHistory));
    }

    // Calculate Taste Match Score (0-100%)
    calculateTasteMatch(restaurant, dish = null) {
        let score = 50; // Base score

        // Cuisine preference match
        if (this.userProfile.preferredCuisines.includes(restaurant.cuisineType)) {
            score += 20;
        }

        // Spice level match (if dish provided)
        if (dish && dish.isSpicy !== undefined) {
            const spiceDiff = Math.abs(this.userProfile.spiceLevel - (dish.isSpicy ? 80 : 20));
            score += (100 - spiceDiff) * 0.15;
        }

        // Budget match
        const avgPrice = dish ? dish.price : restaurant.deliveryFee * 5;
        if (avgPrice >= this.userProfile.budgetRange.min && avgPrice <= this.userProfile.budgetRange.max) {
            score += 15;
        }

        // Favorite restaurant bonus
        if (this.userProfile.favoriteRestaurants.includes(restaurant.id)) {
            score += 10;
        }

        // Order frequency bonus
        const orderCount = this.orderHistory.filter(o => o.restaurantId === restaurant.id).length;
        score += Math.min(orderCount * 2, 10);

        return Math.min(Math.round(score), 100);
    }

    // Mood-based recommendations
    getMoodRecommendations(mood, restaurants) {
        this.currentMood = mood;

        const moodFilters = {
            comfort: {
                cuisines: ['Indian', 'Italian', 'American'],
                keywords: ['butter', 'cheese', 'creamy', 'rich'],
                sortBy: 'rating'
            },
            party: {
                cuisines: ['Chinese', 'Mexican', 'Thai', 'Korean'],
                keywords: ['spicy', 'sharing', 'platter', 'combo'],
                sortBy: 'popularity'
            },
            healthy: {
                cuisines: ['South Indian', 'Japanese', 'Mediterranean'],
                keywords: ['salad', 'grilled', 'steamed', 'fresh'],
                sortBy: 'calories'
            },
            lazy: {
                cuisines: ['Fast Food', 'American', 'Pizza'],
                keywords: ['burger', 'pizza', 'fries', 'quick'],
                sortBy: 'deliveryTime'
            },
            quickBite: {
                cuisines: ['Fast Food', 'South Indian', 'Street Food'],
                keywords: ['snack', 'quick', 'light', 'small'],
                sortBy: 'deliveryTime'
            }
        };

        const filter = moodFilters[mood] || moodFilters.comfort;

        return restaurants
            .filter(r => filter.cuisines.includes(r.cuisineType))
            .map(r => ({
                ...r,
                moodScore: this.calculateMoodScore(r, filter),
                tasteMatch: this.calculateTasteMatch(r)
            }))
            .sort((a, b) => b.moodScore - a.moodScore);
    }

    // Calculate mood-specific score
    calculateMoodScore(restaurant, filter) {
        let score = 50;

        if (filter.cuisines.includes(restaurant.cuisineType)) score += 30;
        
        if (filter.sortBy === 'deliveryTime') {
            score += (60 - (restaurant.deliveryTime || 30)) * 0.5;
        } else if (filter.sortBy === 'rating') {
            score += (restaurant.rating || 4) * 10;
        }

        return Math.min(score, 100);
    }

    // Smart search suggestions
    getSmartSuggestions(context = {}) {
        const hour = new Date().getHours();
        const suggestions = [];

        // Time-based suggestions
        if (hour >= 6 && hour < 11) {
            suggestions.push({ text: '🌅 Breakfast Specials', filter: 'breakfast' });
        } else if (hour >= 11 && hour < 16) {
            suggestions.push({ text: '🍽️ Lunch Combos', filter: 'lunch' });
        } else if (hour >= 16 && hour < 19) {
            suggestions.push({ text: '☕ Evening Snacks', filter: 'snacks' });
        } else {
            suggestions.push({ text: '🌙 Dinner Delights', filter: 'dinner' });
        }

        // Personalized suggestions
        if (this.userProfile.spiceLevel > 70) {
            suggestions.push({ text: '🌶️ Craving Spicy?', filter: 'spicy' });
        }

        suggestions.push(
            { text: '⚡ Fastest Delivery', filter: 'fastest' },
            { text: '💰 Under Budget', filter: 'budget' },
            { text: '⭐ Top Rated', filter: 'topRated' },
            { text: '🔥 Trending Now', filter: 'trending' }
        );

        // History-based suggestions
        if (this.orderHistory.length > 0) {
            const lastOrder = this.orderHistory[0];
            suggestions.push({ 
                text: `🔄 Reorder from ${lastOrder.restaurantName}`, 
                filter: 'reorder' 
            });
        }

        return suggestions;
    }

    // Intelligent nudges
    getPersonalizedNudges(restaurant, dish = null) {
        const nudges = [];

        // Order frequency nudge
        const orderCount = this.orderHistory.filter(o => o.restaurantId === restaurant.id).length;
        if (orderCount > 3) {
            nudges.push({
                type: 'frequent',
                message: `You order here often! (${orderCount} times)`,
                icon: '💚'
            });
        }

        // Weekend pattern
        const isWeekend = [0, 6].includes(new Date().getDay());
        const weekendOrders = this.orderHistory.filter(o => 
            o.restaurantId === restaurant.id && [0, 6].includes(new Date(o.date).getDay())
        );
        if (isWeekend && weekendOrders.length > 2) {
            nudges.push({
                type: 'pattern',
                message: 'You usually order this on weekends',
                icon: '📅'
            });
        }

        // Similar to last order
        if (this.orderHistory.length > 0 && dish) {
            const lastDish = this.orderHistory[0].items?.[0];
            if (lastDish && lastDish.category === dish.category) {
                nudges.push({
                    type: 'similar',
                    message: 'Similar to your last order',
                    icon: '🔄'
                });
            }
        }

        // Taste match nudge
        const tasteMatch = this.calculateTasteMatch(restaurant, dish);
        if (tasteMatch >= 80) {
            nudges.push({
                type: 'match',
                message: `${tasteMatch}% Taste Match!`,
                icon: '🎯'
            });
        }

        return nudges;
    }

    // Delivery accuracy prediction
    calculateDeliveryAccuracy(restaurant) {
        // Mock calculation based on historical data
        const baseAccuracy = 85;
        const ratingBonus = (restaurant.rating || 4) * 2;
        const timeBonus = restaurant.deliveryTime < 30 ? 5 : 0;
        
        return Math.min(Math.round(baseAccuracy + ratingBonus + timeBonus), 99);
    }

    // Carbon footprint estimation
    calculateCarbonFootprint(distance, items) {
        // Rough estimation: 0.2 kg CO2 per km + 0.1 kg per item
        const transportEmission = distance * 0.2;
        const packagingEmission = items.length * 0.1;
        return (transportEmission + packagingEmission).toFixed(2);
    }

    // Best dish recommendation per restaurant
    getBestDish(menuItems) {
        if (!menuItems || menuItems.length === 0) return null;

        return menuItems
            .map(item => ({
                ...item,
                score: (item.rating || 4) * 20 + (item.orderCount || 0) * 0.5
            }))
            .sort((a, b) => b.score - a.score)[0];
    }

    // Smart menu sorting
    sortMenu(items, sortBy) {
        const sorted = [...items];

        switch(sortBy) {
            case 'bestRated':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'mostOrdered':
                return sorted.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
            case 'bestValue':
                return sorted.sort((a, b) => {
                    const valueA = (a.rating || 4) / a.price;
                    const valueB = (b.rating || 4) / b.price;
                    return valueB - valueA;
                });
            case 'lowCalorie':
                return sorted.sort((a, b) => (a.calories || 500) - (b.calories || 500));
            case 'tasteMatch':
                return sorted.sort((a, b) => {
                    const matchA = this.calculateTasteMatch(null, a);
                    const matchB = this.calculateTasteMatch(null, b);
                    return matchB - matchA;
                });
            default:
                return sorted;
        }
    }

    // Auto-apply best coupon
    findBestCoupon(coupons, cartTotal) {
        if (!coupons || coupons.length === 0) return null;

        return coupons
            .filter(c => cartTotal >= c.minOrder)
            .map(c => ({
                ...c,
                savings: c.type === 'percentage' 
                    ? (cartTotal * c.value / 100)
                    : c.value
            }))
            .sort((a, b) => b.savings - a.savings)[0];
    }
}

// Export singleton instance
export default new AIEngine();
