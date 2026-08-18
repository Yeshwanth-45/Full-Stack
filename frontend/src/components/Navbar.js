import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import EnhancedUserProfile from "./EnhancedUserProfile";

export default function Navbar() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [showProfile, setShowProfile] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    
    const customerToken = localStorage.getItem("token");
    const restaurantToken = localStorage.getItem("restaurantToken");
    const token = customerToken || restaurantToken;
    const isRestaurant = !!restaurantToken && location.pathname.includes('restaurant');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(count);
        };

        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        window.addEventListener('cartUpdated', updateCartCount);

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, [location]);

    const handleClearStorage = () => {
        localStorage.clear();
        window.location.reload();
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            <nav style={{
                ...styles.navbar,
                top: isScrolled ? '10px' : '20px',
                width: isScrolled ? '92%' : '90%',
                boxShadow: isScrolled ? '0 20px 40px rgba(0, 0, 0, 0.15)' : '0 10px 30px rgba(0, 0, 0, 0.05)'
            }}>
                <div style={styles.container}>
                    {/* Logo Section */}
                    <Link to="/" style={styles.logo}>
                        <div style={styles.logoIcon}>⚡</div>
                        <div style={styles.logoContent}>
                            <span style={styles.logoText}>BiteRush</span>
                            <span style={styles.logoTagline}>AI-Fulfillment</span>
                        </div>
                    </Link>
                    
                    {/* Navigation Links */}
                    <div style={styles.navLinks}>
                        {token ? (
                            isRestaurant ? (
                                <>
                                    <Link 
                                        to="/restaurant-dashboard" 
                                        style={{
                                            ...styles.navLink,
                                            ...(isActive('/restaurant-dashboard') ? styles.navLinkActive : {})
                                        }}
                                    >
                                        <span style={styles.navIcon}>📊</span>
                                        <span>Console</span>
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            localStorage.removeItem("restaurantToken");
                                            localStorage.removeItem("restaurantData");
                                            window.location.href = "/restaurant-login";
                                        }}
                                        style={styles.logoutBtn}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/" 
                                        style={{
                                            ...styles.navLink,
                                            ...(isActive('/') ? styles.navLinkActive : {})
                                        }}
                                    >
                                        <span style={styles.navIcon}>🏠</span>
                                        <span style={styles.linkLabel}>Home</span>
                                    </Link>
                                    <Link 
                                        to="/menu" 
                                        style={{
                                            ...styles.navLink,
                                            ...(isActive('/menu') ? styles.navLinkActive : {})
                                        }}
                                    >
                                        <span style={styles.navIcon}>🍽️</span>
                                        <span style={styles.linkLabel}>Menu</span>
                                    </Link>
                                    <Link 
                                        to="/orders" 
                                        style={{
                                            ...styles.navLink,
                                            ...(isActive('/orders') ? styles.navLinkActive : {})
                                        }}
                                    >
                                        <span style={styles.navIcon}>📦</span>
                                        <span style={styles.linkLabel}>Orders</span>
                                    </Link>
                                    <Link 
                                        to="/cart" 
                                        style={{
                                            ...styles.navLink,
                                            ...(isActive('/cart') ? styles.navLinkActive : {})
                                        }}
                                    >
                                        <span style={styles.navIcon}>🛒</span>
                                        <span style={styles.linkLabel}>Cart</span>
                                        {cartCount > 0 && (
                                            <span style={styles.cartBadge}>{cartCount}</span>
                                        )}
                                    </Link>
                                    
                                    {/* User Profile Button */}
                                    <button 
                                        onClick={() => setShowProfile(true)}
                                        style={{
                                            ...styles.profileBtn,
                                            ...(showProfile ? styles.profileBtnActive : {})
                                        }}
                                    >
                                        <div style={styles.profileAvatar}>
                                            {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                                        </div>
                                        <span style={styles.profileName}>
                                            {user.name ? user.name.split(' ')[0] : 'Profile'}
                                        </span>
                                    </button>
                                </>
                            )
                        ) : (
                            <>
                                <Link to="/auth" style={styles.loginBtn}>
                                    <span>Sign In</span>
                                </Link>
                                <Link to="/auth?mode=register" style={styles.registerBtn}>
                                    <span>Register</span>
                                </Link>
                            </>
                        )}
                        
                        {process.env.NODE_ENV === 'development' && (
                            <button 
                                onClick={handleClearStorage}
                                style={styles.debugBtn}
                                title="Clear localStorage"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            
            {showProfile && createPortal(
                <EnhancedUserProfile onClose={() => setShowProfile(false)} />,
                document.body
            )}
        </>
    );
}

const styles = {
    navbar: {
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(15, 23, 42, 0.8)", // Slate dark glass
        backdropFilter: "blur(24px)",
        borderRadius: "40px",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        zIndex: 1000,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "visible"
    },
    container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 20px",
        position: "relative"
    },
    logo: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
        color: "white",
        padding: "6px 12px",
        borderRadius: "12px"
    },
    logoIcon: {
        fontSize: "24px",
        color: "#a78bfa",
        textShadow: "0 0 10px rgba(167, 139, 250, 0.5)",
        fontWeight: 'bold'
    },
    logoContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
    },
    logoText: {
        fontSize: "18px",
        fontWeight: "900",
        letterSpacing: "-0.5px",
        lineHeight: "1"
    },
    logoTagline: {
        fontSize: "9px",
        opacity: "0.7",
        fontWeight: "600",
        letterSpacing: "0.5px",
        marginTop: "2px",
        textTransform: 'uppercase'
    },
    navLinks: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        position: "relative"
    },
    navLink: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        color: "white",
        textDecoration: "none",
        borderRadius: "30px",
        fontWeight: "600",
        fontSize: "13px",
        transition: "all 0.2s ease",
        background: "transparent",
        position: "relative"
    },
    navLinkActive: {
        background: "rgba(255, 255, 255, 0.15)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.05)"
    },
    linkLabel: {
        display: 'inline'
    },
    navIcon: {
        fontSize: "14px"
    },
    cartBadge: {
        background: "#ef4444",
        color: "white",
        borderRadius: "50%",
        width: "16px",
        height: "16px",
        fontSize: "9px",
        fontWeight: "800",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #0f172a",
        marginLeft: '4px'
    },
    profileBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        background: "rgba(255, 255, 255, 0.1)",
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "30px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "13px",
        transition: "all 0.2s ease"
    },
    profileBtnActive: {
        background: "rgba(255, 255, 255, 0.2)",
        borderColor: "rgba(255,255,255,0.3)"
    },
    profileAvatar: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #a78bfa, #ec4899)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: "750",
        color: "white"
    },
    profileName: {
        fontSize: "12px",
        fontWeight: "600"
    },
    logoutBtn: {
        padding: "8px 14px",
        background: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "30px",
        fontSize: "12px",
        fontWeight: "700",
        cursor: "pointer"
    },
    loginBtn: {
        padding: "8px 16px",
        color: "white",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "13px"
    },
    registerBtn: {
        padding: "8px 16px",
        background: "white",
        color: "#0f172a",
        textDecoration: "none",
        borderRadius: "30px",
        fontWeight: "700",
        fontSize: "13px",
        boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)"
    },
    debugBtn: {
        width: "30px",
        height: "30px",
        background: "rgba(255, 255, 255, 0.05)",
        color: "white",
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "12px",
        opacity: "0.6"
    }
};
