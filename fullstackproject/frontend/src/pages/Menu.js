import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Menu() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get("restaurant");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const token = localStorage.getItem("token");

    const loadCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };

    useEffect(() => {
        loadCart();
    }, []);

    useEffect(() => {
        if (!restaurantId || !token) return;

        const fetchMenu = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/menus/restaurant/${restaurantId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setItems(Array.isArray(data) ? data : []);
                } else {
                    setError("Failed to load menu");
                }
            } catch (e) {
                console.error(e);
                setError("Cannot connect to server");
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [restaurantId, token]);

    const addToCart = (item) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find(c => c.id === item.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
        alert("Added to cart!");
    };

    if (loading) return <div style={styles.loadingContainer}><p>Loading menu...</p></div>;
    if (error) return <div style={styles.errorContainer}><p>{error}</p></div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={() => navigate("/")} style={styles.backBtn}>← Back</button>
                <h1 style={styles.title}>Menu</h1>
                <button onClick={() => navigate("/cart")} style={styles.cartBtn}>
                    Cart ({cartCount})
                </button>
            </div>

            <div style={styles.grid}>
                {items.map(item => (
                    <div key={item.id} style={styles.itemCard}>
                        <div style={styles.itemImage}>
                            <div style={styles.placeholderIcon}>Food Item</div>
                        </div>
                        <h3 style={styles.itemName}>{item.name}</h3>
                        <p style={styles.itemDesc}>{item.description || "Delicious item"}</p>
                        <div style={styles.itemFooter}>
                            <span style={styles.price}>₹{item.price?.toFixed(2) || "0.00"}</span>
                            <button
                                onClick={() => addToCart(item)}
                                style={styles.addBtn}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {items.length === 0 && <p style={styles.empty}>No items on this menu</p>}
        </div>
    );
}

const styles = {
    container: {
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        gap: "20px"
    },
    backBtn: {
        padding: "10px 16px",
        background: "#667eea",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },
    cartBtn: {
        padding: "10px 16px",
        background: "#764ba2",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },
    title: {
        margin: "0",
        flex: 1,
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "700",
        color: "#1a1a1a"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px"
    },
    itemCard: {
        background: "white",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease"
    },
    itemImage: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        height: "140px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white"
    },
    placeholderIcon: {
        fontSize: "14px",
        fontWeight: "600",
        textAlign: "center"
    },
    itemName: {
        padding: "12px 12px 4px 12px",
        margin: "0",
        fontSize: "16px",
        fontWeight: "600",
        color: "#1a1a1a"
    },
    itemDesc: {
        padding: "0 12px 12px 12px",
        margin: "0",
        fontSize: "12px",
        color: "#666",
        minHeight: "30px"
    },
    itemFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 12px",
        borderTop: "1px solid #e0e0e0"
    },
    price: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#667eea"
    },
    addBtn: {
        padding: "8px 12px",
        background: "#667eea",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "background 0.3s ease"
    },
    loadingContainer: {
        textAlign: "center",
        padding: "60px 20px",
        color: "#666"
    },
    errorContainer: {
        textAlign: "center",
        padding: "60px 20px",
        color: "#c33"
    },
    empty: {
        textAlign: "center",
        padding: "40px",
        color: "#999"
    }
};
