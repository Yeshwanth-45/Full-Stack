import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const craveItems = [
    {
        id: 1,
        name: "Spicy Ramen",
        restaurant: "Noodle House",
        image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=1000&auto=format&fit=crop",
        tags: ["Spicy", "Comfort", "Hot"],
        price: "₹349",
        rating: 4.8
    },
    {
        id: 2,
        name: "Double Cheese Burger",
        restaurant: "Burger Barn",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
        tags: ["Cheesy", "American", "Filling"],
        price: "₹249",
        rating: 4.6
    },
    {
        id: 3,
        name: "Dragon Sushi Roll",
        restaurant: "Sushi Station",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop",
        tags: ["Fresh", "Japanese", "Premium"],
        price: "₹499",
        rating: 4.9
    },
    {
        id: 4,
        name: "Margherita Pizza",
        restaurant: "Pizza Palace",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1000&auto=format&fit=crop",
        tags: ["Italian", "Vegetarian", "Cheesy"],
        price: "₹299",
        rating: 4.5
    },
    {
        id: 5,
        name: "Tacos Al Pastor",
        restaurant: "Taco Fiesta",
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1000&auto=format&fit=crop",
        tags: ["Mexican", "Spicy", "Street Food"],
        price: "₹199",
        rating: 4.7
    }
];

export default function CraveSwipe({ onClose, onMatch }) {
    const [cards, setCards] = useState(craveItems);
    const [matches, setMatches] = useState([]);
    
    // To handle swiping off the deck
    const handleDragEnd = (event, info, index, item) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        
        // If swiped far enough right or fast enough to right
        if (offset > 150 || velocity > 500) {
            handleSwipe("right", index, item);
        } else if (offset < -150 || velocity < -500) {
            handleSwipe("left", index, item);
        }
    };

    const handleSwipe = (direction, index, item) => {
        if (direction === "right") {
            setMatches(prev => [...prev, item]);
            // If it's a match, trigger haptic or show a match UI
            setTimeout(() => {
                if (onMatch) onMatch(item); // Send match back to parent
            }, 300);
        }
        
        // Remove card from deck
        setCards(prev => prev.filter((_, i) => i !== index));
    };

    if (cards.length === 0) {
        return (
            <div style={styles.overlay}>
                <div style={styles.glassContainer}>
                    <h2 style={styles.title}>All Caught Up!</h2>
                    <p style={styles.subtitle}>You've found {matches.length} perfect matches.</p>
                    <div style={styles.matchesGrid}>
                        {matches.map(m => (
                            <div key={m.id} style={styles.matchBadge}>{m.name}</div>
                        ))}
                    </div>
                    <button style={styles.closeButton} onClick={onClose}>Back to Home</button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.header}>
                <h2 style={styles.headerTitle}>🔥 CraveSwipe</h2>
                <button onClick={onClose} style={styles.headerClose}>✖</button>
            </div>
            
            <div style={styles.cardContainer}>
                {cards.map((item, index) => {
                    const isTop = index === cards.length - 1;
                    return (
                        <Card 
                            key={item.id}
                            item={item}
                            isTop={isTop}
                            onDragEnd={(e, i) => handleDragEnd(e, i, index, item)}
                            onSwipeLeft={() => handleSwipe("left", index, item)}
                            onSwipeRight={() => handleSwipe("right", index, item)}
                        />
                    );
                })}
            </div>
            
            <div style={styles.instructions}>
                <p>Swipe <strong>Left</strong> to pass, Swipe <strong>Right</strong> to crave</p>
            </div>
        </div>
    );
}

const Card = ({ item, isTop, onDragEnd, onSwipeLeft, onSwipeRight }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const scale = isTop ? 1 : 0.95;
    
    // Background color overlays for visual feedback
    const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);
    const likeOpacity = useTransform(x, [0, 150], [0, 1]);

    return (
        <motion.div
            style={{
                ...styles.card,
                x: isTop ? x : 0,
                rotate: isTop ? rotate : 0,
                scale,
                zIndex: isTop ? 10 : 1
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
            whileDrag={{ scale: 1.05 }}
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div style={{...styles.cardInner, backgroundImage: `url(${item.image})`}}>
                <div style={styles.cardGradient}></div>
                
                {/* Visual Feedback Overlays */}
                <motion.div style={{ ...styles.stamp, ...styles.nopeStamp, opacity: nopeOpacity }}>
                    PASS
                </motion.div>
                <motion.div style={{ ...styles.stamp, ...styles.likeStamp, opacity: likeOpacity }}>
                    CRAVE
                </motion.div>

                <div style={styles.cardInfo}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.itemName}>{item.name}</h3>
                        <span style={styles.itemPrice}>{item.price}</span>
                    </div>
                    <p style={styles.restaurantName}>🏪 {item.restaurant} • ⭐ {item.rating}</p>
                    <div style={styles.tags}>
                        {item.tags.map(tag => (
                            <span key={tag} style={styles.tag}>{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
            
            {isTop && (
                <div style={styles.actionButtons}>
                    <button style={{...styles.actionBtn, ...styles.passBtn}} onClick={onSwipeLeft}>✖</button>
                    <button style={{...styles.actionBtn, ...styles.craveBtn}} onClick={onSwipeRight}>❤️</button>
                </div>
            )}
        </motion.div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(15px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    header: {
        position: 'absolute',
        top: '40px',
        width: '100%',
        padding: '0 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000
    },
    headerTitle: {
        color: '#fff',
        margin: 0,
        fontSize: '1.8rem',
        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        fontStyle: 'italic',
        fontWeight: '900',
        background: 'linear-gradient(90deg, #ff6b6b, #f093fb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    headerClose: {
        background: 'rgba(255,255,255,0.2)',
        border: 'none',
        color: '#fff',
        width: '40px', height: '40px',
        borderRadius: '50%',
        fontSize: '1.2rem',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)'
    },
    cardContainer: {
        position: 'relative',
        width: '90%',
        maxWidth: '400px',
        height: '60vh',
        maxHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px'
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '24px',
        background: '#fff',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column'
    },
    cardInner: {
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '24px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
    },
    cardGradient: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '50%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
    },
    cardInfo: {
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        color: '#fff',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '5px'
    },
    itemName: {
        margin: 0,
        fontSize: '2rem',
        fontWeight: '800',
        lineHeight: 1.1,
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
    },
    itemPrice: {
        fontSize: '1.5rem',
        fontWeight: '700',
        background: 'rgba(255,255,255,0.2)',
        padding: '5px 12px',
        borderRadius: '12px',
        backdropFilter: 'blur(5px)'
    },
    restaurantName: {
        margin: '5px 0 15px 0',
        fontSize: '1.1rem',
        color: '#e2e8f0',
        fontWeight: '500'
    },
    tags: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
    },
    tag: {
        background: 'rgba(255,255,255,0.15)',
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '0.85rem',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.3)'
    },
    actionButtons: {
        position: 'absolute',
        bottom: '-80px',
        left: 0, right: 0,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '0 20px'
    },
    actionBtn: {
        width: '65px',
        height: '65px',
        borderRadius: '50%',
        border: 'none',
        fontSize: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s ease',
    },
    passBtn: {
        background: '#fff',
        color: '#ff6b6b',
        border: '4px solid #f1f5f9'
    },
    craveBtn: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: '#fff',
        transform: 'scale(1.1)',
        boxShadow: '0 10px 30px rgba(245, 87, 108, 0.4)'
    },
    instructions: {
        position: 'absolute',
        bottom: '20px',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.9rem',
        letterSpacing: '1px'
    },
    stamp: {
        position: 'absolute',
        top: '40px',
        padding: '5px 15px',
        border: '4px solid',
        borderRadius: '10px',
        fontSize: '3rem',
        fontWeight: '900',
        textTransform: 'uppercase',
        zIndex: 10
    },
    nopeStamp: {
        right: '20px',
        color: '#ff6b6b',
        borderColor: '#ff6b6b',
        transform: 'rotate(15deg)'
    },
    likeStamp: {
        left: '20px',
        color: '#4ade80',
        borderColor: '#4ade80',
        transform: 'rotate(-15deg)'
    },
    glassContainer: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        padding: '40px',
        borderRadius: '30px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff',
        maxWidth: '400px'
    },
    title: {
        fontSize: '2.5rem',
        margin: '0 0 10px 0',
        fontWeight: '800'
    },
    subtitle: {
        fontSize: '1.1rem',
        marginBottom: '20px',
        opacity: 0.9
    },
    matchesGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '30px'
    },
    matchBadge: {
        background: 'rgba(245, 87, 108, 0.2)',
        border: '1px solid rgba(245, 87, 108, 0.5)',
        padding: '8px 16px',
        borderRadius: '20px',
        color: '#ffb3c6'
    },
    closeButton: {
        background: '#fff',
        color: '#0f172a',
        border: 'none',
        padding: '12px 30px',
        borderRadius: '30px',
        fontSize: '1.1rem',
        fontWeight: '700',
        cursor: 'pointer'
    }
};
