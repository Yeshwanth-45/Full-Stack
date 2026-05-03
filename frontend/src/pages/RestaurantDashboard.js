import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RestaurantDashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const [stats, setStats] = useState({
        todayOrders: 0,
        todayRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0
    });

    const token = localStorage.getItem("restaurantToken");

    useEffect(() => {
        if (!token) {
            navigate('/restaurant-login');
            return;
        }
        fetchRestaurantData();
        fetchOrders();
        // Poll for new orders every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [token, navigate]);

    const fetchRestaurantData = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/restaurant/profile', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRestaurant(data);
            }
        } catch (error) {
            console.error('Error fetching restaurant data:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/restaurant/orders', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
                calculateStats(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (orderData) => {
        const today = new Date().toDateString();
        const todayOrders = orderData.filter(order => 
            new Date(order.createdAt).toDateString() === today
        );
        
        setStats({
            todayOrders: todayOrders.length,
            todayRevenue: todayOrders.reduce((sum, order) => sum + order.totalAmount, 0),
            pendingOrders: orderData.filter(order => order.status === 'PENDING').length,
            completedOrders: orderData.filter(order => order.status === 'DELIVERED').length
        });
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:8080/api/restaurant/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (res.ok) {
                fetchOrders(); // Refresh orders
                // Show success notification
                alert(`Order ${newStatus.toLowerCase()} successfully!`);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#ff9800';
            case 'ACCEPTED': return '#2196f3';
            case 'PREPARING': return '#9c27b0';
            case 'READY': return '#4caf50';
            case 'OUT_FOR_DELIVERY': return '#ff5722';
            case 'DELIVERED': return '#8bc34a';
            case 'CANCELLED': return '#f44336';
            default: return '#757575';
        }
    };

    const getNextStatus = (currentStatus) => {
        const statusFlow = {
            'PENDING': 'ACCEPTED',
            'ACCEPTED': 'PREPARING',
            'PREPARING': 'READY',
            'READY': 'OUT_FOR_DELIVERY',
            'OUT_FOR_DELIVERY': 'DELIVERED'
        };
        return statusFlow[currentStatus];
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const logout = () => {
        localStorage.removeItem('restaurantToken');
        localStorage.removeItem('restaurantData');
        navigate('/restaurant-login');
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p>Loading restaurant dashboard...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}>🍽️ {restaurant?.name || 'Restaurant'} Dashboard</h1>
                    <p style={styles.subtitle}>Manage your orders and restaurant operations</p>
                </div>
                <div style={styles.headerRight}>
                    <button onClick={logout} style={styles.logoutBtn}>
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>📊</div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statNumber}>{stats.todayOrders}</h3>
                        <p style={styles.statLabel}>Today's Orders</p>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>💰</div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statNumber}>₹{stats.todayRevenue}</h3>
                        <p style={styles.statLabel}>Today's Revenue</p>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>⏳</div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statNumber}>{stats.pendingOrders}</h3>
                        <p style={styles.statLabel}>Pending Orders</p>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>✅</div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statNumber}>{stats.completedOrders}</h3>
                        <p style={styles.statLabel}>Completed Orders</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={styles.tabContainer}>
                <button 
                    onClick={() => setActiveTab('orders')}
                    style={{...styles.tab, ...(activeTab === 'orders' ? styles.activeTab : {})}}
                >
                    📋 Orders
                </button>
                <button 
                    onClick={() => setActiveTab('menu')}
                    style={{...styles.tab, ...(activeTab === 'menu' ? styles.activeTab : {})}}
                >
                    🍽️ Menu Management
                </button>
                <button 
                    onClick={() => setActiveTab('analytics')}
                    style={{...styles.tab, ...(activeTab === 'analytics' ? styles.activeTab : {})}}
                >
                    📈 Analytics
                </button>
            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div style={styles.ordersContainer}>
                    <h2 style={styles.sectionTitle}>📋 Live Orders</h2>
                    {orders.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}>📭</div>
                            <h3>No orders yet</h3>
                            <p>New orders will appear here automatically</p>
                        </div>
                    ) : (
                        <div style={styles.ordersGrid}>
                            {orders.map(order => (
                                <div key={order.id} style={styles.orderCard}>
                                    <div style={styles.orderHeader}>
                                        <div style={styles.orderInfo}>
                                            <h3 style={styles.orderId}>Order #{order.id}</h3>
                                            <p style={styles.orderTime}>{formatTime(order.createdAt)}</p>
                                        </div>
                                        <div 
                                            style={{
                                                ...styles.statusBadge,
                                                backgroundColor: getStatusColor(order.status)
                                            }}
                                        >
                                            {order.status}
                                        </div>
                                    </div>

                                    <div style={styles.customerInfo}>
                                        <p><strong>👤 Customer:</strong> {order.customerName}</p>
                                        <p><strong>📱 Phone:</strong> {order.customerPhone}</p>
                                        <p><strong>📍 Address:</strong> {order.deliveryAddress}</p>
                                    </div>

                                    <div style={styles.orderItems}>
                                        <h4>🍽️ Items:</h4>
                                        {order.items?.map((item, index) => (
                                            <div key={index} style={styles.orderItem}>
                                                <span>{item.quantity}x {item.name}</span>
                                                <span>₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={styles.orderFooter}>
                                        <div style={styles.totalAmount}>
                                            <strong>💰 Total: ₹{order.totalAmount}</strong>
                                        </div>
                                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                            <div style={styles.actionButtons}>
                                                {order.status === 'PENDING' && (
                                                    <>
                                                        <button 
                                                            onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
                                                            style={{...styles.actionBtn, ...styles.acceptBtn}}
                                                        >
                                                            ✅ Accept
                                                        </button>
                                                        <button 
                                                            onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                                            style={{...styles.actionBtn, ...styles.rejectBtn}}
                                                        >
                                                            ❌ Reject
                                                        </button>
                                                    </>
                                                )}
                                                {getNextStatus(order.status) && (
                                                    <button 
                                                        onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                                                        style={{...styles.actionBtn, ...styles.nextBtn}}
                                                    >
                                                        ➡️ {getNextStatus(order.status)}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Menu Management Tab */}
            {activeTab === 'menu' && (
                <div style={styles.menuContainer}>
                    <h2 style={styles.sectionTitle}>🍽️ Menu Management</h2>
                    <p style={styles.comingSoon}>Menu management features coming soon!</p>
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div style={styles.analyticsContainer}>
                    <h2 style={styles.sectionTitle}>📈 Analytics</h2>
                    <p style={styles.comingSoon}>Analytics dashboard coming soon!</p>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: '#f8f9fa',
        padding: '20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px'
    },
    headerLeft: {
        flex: 1
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#212529',
        margin: '0 0 8px 0'
    },
    subtitle: {
        fontSize: '16px',
        color: '#6c757d',
        margin: 0
    },
    headerRight: {
        display: 'flex',
        gap: '12px'
    },
    logoutBtn: {
        padding: '12px 24px',
        background: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
    },
    statCard: {
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    statIcon: {
        fontSize: '32px',
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '12px'
    },
    statContent: {
        flex: 1
    },
    statNumber: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#212529',
        margin: '0 0 4px 0'
    },
    statLabel: {
        fontSize: '14px',
        color: '#6c757d',
        margin: 0
    },
    tabContainer: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        background: 'white',
        padding: '8px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    tab: {
        padding: '12px 24px',
        background: 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        color: '#6c757d',
        transition: 'all 0.3s ease'
    },
    activeTab: {
        background: '#ff6b6b',
        color: 'white'
    },
    ordersContainer: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#212529',
        marginBottom: '24px'
    },
    ordersGrid: {
        display: 'grid',
        gap: '20px'
    },
    orderCard: {
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        padding: '20px',
        background: '#fff'
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    orderInfo: {
        flex: 1
    },
    orderId: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#212529',
        margin: '0 0 4px 0'
    },
    orderTime: {
        fontSize: '14px',
        color: '#6c757d',
        margin: 0
    },
    statusBadge: {
        padding: '6px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase'
    },
    customerInfo: {
        marginBottom: '16px',
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '8px'
    },
    orderItems: {
        marginBottom: '16px'
    },
    orderItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid #e9ecef'
    },
    orderFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid #e9ecef'
    },
    totalAmount: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#212529'
    },
    actionButtons: {
        display: 'flex',
        gap: '8px'
    },
    actionBtn: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '12px'
    },
    acceptBtn: {
        background: '#28a745',
        color: 'white'
    },
    rejectBtn: {
        background: '#dc3545',
        color: 'white'
    },
    nextBtn: {
        background: '#007bff',
        color: 'white'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6c757d'
    },
    emptyIcon: {
        fontSize: '48px',
        marginBottom: '16px'
    },
    menuContainer: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
    },
    analyticsContainer: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
    },
    comingSoon: {
        fontSize: '16px',
        color: '#6c757d',
        fontStyle: 'italic'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: '#6c757d'
    },
    loader: {
        width: '40px',
        height: '40px',
        border: '4px solid #f1f3f4',
        borderTop: '4px solid #ff6b6b',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '16px'
    }
};