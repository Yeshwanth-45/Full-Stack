import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [deliveryCoordinates, setDeliveryCoordinates] = useState(null);
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
    };

    const removeItem = (id) => {
        const updated = cart.filter(item => item.id !== id);
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const deliveryFee = total >= 99 ? 0 : 49;
    const taxable = Math.max(0, total - discount);
    const tax = taxable * 0.1;

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }

        if (!deliveryAddress.trim()) {
            alert("Please enter a delivery address!");
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    itemId: item.id,
                    quantity: item.quantity
                })),
                deliveryAddress: deliveryAddress,
                deliveryLatitude: deliveryCoordinates?.lat || 12.9716, // Default to Bangalore
                deliveryLongitude: deliveryCoordinates?.lng || 77.5946
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
                setTimeout(() => navigate(`/tracking/${orderResponse.id || 1}`), 1500);
            } else {
                alert("Failed to place order");
            }
        } catch (err) {
            console.error(err);
            alert("Cannot connect to server");
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
                        <h2 style={styles.summaryTitle}>Order Summary</h2>
                        
                        {/* Delivery Address Section */}
                        <div style={styles.addressSection}>
                            <label style={styles.addressLabel}>Delivery Address *</label>
                            <textarea
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder="Enter your complete delivery address..."
                                style={styles.addressInput}
                                rows="3"
                            />
                            <small style={styles.addressHint}>
                                Please provide a complete address including landmarks
                            </small>
                        </div>

                        <div style={styles.summaryRow}>
                            <span>Subtotal:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                <div style={styles.summaryRow}>
                    <span>Coupon:</span>
                    <div style={{display: 'flex', gap:8}}>
                        <input placeholder="Enter coupon" value={couponCode} onChange={e=>setCouponCode(e.target.value)} style={{padding:'6px', borderRadius:6, border:'1px solid #ddd'}} />
                        <button onClick={() => {
                            const code = (couponCode || "").trim().toUpperCase();
                            if (code === "NEWUSER10") {
                                setDiscount(total * 0.10);
                                alert("Applied 10% off");
                            } else if (code === "FLAT50") {
                                setDiscount(50);
                                alert("Applied ₹50 off");
                            } else {
                                setDiscount(0);
                                alert("Invalid coupon");
                            }
                        }} style={{padding:'6px 10px', borderRadius:6, background:'#667eea', color:'#fff', border:'none'}}>Apply</button>
                    </div>
                </div>
                        <div style={styles.summaryRow}>
                            <span>Delivery Fee:</span>
                            <span>₹{deliveryFee.toFixed(2)}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Tax:</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div style={styles.divider}></div>
                        <div style={{...styles.summaryRow, ...styles.totalRow}}>
                            <span>Total:</span>
                            <span>₹{(Math.max(0, total - discount) + deliveryFee + tax).toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={loading || !deliveryAddress.trim()}
                            style={{
                                ...styles.checkoutBtn,
                                opacity: (loading || !deliveryAddress.trim()) ? 0.6 : 1
                            }}
                        >
                            {loading ? "Processing..." : "Place Order"}
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
        background: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        height: "fit-content"
    },
    summaryTitle: {
        margin: "0 0 20px 0",
        fontSize: "18px",
        fontWeight: "700",
        color: "#1a1a1a"
    },
    addressSection: {
        marginBottom: "20px",
        paddingBottom: "20px",
        borderBottom: "1px solid #e0e0e0"
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
        padding: "12px 16px",
        marginTop: "20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "all 0.3s ease"
    }
};
