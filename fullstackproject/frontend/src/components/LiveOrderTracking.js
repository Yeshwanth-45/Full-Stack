import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LiveOrderTracking = ({ orderId }) => {
    const [order, setOrder] = useState(null);
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const intervalRef = useRef(null);
    const token = localStorage.getItem('token');

    // Fetch order details
    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setOrder(data);
                
                // Simulate delivery partner location (in real app, this would come from GPS)
                if (data.status === 'OUT_FOR_DELIVERY' || data.status === 'NEARBY') {
                    simulateDeliveryLocation(data);
                }
                
                setLoading(false);
            } else {
                setError('Failed to load order details');
                setLoading(false);
            }
        } catch (err) {
            setError('Cannot connect to server');
            setLoading(false);
        }
    };

    // Simulate delivery partner movement (in real app, use actual GPS data)
    const simulateDeliveryLocation = (orderData) => {
        const restaurantLat = orderData.restaurant?.latitude || 17.4239;
        const restaurantLng = orderData.restaurant?.longitude || 78.4738;
        const deliveryLat = orderData.deliveryLatitude || 17.4326;
        const deliveryLng = orderData.deliveryLongitude || 78.4071;

        // Calculate midpoint for simulation
        const currentLat = (restaurantLat + deliveryLat) / 2;
        const currentLng = (restaurantLng + deliveryLng) / 2;

        setDeliveryLocation({
            lat: currentLat,
            lng: currentLng
        });
    };

    useEffect(() => {
        fetchOrderDetails();

        // Poll for updates every 10 seconds
        intervalRef.current = setInterval(() => {
            fetchOrderDetails();
        }, 10000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [orderId]);

    const getStatusProgress = (status) => {
        const statuses = {
            'PENDING': 0,
            'CONFIRMED': 20,
            'PREPARING': 40,
            'READY': 60,
            'OUT_FOR_DELIVERY': 80,
            'NEARBY': 90,
            'DELIVERED': 100
        };
        return statuses[status] || 0;
    };

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': '#fbbf24',
            'CONFIRMED': '#60a5fa',
            'PREPARING': '#f97316',
            'READY': '#8b5cf6',
            'OUT_FOR_DELIVERY': '#10b981',
            'NEARBY': '#06b6d4',
            'DELIVERED': '#22c55e',
            'CANCELLED': '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'PENDING': '⏳',
            'CONFIRMED': '✅',
            'PREPARING': '👨‍🍳',
            'READY': '📦',
            'OUT_FOR_DELIVERY': '🏍️',
            'NEARBY': '📍',
            'DELIVERED': '🎉',
            'CANCELLED': '❌'
        };
        return icons[status] || '📋';
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    <div style={styles.spinner}></div>
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>
                    <p>❌ {error || 'Order not found'}</p>
                </div>
            </div>
        );
    }

    const restaurantLocation = {
        lat: order.restaurant?.latitude || 17.4239,
        lng: order.restaurant?.longitude || 78.4738
    };

    const customerLocation = {
        lat: order.deliveryLatitude || 17.4326,
        lng: order.deliveryLongitude || 78.4071
    };

    const showMap = order.status === 'OUT_FOR_DELIVERY' || order.status === 'NEARBY';

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h2 style={styles.title}>Track Your Order</h2>
                <p style={styles.orderId}>Order #{order.id}</p>
            </div>

            {/* Status Progress */}
            <div style={styles.statusSection}>
                <div style={styles.statusHeader}>
                    <span style={{...styles.statusIcon, color: getStatusColor(order.status)}}>
                        {getStatusIcon(order.status)}
                    </span>
                    <div>
                        <h3 style={styles.statusTitle}>{order.status.replace(/_/g, ' ')}</h3>
                        <p style={styles.statusSubtitle}>
                            {order.status === 'DELIVERED' ? 'Your order has been delivered!' :
                             order.status === 'OUT_FOR_DELIVERY' ? 'Your order is on the way' :
                             order.status === 'PREPARING' ? 'Your food is being prepared' :
                             'Your order is being processed'}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={styles.progressBar}>
                    <div style={{
                        ...styles.progressFill,
                        width: `${getStatusProgress(order.status)}%`,
                        backgroundColor: getStatusColor(order.status)
                    }}></div>
                </div>

                {/* Timeline */}
                <div style={styles.timeline}>
                    {['CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((status, index) => {
                        const isCompleted = getStatusProgress(order.status) >= getStatusProgress(status);
                        const isCurrent = order.status === status;
                        
                        return (
                            <div key={status} style={styles.timelineItem}>
                                <div style={{
                                    ...styles.timelineDot,
                                    backgroundColor: isCompleted ? getStatusColor(status) : '#e5e7eb',
                                    transform: isCurrent ? 'scale(1.3)' : 'scale(1)'
                                }}></div>
                                <p style={{
                                    ...styles.timelineLabel,
                                    color: isCompleted ? '#111827' : '#9ca3af',
                                    fontWeight: isCurrent ? '600' : '400'
                                }}>
                                    {status.replace(/_/g, ' ')}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Live Map */}
            {showMap && deliveryLocation && (
                <div style={styles.mapSection}>
                    <h3 style={styles.mapTitle}>🗺️ Live Location</h3>
                    <div style={styles.mapContainer}>
                        <MapContainer
                            center={[deliveryLocation.lat, deliveryLocation.lng]}
                            zoom={13}
                            style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            
                            {/* Restaurant Marker */}
                            <Marker position={[restaurantLocation.lat, restaurantLocation.lng]}>
                                <Popup>
                                    <strong>{order.restaurant?.name}</strong><br/>
                                    Restaurant Location
                                </Popup>
                            </Marker>

                            {/* Delivery Partner Marker */}
                            <Marker position={[deliveryLocation.lat, deliveryLocation.lng]}>
                                <Popup>
                                    <strong>🏍️ Delivery Partner</strong><br/>
                                    {order.deliveryPartnerName || 'On the way'}
                                </Popup>
                            </Marker>

                            {/* Customer Marker */}
                            <Marker position={[customerLocation.lat, customerLocation.lng]}>
                                <Popup>
                                    <strong>📍 Your Location</strong><br/>
                                    {order.deliveryAddress}
                                </Popup>
                            </Marker>

                            {/* Route Line */}
                            <Polyline
                                positions={[
                                    [restaurantLocation.lat, restaurantLocation.lng],
                                    [deliveryLocation.lat, deliveryLocation.lng],
                                    [customerLocation.lat, customerLocation.lng]
                                ]}
                                color="#10b981"
                                weight={3}
                                opacity={0.7}
                                dashArray="10, 10"
                            />
                        </MapContainer>
                    </div>
                </div>
            )}

            {/* Delivery Partner Info */}
            {(order.status === 'OUT_FOR_DELIVERY' || order.status === 'NEARBY') && (
                <div style={styles.deliveryPartner}>
                    <h3 style={styles.sectionTitle}>🏍️ Delivery Partner</h3>
                    <div style={styles.partnerCard}>
                        <div style={styles.partnerAvatar}>
                            {(order.deliveryPartnerName || 'D')[0].toUpperCase()}
                        </div>
                        <div style={styles.partnerInfo}>
                            <h4 style={styles.partnerName}>{order.deliveryPartnerName || 'Delivery Partner'}</h4>
                            <p style={styles.partnerRating}>⭐ {order.deliveryPartnerRating || '4.5'}</p>
                        </div>
                        {order.deliveryPartnerPhone && (
                            <a href={`tel:${order.deliveryPartnerPhone}`} style={styles.callButton}>
                                📞 Call
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Order Details */}
            <div style={styles.orderDetails}>
                <h3 style={styles.sectionTitle}>📦 Order Details</h3>
                <div style={styles.detailsCard}>
                    <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Restaurant:</span>
                        <span style={styles.detailValue}>{order.restaurant?.name}</span>
                    </div>
                    <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Items:</span>
                        <span style={styles.detailValue}>{order.items?.length || 0} items</span>
                    </div>
                    <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Total:</span>
                        <span style={styles.detailValue}>₹{order.total?.toFixed(2)}</span>
                    </div>
                    <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Delivery Address:</span>
                        <span style={styles.detailValue}>{order.deliveryAddress}</span>
                    </div>
                    {order.estimatedDeliveryTime && (
                        <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Est. Delivery:</span>
                            <span style={styles.detailValue}>{order.estimatedDeliveryTime} mins</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    loading: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6b7280'
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
    },
    error: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#ef4444',
        fontSize: '18px'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '8px'
    },
    orderId: {
        fontSize: '14px',
        color: '#6b7280'
    },
    statusSection: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    statusHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px'
    },
    statusIcon: {
        fontSize: '48px'
    },
    statusTitle: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '4px',
        textTransform: 'capitalize'
    },
    statusSubtitle: {
        fontSize: '14px',
        color: '#6b7280'
    },
    progressBar: {
        width: '100%',
        height: '8px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '24px'
    },
    progressFill: {
        height: '100%',
        transition: 'width 0.5s ease',
        borderRadius: '4px'
    },
    timeline: {
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative'
    },
    timelineItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
    },
    timelineDot: {
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        marginBottom: '8px',
        transition: 'all 0.3s ease'
    },
    timelineLabel: {
        fontSize: '11px',
        textAlign: 'center',
        textTransform: 'capitalize'
    },
    mapSection: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    mapTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '16px'
    },
    mapContainer: {
        height: '400px',
        borderRadius: '12px',
        overflow: 'hidden'
    },
    deliveryPartner: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '16px'
    },
    partnerCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '12px'
    },
    partnerAvatar: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: '600'
    },
    partnerInfo: {
        flex: 1
    },
    partnerName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '4px'
    },
    partnerRating: {
        fontSize: '14px',
        color: '#6b7280'
    },
    callButton: {
        padding: '10px 20px',
        background: '#10b981',
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background 0.3s'
    },
    orderDetails: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    detailsCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    detailRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid #f3f4f6'
    },
    detailLabel: {
        fontSize: '14px',
        color: '#6b7280',
        fontWeight: '500'
    },
    detailValue: {
        fontSize: '14px',
        color: '#111827',
        fontWeight: '600',
        textAlign: 'right'
    }
};

export default LiveOrderTracking;
