import { Link } from "react-router-dom";

export default function Navbar() {
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const handleClearStorage = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    <div style={styles.logoIcon}>🍕</div>
                    <span style={styles.logoText}>FoodieHub</span>
                </Link>
                
                <div style={styles.navLinks}>
                    {token ? (
                        <>
                            <Link to="/" style={styles.navLink}>
                                <span style={styles.navIcon}>🏠</span>
                                Home
                            </Link>
                            <Link to="/menu" style={styles.navLink}>
                                <span style={styles.navIcon}>📋</span>
                                Menu
                            </Link>
                            <Link to="/orders" style={styles.navLink}>
                                <span style={styles.navIcon}>📦</span>
                                Orders
                            </Link>
                            <Link to="/cart" style={styles.navLink}>
                                <span style={styles.navIcon}>🛒</span>
                                Cart
                            </Link>
                            <button 
                                onClick={handleClearStorage}
                                style={styles.debugBtn}
                                title="Clear localStorage if having issues"
                            >
                                🔄
                            </button>
                            <button 
                                onClick={handleLogout}
                                style={styles.logoutBtn}
                            >
                                <span style={styles.navIcon}>🚪</span>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={handleClearStorage}
                                style={styles.debugBtn}
                                title="Clear localStorage if having issues"
                            >
                                🔄 Clear Cache
                            </button>
                            <Link to="/auth" style={styles.loginBtn}>
                                <span style={styles.navIcon}>👤</span>
                                Login / Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

const styles = {
    navbar: {
        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
        boxShadow: "0 4px 20px rgba(255, 107, 107, 0.3)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backdropFilter: "blur(10px)"
    },
    container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        maxWidth: "1200px",
        margin: "0 auto"
    },
    logo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textDecoration: "none",
        color: "white",
        fontWeight: "800",
        fontSize: "24px",
        transition: "all 0.3s ease"
    },
    logoIcon: {
        fontSize: "32px",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
    },
    logoText: {
        letterSpacing: "-0.5px"
    },
    navLinks: {
        display: "flex",
        alignItems: "center",
        gap: "8px"
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
        backdropFilter: "blur(10px)"
    },
    navIcon: {
        fontSize: "16px"
    },
    debugBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        background: "rgba(255, 255, 255, 0.15)",
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "500",
        fontSize: "12px",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)"
    },
    logoutBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 16px",
        background: "rgba(255, 255, 255, 0.2)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)"
    },
    loginBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 20px",
        background: "rgba(255, 255, 255, 0.2)",
        color: "white",
        textDecoration: "none",
        borderRadius: "12px",
        fontWeight: "600",
        fontSize: "14px",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)"
    }
};
