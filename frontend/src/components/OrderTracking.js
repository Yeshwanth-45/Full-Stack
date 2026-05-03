import { useState, useEffect } from 'react';

export default function OrderTracking({ orderId, onClose }) {
    const [orderStatus, setOrderStatus] = useState('confirmed');
    const [eta, setEta] = useState(30);
    const [orderDetails, setOrderDetails] = useState(null);
    const [deliveryPartner, setDeliveryPartner] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const trackingStates = [
        { 
            id: 'confirmed', 
            label: 'Order Confirmed', 
            icon: '✅', 
            description: 'Restaurant has received your order',
            estimatedTime: 2
        },
        { 
            id: 'preparing', 
            label: 'Preparing Your Food', 
            icon: '👨‍🍳', 
            description: 'Chef is cooking your delicious meal',
            estimatedTime: 15
        },
        { 
            id: 'ready', 
            label: 'Ready for Pickup', 
            icon: '📦', 
            description: 'Food is packed and ready',
            estimatedTime: 20
        },
        { 
            id: 'out_for_delivery', 
            label: 'Out for Delivery', 
            icon: '🚚', 
            description: 'Delivery partner is on the way',
            estimatedTime: 25
        },
        { 
            id: 'nearby', 
            label: 'Nearby', 
            icon: '📍', 
            description: 'Delivery partner is 5 minutes away',
            estimatedTime: 28
        },
        { 
            id: 'delivered', 
            label: 'Delivered', 
            icon: '🎉', 
            description: 'Enjoy your meal!',
            estimatedTime: 30
        }
    ];

    useEffect(() => {
        // Load order details
        const loadOrderDetails = () => {
            // Mock order data - in real app, fetch from API
            setOrderDetails({
                id: orderId,
                restaurant: 'Spicy Hub',
                items: ['Butter Chicken', 'Naan Bread', 'Basmati Rice'],
                total: 450,
                address: '123 Main Street, Banjara Hills',
                phone: '+91 98765 43210'
            });
        };

        // Simulate order progression
        const simulateOrderProgress = () => {
            const progressSteps = [
                { status: 'confirmed', delay: 0, eta: 30 },
                { status: 'preparing', delay: 2000, eta: 28 },
                { status: 'ready', delay: 15000, eta: 15 },
                { status: 'out_for_delivery', delay: 20000, eta: 10 },
                { status: 'nearby', delay: 25000, eta: 5 },
                { status: 'delivered', delay: 30000, eta: 0 }
            ];

            progressSteps.forEach(step => {
                setTimeout(() => {
                    setOrderStatus(step.status);
                    setEta(step.eta);
                    
                    // Add notification
                    const currentState = trackingStates.find(s => s.id === step.status);
                    if (currentState) {
                        setNotifications(prev => [...prev, {
                            id: Date.now(),
                            message: currentState.description,
                            time: new Date().toLocaleTimeString(),
                            status: step.status
                        }]);
                    }

                    // Assign delivery partner when out for delivery
                    if (step.status === 'out_for_delivery') {
                        setDeliveryPartner({
                            name: 'Rajesh Kumar',
                            phone: '+91 98765 12345',
                            rating: 4.8,
                            vehicle: 'Bike',
                            location: { lat: 17.4065, lng: 78.4772 }
                        });
                    }
                }, step.delay);
            });
        };

        loadOrderDetails();
        simulateOrderProgress();
    }, [orderId]);

    const getCurrentStateIndex = () => {
        return trackingStates.findIndex(state => state.id === orderStatus);
    };

    const getStatusColor = (stateId) => {
        const currentIndex = getCurrentStateIndex();
        const stateIndex = trackingStates.findIndex(state => state.id === stateId);
        
        if (stateIndex < currentIndex) return '#10b981'; // Completed - green
        if (stateIndex === currentIndex) return '#3b82f6'; // Current - blue
        return '#e5e7eb'; // Pending - gray
    };

    const callDeliveryPartner = () => {
        if (deliveryPartner) {
            window.open(`tel:${deliveryPartner.phone}`);
        }
    };

    const shareLocation = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Order Location',
                text: 'Track my food delivery',
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Tracking link copied to clipboard!');
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>🚚 Track Your Order</h2>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {/* ETA Display */}
                <div style={styles.etaSection}>
                    <div style={styles.etaDisplay}>
                        <div style={styles.etaTime}>
                            {eta > 0 ? `${eta} min` : 'Delivered!'}
                        </div>
                        <div style={styles.etaLabel}>
                            {eta > 0 ? 'Estimated arrival' : 'Order completed'}
                        </div>
                    </div>
                    
                    {orderDetails && (
                        <div style={styles.orderSummary}>
                            <div style={styles.restaurantInfo}>
                                <span style={styles.restaurantName}>{orderDetails.restaurant}</span>
                                <span style={styles.orderTotal}>₹{orderDetails.total}</span>
                            </div>
                            <div style={styles.orderItems}>
                                {orderDetails.items.join(', ')}
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Timeline */}
                <div style={styles.timelineSection}>
                    <h3 style={styles.sectionTitle}>Order Progress</h3>
                    <div style={styles.timeline}>
                        {trackingStates.map((state, index) => {
                            const isCompleted = index < getCurrentStateIndex();
                            const isCurrent = index === getCurrentStateIndex();
                            const isPending = index > getCurrentStateIndex();
                            
                            return (
                                <div key={state.id} style={styles.timelineItem}>
                                    <div style={styles.timelineLeft}>
                                        <div style={{
                                            ...styles.timelineIcon,
                                            background: getStatusColor(state.id),
                                            color: isPending ? '#9ca3af' : 'white'
                                        }}>
                                            {state.icon}
                                        </div>
                                        {index < trackingStates.length - 1 && (
                                            <div style={{
                                                ...styles.timelineLine,
                                                background: isCompleted ? '#10b981' : '#e5e7eb'
                                            }}></div>
                                        )}
                                    </div>
                                    
                                    <div style={styles.timelineContent}>
                                        <div style={styles.timelineHeader}>
                                            <h4 style={{
                                                ...styles.timelineTitle,
                                                color: isPending ? '#9ca3af' : '#1e293b'
                                            }}>
                                                {state.label}
                                            </h4>
                                            {isCurrent && (
                                                <span style={styles.currentBadge}>Current</span>
                                            )}
                                            {isCompleted && (
                                                <span style={styles.completedTime}>
                                                    {new Date().toLocaleTimeString()}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{
                                            ...styles.timelineDescription,
                                            color: isPending ? '#9ca3af' : '#64748b'
                                        }}>
                                            {state.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Delivery Partner Info */}
                {deliveryPartner && (
                    <div style={styles.deliveryPartnerSection}>
                        <h3 style={styles.sectionTitle}>Your Delivery Partner</h3>
                        <div style={styles.partnerCard}>
                            <div style={styles.partnerInfo}>
                                <div style={styles.partnerAvatar}>
                                    {deliveryPartner.name.charAt(0)}
                                </div>
                                <div style={styles.partnerDetails}>
                                    <h4 style={styles.partnerName}>{deliveryPartner.name}</h4>
                                    <div style={styles.partnerMeta}>
                                        <span style={styles.partnerRating}>
                                            ⭐ {deliveryPartner.rating}
                                        </span>
                                        <span style={styles.partnerVehicle}>
                                            🏍️ {deliveryPartner.vehicle}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.partnerActions}>
                                <button onClick={callDeliveryPartner} style={styles.callBtn}>
                                    📞 Call
                                </button>
                                <button onClick={shareLocation} style={styles.shareBtn}>
                                    📍 Share Location
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Live Map Placeholder */}
                <div style={styles.mapSection}>
                    <h3 style={styles.sectionTitle}>Live Tracking</h3>
                    <div style={styles.mapPlaceholder}>
                        <div style={styles.mapIcon}>🗺️</div>
                        <p style={styles.mapText}>
                            {deliveryPartner ? 
                                `${deliveryPartner.name} is on the way to your location` :
                                'Preparing your order at the restaurant'
                            }
                        </p>
                        <div style={styles.mapRoute}>
                            <div style={styles.routePoint}>🏪 Restaurant</div>
                            <div style={styles.routeLine}></div>
                            {deliveryPartner && <div style={styles.routePoint}>🚚 Delivery Partner</div>}
                            <div style={styles.routeLine}></div>
                            <div style={styles.routePoint}>🏠 Your Location</div>
                        </div>
                    </div>
                </div>

                {/* Recent Notifications */}
                {notifications.length > 0 && (
                    <div style={styles.notificationsSection}>
                        <h3 style={styles.sectionTitle}>Recent Updates</h3>
                        <div style={styles.notificationsList}>
                            {notifications.slice(-3).reverse().map(notification => (
                                <div key={notification.id} style={styles.notificationItem}>
                                    <div style={styles.notificationTime}>{notification.time}</div>
                                    <div style={styles.notificationMessage}>{notification.message}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={styles.actionButtons}>
                    <button style={styles.helpBtn}>
                        ❓ Need Help?
                    </button>
                    <button style={styles.cancelBtn}>
                        ❌ Cancel Order
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '20px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    header: {
        padding: '24px 24px 0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        background: 'white',
        zIndex: 1
    },
    title: {
        margin: 0,
        fontSize: '24px',
        fontWeight: '800',
        color: '#1e293b'
    },
    closeBtn: {
        background: '#f1f5f9',
        border: 'none',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#64748b'
    },
    etaSection: {
        padding: '24px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        textAlign: 'center'
    },
    etaDisplay: {
        marginBottom: '16px'
    },
    etaTime: {
        fontSize: '48px',
        fontWeight: '800',
        marginBottom: '8px'
    },
    etaLabel: {
        fontSize: '16px',
        opacity: 0.9
    },
    orderSummary: {
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '16px'
    },
    restaurantInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    restaurantName: {
        fontSize: '18px',
        fontWeight: '700'
    },
    orderTotal: {
        fontSize: '18px',
        fontWeight: '700'
    },
    orderItems: {
        fontSize: '14px',
        opacity: 0.9
    },
    timelineSection: {
        padding: '24px'
    },
    sectionTitle: {
        margin: '0 0 20px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1e293b'
    },
    timeline: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    timelineItem: {
        display: 'flex',
        gap: '16px'
    },
    timelineLeft: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '40px'
    },
    timelineIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: '600',
        zIndex: 1
    },
    timelineLine: {
        width: '2px',
        height: '30px',
        marginTop: '8px'
    },
    timelineContent: {
        flex: 1,
        paddingBottom: '8px'
    },
    timelineHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '4px'
    },
    timelineTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '600'
    },
    currentBadge: {
        padding: '4px 8px',
        background: '#3b82f6',
        color: 'white',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600'
    },
    completedTime: {
        fontSize: '12px',
        color: '#10b981',
        fontWeight: '600'
    },
    timelineDescription: {
        margin: 0,
        fontSize: '14px'
    },
    deliveryPartnerSection: {
        padding: '0 24px 24px 24px'
    },
    partnerCard: {
        background: '#f8fafc',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #e2e8f0'
    },
    partnerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px'
    },
    partnerAvatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: '700'
    },
    partnerDetails: {
        flex: 1
    },
    partnerName: {
        margin: '0 0 4px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1e293b'
    },
    partnerMeta: {
        display: 'flex',
        gap: '16px',
        fontSize: '14px',
        color: '#64748b'
    },
    partnerRating: {
        fontWeight: '600'
    },
    partnerVehicle: {
        fontWeight: '500'
    },
    partnerActions: {
        display: 'flex',
        gap: '12px'
    },
    callBtn: {
        flex: 1,
        padding: '12px 16px',
        background: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    shareBtn: {
        flex: 1,
        padding: '12px 16px',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    mapSection: {
        padding: '0 24px 24px 24px'
    },
    mapPlaceholder: {
        background: '#f8fafc',
        borderRadius: '16px',
        padding: '40px 20px',
        textAlign: 'center',
        border: '1px solid #e2e8f0'
    },
    mapIcon: {
        fontSize: '48px',
        marginBottom: '16px'
    },
    mapText: {
        margin: '0 0 24px 0',
        fontSize: '16px',
        color: '#64748b'
    },
    mapRoute: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap'
    },
    routePoint: {
        padding: '8px 12px',
        background: 'white',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#1e293b',
        border: '2px solid #e2e8f0'
    },
    routeLine: {
        width: '30px',
        height: '2px',
        background: '#d1d5db'
    },
    notificationsSection: {
        padding: '0 24px 24px 24px'
    },
    notificationsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    notificationItem: {
        display: 'flex',
        gap: '12px',
        padding: '12px 16px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
    },
    notificationTime: {
        fontSize: '12px',
        color: '#64748b',
        fontWeight: '600',
        minWidth: '60px'
    },
    notificationMessage: {
        fontSize: '14px',
        color: '#1e293b'
    },
    actionButtons: {
        padding: '0 24px 24px 24px',
        display: 'flex',
        gap: '12px'
    },
    helpBtn: {
        flex: 1,
        padding: '12px 16px',
        background: '#f59e0b',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    cancelBtn: {
        flex: 1,
        padding: '12px 16px',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    }
};