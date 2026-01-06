import { Link } from "react-router-dom";

export default function Navbar() {
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <nav style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            padding: "15px 30px",
            backgroundColor: "#333",
            color: "white"
        }}>
            <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "20px", fontWeight: "bold" }}>
                FoodApp
            </Link>
            <div>
                {token ? (
                    <>
                        <Link to="/menu" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>
                            Menu
                        </Link>
                        <Link to="/orders" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>
                            Orders
                        </Link>
                        <Link to="/cart" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>
                            Cart
                        </Link>
                        <button 
                            onClick={handleLogout}
                            style={{ 
                                padding: "8px 15px", 
                                backgroundColor: "#ff6b6b", 
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/auth" style={{ 
                        padding: "8px 15px", 
                        backgroundColor: "#4CAF50", 
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "4px"
                    }}>
                        Login / Register
                    </Link>
                )}
            </div>
        </nav>
    );
}
