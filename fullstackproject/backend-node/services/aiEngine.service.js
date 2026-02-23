/**
 * AI Recommendation Engine Service
 * Handles taste matching, mood-based recommendations, and personalization
 */

class AIEngineService {
    /**
     * Calculate Taste Match Score (0-100%)
     * @param {Object} userProfile - User's taste profile
     * @param {Object} restaurant - Restaurant data
     * @param {Object} dish - Optional dish data
     * @returns {number} Taste match percentage
     */
    calculateTasteMatch(userProfile, restaurant, dish = null) {
        let score = 50; // Base score

        if (!userProfile) return score;

        // Cuisine preference match (+20 points)
        if (userProfile.preferred_cuisines && 
            userProfile.preferred_cuisines.includes(restaurant.cuisine_type)) {
            score += 20;
        }

        // Spice level match (+15 points)
        if (dish && dish.spice_level !== undefined) {
            const spiceDiff = Math.abs(userProfile.spice_level - dish.spice_level);
            score += (100 - spiceDiff) * 0.15;
        }

        // Budget match (+15 points)
        const avgPrice = dish ? dish.price : restaurant.delivery_fee * 5;
        if (avgPrice >= userProfile.budget_min && avgPrice <= userProfile.budget_max) {
            score += 15;
        }

        // Favorite restaurant bonus (+10 points)
        if (userProfile.favorite_restaurants && 
            userProfile.favorite_restaurants.includes(restaurant.restaurant_id)) {
            score += 10;
        }

        return Math.min(Math.round(score), 100);
    }

    /**
     * Get mood-based restaurant recommendations
     * @param {string} mood - User's current mood
     * @param {Array} restaurants - List of restaurants
     * @param {Object} userProfile - User's taste profile
     * @returns {Array} Sorted restaurants by mood score
     */
    getMoodRecommendations(mood, restaurants, userProfile) {
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
            .filter(r => filter.cuisines.includes(r.cuisine_type))
            .map(r => ({
                ...r,
                moodScore: this.calculateMoodScore(r, filter),
                tasteMatch: this.calculateTasteMatch(userProfile, r)
            }))
            .sort((a, b) => b.moodScore - a.moodScore);
    }

    /**
     * Calculate mood-specific score
     * @param {Object} restaurant - Restaurant data
     * @param {Object} filter - Mood filter criteria
     * @returns {number} Mood score
     */
    calculateMoodScore(restaurant, filter) {
        let score = 50;

        if (filter.cuisines.includes(restaurant.cuisine_type)) {
            score += 30;
        }

        if (filter.sortBy === 'deliveryTime') {
            score += (60 - (restaurant.delivery_time || 30)) * 0.5;
        } else if (filter.sortBy === 'rating') {
            score += (restaurant.rating || 4) * 10;
        }

        return Math.min(score, 100);
    }

    /**
     * Calculate delivery accuracy score
     * @param {Object} restaurant - Restaurant data
     * @param {Array} deliveryLogs - Historical delivery data
     * @returns {number} Accuracy percentage
     */
    calculateDeliveryAccuracy(restaurant, deliveryLogs = []) {
        if (deliveryLogs.length === 0) {
            // Estimate based on rating and delivery time
            const baseAccuracy = 85;
            const ratingBonus = (restaurant.rating || 4) * 2;
            const timeBonus = restaurant.delivery_time < 30 ? 5 : 0;
            return Math.min(Math.round(baseAccuracy + ratingBonus + timeBonus), 99);
        }

        // Calculate from actual delivery logs
        const accuracyScores = deliveryLogs.map(log => log.accuracy_score);
        const avgAccuracy = accuracyScores.reduce((a, b) => a + b, 0) / accuracyScores.length;
        return Math.round(avgAccuracy);
    }

    /**
     * Generate personalized nudges
     * @param {Object} restaurant - Restaurant data
     * @param {Array} orderHistory - User's order history
     * @param {Object} dish - Optional dish data
     * @returns {Array} List of nudges
     */
    generateNudges(restaurant, orderHistory = [], dish = null) {
        const nudges = [];

        // Order frequency nudge
        const orderCount = orderHistory.filter(
            o => o.restaurant_id === restaurant.restaurant_id
        ).length;

        if (orderCount > 3) {
            nudges.push({
                type: 'frequent',
                message: `You order here often! (${orderCount} times)`,
                icon: '💚'
            });
        }

        // Weekend pattern
        const isWeekend = [0, 6].includes(new Date().getDay());
        const weekendOrders = orderHistory.filter(o => 
            o.restaurant_id === restaurant.restaurant_id && 
            [0, 6].includes(new Date(o.placed_at).getDay())
        );

        if (isWeekend && weekendOrders.length > 2) {
            nudges.push({
                type: 'pattern',
                message: 'You usually order this on weekends',
                icon: '📅'
            });
        }

        // Similar to last order
        if (orderHistory.length > 0 && dish) {
            const lastOrder = orderHistory[0];
            if (lastOrder.category === dish.category) {
                nudges.push({
                    type: 'similar',
                    message: 'Similar to your last order',
                    icon: '🔄'
                });
            }
        }

        return nudges;
    }

    /**
     * Calculate carbon footprint
     * @param {number} distance - Delivery distance in km
     * @param {number} itemCount - Number of items
     * @returns {number} CO2 emissions in kg
     */
    calculateCarbonFootprint(distance, itemCount) {
        const transportEmission = distance * 0.2; // 0.2 kg CO2 per km
        const packagingEmission = itemCount * 0.1; // 0.1 kg per item
        return parseFloat((transportEmission + packagingEmission).toFixed(2));
    }

    /**
     * Find best dish in menu
     * @param {Array} menuItems - List of menu items
     * @returns {Object} Best dish
     */
    getBestDish(menuItems) {
        if (!menuItems || menuItems.length === 0) return null;

        return menuItems
            .map(item => ({
                ...item,
                score: (item.rating || 4) * 20 + (item.order_count || 0) * 0.5
            }))
            .sort((a, b) => b.score - a.score)[0];
    }

    /**
     * Sort menu items by criteria
     * @param {Array} items - Menu items
     * @param {string} sortBy - Sort criteria
     * @param {Object} userProfile - User's taste profile
     * @returns {Array} Sorted items
     */
    sortMenu(items, sortBy, userProfile = null) {
        const sorted = [...items];

        switch(sortBy) {
            case 'bestRated':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            
            case 'mostOrdered':
                return sorted.sort((a, b) => (b.order_count || 0) - (a.order_count || 0));
            
            case 'bestValue':
                return sorted.sort((a, b) => {
                    const valueA = (a.rating || 4) / a.price;
                    const valueB = (b.rating || 4) / b.price;
                    return valueB - valueA;
                });
            
            case 'lowCalorie':
                return sorted.sort((a, b) => (a.calories || 500) - (b.calories || 500));
            
            case 'tasteMatch':
                if (!userProfile) return sorted;
                return sorted.sort((a, b) => {
                    const matchA = this.calculateTasteMatch(userProfile, null, a);
                    const matchB = this.calculateTasteMatch(userProfile, null, b);
                    return matchB - matchA;
                });
            
            default:
                return sorted;
        }
    }

    /**
     * Find best coupon for order
     * @param {Array} coupons - Available coupons
     * @param {number} cartTotal - Cart total amount
     * @returns {Object} Best coupon
     */
    findBestCoupon(coupons, cartTotal) {
        if (!coupons || coupons.length === 0) return null;

        const now = new Date();
        
        return coupons
            .filter(c => 
                c.is_active &&
                cartTotal >= c.min_order_amount &&
                new Date(c.valid_from) <= now &&
                new Date(c.valid_until) >= now &&
                c.used_count < c.usage_limit
            )
            .map(c => ({
                ...c,
                savings: c.discount_type === 'percentage' 
                    ? Math.min((cartTotal * c.discount_value / 100), c.max_discount || Infinity)
                    : c.discount_value
            }))
            .sort((a, b) => b.savings - a.savings)[0];
    }

    /**
     * Generate smart search suggestions
     * @param {Object} context - Search context (time, location, history)
     * @returns {Array} List of suggestions
     */
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

        // Standard suggestions
        suggestions.push(
            { text: '⚡ Fastest Delivery', filter: 'fastest' },
            { text: '💰 Under Budget', filter: 'budget' },
            { text: '⭐ Top Rated', filter: 'topRated' },
            { text: '🔥 Trending Now', filter: 'trending' }
        );

        // History-based suggestions
        if (context.lastOrder) {
            suggestions.push({ 
                text: `🔄 Reorder from ${context.lastOrder.restaurant_name}`, 
                filter: 'reorder' 
            });
        }

        return suggestions;
    }
}

module.exports = new AIEngineService();
