import { useNavigate } from 'react-router-dom';
import TrustIndicators from './TrustIndicators';

export default function RestaurantCard({ restaurant, showTrustIndicators = true }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/menu?restaurant=${restaurant.id}`);
    };

    return (
        <div style={styles.restaurantCard} className="restaurant-card" onClick={handleCardClick}>
            <div style={styles.restaurantImageContainer}>
                <img 
                    src={restaurant.imageUrl || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop`}
                    alt={restaurant.name}
                    style={styles.restaurantImage}
                    className="restaurant-image"
                />
                <div style={styles.restaurantBadges}>
                    <span style={styles.discountBadge}>20% OFF</span>
                    {restaurant.rating >= 4.5 && <span style={styles.topRatedBadge}>⭐ Top Rated</span>}
                </div>
                <div style={styles.deliveryTimeOverlay}>
                    {restaurant.deliveryTime || 30} mins
                </div>
            </div>
            
            <div style={styles.restaurantInfo}>
                <div style={styles.restaurantHeader}>
                    <h3 style={styles.restaurantName}>{restaurant.name}</h3>
                    <div style={styles.rating}>
                        <span style={styles.ratingIcon}>⭐</span>
                        <span style={styles.ratingValue}>{restaurant.rating || 4.5}</span>
                    </div>
                </div>
                
                <p style={styles.restaurantCuisine}>{restaurant.cuisineType}</p>
                <p style={styles.restaurantLocation}>{restaurant.location}</p>
                
                {/* Trust Indicators */}
                {showTrustIndicators && (
                    <div style={styles.trustSection}>
                        <TrustIndicators restaurant={restaurant} />
                    </div>
                )}
                
                <div style={styles.restaurantFooter}>
                    <div style={styles.deliveryInfo}>
                        <span style={styles.deliveryFee}>₹{restaurant.deliveryFee || 40} delivery fee</span>
                        <span style={styles.deliveryTime}>• {restaurant.deliveryTime || 30} mins</span>
                    </div>
                    <button style={styles.viewMenuBtn} onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick();
                    }}>
                        View Menu →
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    restaurantCard: {
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: '1px solid #f1f5f9'
    },
    restaurantImageContainer: {
        position: 'relative',
        height: '200px',
        overflow: 'hidden'
    },
    restaurantImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease'
    },
    restaurantBadges: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    discountBadge: {
        background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)'
    },
    topRatedBadge: {
        background: 'linear-gradient(135deg, #ffd93d, #ff9500)',
        color: 'white',
        padding: '4px 10px',
        borderRadius: '16px',
        fontSize: '11px',
        fontWeight: '700',
        boxShadow: '0 2px 8px rgba(255, 217, 61, 0.3)'
    },
    deliveryTimeOverlay: {
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '600',
        backdropFilter: 'blur(10px)'
    },
    restaurantInfo: {
        padding: '20px'
    },
    restaurantHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
    },
    restaurantName: {
        margin: 0,
        fontSize: '20px',
        fontWeight: '700',
        color: '#1e293b',
        lineHeight: '1.2'
    },
    rating: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: '#f8fafc',
        padding: '6px 10px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
    },
    ratingIcon: {
        fontSize: '14px'
    },
    ratingValue: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#1e293b'
    },
    restaurantCuisine: {
        margin: '0 0 4px 0',
        fontSize: '14px',
        color: '#64748b',
        fontWeight: '500'
    },
    restaurantLocation: {
        margin: '0 0 16px 0',
        fontSize: '13px',
        color: '#94a3b8',
        fontWeight: '500'
    },
    trustSection: {
        marginBottom: '16px'
    },
    restaurantFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid #f1f5f9'
    },
    deliveryInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '13px',
        color: '#64748b'
    },
    deliveryFee: {
        fontWeight: '600'
    },
    deliveryTime: {
        fontWeight: '500'
    },
    viewMenuBtn: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
    }
};