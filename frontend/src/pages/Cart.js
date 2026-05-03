import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BillBreakdown from "../components/BillBreakdown";

export default function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addressDetails, setAddressDetails] = useState({
        houseNo: "",
        street: "",
        landmark: ""
    });
    const [finalTotal, setFinalTotal] = useState(0);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(savedCart);
    }, []);

    const updateQuantity = (id, qty) => {
        if (qty <= 0) {
            removeItem(id);
            return;
        }
        const updated = cart.map(item =>
            item.id === id ? { ...item, quantity: qty } : item
        );
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        // Dispatch custom event to update navbar
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const removeItem = (id) => {
        const updated = cart.filter(item => item.id !== id);
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        // Dispatch custom event to update navbar
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }

        if (!addressDetails.houseNo.trim() || !addressDetails.street.trim()) {
            alert("Please enter House/Flat No. and Street/Locality!");
            return;
        }

        const formattedAddress = `${addressDetails.houseNo}, ${addressDetails.street}${addressDetails.landmark ? ', ' + addressDetails.landmark : ''}`;

        setLoading(true);
        try {
            // Get restaurant ID from first item in cart
            const restaurantId = cart[0]?.restaurantId || 1;
            
            const orderData = {
                restaurantId: restaurantId,
                items: cart.map(item => ({
                    menuItemId: item.id,
                    quantity: item.quantity
                })),
                deliveryAddress: formattedAddress,
                deliveryLatitude: 17.4326, // Default to Hyderabad
                deliveryLongitude: 78.4071
            };

            const res = await fetch("http://localhost:8080/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (res.ok) {
                const orderResponse = await res.json();
                alert("Order placed successfully!");
                localStorage.removeItem("cart");
                setCart([]);
                // Dispatch custom event to update navbar
                window.dispatchEvent(new Event('cartUpdated'));
                setTimeout(() => navigate(`/tracking/${orderResponse.id || 1}`), 1500);
            } else {
                const errorData = await res.json().catch(() => ({}));
                const errorMsg = errorData.error || errorData.message || "Failed to place order";
                console.error("Order error:", errorData);
                alert(errorMsg);
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Cannot connect to server. Please check if backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Shopping Cart</h1>

            {cart.length === 0 ? (
                <div style={styles.emptyCart}>
                    <p>Your cart is empty</p>
                    <Link to="/" style={styles.shopBtn}>Continue Shopping</Link>
                </div>
            ) : (
                <div style={styles.content}>
                    <div style={styles.itemsList}>
                        {cart.map(item => (
                            <div key={item.id} style={styles.cartItem}>
                                <div style={styles.itemInfo}>
                                    <h3 style={styles.itemName}>{item.name}</h3>
                                    <p style={styles.itemPrice}>₹{item.price?.toFixed(2)}</p>
                                </div>
                                <div style={styles.quantity}>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        style={styles.qtyBtn}
                                    >
                                        −
                                    </button>
                                    <span style={styles.qtyValue}>{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        style={styles.qtyBtn}
                                    >
                                        +
                                    </button>
                                </div>
                                <div style={styles.itemTotal}>
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    style={styles.removeBtn}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={styles.summary}>
                        {/* Delivery Address Section */}
                        <div style={styles.addressSection}>
                            <h4 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#1a1a1a" }}>📍 Delivery Details</h4>
                            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.addressLabel}>House/Flat No. *</label>
                                    <input
                                        type="text"
                                        value={addressDetails.houseNo}
                                        onChange={(e) => setAddressDetails({...addressDetails, houseNo: e.target.value})}
                                        placeholder="E.g. Flat 401, Tower B"
                                        style={styles.addressInput}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label style={styles.addressLabel}>Street/Locality *</label>
                                <input
                                    type="text"
                                    value={addressDetails.street}
                                    onChange={(e) => setAddressDetails({...addressDetails, street: e.target.value})}
                                    placeholder="E.g. Road No. 12, Banjara Hills"
                                    style={styles.addressInput}
                                />
                            </div>
                            <div style={{ marginBottom: "5px" }}>
                                <label style={styles.addressLabel}>Landmark (Optional)</label>
                                <input
                                    type="text"
                                    value={addressDetails.landmark}
                                    onChange={(e) => setAddressDetails({...addressDetails, landmark: e.target.value})}
                                    placeholder="E.g. Near City Center Mall"
                                    style={styles.addressInput}
                                />
                            </div>
                        </div>

                        {/* Enhanced Bill Breakdown Component */}
                        <BillBreakdown 
                            cartItems={cart}
                            deliveryAddress={`${addressDetails.houseNo ? addressDetails.houseNo + ', ' : ''}${addressDetails.street}`}
                            onTotalChange={setFinalTotal}
                        />

                        <button
                            onClick={handleCheckout}
                            disabled={loading || !addressDetails.houseNo.trim() || !addressDetails.street.trim()}
                            style={{
                                ...styles.checkoutBtn,
                                opacity: (loading || !addressDetails.houseNo.trim() || !addressDetails.street.trim()) ? 0.6 : 1
                            }}
                        >
                            {loading ? "Processing..." : `Place Order • ₹${finalTotal.toFixed(0)}`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: "40px 20px",
        maxWidth: "1200px",
        margin: "0 auto"
    },
    title: {
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "30px",
        color: "#1a1a1a",
        textAlign: "center"
    },
    emptyCart: {
        textAlign: "center",
        padding: "60px 20px",
        background: "#f5f5f5",
        borderRadius: "12px"
    },
    shopBtn: {
        display: "inline-block",
        marginTop: "20px",
        padding: "12px 24px",
        background: "#667eea",
        color: "white",
        textDecoration: "none",
        borderRadius: "8px",
        fontWeight: "600"
    },
    content: {
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        gap: "30px"
    },
    "@media (max-width: 768px)": {
        content: {
            gridTemplateColumns: "1fr",
            gap: "20px"
        }
    },
    itemsList: {
        background: "white",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
    },
    cartItem: {
        display: "grid",
        gridTemplateColumns: "1fr 120px 120px 80px",
        gap: "20px",
        alignItems: "center",
        padding: "20px",
        borderBottom: "1px solid #e0e0e0"
    },
    itemInfo: {
        display: "flex",
        flexDirection: "column"
    },
    itemName: {
        margin: "0",
        fontSize: "16px",
        fontWeight: "600",
        color: "#1a1a1a"
    },
    itemPrice: {
        margin: "4px 0 0 0",
        fontSize: "14px",
        color: "#666"
    },
    quantity: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#f5f5f5",
        borderRadius: "6px",
        padding: "4px 8px"
    },
    qtyBtn: {
        background: "transparent",
        border: "none",
        fontSize: "18px",
        cursor: "pointer",
        width: "30px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    qtyValue: {
        flex: 1,
        textAlign: "center",
        fontWeight: "600"
    },
    itemTotal: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#667eea",
        textAlign: "right"
    },
    removeBtn: {
        background: "#ff6b6b",
        color: "white",
        border: "none",
        borderRadius: "4px",
        padding: "6px 12px",
        fontSize: "12px",
        cursor: "pointer",
        fontWeight: "600"
    },
    summary: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        height: 'fit-content'
    },
    summaryTitle: {
        margin: "0 0 20px 0",
        fontSize: "18px",
        fontWeight: "700",
        color: "#1a1a1a"
    },
    addressSection: {
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
    },
    addressLabel: {
        display: "block",
        marginBottom: "8px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#1a1a1a"
    },
    addressInput: {
        width: "100%",
        padding: "12px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        fontSize: "14px",
        fontFamily: "inherit",
        resize: "vertical",
        boxSizing: "border-box"
    },
    addressHint: {
        display: "block",
        marginTop: "6px",
        fontSize: "12px",
        color: "#666"
    },
    summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "12px",
        fontSize: "14px",
        color: "#666"
    },
    totalRow: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#1a1a1a"
    },
    divider: {
        height: "1px",
        background: "#e0e0e0",
        margin: "16px 0"
    },
    checkoutBtn: {
        width: "100%",
        padding: "16px 20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "none",
        borderRadius: "16px",
        fontSize: "18px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)"
    }
};
