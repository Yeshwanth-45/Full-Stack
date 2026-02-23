import { useState, useEffect } from 'react';

export default function RewardsSystem() {
    const [userStats, setUserStats] = useState({
        points: 1250,
        level: 5,
        ordersCount: 23,
        streak: 7,
        badges: []
    });

    const [showRewards, setShowRewards] = useState(false);

    useEffect(() => {
        // Load user stats from localStorage or API
        const savedStats = localStorage.getItem('userRewards');
        if (savedStats) {
            setUserStats(JSON.parse(savedStats));
        } else {
            // Initialize badges
            const initialBadges = calculateBadges(23, 7);
            setUserStats(prev => ({ ...prev, badges: initialBadges }));
        }
    }, []);

    const calculateBadges = (orders, streak) => {
        const badges = [];
        
        if (orders >= 1) badges.push({ id: 1, name: 'First Order', icon: '🎯', color: '#10b981' });
        if (orders >= 5) badges.push({ id: 2, name: 'Foodie', icon: '🍕', color: '#f59e0b' });
        if (orders >= 10) badges.push({ id: 3, name: 'Regular', icon: '⭐', color: '#6366f1' });
        if (orders >= 20) badges.push({ id: 4, name: 'VIP', icon: '👑', color: '#8b5cf6' });
        if (orders >= 50) badges.push({ id: 5, name: 'Legend', icon: '🏆', color: '#ef4444' });
        
        if (streak >= 3) badges.push({ id: 6, name: 'Streak Master', icon: '🔥', color: '#f97316' });
        if (streak >= 7) badges.push({ id: 7, name: 'Week Warrior', icon: '💪', color: '#14b8a6' });
        
        return badges;
    };

    const levels = [
        { level: 1, name: 'Newbie', minPoints: 0, maxPoints: 100, color: '#94a3b8' },
        { level: 2, name: 'Explorer', minPoints: 100, maxPoints: 300, color: '#10b981' },
        { level: 3, name: 'Enthusiast', minPoints: 300, maxPoints: 600, color: '#3b82f6' },
        { level: 4, name: 'Connoisseur', minPoints: 600, maxPoints: 1000, color: '#8b5cf6' },
        { level: 5, name: 'Master', minPoints: 1000, maxPoints: 1500, color: '#f59e0b' },
        { level: 6, name: 'Legend', minPoints: 1500, maxPoints: 2500, color: '#ef4444' },
        { level: 7, name: 'God', minPoints: 2500, maxPoints: 5000, color: '#ec4899' }
    ];

    const currentLevel = levels.find(l => 
        userStats.points >= l.minPoints && userStats.points < l.maxPoints
    ) || levels[levels.length - 1];

    const nextLevel = levels.find(l => l.level === currentLevel.level + 1);
    const progress = nextLevel 
        ? ((userStats.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
        : 100;

    const rewards = [
        { id: 1, name: '10% Off Next Order', points: 500, icon: '🎁', claimed: false },
        { id: 2, name: 'Free Delivery', points: 300, icon: '🚚', claimed: false },
        { id: 3, name: 'Buy 1 Get 1', points: 800, icon: '🍔', claimed: false },
        { id: 4, name: 'Premium Membership', points: 2000, icon: '👑', claimed: false },
        { id: 5, name: '₹200 Cashback', points: 1000, icon: '💰', claimed: false },
        { id: 6, name: 'Priority Support', points: 600, icon: '⚡', claimed: false }
    ];

    const handleClaimReward = (reward) => {
        if (userStats.points >= reward.points) {
            alert(`Reward "${reward.name}" claimed! Check your account for details.`);
            setUserStats(prev => ({
                ...prev,
                points: prev.points - reward.points
            }));
        } else {
            alert(`You need ${reward.points - userStats.points} more points to claim this reward!`);
        }
    };

    if (!showRewards) {
        return (
            <button
                onClick={() => setShowRewards(true)}
                style={styles.rewardsButton}
                title="View Rewards"
            >
                <span style={styles.rewardsIcon}>🏆</span>
                <span style={styles.pointsBadge}>{userStats.points}</span>
            </button>
        );
    }

    return (
        <div style={styles.overlay} onClick={() => setShowRewards(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>🏆 Rewards & Achievements</h2>
                    <button onClick={() => setShowRewards(false)} style={styles.closeBtn}>✕</button>
                </div>

                {/* User Stats */}
                <div style={styles.statsSection}>
                    <div style={styles.levelCard}>
                        <div style={{...styles.levelBadge, background: currentLevel.color}}>
                            Level {currentLevel.level}
                        </div>
                        <h3 style={styles.levelName}>{currentLevel.name}</h3>
                        <div style={styles.progressBar}>
                            <div 
                                style={{...styles.progressFill, width: `${progress}%`, background: currentLevel.color}}
                            ></div>
                        </div>
                        <p style={styles.progressText}>
                            {userStats.points} / {nextLevel ? nextLevel.minPoints : currentLevel.maxPoints} points
                        </p>
                    </div>

                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <div style={styles.statIcon}>🎯</div>
                            <div style={styles.statValue}>{userStats.points}</div>
                            <div style={styles.statLabel}>Points</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statIcon}>📦</div>
                            <div style={styles.statValue}>{userStats.ordersCount}</div>
                            <div style={styles.statLabel}>Orders</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statIcon}>🔥</div>
                            <div style={styles.statValue}>{userStats.streak}</div>
                            <div style={styles.statLabel}>Day Streak</div>
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>🎖️ Your Badges</h3>
                    <div style={styles.badgesGrid}>
                        {userStats.badges.map(badge => (
                            <div key={badge.id} style={{...styles.badge, border: `3px solid ${badge.color}`}}>
                                <div style={styles.badgeIcon}>{badge.icon}</div>
                                <div style={styles.badgeName}>{badge.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Available Rewards */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}> Available Rewards</h3>
                    <div style={styles.rewardsGrid}>
                        {rewards.map(reward => (
                            <div key={reward.id} style={styles.rewardCard}>
                                <div style={styles.rewardIcon}>{reward.icon}</div>
                                <div style={styles.rewardInfo}>
                                    <h4 style={styles.rewardName}>{reward.name}</h4>
                                    <p style={styles.rewardPoints}>{reward.points} points</p>
                                </div>
                                <button
                                    onClick={() => handleClaimReward(reward)}
                                    style={{
                                        ...styles.claimButton,
                                        opacity: userStats.points >= reward.points ? 1 : 0.5
                                    }}
                                    disabled={userStats.points < reward.points}
                                >
                                    {userStats.points >= reward.points ? 'Claim' : 'Locked'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How to Earn Points */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>💡 How to Earn Points</h3>
                    <div style={styles.earnList}>
                        <div style={styles.earnItem}>
                            <span style={styles.earnIcon}>🛒</span>
                            <span style={styles.earnText}>Place an order: <strong>+50 points</strong></span>
                        </div>
                        <div style={styles.earnItem}>
                            <span style={styles.earnIcon}>⭐</span>
                            <span style={styles.earnText}>Write a review: <strong>+20 points</strong></span>
                        </div>
                        <div style={styles.earnItem}>
                            <span style={styles.earnIcon}>📸</span>
                            <span style={styles.earnText}>Share food photo: <strong>+30 points</strong></span>
                        </div>
                        <div style={styles.earnItem}>
                            <span style={styles.earnIcon}>👥</span>
                            <span style={styles.earnText}>Refer a friend: <strong>+100 points</strong></span>
                        </div>
                        <div style={styles.earnItem}>
                            <span style={styles.earnIcon}>🔥</span>
                            <span style={styles.earnText}>Daily streak bonus: <strong>+10 points/day</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    rewardsButton: {
        position: 'fixed',
        bottom: '100px',
        right: '24px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: 'white',
        border: 'none',
        fontSize: '28px',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rewardsIcon: {
        fontSize: '32px'
    },
    pointsBadge: {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        background: '#ef4444',
        color: 'white',
        borderRadius: '12px',
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: '700',
        border: '2px solid white'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    modal: {
        background: 'white',
        borderRadius: '24px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    header: {
        padding: '24px',
        borderBottom: '1px solid #e2e8f0',
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
        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
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
    statsSection: {
        padding: '24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
    },
    levelCard: {
        textAlign: 'center',
        marginBottom: '24px'
    },
    levelBadge: {
        display: 'inline-block',
        padding: '8px 20px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '700',
        marginBottom: '8px'
    },
    levelName: {
        margin: '0 0 16px 0',
        fontSize: '28px',
        fontWeight: '800'
    },
    progressBar: {
        width: '100%',
        height: '12px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '6px',
        overflow: 'hidden',
        marginBottom: '8px'
    },
    progressFill: {
        height: '100%',
        borderRadius: '6px',
        transition: 'width 0.5s ease'
    },
    progressText: {
        margin: 0,
        fontSize: '14px',
        opacity: 0.9
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px'
    },
    statCard: {
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
        padding: '16px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
    },
    statIcon: {
        fontSize: '36px',
        marginBottom: '8px'
    },
    statValue: {
        fontSize: '24px',
        fontWeight: '800',
        marginBottom: '4px'
    },
    statLabel: {
        fontSize: '12px',
        opacity: 0.9
    },
    section: {
        padding: '24px'
    },
    sectionTitle: {
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1e293b'
    },
    badgesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '16px'
    },
    badge: {
        background: 'white',
        border: '3px solid',
        borderRadius: '16px',
        padding: '16px',
        textAlign: 'center',
        transition: 'all 0.3s ease'
    },
    badgeIcon: {
        fontSize: '48px',
        marginBottom: '8px'
    },
    badgeName: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#475569'
    },
    rewardsGrid: {
        display: 'grid',
        gap: '12px'
    },
    rewardCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '16px',
        border: '2px solid #e2e8f0'
    },
    rewardIcon: {
        fontSize: '36px',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        borderRadius: '12px'
    },
    rewardInfo: {
        flex: 1
    },
    rewardName: {
        margin: '0 0 4px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#1e293b'
    },
    rewardPoints: {
        margin: 0,
        fontSize: '14px',
        color: '#64748b'
    },
    claimButton: {
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '14px'
    },
    earnList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    earnItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        background: '#f8fafc',
        borderRadius: '12px'
    },
    earnIcon: {
        fontSize: '28px'
    },
    earnText: {
        fontSize: '14px',
        color: '#475569'
    }
};
