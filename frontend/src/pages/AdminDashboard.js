import React from 'react';

export default function AdminDashboard() {

    const metrics = [
        { label: 'Total Revenue', value: '₹3,45,280', change: '+18.4% this week', icon: '💰', color: '#10b981' },
        { label: 'Active Orders', value: '142', change: '84 out for delivery', icon: '📦', color: '#3b82f6' },
        { label: 'Total Restaurants', value: '38', change: '5 onboarding today', icon: '🏪', color: '#8b5cf6' },
        { label: 'Monthly Growth', value: '32.6%', change: '+4.2% from last month', icon: '📈', color: '#ec4899' }
    ];

    const activeOrders = [
        { id: '#2041', customer: 'Rohan Sharma', item: 'Spiced Chicken Biryani x2', status: 'Preparing', chef: 'Kabir', eta: '12 min' },
        { id: '#2040', customer: 'Anjali Gupta', item: 'Margherita Pizza x1', status: 'Ready for Pickup', chef: 'Amit', eta: '4 min' },
        { id: '#2039', customer: 'Vikram Singh', item: 'Hakka Noodles x3', status: 'Out for Delivery', driver: 'Sanjay', eta: '18 min' }
    ];

    const restaurantPerformers = [
        { name: 'Biryani Blues', category: 'Indian', revenue: '₹42,500', orders: 184, rating: '⭐ 4.8' },
        { name: 'Pizza Palace', category: 'Italian', revenue: '₹38,200', orders: 142, rating: '⭐ 4.7' },
        { name: 'Begumpet Cafe Delight', category: 'Beverages', revenue: '₹18,900', orders: 98, rating: '⭐ 4.5' }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <span style={styles.tag}>Enterprise Console</span>
                    <h1 style={styles.title}>📈 BiteRush Enterprise Analytics</h1>
                    <p style={styles.subtitle}>Real-time transaction volume, restaurant performance, and active deliveries.</p>
                </div>
                <div style={styles.actions}>
                    <button style={styles.actionBtn}>📥 Export CSV</button>
                    <button style={styles.actionBtnPrimary}>🔄 Refresh Logs</button>
                </div>
            </div>

            {/* Metrics cards row */}
            <div style={styles.metricsGrid}>
                {metrics.map((m, idx) => (
                    <div key={idx} style={styles.metricCard}>
                        <div style={styles.cardTop}>
                            <span style={styles.metricLabel}>{m.label}</span>
                            <span style={{ ...styles.metricIcon, background: m.color + '20', color: m.color }}>{m.icon}</span>
                        </div>
                        <h3 style={styles.metricVal}>{m.value}</h3>
                        <p style={styles.metricChange}>{m.change}</p>
                    </div>
                ))}
            </div>

            {/* Main section */}
            <div style={styles.mainGrid}>
                {/* Active orders pipeline */}
                <div style={styles.contentCard}>
                    <div style={styles.cardHeader}>
                        <h4 style={styles.cardTitle}>📦 Active Orders Pipeline</h4>
                        <span style={styles.activeDot}>● {activeOrders.length} active now</span>
                    </div>
                    <div style={styles.ordersTable}>
                        <div style={styles.tableHeader}>
                            <span>ID</span>
                            <span>Customer</span>
                            <span>Items</span>
                            <span>Status</span>
                            <span>Staff</span>
                        </div>
                        {activeOrders.map((ord, idx) => (
                            <div key={idx} style={styles.tableRow}>
                                <strong style={{ color: '#4f46e5' }}>{ord.id}</strong>
                                <span>{ord.customer}</span>
                                <span style={{ fontSize: '13px', color: '#475569' }}>{ord.item}</span>
                                <span style={{ 
                                    ...styles.statusBadge,
                                    background: ord.status.includes('Out') ? '#e0f2fe' : ord.status.includes('Ready') ? '#d1fae5' : '#f5f3ff',
                                    color: ord.status.includes('Out') ? '#0369a1' : ord.status.includes('Ready') ? '#065f46' : '#6d28d9'
                                }}>
                                    {ord.status}
                                </span>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>{ord.chef || ord.driver || 'Staff'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performing Restaurants */}
                <div style={styles.contentCard}>
                    <div style={styles.cardHeader}>
                        <h4 style={styles.cardTitle}>🏆 Top Restaurant Performers</h4>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>This month</span>
                    </div>
                    <div style={styles.performersList}>
                        {restaurantPerformers.map((res, idx) => (
                            <div key={idx} style={styles.performerRow}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <span style={styles.performerRank}>{idx + 1}</span>
                                    <div>
                                        <strong style={{ fontSize: '14px', color: '#1e293b' }}>{res.name}</strong>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{res.category} • {res.rating}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <strong style={{ fontSize: '14px', color: '#10b981' }}>{res.revenue}</strong>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{res.orders} orders</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Growth details chart mock */}
            <div style={styles.chartCard}>
                <h4 style={styles.cardTitle}>📈 Weekly Revenue Growth Velocity</h4>
                <div style={styles.chartWrapper}>
                    {[45, 60, 55, 75, 90, 85, 110].map((val, idx) => (
                        <div key={idx} style={styles.chartCol}>
                            <div style={{ ...styles.chartBar, height: `${val}%` }}>
                                <span style={styles.barTooltip}>₹{val * 350}</span>
                            </div>
                            <span style={styles.chartLabel}>Day {idx + 1}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '100px 20px 80px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#f8fafc',
        minHeight: '100vh',
        fontFamily: 'inherit'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '40px'
    },
    tag: {
        fontSize: '11px',
        background: '#e0e7ff',
        color: '#4f46e5',
        padding: '4px 12px',
        borderRadius: '20px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.8px'
    },
    title: {
        fontSize: '2.2rem',
        fontWeight: '850',
        color: '#1e293b',
        margin: '6px 0 0 0'
    },
    subtitle: {
        fontSize: '15px',
        color: '#64748b',
        margin: 0
    },
    actions: {
        display: 'flex',
        gap: '10px'
    },
    actionBtn: {
        padding: '10px 20px',
        background: 'white',
        border: '1px solid #cbd5e1',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '700',
        color: '#475569',
        cursor: 'pointer'
    },
    actionBtnPrimary: {
        padding: '10px 20px',
        background: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer'
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '35px'
    },
    metricCard: {
        background: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
    },
    cardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    },
    metricLabel: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#64748b'
    },
    metricIcon: {
        fontSize: '1.2rem',
        padding: '8px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px'
    },
    metricVal: {
        fontSize: '2rem',
        fontWeight: '900',
        color: '#1e293b',
        margin: 0
    },
    metricChange: {
        fontSize: '12px',
        color: '#10b981',
        fontWeight: '600',
        margin: '6px 0 0 0'
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '30px',
        marginBottom: '30px'
    },
    contentCard: {
        background: 'white',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '16px',
        marginBottom: '20px'
    },
    cardTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '800',
        color: '#1e293b'
    },
    activeDot: {
        fontSize: '12px',
        color: '#10b981',
        fontWeight: '700'
    },
    ordersTable: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    tableHeader: {
        display: 'grid',
        gridTemplateColumns: '80px 120px 1fr 120px 80px',
        gap: '10px',
        fontSize: '12px',
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        paddingBottom: '8px',
        borderBottom: '1px solid #f1f5f9'
    },
    tableRow: {
        display: 'grid',
        gridTemplateColumns: '80px 120px 1fr 120px 80px',
        gap: '10px',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #f8fafc',
        fontSize: '14px'
    },
    statusBadge: {
        fontSize: '11px',
        fontWeight: '750',
        padding: '4px 10px',
        borderRadius: '8px',
        textAlign: 'center',
        width: 'fit-content'
    },
    performersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    performerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '12px',
        borderBottom: '1px solid #f1f5f9'
    },
    performerRank: {
        fontSize: '14px',
        fontWeight: '800',
        color: '#4f46e5',
        background: '#e0e7ff',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    chartCard: {
        background: 'white',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
    },
    chartWrapper: {
        height: '240px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '20px 40px 10px',
        borderBottom: '2px solid #cbd5e1',
        marginTop: '20px'
    },
    chartCol: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        width: '45px',
        position: 'relative'
    },
    chartBar: {
        width: '100%',
        background: 'linear-gradient(180deg, #667eea, #764ba2)',
        borderRadius: '8px 8px 0 0',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        ':hover': {
            background: '#4f46e5'
        }
    },
    barTooltip: {
        position: 'absolute',
        top: '-30px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1e293b',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '700',
        whiteSpace: 'nowrap'
    },
    chartLabel: {
        fontSize: '12px',
        color: '#64748b',
        fontWeight: '600'
    }
};
