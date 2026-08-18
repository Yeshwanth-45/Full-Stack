import { useState, useEffect } from 'react';
import { api } from '../services/api';

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

    // Wallet state
    const [wallet, setWallet] = useState({ balance: 0, loyaltyPoints: 0, transactions: [] });
    const [addAmount, setAddAmount] = useState('');
    const [walletMessage, setWalletMessage] = useState('');
    const [walletError, setWalletError] = useState('');

    // Referral state
    const [referralData, setReferralData] = useState({ referralCode: '', history: [], referredBy: '', totalEarned: 0 });
    const [friendCode, setFriendCode] = useState('');
    const [referralMessage, setReferralMessage] = useState('');
    const [referralError, setReferralError] = useState('');

    // Subscription state
    const [subscription, setSubscription] = useState({ active: false });
    const [subMessage, setSubMessage] = useState('');
    const [subError, setSubError] = useState('');

    useEffect(() => {
        loadUserProfile();
        loadOrderHistory();
        loadAddresses();
        initializeBadges();
        loadWallet();
        loadReferrals();
        loadSubscription();
        
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

    // Load Wallet
    const loadWallet = async () => {
        try {
            const res = await api('/wallet');
            if (res.ok) {
                const data = await res.json();
                setWallet(data);
                setUserStats(prev => ({ ...prev, points: data.loyaltyPoints }));
            }
        } catch (err) {
            console.error('Failed to load wallet:', err);
        }
    };

    // Load Referrals
    const loadReferrals = async () => {
        try {
            const res = await api('/referrals');
            if (res.ok) {
                const data = await res.json();
                setReferralData(data);
            }
        } catch (err) {
            console.error('Failed to load referrals:', err);
        }
    };

    // Load Subscription
    const loadSubscription = async () => {
        try {
            const res = await api('/subscriptions/active');
            if (res.ok) {
                const data = await res.json();
                setSubscription(data);
            }
        } catch (err) {
            console.error('Failed to load subscription:', err);
        }
    };

    // Handle Wallet Deposit
    const handleAddMoney = async () => {
        setWalletError('');
        setWalletMessage('');
        const amt = parseFloat(addAmount);
        if (isNaN(amt) || amt <= 0) {
            setWalletError('Please enter a valid positive amount.');
            return;
        }
        try {
            const res = await api('/wallet/add', {
                method: 'POST',
                body: JSON.stringify({ amount: amt })
            });
            const data = await res.json();
            if (res.ok) {
                setWalletMessage(`Successfully added ₹${amt.toFixed(2)} to wallet!`);
                setAddAmount('');
                loadWallet();
            } else {
                setWalletError(data.message || 'Failed to add funds.');
            }
        } catch (err) {
            setWalletError('Error connecting to backend.');
        }
    };

    // Handle Redeem Points
    const handleRedeemPoints = async (points) => {
        setWalletError('');
        setWalletMessage('');
        try {
            const res = await api('/wallet/redeem-points', {
                method: 'POST',
                body: JSON.stringify({ points: points })
            });
            const data = await res.json();
            if (res.ok) {
                setWalletMessage(data.message || 'Points redeemed successfully!');
                loadWallet();
            } else {
                setWalletError(data.message || 'Failed to redeem points.');
            }
        } catch (err) {
            setWalletError('Error connecting to backend.');
        }
    };

    // Handle Apply Referral Code
    const handleApplyReferral = async () => {
        setReferralError('');
        setReferralMessage('');
        if (!friendCode.trim()) {
            setReferralError('Please enter a code.');
            return;
        }
        try {
            const res = await api('/referrals/apply', {
                method: 'POST',
                body: JSON.stringify({ code: friendCode })
            });
            const data = await res.json();
            if (res.ok) {
                setReferralMessage(data.message || 'Code applied successfully!');
                setFriendCode('');
                loadReferrals();
                loadWallet(); // To reflect new wallet credits
            } else {
                setReferralError(data.message || 'Failed to apply referral code.');
            }
        } catch (err) {
            setReferralError('Error connecting to backend.');
        }
    };

    // Handle Purchase Subscription
    const handlePurchaseSubscription = async (planType) => {
        setSubError('');
        setSubMessage('');
        try {
            const res = await api('/subscriptions/subscribe', {
                method: 'POST',
                body: JSON.stringify({ planType: planType })
            });
            const data = await res.json();
            if (res.ok) {
                setSubMessage(data.message || `Subscribed to ${planType} successfully!`);
                loadSubscription();
                loadWallet(); // Reload wallet since we debited the subscription fee
            } else {
                setSubError(data.message || 'Failed to subscribe.');
            }
        } catch (err) {
            setSubError('Error connecting to backend.');
        }
    };

    // Handle Cancel Subscription
    const handleCancelSubscription = async () => {
        setSubError('');
        setSubMessage('');
        if (!window.confirm('Are you sure you want to cancel your Gold membership?')) {
            return;
        }
        try {
            const res = await api('/subscriptions/cancel', {
                method: 'POST'
            });
            const data = await res.json();
            if (res.ok) {
                setSubMessage(data.message || 'Subscription cancelled successfully.');
                loadSubscription();
            } else {
                setSubError(data.message || 'Failed to cancel subscription.');
            }
        } catch (err) {
            setSubError('Error connecting to backend.');
        }
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
                        { id: 'wallet', label: 'Wallet', icon: '💳' },
                        { id: 'rewards', label: 'Rewards', icon: '🏆' },
                        { id: 'orders', label: 'Orders', icon: '📦' },
                        { id: 'addresses', label: 'Addresses', icon: '📍' },
                        { id: 'referrals', label: 'Referrals', icon: '👥' },
                        { id: 'subscriptions', label: 'Subscriptions', icon: '👑' },
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

                    {/* Wallet Tab */}
                    {activeTab === 'wallet' && (
                        <div style={styles.walletSection}>
                            <h4 style={styles.sectionTitle}>💳 BiteRush Wallet</h4>
                            
                            <div style={styles.walletBalanceCard}>
                                <div style={styles.walletLabel}>Current Balance</div>
                                <div style={styles.walletValue}>₹{wallet.balance.toFixed(2)}</div>
                                <div style={styles.loyaltyValue}>✨ {wallet.loyaltyPoints} Loyalty Points</div>
                            </div>

                            {/* Add Funds Form */}
                            <div style={styles.actionCard}>
                                <h5 style={styles.actionTitle}>Add Money to Wallet</h5>
                                <div style={styles.formRow}>
                                    <input 
                                        type="number" 
                                        placeholder="Enter amount (₹)" 
                                        value={addAmount} 
                                        onChange={(e) => setAddAmount(e.target.value)}
                                        style={styles.inputField}
                                    />
                                    <button onClick={handleAddMoney} style={styles.actionBtn}>Add Funds</button>
                                </div>
                                {walletMessage && <p style={styles.successMsg}>{walletMessage}</p>}
                                {walletError && <p style={styles.errorMsg}>{walletError}</p>}
                            </div>

                            {/* Redeem Points Form */}
                            <div style={styles.actionCard}>
                                <h5 style={styles.actionTitle}>Redeem Loyalty Points</h5>
                                <p style={styles.infoText}>10 Loyalty Points = ₹1.00 wallet credit</p>
                                <button 
                                    onClick={() => handleRedeemPoints(100)} 
                                    disabled={wallet.loyaltyPoints < 100}
                                    style={{
                                        ...styles.actionBtn, 
                                        opacity: wallet.loyaltyPoints >= 100 ? 1 : 0.5,
                                        width: 'auto'
                                    }}
                                >
                                    Redeem 100 Points (₹10.00)
                                </button>
                            </div>

                            {/* Wallet Transaction History */}
                            <div style={styles.txnSection}>
                                <h5 style={styles.actionTitle}>Transaction History</h5>
                                {wallet.transactions && wallet.transactions.length > 0 ? (
                                    <div style={styles.txnList}>
                                        {wallet.transactions.map(txn => (
                                            <div key={txn.id} style={styles.txnCard}>
                                                <div style={styles.txnHeader}>
                                                    <span style={{
                                                        ...styles.txnType,
                                                        color: txn.type === 'CREDIT' ? '#10b981' : '#ef4444'
                                                    }}>{txn.type}</span>
                                                    <span style={styles.txnDate}>{new Date(txn.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div style={styles.txnBody}>
                                                    <span style={styles.txnDesc}>{txn.description}</span>
                                                    <span style={{
                                                        ...styles.txnAmt,
                                                        color: txn.type === 'CREDIT' ? '#10b981' : '#ef4444'
                                                    }}>{txn.type === 'CREDIT' ? '+' : '-'} ₹{txn.amount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={styles.noTxns}>No transactions yet.</p>
                                )}
                            </div>
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

                    {/* Referrals Tab */}
                    {activeTab === 'referrals' && (
                        <div style={styles.referralSection}>
                            <h4 style={styles.sectionTitle}>👥 Refer & Earn</h4>
                            
                            <div style={styles.referralCodeCard}>
                                <div style={styles.refLabel}>Your Unique Referral Code</div>
                                <div style={styles.refCode}>{referralData.referralCode}</div>
                                <p style={styles.infoText}>Share this code with friends! When they join, they get ₹20 and you get ₹50 credit.</p>
                            </div>

                            {/* Apply Referral Code */}
                            {!referralData.referredBy ? (
                                <div style={styles.actionCard}>
                                    <h5 style={styles.actionTitle}>Got a Friend's Referral Code?</h5>
                                    <div style={styles.formRow}>
                                        <input 
                                            type="text" 
                                            placeholder="Enter referral code" 
                                            value={friendCode} 
                                            onChange={(e) => setFriendCode(e.target.value)}
                                            style={styles.inputField}
                                        />
                                        <button onClick={handleApplyReferral} style={styles.actionBtn}>Apply Code</button>
                                    </div>
                                    {referralMessage && <p style={styles.successMsg}>{referralMessage}</p>}
                                    {referralError && <p style={styles.errorMsg}>{referralError}</p>}
                                </div>
                            ) : (
                                <div style={styles.actionCard}>
                                    <p style={styles.successMsg}>✓ Referred by: <strong>{referralData.referredBy}</strong> (Reward received!)</p>
                                </div>
                            )}

                            {/* Referral Stats */}
                            <div style={styles.statsGrid}>
                                <div style={styles.statCard}>
                                    <div style={styles.statIcon}>👥</div>
                                    <div style={styles.statValue}>{referralData.history ? referralData.history.length : 0}</div>
                                    <div style={styles.statLabel}>Successful Invites</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statIcon}>💰</div>
                                    <div style={styles.statValue}>₹{(referralData.totalEarned || 0).toFixed(2)}</div>
                                    <div style={styles.statLabel}>Total Earned</div>
                                </div>
                            </div>

                            {/* Referral History */}
                            <div style={styles.txnSection}>
                                <h5 style={styles.actionTitle}>Invited Friends</h5>
                                {referralData.history && referralData.history.length > 0 ? (
                                    <div style={styles.txnList}>
                                        {referralData.history.map(ref => (
                                            <div key={ref.id} style={styles.txnCard}>
                                                <div style={styles.txnHeader}>
                                                    <span style={styles.txnDesc}><strong>{ref.referredName}</strong> ({ref.referredEmail})</span>
                                                    <span style={styles.txnDate}>{new Date(ref.completedAt).toLocaleDateString()}</span>
                                                </div>
                                                <div style={styles.txnBody}>
                                                    <span style={styles.pointsEarned}>+{ref.points} pts</span>
                                                    <span style={{...styles.txnAmt, color: '#10b981'}}>+ ₹{ref.reward.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={styles.noTxns}>No friends referred yet. Share your code above to start earning!</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Subscriptions Tab */}
                    {activeTab === 'subscriptions' && (
                        <div style={styles.subscriptionSection}>
                            <h4 style={styles.sectionTitle}>👑 BiteRush Gold Membership</h4>
                            
                            {subscription.active ? (
                                <div style={styles.subActiveCard}>
                                    <div style={styles.subHeader}>
                                        <span style={styles.subBadge}>{subscription.planType} Member</span>
                                        <span style={styles.subStatus}>ACTIVE</span>
                                    </div>
                                    <div style={styles.subInfoRow}>
                                        <div>
                                            <div style={styles.subLabel}>Deliveries Left</div>
                                            <div style={styles.subValue}>{subscription.deliveriesPerMonth === 999 ? 'Unlimited' : (subscription.deliveriesPerMonth - subscription.deliveriesUsed)}</div>
                                        </div>
                                        <div>
                                            <div style={styles.subLabel}>Discount</div>
                                            <div style={styles.subValue}>{subscription.discountPercentage}% OFF</div>
                                        </div>
                                        <div>
                                            <div style={styles.subLabel}>Free Delivery</div>
                                            <div style={styles.subValue}>{subscription.freeDelivery ? 'YES' : 'NO'}</div>
                                        </div>
                                    </div>
                                    <p style={styles.subMeta}>Next Billing Date: {new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
                                    <button onClick={handleCancelSubscription} style={styles.cancelSubBtn}>Cancel Subscription</button>
                                    {subMessage && <p style={styles.successMsg}>{subMessage}</p>}
                                    {subError && <p style={styles.errorMsg}>{subError}</p>}
                                </div>
                            ) : (
                                <div style={styles.subIntro}>
                                    <p style={styles.infoText}>Unlock free deliveries, exclusive discounts, and priority customer support with our subscription plans.</p>
                                    
                                    <div style={styles.plansGrid}>
                                        {/* Basic Plan */}
                                        <div style={styles.planCard}>
                                            <h5 style={styles.planName}>Basic</h5>
                                            <div style={styles.planPrice}>₹99<span style={styles.planPeriod}>/mo</span></div>
                                            <ul style={styles.planFeatures}>
                                                <li>🚚 5 Free Deliveries / mo</li>
                                                <li>✓ Free Delivery</li>
                                                <li>✗ No Extra Discounts</li>
                                                <li>✗ Standard Support</li>
                                            </ul>
                                            <button onClick={() => handlePurchaseSubscription('BASIC')} style={styles.planBtn}>Get Basic</button>
                                        </div>

                                        {/* Premium Plan */}
                                        <div style={{...styles.planCard, border: '2px solid #8b5cf6', background: '#fcfaff'}}>
                                            <div style={styles.popularBadge}>Most Popular</div>
                                            <h5 style={styles.planName}>Premium</h5>
                                            <div style={styles.planPrice}>₹199<span style={styles.planPeriod}>/mo</span></div>
                                            <ul style={styles.planFeatures}>
                                                <li>🚚 15 Free Deliveries / mo</li>
                                                <li>✓ Free Delivery</li>
                                                <li>🏷️ 5% Off All Orders</li>
                                                <li>⚡ Priority Support</li>
                                            </ul>
                                            <button onClick={() => handlePurchaseSubscription('PREMIUM')} style={{...styles.planBtn, background: '#8b5cf6'}}>Get Premium</button>
                                        </div>

                                        {/* Gold Plan */}
                                        <div style={styles.planCard}>
                                            <h5 style={styles.planName}>Gold</h5>
                                            <div style={styles.planPrice}>₹299<span style={styles.planPeriod}>/mo</span></div>
                                            <ul style={styles.planFeatures}>
                                                <li>🚀 Unlimited Free Deliveries</li>
                                                <li>✓ Free Delivery</li>
                                                <li>🏷️ 10% Off All Orders</li>
                                                <li>👑 VIP Support & Offers</li>
                                            </ul>
                                            <button onClick={() => handlePurchaseSubscription('GOLD')} style={styles.planBtn}>Get Gold</button>
                                        </div>
                                    </div>
                                    {subMessage && <p style={styles.successMsg}>{subMessage}</p>}
                                    {subError && <p style={styles.errorMsg}>{subError}</p>}
                                </div>
                            )}
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
    },
    walletSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '10px 0'
    },
    walletBalanceCard: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.25)'
    },
    walletLabel: {
        fontSize: '14px',
        opacity: '0.85',
        marginBottom: '8px',
        fontWeight: '500'
    },
    walletValue: {
        fontSize: '36px',
        fontWeight: '800',
        marginBottom: '10px'
    },
    loyaltyValue: {
        fontSize: '14px',
        background: 'rgba(255, 255, 255, 0.2)',
        padding: '6px 12px',
        borderRadius: '20px',
        display: 'inline-block',
        fontWeight: '600'
    },
    actionCard: {
        background: '#f8fafc',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    actionTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '700',
        color: '#1e293b'
    },
    formRow: {
        display: 'flex',
        gap: '12px'
    },
    inputField: {
        flex: 1,
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        fontSize: '14px',
        outline: 'none',
        transition: 'border 0.2s ease',
        background: 'white',
        color: '#1e293b'
    },
    actionBtn: {
        padding: '12px 24px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background 0.2s ease'
    },
    successMsg: {
        margin: 0,
        color: '#10b981',
        fontSize: '14px',
        fontWeight: '600'
    },
    errorMsg: {
        margin: 0,
        color: '#ef4444',
        fontSize: '14px',
        fontWeight: '600'
    },
    infoText: {
        margin: 0,
        color: '#64748b',
        fontSize: '14px',
        lineHeight: '1.5'
    },
    txnSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '10px'
    },
    txnList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxHeight: '300px',
        overflowY: 'auto',
        paddingRight: '4px'
    },
    txnCard: {
        background: 'white',
        borderRadius: '12px',
        padding: '14px 16px',
        border: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    txnHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    txnType: {
        fontSize: '11px',
        fontWeight: '700',
        padding: '2px 8px',
        borderRadius: '8px',
        background: '#f1f5f9',
        letterSpacing: '0.5px'
    },
    txnDate: {
        fontSize: '12px',
        color: '#94a3b8'
    },
    txnBody: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    txnDesc: {
        fontSize: '14px',
        color: '#475569',
        fontWeight: '500'
    },
    txnAmt: {
        fontSize: '16px',
        fontWeight: '700'
    },
    noTxns: {
        margin: 0,
        color: '#94a3b8',
        fontSize: '14px',
        textAlign: 'center',
        padding: '20px 0'
    },
    referralSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '10px 0'
    },
    referralCodeCard: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)'
    },
    refLabel: {
        fontSize: '14px',
        opacity: '0.9',
        marginBottom: '8px',
        fontWeight: '500'
    },
    refCode: {
        fontSize: '32px',
        fontWeight: '800',
        letterSpacing: '1.5px',
        marginBottom: '12px',
        textTransform: 'uppercase'
    },
    subscriptionSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '10px 0'
    },
    subActiveCard: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
        boxShadow: '0 8px 20px rgba(245, 158, 11, 0.25)'
    },
    subHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    subBadge: {
        fontSize: '20px',
        fontWeight: '800'
    },
    subStatus: {
        background: 'rgba(255, 255, 255, 0.25)',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '1px'
    },
    subInfoRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '20px',
        background: 'rgba(0, 0, 0, 0.1)',
        padding: '16px',
        borderRadius: '12px'
    },
    subLabel: {
        fontSize: '11px',
        opacity: '0.85',
        marginBottom: '4px',
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    subValue: {
        fontSize: '18px',
        fontWeight: '800'
    },
    subMeta: {
        margin: '0 0 16px 0',
        fontSize: '13px',
        opacity: '0.9',
        fontWeight: '500'
    },
    cancelSubBtn: {
        padding: '10px 20px',
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '10px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'background 0.2s ease'
    },
    subIntro: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    plansGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
    },
    planCard: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    },
    planName: {
        margin: 0,
        fontSize: '20px',
        fontWeight: '700',
        color: '#1e293b'
    },
    planPrice: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#1e293b'
    },
    planPeriod: {
        fontSize: '14px',
        color: '#64748b',
        fontWeight: '500'
    },
    planFeatures: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        fontSize: '13px',
        color: '#475569',
        flex: 1
    },
    planBtn: {
        width: '100%',
        padding: '10px 16px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background 0.2s'
    },
    popularBadge: {
        position: 'absolute',
        top: '-12px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#8b5cf6',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)'
    }
};