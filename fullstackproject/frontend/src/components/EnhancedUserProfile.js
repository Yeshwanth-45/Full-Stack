import { useState, useEffect } from 'react';

export default function EnhancedUserProfile({ onClose }) {
    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Rewards data (integrated from RewardsSystem)
    const [userStats, setUserStats] = useState({
        points: 1250,
        level: 5,
        ordersCount: 23,
        streak: 7,
        totalSpent: 4580,
        savedAmount: 890,
        badges: []
    });

    const [orderHistory, setOrderHistory] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [preferences, setPreferences] = useState({
        notifications: true,
        emailUpdates: true,
        smsAlerts: false,
        dietaryRestrictions: [],
        favoriteRestaurants: []
    });

    useEffect(() => {
        loadUserProfile();
        loadOrderHistory();
        loadAddresses();
        initializeBadges();
        
        // Add ESC key listener to close modal
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleEscKey);
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, []);

    const loadUserProfile = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            setUser(userData);
            setFormData(userData);
        } catch (err) {
            console.error('Failed to load profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadOrderHistory = async () => {
        // Mock order history - in real app, fetch from API
        const mockOrders = [
            {
                id: 1,
                restaurant: 'Spicy Hub',
                items: ['Butter Chicken', 'Naan'],
                total: 450,
                date: '2024-01-15',
                status: 'Delivered',
                rating: 5,
                pointsEarned: 45
            },
            {
                id: 2,
                restaurant: 'Pizza Palace',
                items: ['Margherita Pizza', 'Garlic Bread'],
                total: 380,
                date: '2024-01-12',
                status: 'Delivered',
                rating: 4,
                pointsEarned: 38
            },
            {
                id: 3,
                restaurant: 'Burger Barn',
                items: ['Classic Cheese Burger', 'Fries'],
                total: 260,
                date: '2024-01-10',
                status: 'Delivered',
                rating: 5,
                pointsEarned: 26
            }
        ];
        setOrderHistory(mockOrders);
    };

    const loadAddresses = async () => {
        // Mock addresses - in real app, fetch from API
        const mockAddresses = [
            {
                id: 1,
                type: 'Home',
                address: '123 Main Street, Banjara Hills',
                city: 'Hyderabad',
                isDefault: true
            },
            {
                id: 2,
                type: 'Work',
                address: '456 Tech Park, HITEC City',
                city: 'Hyderabad',
                isDefault: false
            }
        ];
        setAddresses(mockAddresses);
    };

    const initializeBadges = () => {
        const badges = [];
        if (userStats.ordersCount >= 1) badges.push({ id: 1, name: 'First Order', icon: '🎯', color: '#10b981' });
        if (userStats.ordersCount >= 5) badges.push({ id: 2, name: 'Foodie', icon: '🍕', color: '#f59e0b' });
        if (userStats.ordersCount >= 10) badges.push({ id: 3, name: 'Regular', icon: '⭐', color: '#6366f1' });
        if (userStats.ordersCount >= 20) badges.push({ id: 4, name: 'VIP', icon: '👑', color: '#8b5cf6' });
        if (userStats.streak >= 7) badges.push({ id: 5, name: 'Week Warrior', icon: '💪', color: '#14b8a6' });
        
        setUserStats(prev => ({ ...prev, badges }));
    };

    const handleSave = async () => {
        try {
            // In real app, save to backend
            localStorage.setItem('user', JSON.stringify(formData));
            setUser(formData);
            setEditing(false);
        } catch (err) {
            console.error('Failed to save profile:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
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

    if (loading) {
        return (
            <div style={styles.overlay}>
                <div style={styles.modal}>
                    <div style={styles.loading}>Loading profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div 
            style={styles.overlay} 
            onClick={onClose} 
            className="profile-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
        >
            <div 
                style={styles.modal} 
                onClick={(e) => e.stopPropagation()} 
                className="profile-modal"
                role="document"
            >
                <div style={styles.header}>
                    <h2 style={styles.title} id="profile-title">👤 My Profile</h2>
                    <button 
                        onClick={onClose} 
                        style={styles.closeBtn} 
                        className="close-btn"
                        aria-label="Close profile modal"
                    >✕</button>
                </div>

                {/* Tab Navigation */}
                <div style={styles.tabNav}>
                    {[
                        { id: 'profile', label: 'Profile', icon: '👤' },
                        { id: 'rewards', label: 'Rewards', icon: '🏆' },
                        { id: 'orders', label: 'Orders', icon: '📦' },
                        { id: 'addresses', label: 'Addresses', icon: '📍' },
                        { id: 'preferences', label: 'Settings', icon: '⚙️' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                ...styles.tabBtn,
                                ...(activeTab === tab.id ? styles.tabBtnActive : {})
                            }}
                            className="tab-btn"
                        >
                            <span style={styles.tabIcon}>{tab.icon}</span>
                            <span style={styles.tabLabel}>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div style={styles.content}>
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div style={styles.profileSection}>
                            <div style={styles.profileHeader}>
                                <div style={styles.avatar}>
                                    {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                                </div>
                                <div style={styles.profileInfo}>
                                    <h3 style={styles.userName}>{user.name || 'User'}</h3>
                                    <p style={styles.userEmail}>{user.email}</p>
                                    <div style={styles.userStats}>
                                        <span style={styles.statItem}>
                                            <span style={styles.statIcon}>📦</span>
                                            {userStats.ordersCount} Orders
                                        </span>
                                        <span style={styles.statItem}>
                                            <span style={styles.statIcon}>💰</span>
                                            ₹{userStats.totalSpent} Spent
                                        </span>
                                        <span style={styles.statItem}>
                                            <span style={styles.statIcon}>💸</span>
                                            ₹{userStats.savedAmount} Saved
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {editing ? (
                                <div style={styles.editForm}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Name</label>
                                        <input
                                            type="text"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Email</label>
                                        <input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone || ''}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            style={styles.input}
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                    <div style={styles.formActions}>
                                        <button onClick={handleSave} style={styles.saveBtn}>Save Changes</button>
                                        <button onClick={() => setEditing(false)} style={styles.cancelBtn}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div style={styles.profileDetails}>
                                    <button onClick={() => setEditing(true)} style={styles.editBtn} className="edit-btn">
                                        ✏️ Edit Profile
                                    </button>
                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>Phone:</span>
                                        <span style={styles.detailValue}>{user.phone || 'Not provided'}</span>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>Member since:</span>
                                        <span style={styles.detailValue}>January 2024</span>
                                    </div>
                                </div>
                            )}

                            <button onClick={handleLogout} style={styles.logoutBtn} className="logout-btn">
                                🚪 Logout
                            </button>
                        </div>
                    )}

                    {/* Rewards Tab */}
                    {activeTab === 'rewards' && (
                        <div style={styles.rewardsSection}>
                            {/* Level Progress */}
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

                            {/* Stats Grid */}
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

                            {/* Badges */}
                            <div style={styles.badgesSection}>
                                <h4 style={styles.sectionTitle}>🎖️ Your Badges</h4>
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
                            <div style={styles.rewardsGrid}>
                                <h4 style={styles.sectionTitle}>🎁 Available Rewards</h4>
                                {[
                                    { id: 1, name: '10% Off Next Order', points: 500, icon: '🎁' },
                                    { id: 2, name: 'Free Delivery', points: 300, icon: '🚚' },
                                    { id: 3, name: 'Buy 1 Get 1', points: 800, icon: '🍔' }
                                ].map(reward => (
                                    <div key={reward.id} style={styles.rewardCard}>
                                        <div style={styles.rewardIcon}>{reward.icon}</div>
                                        <div style={styles.rewardInfo}>
                                            <h5 style={styles.rewardName}>{reward.name}</h5>
                                            <p style={styles.rewardPoints}>{reward.points} points</p>
                                        </div>
                                        <button
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
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div style={styles.ordersSection}>
                            <h4 style={styles.sectionTitle}>📦 Order History</h4>
                            {orderHistory.map(order => (
                                <div key={order.id} style={styles.orderCard}>
                                    <div style={styles.orderHeader}>
                                        <h5 style={styles.orderRestaurant}>{order.restaurant}</h5>
                                        <span style={styles.orderStatus}>{order.status}</span>
                                    </div>
                                    <div style={styles.orderDetails}>
                                        <p style={styles.orderItems}>{order.items.join(', ')}</p>
                                        <div style={styles.orderMeta}>
                                            <span style={styles.orderDate}>{order.date}</span>
                                            <span style={styles.orderTotal}>₹{order.total}</span>
                                            <span style={styles.pointsEarned}>+{order.pointsEarned} pts</span>
                                        </div>
                                    </div>
                                    <div style={styles.orderActions}>
                                        <button style={styles.reorderBtn}>🔄 Reorder</button>
                                        <button style={styles.reviewBtn}>⭐ Rate & Review</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Addresses Tab */}
                    {activeTab === 'addresses' && (
                        <div style={styles.addressesSection}>
                            <div style={styles.sectionHeader}>
                                <h4 style={styles.sectionTitle}>📍 Saved Addresses</h4>
                                <button style={styles.addBtn}>+ Add New</button>
                            </div>
                            {addresses.map(address => (
                                <div key={address.id} style={styles.addressCard}>
                                    <div style={styles.addressHeader}>
                                        <span style={styles.addressType}>{address.type}</span>
                                        {address.isDefault && <span style={styles.defaultBadge}>Default</span>}
                                    </div>
                                    <p style={styles.addressText}>{address.address}</p>
                                    <p style={styles.addressCity}>{address.city}</p>
                                    <div style={styles.addressActions}>
                                        <button style={styles.editAddressBtn}>✏️ Edit</button>
                                        <button style={styles.deleteAddressBtn}>🗑️ Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div style={styles.preferencesSection}>
                            <h4 style={styles.sectionTitle}>⚙️ Preferences</h4>
                            
                            <div style={styles.preferenceGroup}>
                                <h5 style={styles.preferenceTitle}>🔔 Notifications</h5>
                                <div style={styles.preferenceItem}>
                                    <label style={styles.preferenceLabel}>
                                        <input type="checkbox" checked={preferences.notifications} />
                                        Push Notifications
                                    </label>
                                </div>
                                <div style={styles.preferenceItem}>
                                    <label style={styles.preferenceLabel}>
                                        <input type="checkbox" checked={preferences.emailUpdates} />
                                        Email Updates
                                    </label>
                                </div>
                                <div style={styles.preferenceItem}>
                                    <label style={styles.preferenceLabel}>
                                        <input type="checkbox" checked={preferences.smsAlerts} />
                                        SMS Alerts
                                    </label>
                                </div>
                            </div>

                            <div style={styles.preferenceGroup}>
                                <h5 style={styles.preferenceTitle}>🥗 Dietary Preferences</h5>
                                <div style={styles.dietaryOptions}>
                                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Jain', 'Keto'].map(diet => (
                                        <button key={diet} style={styles.dietaryBtn}>{diet}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '40px 20px 20px 20px',
        overflowY: 'auto',
        animation: 'fadeIn 0.3s ease-out'
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '28px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.4), 0 10px 30px rgba(102, 126, 234, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 100000,
        margin: '0 auto'
    },
    header: {
        padding: '24px 32px',
        borderBottom: '2px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '28px 28px 0 0',
        flexShrink: 0
    },
    title: {
        margin: 0,
        fontSize: '28px',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.5px'
    },
    closeBtn: {
        background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
        border: 'none',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '20px',
        color: '#64748b',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    tabNav: {
        display: 'flex',
        borderBottom: '1px solid #e2e8f0',
        overflowX: 'auto',
        flexShrink: 0
    },
    tabBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '16px 20px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: '#64748b',
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap'
    },
    tabBtnActive: {
        color: '#667eea',
        borderBottom: '2px solid #667eea',
        background: 'rgba(102, 126, 234, 0.05)'
    },
    tabIcon: {
        fontSize: '16px'
    },
    tabLabel: {
        fontSize: '14px'
    },
    content: {
        padding: '24px',
        overflowY: 'auto',
        flex: 1
    },
    profileSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    profileHeader: {
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
        padding: '28px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '20px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden'
    },
    avatar: {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '36px',
        fontWeight: '800',
        border: '4px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
    },
    profileInfo: {
        flex: 1
    },
    userName: {
        margin: '0 0 8px 0',
        fontSize: '24px',
        fontWeight: '700'
    },
    userEmail: {
        margin: '0 0 16px 0',
        opacity: '0.9',
        fontSize: '16px'
    },
    userStats: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap'
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '14px',
        fontWeight: '600'
    },
    statIcon: {
        fontSize: '16px'
    },
    editForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
        background: '#f8fafc',
        borderRadius: '12px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151'
    },
    input: {
        padding: '12px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.3s ease'
    },
    formActions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
    },
    saveBtn: {
        padding: '12px 24px',
        background: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    cancelBtn: {
        padding: '12px 24px',
        background: '#6b7280',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    profileDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    editBtn: {
        alignSelf: 'flex-start',
        padding: '14px 28px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    detailItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid #e5e7eb'
    },
    detailLabel: {
        fontWeight: '600',
        color: '#374151'
    },
    detailValue: {
        color: '#6b7280'
    },
    logoutBtn: {
        padding: '14px 28px',
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '15px',
        cursor: 'pointer',
        alignSelf: 'flex-start',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 6px 20px rgba(239, 68, 68, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    rewardsSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    levelCard: {
        textAlign: 'center',
        padding: '24px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '16px',
        color: 'white'
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
        background: '#f8fafc',
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center'
    },
    statValue: {
        fontSize: '24px',
        fontWeight: '800',
        marginBottom: '4px',
        color: '#1e293b'
    },
    statLabel: {
        fontSize: '12px',
        color: '#64748b',
        fontWeight: '600'
    },
    badgesSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    sectionTitle: {
        margin: '0',
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
        borderRadius: '16px',
        padding: '16px',
        textAlign: 'center',
        transition: 'all 0.3s ease'
    },
    badgeIcon: {
        fontSize: '32px',
        marginBottom: '8px'
    },
    badgeName: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#475569'
    },
    rewardsGrid: {
        display: 'flex',
        flexDirection: 'column',
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
        fontSize: '24px',
        width: '40px',
        height: '40px',
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
        background: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '14px'
    },
    ordersSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    orderCard: {
        padding: '20px',
        background: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid #e2e8f0'
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    },
    orderRestaurant: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '700',
        color: '#1e293b'
    },
    orderStatus: {
        padding: '4px 12px',
        background: '#10b981',
        color: 'white',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
    },
    orderDetails: {
        marginBottom: '16px'
    },
    orderItems: {
        margin: '0 0 8px 0',
        color: '#64748b',
        fontSize: '14px'
    },
    orderMeta: {
        display: 'flex',
        gap: '16px',
        fontSize: '14px'
    },
    orderDate: {
        color: '#64748b'
    },
    orderTotal: {
        fontWeight: '700',
        color: '#1e293b'
    },
    pointsEarned: {
        color: '#10b981',
        fontWeight: '600'
    },
    orderActions: {
        display: 'flex',
        gap: '12px'
    },
    reorderBtn: {
        padding: '8px 16px',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    reviewBtn: {
        padding: '8px 16px',
        background: '#f59e0b',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    addressesSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addBtn: {
        padding: '8px 16px',
        background: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    addressCard: {
        padding: '20px',
        background: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid #e2e8f0'
    },
    addressHeader: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '12px'
    },
    addressType: {
        padding: '4px 12px',
        background: '#3b82f6',
        color: 'white',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
    },
    defaultBadge: {
        padding: '4px 12px',
        background: '#10b981',
        color: 'white',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
    },
    addressText: {
        margin: '0 0 4px 0',
        color: '#1e293b',
        fontSize: '16px'
    },
    addressCity: {
        margin: '0 0 16px 0',
        color: '#64748b',
        fontSize: '14px'
    },
    addressActions: {
        display: 'flex',
        gap: '12px'
    },
    editAddressBtn: {
        padding: '6px 12px',
        background: '#f59e0b',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    deleteAddressBtn: {
        padding: '6px 12px',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    preferencesSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    preferenceGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    preferenceTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '700',
        color: '#1e293b'
    },
    preferenceItem: {
        display: 'flex',
        alignItems: 'center'
    },
    preferenceLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#374151',
        cursor: 'pointer'
    },
    dietaryOptions: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
    },
    dietaryBtn: {
        padding: '8px 16px',
        background: '#f1f5f9',
        border: '2px solid #e2e8f0',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '16px',
        color: '#64748b'
    }
};