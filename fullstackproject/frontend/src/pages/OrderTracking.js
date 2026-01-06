import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GoogleMap from '../components/GoogleMap';

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/tracking/order/${orderId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setTrackingData(data);
                } else {
                    setError('Failed to load tracking information');
                }
            } catch (err) {
                setError('Cannot connect to server');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        
        // Set up polling for real-time updates
        const interval = setInterval(fetchData, 30000); // Update every 30 seconds
        
        return () => clearInterval(interval);
    }, [orderId, token, navigate]);

    const fetchTrackingData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/tracking/order/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTrackingData(data);
            } else {
                setError('Failed to load tracking information');
            }
        } catch (err) {
            setError('Cannot connect to server');
        }
    };

    const simulateDelivery = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/tracking/order/${orderId}/simulate-delivery`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                fetchTrackingData(); // Refresh tracking data
            } else {
                alert('Failed to start delivery simulation');
            }
        } catch (err) {
            alert('Cannot connect to server');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': '#FFA726',
            'CONFIRMED': '#42A5F5',
            'PREPARING': '#FF7043',
            'READY_FOR_PICKUP': '#AB47BC',
            'OUT_FOR_DELIVERY': '#26C6DA',
            'DELIVERED': '#66BB6A',
            'CANCELLED': '#EF5350'
        };
        return colors[status] || '#9E9E9E';
    };

    const getStatusSteps = () => {
        const steps = [
            { key: 'PENDING', label: 'Order Placed', icon: '📝' },
            { key: 'CONFIRMED', label: 'Confirmed', icon: '✅' },
            { key: 'PREPARING', label: 'Preparing', icon: '👨‍🍳' },
            { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', icon: '📦' },
            { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '🚗' },
            { key: 'DELIVERED', label: 'Delivered', icon: '🎉' }
        ];

        const currentStatusIndex = steps.findIndex(step => step.key === trackingData?.status);
        
        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentStatusIndex,
            active: index === currentStatusIndex
        }));
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'Not available';
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingContainer}>
                    <p>Loading tracking information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.errorContainer}>
                    <p>{error}</p>
                    <button onClick={() => navigate('/orders')} style={styles.backButton}>
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    if (!trackingData) {
        return (
            <div style={styles.container}>
                <div style={styles.errorContainer}>
                    <p>Order not found</p>
                    <button onClick={() => navigate('/orders')} style={styles.backButton}>
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const statusSteps = getStatusSteps();

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={() => navigate('/orders')} style={styles.backButton}>
                    ← Back to Orders
                </button>
                <h1 style={styles.title}>Track Order #{orderId}</h1>
                <button onClick={simulateDelivery} style={styles.simulateButton}>
                    Simulate Delivery
                </button>
            </div>

            <div style={styles.content}>
                {/* Order Status Timeline */}
                <div style={styles.statusSection}>
                    <h2 style={styles.sectionTitle}>Order Status</h2>
                    <div style={styles.timeline}>
                        {statusSteps.map((step, index) => (
                            <div key={step.key} style={styles.timelineItem}>
                                <div style={{
                                    ...styles.timelineIcon,
                                    backgroundColor: step.completed ? getStatusColor(step.key) : '#E0E0E0',
                                    color: step.completed ? 'white' : '#9E9E9E'
                                }}>
                                    {step.icon}
                                </div>
                                <div style={styles.timelineContent}>
                                    <div style={{
                                        ...styles.timelineLabel,
                                        fontWeight: step.active ? 'bold' : 'normal',
                                        color: step.completed ? '#1a1a1a' : '#9E9E9E'
                                    }}>
                                        {step.label}
                                    </div>
                                    {step.active && (
                                        <div style={styles.activeIndicator}>Current Status</div>
                                    )}
                                </div>
                                {index < statusSteps.length - 1 && (
                                    <div style={{
                                        ...styles.timelineConnector,
                                        backgroundColor: step.completed ? getStatusColor(step.key) : '#E0E0E0'
                                    }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Details */}
                <div style={styles.detailsSection}>
                    <h2 style={styles.sectionTitle}>Order Details</h2>
                    <div style={styles.detailsGrid}>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Order Time:</span>
                            <span style={styles.detailValue}>{formatTime(trackingData.createdAt)}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Last Updated:</span>
                            <span style={styles.detailValue}>{formatTime(trackingData.updatedAt)}</span>
                        </div>
                        {trackingData.estimatedDeliveryTime && (
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>Estimated Delivery:</span>
                                <span style={styles.detailValue}>{formatTime(trackingData.estimatedDeliveryTime)}</span>
                            </div>
                        )}
                        {trackingData.deliveryAddress && (
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>Delivery Address:</span>
                                <span style={styles.detailValue}>{trackingData.deliveryAddress}</span>
                            </div>
                        )}
                        {trackingData.trackingNotes && (
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>Notes:</span>
                                <span style={styles.detailValue}>{trackingData.trackingNotes}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Driver Information */}
                {trackingData.driver && (
                    <div style={styles.driverSection}>
                        <h2 style={styles.sectionTitle}>Driver Information</h2>
                        <div style={styles.driverCard}>
                            <div style={styles.driverAvatar}>👨‍💼</div>
                            <div style={styles.driverInfo}>
                                <div style={styles.driverName}>{trackingData.driver.name}</div>
                                <div style={styles.driverPhone}>{trackingData.driver.phone}</div>
                            </div>
                            <button style={styles.callButton}>
                                📞 Call Driver
                            </button>
                        </div>
                    </div>
                )}

                {/* Live Map */}
                {(trackingData.deliveryLocation || trackingData.driver) && (
                    <div style={styles.mapSection}>
                        <h2 style={styles.sectionTitle}>Live Tracking</h2>
                        <GoogleMap
                            deliveryLocation={trackingData.deliveryLocation}
                            driverLocation={trackingData.driver ? {
                                latitude: trackingData.driver.latitude,
                                longitude: trackingData.driver.longitude
                            } : null}
                            height="400px"
                        />
                        <div style={styles.mapLegend}>
                            <div style={styles.legendItem}>
                                <span style={styles.legendIcon}>📍</span>
                                <span>Delivery Location</span>
                            </div>
                            {trackingData.driver && (
                                <div style={styles.legendItem}>
                                    <span style={styles.legendIcon}>🚗</span>
                                    <span>Driver Location</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
    },
    title: {
        margin: '0',
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a1a1a'
    },
    backButton: {
        padding: '10px 16px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        textDecoration: 'none'
    },
    simulateButton: {
        padding: '10px 16px',
        background: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    content: {
        display: 'grid',
        gap: '30px'
    },
    statusSection: {
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    sectionTitle: {
        margin: '0 0 20px 0',
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a'
    },
    timeline: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    timelineItem: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
    },
    timelineIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        marginRight: '16px',
        zIndex: 2
    },
    timelineContent: {
        flex: 1
    },
    timelineLabel: {
        fontSize: '16px',
        marginBottom: '4px'
    },
    activeIndicator: {
        fontSize: '12px',
        color: '#667eea',
        fontWeight: '600'
    },
    timelineConnector: {
        position: 'absolute',
        left: '19px',
        top: '40px',
        width: '2px',
        height: '16px',
        zIndex: 1
    },
    detailsSection: {
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    detailsGrid: {
        display: 'grid',
        gap: '16px'
    },
    detailItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '12px',
        borderBottom: '1px solid #E0E0E0'
    },
    detailLabel: {
        fontWeight: '600',
        color: '#666'
    },
    detailValue: {
        color: '#1a1a1a',
        textAlign: 'right'
    },
    driverSection: {
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    driverCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        background: '#F5F5F5',
        borderRadius: '8px'
    },
    driverAvatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: '#667eea',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px'
    },
    driverInfo: {
        flex: 1
    },
    driverName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '4px'
    },
    driverPhone: {
        fontSize: '14px',
        color: '#666'
    },
    callButton: {
        padding: '8px 16px',
        background: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    mapSection: {
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    mapLegend: {
        display: 'flex',
        gap: '20px',
        marginTop: '16px',
        justifyContent: 'center'
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#666'
    },
    legendIcon: {
        fontSize: '16px'
    },
    loadingContainer: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666'
    },
    errorContainer: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#c33'
    }
};

export default OrderTracking;