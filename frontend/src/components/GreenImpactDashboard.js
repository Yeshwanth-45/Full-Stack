import React from 'react';

export default function GreenImpactDashboard({ orderHistory = [] }) {
    // Generate gamified baseline stats + real order calculations
    const calculateImpact = () => {
        let realCO2 = 0;
        let realItems = 0;
        
        orderHistory.forEach(order => {
            const distance = order.distance || 3.2;
            const items = order.items || [];
            realCO2 += (distance * 0.12 * items.length); // Mock formula
            realItems += items.length;
        });

        // Add premium baseline gamified stats so it looks rich
        const carbonSaved = (14.2 + realCO2 * 0.4).toFixed(1);
        const plasticSaved = (2.4 + realItems * 0.05).toFixed(1);
        const ecoDeliveries = 3 + orderHistory.filter(o => o.ecoFriendly).length;
        const treesPlanted = (parseFloat(carbonSaved) / 5).toFixed(1);

        return { carbonSaved, plasticSaved, ecoDeliveries, treesPlanted };
    };

    const impact = calculateImpact();
    
    // Progress calculation for next level (goal of 10 trees offset)
    const targetTrees = 10;
    const progressPercent = Math.min((parseFloat(impact.treesPlanted) / targetTrees) * 100, 100);

    const achievements = [
        { title: '🍃 Eco Rookie', desc: 'Completed first eco-friendly delivery', unlocked: true, icon: '🌱' },
        { title: '📦 Plastic Free', desc: 'Saved 2+ kg of single-use packaging', unlocked: parseFloat(impact.plasticSaved) >= 2.0, icon: '♻️' },
        { title: '🌳 Forest Guardian', desc: 'Offset carbon equivalent of 5+ trees', unlocked: parseFloat(impact.treesPlanted) >= 5.0, icon: '🌲' }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span style={styles.leafTag}>Eco-Impact Hub</span>
                <h2 style={styles.title}>🌱 Green Sustainability Dashboard</h2>
                <p style={styles.subtitle}>Your choices are actively helping restore the environment</p>
            </div>

            <div style={styles.statsGrid}>
                {/* Carbon Saved Card */}
                <div style={styles.statCard}>
                    <div style={styles.cardHeader}>
                        <span style={styles.icon}>☁️</span>
                        <span style={styles.statLabel}>Carbon Saved</span>
                    </div>
                    <h3 style={styles.statValue}>{impact.carbonSaved} kg</h3>
                    <p style={styles.cardDesc}>Reduced CO2 emissions</p>
                </div>

                {/* Plastic Saved Card */}
                <div style={styles.statCard}>
                    <div style={styles.cardHeader}>
                        <span style={styles.icon}>♻️</span>
                        <span style={styles.statLabel}>Plastic Prevented</span>
                    </div>
                    <h3 style={styles.statValue}>{impact.plasticSaved} kg</h3>
                    <p style={styles.cardDesc}>Eco-packaging used</p>
                </div>

                {/* Eco Deliveries Card */}
                <div style={styles.statCard}>
                    <div style={styles.cardHeader}>
                        <span style={styles.icon}>🚲</span>
                        <span style={styles.statLabel}>Eco Deliveries</span>
                    </div>
                    <h3 style={styles.statValue}>{impact.ecoDeliveries}</h3>
                    <p style={styles.cardDesc}>Electric/Cycle orders</p>
                </div>

                {/* Trees Planted Card */}
                <div style={styles.statCard}>
                    <div style={styles.cardHeader}>
                        <span style={styles.icon}>🌲</span>
                        <span style={styles.statLabel}>Trees Seeded</span>
                    </div>
                    <h3 style={styles.statValue}>{impact.treesPlanted}</h3>
                    <p style={styles.cardDesc}>Offset equivalent</p>
                </div>
            </div>

            {/* Progress Gauge */}
            <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                    <span style={styles.goalTitle}>Forestry Target: 10 Trees Offset</span>
                    <span style={styles.goalPercent}>{progressPercent.toFixed(0)}% Completed</span>
                </div>
                <div style={styles.progressBar}>
                    <div 
                        style={{
                            ...styles.progressFill,
                            width: `${progressPercent}%`
                        }}
                    ></div>
                </div>
                <p style={styles.tip}>💡 Pro-tip: Select the "Eco Delivery" option during checkout to increase your score!</p>
            </div>

            {/* Achievements Section */}
            <div style={styles.achievementsBox}>
                <h4 style={styles.boxTitle}>🎖️ Eco Achievements</h4>
                <div style={styles.achievementsGrid}>
                    {achievements.map((ach, idx) => (
                        <div 
                            key={idx} 
                            style={{
                                ...styles.achCard,
                                opacity: ach.unlocked ? 1 : 0.5
                            }}
                        >
                            <span style={styles.achIcon}>{ach.icon}</span>
                            <div>
                                <h5 style={styles.achTitle}>
                                    {ach.title} {ach.unlocked ? '✅' : '🔒'}
                                </h5>
                                <p style={styles.achDesc}>{ach.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
        borderRadius: '24px',
        padding: '30px',
        border: '1px solid #374151',
        color: '#f3f4f6',
        marginTop: '30px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
    },
    header: {
        marginBottom: '25px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px'
    },
    leafTag: {
        fontSize: '11px',
        background: 'rgba(16, 185, 129, 0.2)',
        color: '#34d399',
        padding: '4px 12px',
        borderRadius: '20px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.8px'
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: '800',
        margin: 0,
        color: 'white'
    },
    subtitle: {
        fontSize: '0.95rem',
        color: '#9ca3af',
        margin: 0
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    },
    statCard: {
        background: '#1f2937',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #374151',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    icon: {
        fontSize: '1.4rem'
    },
    statLabel: {
        fontSize: '12px',
        color: '#9ca3af',
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    statValue: {
        fontSize: '1.8rem',
        fontWeight: '800',
        color: '#10b981',
        margin: 0
    },
    cardDesc: {
        fontSize: '12px',
        color: '#6b7280',
        margin: 0
    },
    progressSection: {
        background: '#111827',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #374151',
        marginBottom: '30px'
    },
    progressHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.9rem',
        fontWeight: '600',
        marginBottom: '10px',
        color: '#e5e7eb'
    },
    goalTitle: {
        color: '#d1d5db'
    },
    goalPercent: {
        color: '#34d399',
        fontWeight: '700'
    },
    progressBar: {
        height: '8px',
        background: '#374151',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '15px'
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #34d399, #059669)',
        borderRadius: '5px'
    },
    tip: {
        fontSize: '12px',
        color: '#9ca3af',
        margin: 0,
        textAlign: 'center'
    },
    achievementsBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    boxTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '700',
        color: 'white'
    },
    achievementsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
    },
    achCard: {
        background: '#1f2937',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #374151',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    achIcon: {
        fontSize: '2rem',
        background: '#111827',
        padding: '10px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    achTitle: {
        margin: '0 0 4px 0',
        fontSize: '14px',
        fontWeight: '700',
        color: 'white'
    },
    achDesc: {
        margin: 0,
        fontSize: '12px',
        color: '#9ca3af'
    }
};
