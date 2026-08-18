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

    // Mock carbon footprint score (90g - 250g CO2e)
    const carbonFootprint = Math.round(110 + (restaurant.id * 17) % 110);
    const isEcoFriendly = carbonFootprint < 180;

    // Mock live order count (15 - 99 orders)
    const liveOrderCount = Math.round(20 + (restaurant.id * 11) % 65);

    // Dynamic badges
    const badges = [];
    if (restaurant.rating >= 4.7) badges.push({ text: '⭐ Top Rated', color: '#ffd93d', textColor: '#1e293b' });
    if (isEcoFriendly) badges.push({ text: '🍃 Eco-Choice', color: '#10b981', textColor: 'white' });
    if (tasteMatch >= 85) badges.push({ text: '🎯 Chef Pick', color: '#8b5cf6', textColor: 'white' });

    return (
        <div 
            style={{
                ...styles.card,
                ...(isDarkMode ? styles.cardDark : {})
            }}
            onClick={handleCardClick}
            className="premium-restaurant-card hover-lift"
        >
            {/* Image Section */}
            <div style={styles.imageContainer}>
                <img 
                    src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'}
                    alt={restaurant.name}
                    style={styles.image}
                    loading="lazy"
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
                                background: badge.color,
                                color: badge.textColor
                            }}
                        >
                            {badge.text}
                        </div>
                    ))}
                </div>

                {/* Live Order Indicator */}
                <div style={styles.liveIndicator}>
                    <span style={styles.pulseDot}></span>
                    {liveOrderCount} orders today
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
                    <div>
                        <h3 style={styles.name}>{restaurant.name}</h3>
                        <p style={styles.cuisine}>{restaurant.cuisineType} • Hyderabad</p>
                    </div>
                    <div style={styles.rating}>
                        <span style={styles.ratingIcon}>⭐</span>
                        <span style={styles.ratingValue}>{restaurant.rating || 4.5}</span>
                    </div>
                </div>

                {/* Premium Metrics Grid */}
                <div style={styles.aiScores}>
                    {/* Taste Match */}
                    <div style={styles.scoreItem}>
                        <div style={styles.scoreHeader}>
                            <span style={styles.metricTitle}>🎯 AI Taste Match</span>
                            <span style={styles.metricVal}>{tasteMatch}%</span>
                        </div>
                        <div style={styles.scoreBar}>
                            <div 
                                style={{
                                    ...styles.scoreProgress,
                                    width: `${tasteMatch}%`,
                                    background: 'linear-gradient(90deg, #667eea, #764ba2)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Delivery Accuracy */}
                    <div style={styles.scoreItem}>
                        <div style={styles.scoreHeader}>
                            <span style={styles.metricTitle}>📊 Arrival Confidence</span>
                            <span style={styles.metricVal}>{deliveryAccuracy}%</span>
                        </div>
                        <div style={styles.scoreBar}>
                            <div 
                                style={{
                                    ...styles.scoreProgress,
                                    width: `${deliveryAccuracy}%`,
                                    background: 'linear-gradient(90deg, #10b981, #059669)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Eco Score */}
                    <div style={styles.ecoRow}>
                        <span style={styles.ecoLabel}>🌱 Carbon Impact:</span>
                        <span style={{
                            ...styles.ecoValue,
                            color: isEcoFriendly ? '#10b981' : '#f59e0b'
                        }}>
                            {carbonFootprint}g CO₂e per order {isEcoFriendly ? ' (Low)' : ''}
                        </span>
                    </div>
                </div>

                {/* Personalized Nudges */}
                {nudges.length > 0 && (
                    <div style={styles.nudges}>
                        {nudges.slice(0, 1).map((nudge) => (
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
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span style={styles.deliveryFee}>₹{restaurant.deliveryFee || 40}</span>
                            {restaurant.distance && (
                                <span style={styles.distanceText}>• {restaurant.distance.toFixed(1)} km away</span>
                            )}
                        </div>
                        <span style={styles.deliveryLabel}>delivery charges</span>
                    </div>
                    <button 
                        style={styles.orderBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick();
                        }}
                    >
                        View Menu →
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: {
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        border: '1px solid rgba(226, 232, 240, 0.8)',
    },
    cardDark: {
        background: '#1e293b',
        border: '1px solid #334155'
    },
    imageContainer: {
        position: 'relative',
        height: '200px',
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
        background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)'
    },
    badgesContainer: {
        position: 'absolute',
        top: '15px',
        left: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    badge: {
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
    },
    liveIndicator: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        color: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)'
    },
    pulseDot: {
        width: '8px',
        height: '8px',
        background: '#10b981',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'pulse 1.5s infinite'
    },
    deliveryTime: {
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        background: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700'
    },
    content: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    name: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '800',
        color: '#1e293b',
        lineHeight: '1.2'
    },
    cuisine: {
        margin: '4px 0 0 0',
        fontSize: '12px',
        color: '#64748b',
        fontWeight: '600'
    },
    rating: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: '#fff9db',
        padding: '5px 10px',
        borderRadius: '10px',
        border: '1px solid #ffe066'
    },
    ratingIcon: {
        fontSize: '13px'
    },
    ratingValue: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#868e96'
    },
    aiScores: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: '#f8fafc',
        padding: '14px',
        borderRadius: '16px',
        border: '1px solid #f1f5f9'
    },
    scoreItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    scoreHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    metricTitle: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    metricVal: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#1e293b'
    },
    scoreBar: {
        height: '5px',
        background: '#cbd5e1',
        borderRadius: '10px',
        overflow: 'hidden'
    },
    scoreProgress: {
        height: '100%',
        borderRadius: '10px'
    },
    ecoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        fontWeight: '600',
        borderTop: '1px dashed #e2e8f0',
        paddingTop: '8px',
        marginTop: '2px'
    },
    ecoLabel: {
        color: '#64748b'
    },
    ecoValue: {
        fontWeight: '700'
    },
    nudges: {
        display: 'flex',
        flexDirection: 'column'
    },
    nudge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: '#f5f3ff',
        borderRadius: '12px',
        border: '1px solid #ddd6fe'
    },
    nudgeIcon: {
        fontSize: '14px'
    },
    nudgeText: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#7c3aed'
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '12px',
        borderTop: '1px solid #f1f5f9'
    },
    deliveryInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    deliveryFee: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#1e293b'
    },
    deliveryLabel: {
        fontSize: '10px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        fontWeight: '600'
    },
    distanceText: {
        fontSize: '13px',
        color: '#64748b',
        fontWeight: '600'
    },
    orderBtn: {
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(102, 126, 234, 0.2)',
        transition: 'all 0.2s ease'
    }
};
