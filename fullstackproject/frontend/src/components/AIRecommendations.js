import { useState, useEffect } from 'react';

export default function AIRecommendations({ userPreferences, orderHistory, currentWeather }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        generateAIRecommendations();
    }, [userPreferences, orderHistory, currentWeather]);

    const generateAIRecommendations = () => {
        setLoading(true);
        
        // Simulate AI-powered recommendations based on multiple factors
        setTimeout(() => {
            const aiRecommendations = [
                {
                    id: 1,
                    title: "Perfect for Today's Weather",
                    reason: "It's cold outside, warm comfort food recommended",
                    items: [
                        { name: "Hot Chicken Soup", restaurant: "Spicy Hub", confidence: 95 },
                        { name: "Butter Chicken", restaurant: "Spicy Hub", confidence: 88 }
                    ],
                    icon: "🌡️"
                },
                {
                    id: 2,
                    title: "Based on Your Taste Profile",
                    reason: "You love spicy Indian food",
                    items: [
                        { name: "Chicken Biryani", restaurant: "Spicy Hub", confidence: 92 },
                        { name: "Paneer Tikka", restaurant: "Spicy Hub", confidence: 85 }
                    ],
                    icon: "🧠"
                },
                {
                    id: 3,
                    title: "Trending in Your Area",
                    reason: "Popular orders near you right now",
                    items: [
                        { name: "Margherita Pizza", restaurant: "Pizza Palace", confidence: 89 },
                        { name: "Cheese Burger", restaurant: "Burger Barn", confidence: 82 }
                    ],
                    icon: "📈"
                },
                {
                    id: 4,
                    title: "Healthy Choice",
                    reason: "Low calorie, high nutrition options",
                    items: [
                        { name: "Grilled Chicken Salad", restaurant: "Health Hub", confidence: 91 },
                        { name: "Quinoa Bowl", restaurant: "Health Hub", confidence: 87 }
                    ],
                    icon: "🥗"
                }
            ];
            
            setRecommendations(aiRecommendations);
            setLoading(false);
        }, 1500);
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.title}>🤖 AI Recommendations</h2>
                    <p style={styles.subtitle}>Analyzing your preferences...</p>
                </div>
                <div style={styles.loadingContainer}>
                    <div style={styles.aiLoader}></div>
                    <p style={styles.loadingText}>AI is thinking...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>🤖 AI Recommendations</h2>
                <p style={styles.subtitle}>Personalized just for you</p>
            </div>
            
            <div style={styles.recommendationsGrid}>
                {recommendations.map(rec => (
                    <div key={rec.id} style={styles.recommendationCard}>
                        <div style={styles.cardHeader}>
                            <span style={styles.icon}>{rec.icon}</span>
                            <div>
                                <h3 style={styles.cardTitle}>{rec.title}</h3>
                                <p style={styles.reason}>{rec.reason}</p>
                            </div>
                        </div>
                        
                        <div style={styles.itemsList}>
                            {rec.items.map((item, index) => (
                                <div key={index} style={styles.recommendedItem}>
                                    <div style={styles.itemInfo}>
                                        <span style={styles.itemName}>{item.name}</span>
                                        <span style={styles.restaurantName}>{item.restaurant}</span>
                                    </div>
                                    <div style={styles.confidence}>
                                        <div style={styles.confidenceBar}>
                                            <div 
                                                style={{
                                                    ...styles.confidenceFill,
                                                    width: `${item.confidence}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span style={styles.confidenceText}>{item.confidence}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <button style={styles.exploreButton}>
                            Explore These Options
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        margin: '20px 0',
        color: 'white'
    },
    header: {
        textAlign: 'center',
        marginBottom: '24px'
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '28px',
        fontWeight: '800',
        background: 'linear-gradient(45deg, #fff, #f0f8ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: {
        margin: 0,
        opacity: 0.9,
        fontSize: '16px'
    },
    loadingContainer: {
        textAlign: 'center',
        padding: '40px'
    },
    aiLoader: {
        width: '60px',
        height: '60px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
    },
    loadingText: {
        fontSize: '16px',
        opacity: 0.9
    },
    recommendationsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
    },
    recommendationCard: {
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
        padding: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '16px'
    },
    icon: {
        fontSize: '24px',
        background: 'rgba(255, 255, 255, 0.2)',
        padding: '8px',
        borderRadius: '8px'
    },
    cardTitle: {
        margin: '0 0 4px 0',
        fontSize: '18px',
        fontWeight: '700'
    },
    reason: {
        margin: 0,
        fontSize: '14px',
        opacity: 0.8
    },
    itemsList: {
        marginBottom: '16px'
    },
    recommendedItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    itemName: {
        fontSize: '16px',
        fontWeight: '600'
    },
    restaurantName: {
        fontSize: '13px',
        opacity: 0.7
    },
    confidence: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    confidenceBar: {
        width: '60px',
        height: '6px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '3px',
        overflow: 'hidden'
    },
    confidenceFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #4ade80, #22c55e)',
        borderRadius: '3px',
        transition: 'width 0.5s ease'
    },
    confidenceText: {
        fontSize: '12px',
        fontWeight: '600'
    },
    exploreButton: {
        width: '100%',
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.3s ease'
    }
};