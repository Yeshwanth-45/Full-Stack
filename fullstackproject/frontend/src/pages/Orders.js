import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        const fetchOrders = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/orders/my", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrders(Array.isArray(data) ? data : []);
                } else {
                    setError("Failed to load orders");
                }
            } catch (e) {
                console.error(e);
                setError("Cannot connect to server");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    if (loading) return <div style={styles.loadingContainer}><p>🔄 Loading orders...</p></div>;
    if (error) return <div style={styles.errorContainer}><p>❌ {error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>📦 My Orders</h1>

            {orders.length === 0 ? (
                <div style={styles.emptyOrders}>
                    <p>No orders yet</p>
                    <button onClick={() => navigate("/")} style={styles.shopBtn}>
                        Start Ordering
                    </button>
                </div>
            ) : (
                <div style={styles.grid}>
                    {orders.map(order => (
                        <div key={order.id} style={styles.orderCard}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.orderNumber}>Order #{order.id}</h3>
                                <span style={styles.status(order.status)}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>
                            
                            <div style={styles.cardBody}>
                                <div style={styles.infoRow}>
                                    <span style={styles.label}>Status:</span>
                                    <span>{order.status || "Pending"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.label}>Total:</span>
                                    <span style={styles.total}>₹{order.total?.toFixed(2) || "0.00"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.label}>Date:</span>
                                    <span>{formatDate(order.createdAt)}</span>
                                </div>

                                {order.items && order.items.length > 0 && (
                                    <div style={styles.itemsSection}>
                                        <strong style={styles.itemsTitle}>Items:</strong>
                                        <ul style={styles.itemsList}>
                                            {order.items.map((item, idx) => (
                                                <li key={idx} style={styles.itemLi}>
                                                    {item.name || item.itemId} <span style={styles.qty}>x{item.quantity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const getStatusLabel = (status) => {
    const labels = {
        "PENDING": "⏳ Pending",
        "CONFIRMED": "✅ Confirmed",
        "PREPARING": "👨‍🍳 Preparing",
        "OUT_FOR_DELIVERY": "🚗 Out for Delivery",
        "DELIVERED": "📍 Delivered",
        "CANCELLED": "❌ Cancelled"
    };
    return labels[status] || status;
};

const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString();
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

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
    emptyOrders: {
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
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "24px"
    },
    orderCard: {
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden"
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white"
    },
    orderNumber: {
        margin: "0",
        fontSize: "18px",
        fontWeight: "700"
    },
    status: (status) => ({
        padding: "6px 12px",
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "600"
    }),
    cardBody: {
        padding: "20px"
    },
    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "12px",
        fontSize: "14px"
    },
    label: {
        fontWeight: "600",
        color: "#666"
    },
    total: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#667eea"
    },
    itemsSection: {
        marginTop: "16px",
        paddingTop: "16px",
        borderTop: "1px solid #e0e0e0"
    },
    itemsTitle: {
        display: "block",
        marginBottom: "8px",
        fontSize: "14px"
    },
    itemsList: {
        margin: "0",
        paddingLeft: "20px",
        listStyle: "none"
    },
    itemLi: {
        padding: "4px 0",
        fontSize: "13px",
        color: "#666"
    },
    qty: {
        marginLeft: "8px",
        color: "#999"
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
    }
};
