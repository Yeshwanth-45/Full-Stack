import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { createPortal } from "react-dom";
import EnhancedUserProfile from "./EnhancedUserProfile";

export default function Navbar() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [showProfile, setShowProfile] = useState(false);
    const location = useLocation();

    const handleClearStorage = () => {
        localStorage.clear();
        window.location.reload();
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            <nav style={styles.navbar}>
                <div style={styles.container}>
                    {/* Logo Section */}
                    <Link to="/" style={styles.logo}>
                        <div style={styles.logoIcon}>🍔</div>
                        <div style={styles.logoContent}>
                            <span style={styles.logoText}>FoodieHub</span>
                            <span style={styles.logoTagline}>Order • Eat • Repeat</span>
                        </div>
                    </Link>
                    
                    {/* Navigation Links */}
                    <div style={styles.navLinks}>
                        {token ? (
                            <>
                                <Link 
                                    to="/" 
                                    style={{
                                        ...styles.navLink,
                                        ...(isActive('/') ? styles.navLinkActive : {})
                                    }}
                                >
                                    <span style={styles.navIcon}>🏠</span>
                                    <span>Home</span>
                                </Link>
                                <Link 
                                    to="/menu" 
                                    style={{
                                        ...styles.navLink,
                                        ...(isActive('/menu') ? styles.navLinkActive : {})
                                    }}
                                >
                                    <span style={styles.navIcon}>🍽️</span>
                                    <span>Menu</span>
                                </Link>
                                <Link 
                                    to="/orders" 
                                    style={{
                                        ...styles.navLink,
                                        ...(isActive('/orders') ? styles.navLinkActive : {})
                                    }}
                                >
                                    <span style={styles.navIcon}>📦</span>
                                    <span>Orders</span>
                                </Link>
                                <Link 
                                    to="/cart" 
                                    style={{
                                        ...styles.navLink,
                                        ...(isActive('/cart') ? styles.navLinkActive : {})
                                    }}
                                >
                                    <span style={styles.navIcon}>🛒</span>
                                    <span>Cart</span>
                                    <span style={styles.cartBadge}>3</span>
                                </Link>
                                
                                {/* User Profile Button */}
                                <button 
                                    onClick={() => setShowProfile(true)}
                                    style={{
                                        ...styles.profileBtn,
                                        ...(showProfile ? styles.profileBtnActive : {})
                                    }}
                                    className="profile-btn"
                                    title={`Logged in as ${user.name || user.email}`}
                                >
                                    <div style={styles.profileAvatar} className="profile-avatar">
                                        {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                                    </div>
                                    <span style={styles.profileName}>
                                        {user.name ? user.name.split(' ')[0] : 'Profile'}
                                    </span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/auth" style={styles.loginBtn}>
                                    <span style={styles.loginIcon}>🔐</span>
                                    <span>Login</span>
                                </Link>
                                <Link to="/auth?mode=register" style={styles.registerBtn}>
                                    <span>Sign Up</span>
                                </Link>
                            </>
                        )}
                        
                        {/* Debug Button (only show in development) */}
                        {process.env.NODE_ENV === 'development' && (
                            <button 
                                onClick={handleClearStorage}
                                style={styles.debugBtn}
                                title="Clear localStorage if having issues"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            
            {/* User Profile Modal - Rendered at document root using Portal */}
            {showProfile && createPortal(
                <EnhancedUserProfile onClose={() => setShowProfile(false)} />,
                document.body
            )}
        </>
    );
}

const styles = {
    navbar: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        overflow: "visible"
    },
    container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        maxWidth: "1400px",
        margin: "0 auto",
        position: "relative"
    },
    logo: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        textDecoration: "none",
        color: "white",
        transition: "all 0.3s ease",
        padding: "8px 12px",
        borderRadius: "12px"
    },
    logoIcon: {
        fontSize: "36px",
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
        animation: "bounce 2s infinite"
    },
    logoContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
    },
    logoText: {
        fontSize: "24px",
        fontWeight: "800",
        letterSpacing: "-0.5px",
        lineHeight: "1"
    },
    logoTagline: {
        fontSize: "11px",
        opacity: "0.8",
        fontWeight: "500",
        letterSpacing: "0.5px",
        marginTop: "2px"
    },
    navLinks: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        position: "relative"
    },
    navLink: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 16px",
        color: "white",
        textDecoration: "none",
        borderRadius: "12px",
        fontWeight: "600",
        fontSize: "14px",
        transition: "all 0.3s ease",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        position: "relative"
    },
    navLinkActive: {
        background: "rgba(255, 255, 255, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
    },
    navIcon: {
        fontSize: "16px"
    },
    cartBadge: {
        position: "absolute",
        top: "-6px",
        right: "-6px",
        background: "#ff6b6b",
        color: "white",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        fontSize: "11px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid white",
        animation: "pulse 2s infinite"
    },
    profileBtn: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 16px",
        background: "rgba(255, 255, 255, 0.15)",
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "25px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)"
    },
    profileBtnActive: {
        background: "rgba(255, 255, 255, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
    },
    profileAvatar: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "700",
        color: "white",
        border: "2px solid rgba(255, 255, 255, 0.3)"
    },
    profileName: {
        fontSize: "14px",
        fontWeight: "600"
    },
    loginBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 20px",
        background: "rgba(255, 255, 255, 0.15)",
        color: "white",
        textDecoration: "none",
        borderRadius: "25px",
        fontWeight: "600",
        fontSize: "14px",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)"
    },
    loginIcon: {
        fontSize: "16px"
    },
    registerBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 20px",
        background: "rgba(255, 255, 255, 0.9)",
        color: "#667eea",
        textDecoration: "none",
        borderRadius: "25px",
        fontWeight: "700",
        fontSize: "14px",
        transition: "all 0.3s ease",
        border: "2px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    },
    debugBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        background: "rgba(255, 255, 255, 0.1)",
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "14px",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)",
        opacity: "0.7"
    }
};
