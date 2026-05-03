import { useNavigate } from 'react-router-dom';
import aiEngine from '../services/aiEngine';

export default function PremiumRestaurantCard({ restaurant, isDarkMode = false }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/menu?restaurant=${restaurant.id}`);
    };

    const tasteMatch = restaurant.tasteMatch || aiEngine.calculateTasteMatch(restaurant);
    const deliveryAccuracy = restaurant.deliveryAccuracy || aiEngine.calculateDeliveryAccuracy(restaurant);
    const nudges = restaurant.nudges || aiEngine.getPersonalizedNudges(restaurant);

    // Dynamic badges
    const badges = [];
    if (restaurant.rating >= 4.7) badges.push({ text: '⭐ Top Rated', color: '#ffd93d' });
    if (restaurant.deliveryTime < 25) badges.push({ text: '⚡ Fast', color: '#48dbfb' });
    if (tasteMatch >= 80) badges.push({ text: '🎯 Perfect Match', color: '#00b894' });
    if (nudges.some(n => n.type === 'frequent')) badges.push({ text: '💚 Favorite', color: '#ff6b6b' });

    return (
        <div 
            style={{
                ...styles.card,
                ...(isDarkMode ? styles.cardDark : {})
            }}
            onClick={handleCardClick}
            className="premium-restaurant-card"
        >
            {/* Image Section */}
            <div style={styles.imageContainer}>
                <img 
                    src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'}
                    alt={restaurant.name}
                    style={styles.image}
                />
                
                {/* Gradient Overlay */}
                <div style={styles.imageOverlay} />

                {/* Badges */}
                <div style={styles.badgesContainer}>
                    {badges.slice(0, 2).map((badge) => (
                        <div 
                            key={`${badge.text}-${badge.color}`}
                            style={{
                                ...styles.badge,
                                background: badge.color
                            }}
                        >
                            {badge.text}
                        </div>
                    ))}
                </div>

                {/* Delivery Time */}
                <div style={styles.deliveryTime}>
                    ⚡ {restaurant.deliveryTime || 30} min
                </div>
            </div>

            {/* Content Section */}
            <div style={styles.content}>
                {/* Header */}
                <div style={styles.header}>
                    <h3 style={styles.name}>{restaurant.name}</h3>
                    <div style={styles.rating}>
                        <span style={styles.ratingIcon}>⭐</span>
                        <span style={styles.ratingValue}>{restaurant.rating || 4.5}</span>
                    </div>
                </div>

                <p style={styles.cuisine}>{restaurant.cuisineType}</p>

                {/* AI Scores */}
                <div style={styles.aiScores}>
                    <div style={styles.scoreItem}>
                        <div style={styles.scoreBar}>
                            <div 
                                style={{
                                    ...styles.scoreProgress,
                                    width: `${tasteMatch}%`,
                                    background: tasteMatch >= 80 ? '#00b894' : tasteMatch >= 60 ? '#feca57' : '#ff6b6b'
                                }}
                            />
                        </div>
                        <span style={styles.scoreLabel}>
                            🎯 {tasteMatch}% Taste Match
                        </span>
                    </div>

                    <div style={styles.scoreItem}>
                        <div style={styles.scoreBar}>
                            <div 
                                style={{
                                    ...styles.scoreProgress,
                                    width: `${deliveryAccuracy}%`,
                                    background: '#4facfe'
                                }}
                            />
                        </div>
                        <span style={styles.scoreLabel}>
                            📊 {deliveryAccuracy}% Delivery Accuracy
                        </span>
                    </div>
                </div>

                {/* Personalized Nudges */}
                {nudges.length > 0 && (
                    <div style={styles.nudges}>
                        {nudges.slice(0, 2).map((nudge) => (
                            <div key={`${nudge.type}-${nudge.message}`} style={styles.nudge}>
                                <span style={styles.nudgeIcon}>{nudge.icon}</span>
                                <span style={styles.nudgeText}>{nudge.message}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div style={styles.footer}>
                    <div style={styles.deliveryInfo}>
                        <span style={styles.deliveryFee}>₹{restaurant.deliveryFee || 40}</span>
                        <span style={styles.deliveryLabel}>delivery</span>
                    </div>
                    <button 
                        style={styles.orderBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick();
                        }}
                    >
                        Order Now →
                    </button>
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div style={styles.glowEffect} />
        </div>
    );
}

const styles = {
    card: {
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        transform: 'translateZ(0)'
    },
    cardDark: {
        background: '#1e293b',
        border: '1px solid #334155'
    },
    imageContainer: {
        position: 'relative',
        height: '220px',
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.4s ease'
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)'
    },
    badgesContainer: {
        position: 'absolute',
        top: '15px',
        left: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    badge: {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        color: 'white',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    },
    deliveryTime: {
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        padding: '8px 14px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600'
    },
    content: {
        padding: '20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
    },
    name: {
        margin: 0,
        fontSize: '20px',
        fontWeight: '700',
        color: '#1e293b',
        lineHeight: '1.3',
        flex: 1
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
    cuisine: {
        margin: '0 0 16px 0',
        fontSize: '14px',
        color: '#64748b',
        fontWeight: '500'
    },
    aiScores: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '16px'
    },
    scoreItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    scoreBar: {
        height: '6px',
        background: '#e2e8f0',
        borderRadius: '10px',
        overflow: 'hidden'
    },
    scoreProgress: {
        height: '100%',
        borderRadius: '10px',
        transition: 'width 0.6s ease'
    },
    scoreLabel: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#64748b'
    },
    nudges: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '16px'
    },
    nudge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        borderRadius: '12px',
        border: '1px solid rgba(102, 126, 234, 0.2)'
    },
    nudgeIcon: {
        fontSize: '16px'
    },
    nudgeText: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#667eea'
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid #e2e8f0'
    },
    deliveryInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    deliveryFee: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#1e293b'
    },
    deliveryLabel: {
        fontSize: '12px',
        color: '#64748b'
    },
    orderBtn: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
    },
    glowEffect: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        opacity: 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none'
    }
};
