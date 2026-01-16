import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RestaurantMap from "../components/RestaurantMap";
import AIRecommendations from "../components/AIRecommendations";
import VoiceOrdering from "../components/VoiceOrdering";
import ARMenuViewer from "../components/ARMenuViewer";

export default function Home() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [showAI, setShowAI] = useState(true);
    const [showVoice, setShowVoice] = useState(false);
    const [showAR, setShowAR] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const token = localStorage.getItem("token");

    // List of available locations
    const availableLocations = [
        "Bangalore, Indiranagar",
        "Bangalore, Koramangala", 
        "Bangalore, Whitefield",
        "Hyderabad, Banjara Hills",
        "Chennai, Anna Nagar",
        "Mumbai, Bandra",
        "Delhi, Connaught Place"
    ];

    useEffect(() => {
        // Only fetch restaurants if user is logged in
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchRestaurants = async () => {
            setLoading(true);
            try {
                let url = "http://localhost:8080/api/restaurants";
                if (selectedLocation) {
                    url += `?location=${encodeURIComponent(selectedLocation)}`;
                }

                const res = await fetch(url, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setRestaurants(Array.isArray(data) ? data : []);
                    setError("");
                    
                    // Fetch menu items for AI recommendations and AR
                    if (data.length > 0) {
                        fetchMenuItems(data[0].id);
                    }
                } else if (res.status === 401 || res.status === 403) {
                    // Token is invalid, remove it and redirect to login
                    console.log("Token invalid, clearing localStorage");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.reload();
                } else {
                    setError("Failed to load restaurants");
                }
            } catch (e) {
                console.error(e);
                setError("Cannot connect to server");
            } finally {
                setLoading(false);
            }
        };

        const fetchMenuItems = async (restaurantId) => {
            try {
                const res = await fetch(`http://localhost:8080/api/menus/restaurant/${restaurantId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMenuItems(Array.isArray(data) ? data : []);
                } else if (res.status === 401 || res.status === 403) {
                    // Token is invalid for menu items too
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.reload();
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchRestaurants();
    }, [token, selectedLocation]);

    const handleRestaurantSelect = (restaurantId) => {
        navigate(`/menu?restaurant=${restaurantId}`);
    };

    const handleVoiceOrder = (orderItems) => {
        // Add voice order items to cart
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        orderItems.forEach(item => {
            if (item.total > 0) { // Valid items only
                const existingItem = cart.find(c => c.name === item.item);
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                } else {
                    cart.push({
                        id: Date.now() + Math.random(),
                        name: item.item,
                        price: item.price,
                        quantity: item.quantity,
                        restaurant: item.restaurant
                    });
                }
            }
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Voice order added to cart!");
        setShowVoice(false);
    };

    // Show login page if not authenticated
    if (!token) {
        return (
            <div style={styles.notLoggedIn}>
                <div style={styles.welcomeCard}>
                    <h1 style={styles.notLoggedInTitle}>🚀 Welcome to FoodieHub</h1>
                    <p style={styles.subtitle}>Next Generation Food Delivery Platform</p>
                    
                    <div style={styles.featuresPreview}>
                        <div style={styles.featureItem}>
                            <span style={styles.featureIcon}>🤖</span>
                            <span>AI-Powered Recommendations</span>
                        </div>
                        <div style={styles.featureItem}>
                            <span style={styles.featureIcon}>🎤</span>
                            <span>Voice Ordering System</span>
                        </div>
                        <div style={styles.featureItem}>
                            <span style={styles.featureIcon}>📱</span>
                            <span>AR Menu Experience</span>
                        </div>
                        <div style={styles.featureItem}>
                            <span style={styles.featureIcon}>🗺️</span>
                            <span>Live Restaurant Mapping</span>
                        </div>
                    </div>
                    
                    <p style={styles.notLoggedInText}>
                        Please login or register to experience the future of food delivery
                    </p>
                    
                    <Link to="/auth" style={styles.authButton}>
                        <span style={styles.authIcon}>🚀</span>
                        Get Started - Login / Register
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) return <div style={styles.loadingContainer}><p>Loading restaurants...</p></div>;
    if (error) return <div style={styles.errorContainer}><p>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🚀 FoodieHub - Next Generation Food Delivery</h1>
            
            {/* Revolutionary Features Panel */}
            <div style={styles.featuresPanel}>
                <h2 style={styles.featuresTitle}>🌟 Revolutionary Features</h2>
                <div style={styles.featureButtons}>
                    <button 
                        onClick={() => setShowAI(!showAI)}
                        style={{...styles.featureBtn, ...(showAI ? styles.featureBtnActive : {})}}
                    >
                        🤖 AI Recommendations
                    </button>
                    <button 
                        onClick={() => setShowVoice(!showVoice)}
                        style={{...styles.featureBtn, ...(showVoice ? styles.featureBtnActive : {})}}
                    >
                        🎤 Voice Ordering
                    </button>
                    <button 
                        onClick={() => setShowAR(!showAR)}
                        style={{...styles.featureBtn, ...(showAR ? styles.featureBtnActive : {})}}
                    >
                        📱 AR Menu View
                    </button>
                    <button 
                        onClick={() => setShowMap(!showMap)}
                        style={{...styles.featureBtn, ...(showMap ? styles.featureBtnActive : {})}}
                    >
                        🗺️ Live Map
                    </button>
                </div>
            </div>

            {/* AI Recommendations */}
            {showAI && (
                <AIRecommendations 
                    userPreferences={{ spicy: true, vegetarian: false }}
                    orderHistory={[]}
                    currentWeather="cold"
                />
            )}

            {/* Voice Ordering */}
            {showVoice && (
                <VoiceOrdering onOrderComplete={handleVoiceOrder} />
            )}

            {/* AR Menu Viewer */}
            {showAR && menuItems.length > 0 && (
                <ARMenuViewer menuItems={menuItems} />
            )}
            
            {/* Location Filter */}
            <div style={styles.filterSection}>
                <label style={styles.filterLabel}>
                    <span style={styles.filterIcon}>📍</span>
                    Select Location:
                </label>
                <select 
                    value={selectedLocation} 
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    style={styles.filterSelect}
                >
                    <option value="">All Locations</option>
                    {availableLocations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
                <button 
                    onClick={() => setShowMap(!showMap)}
                    style={styles.mapToggleBtn}
                >
                    {showMap ? '📋 List View' : '🗺️ Map View'}
                </button>
            </div>

            {/* Map View */}
            {showMap && (
                <div style={styles.mapContainer}>
                    <RestaurantMap 
                        restaurants={restaurants}
                        onRestaurantSelect={handleRestaurantSelect}
                    />
                </div>
            )}

            <div style={styles.grid}>
                {restaurants.map(r => (
                    <div key={r.id} style={styles.restaurantCard}>
                        <div style={styles.cardImage}>
                            {r.imageUrl ? (
                                <img 
                                    src={r.imageUrl} 
                                    alt={r.name}
                                    style={styles.restaurantImage}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div style={styles.placeholderIcon}>
                                {r.name}
                            </div>
                        </div>
                        <h3 style={styles.restaurantName}>{r.name}</h3>
                        <p style={styles.description}>{r.description || "Delicious food awaits you"}</p>
                        {r.location && (
                            <p style={styles.location}>
                                <span style={styles.locationIcon}>📍</span>
                                {r.location}
                            </p>
                        )}
                        <div style={styles.restaurantInfo}>
                            <p style={styles.rating}>
                                <span style={styles.ratingIcon}>⭐</span>
                                {r.rating || 4.5}
                            </p>
                            <p style={styles.deliveryTime}>
                                <span style={styles.timeIcon}>🕒</span>
                                {r.deliveryTime || 30} min
                            </p>
                            <p style={styles.deliveryFee}>
                                <span style={styles.feeIcon}>🚚</span>
                                ₹{r.deliveryFee || 40}
                            </p>
                        </div>
                        <Link 
                            to={`/menu?restaurant=${r.id}`} 
                            style={styles.viewMenuBtn}
                        >
                            View Menu & Order
                        </Link>
                    </div>
                ))}
            </div>
            {restaurants.length === 0 && <p style={styles.empty}>No restaurants available in this location</p>}
        </div>
    );
}

const styles = {
    container: {
        padding: "40px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        minHeight: "100vh"
    },
    title: {
        fontSize: "36px",
        fontWeight: "800",
        marginBottom: "40px",
        background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textAlign: "center",
        letterSpacing: "-1px"
    },
    featuresPanel: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "20px",
        padding: "24px",
        marginBottom: "32px",
        color: "white",
        textAlign: "center"
    },
    featuresTitle: {
        margin: "0 0 20px 0",
        fontSize: "24px",
        fontWeight: "700"
    },
    featureButtons: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        justifyContent: "center"
    },
    featureBtn: {
        padding: "12px 20px",
        background: "rgba(255, 255, 255, 0.2)",
        color: "white",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "25px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)"
    },
    featureBtnActive: {
        background: "rgba(255, 255, 255, 0.3)",
        borderColor: "rgba(255, 255, 255, 0.6)",
        transform: "translateY(-2px)",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)"
    },
    filterSection: {
        marginBottom: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap",
        background: "white",
        padding: "24px",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)"
    },
    filterLabel: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },
    filterIcon: {
        fontSize: "20px"
    },
    filterSelect: {
        padding: "12px 20px",
        fontSize: "15px",
        border: "2px solid #e2e8f0",
        borderRadius: "12px",
        cursor: "pointer",
        minWidth: "280px",
        backgroundColor: "white",
        color: "#1e293b",
        fontWeight: "600",
        transition: "all 0.3s ease",
        outline: "none"
    },
    mapToggleBtn: {
        padding: "12px 20px",
        background: "linear-gradient(135deg, #10b981, #059669)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "14px",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)"
    },
    mapContainer: {
        marginBottom: "40px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "32px"
    },
    restaurantCard: {
        background: "white",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        border: "1px solid rgba(255, 255, 255, 0.2)"
    },
    cardImage: {
        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #ff9ff3 100%)",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        position: "relative",
        overflow: "hidden"
    },
    restaurantImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        position: "absolute",
        top: 0,
        left: 0
    },
    placeholderIcon: {
        fontSize: "18px",
        fontWeight: "700",
        textAlign: "center",
        background: "rgba(255, 255, 255, 0.2)",
        padding: "16px 24px",
        borderRadius: "12px",
        backdropFilter: "blur(10px)",
        position: "relative",
        zIndex: 1
    },
    restaurantName: {
        padding: "20px 20px 8px 20px",
        margin: "0",
        fontSize: "22px",
        fontWeight: "700",
        color: "#1e293b",
        letterSpacing: "-0.5px"
    },
    description: {
        padding: "0 20px 12px 20px",
        margin: "0",
        fontSize: "14px",
        color: "#64748b",
        minHeight: "40px",
        lineHeight: "1.5"
    },
    location: {
        padding: "0 20px 8px 20px",
        margin: "0",
        fontSize: "13px",
        color: "#ff6b6b",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "6px"
    },
    locationIcon: {
        fontSize: "14px"
    },
    restaurantInfo: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px 16px 20px",
        gap: "12px"
    },
    rating: {
        margin: "0",
        fontSize: "13px",
        color: "#f59e0b",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        gap: "4px"
    },
    ratingIcon: {
        fontSize: "14px"
    },
    deliveryTime: {
        margin: "0",
        fontSize: "13px",
        color: "#10b981",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "4px"
    },
    timeIcon: {
        fontSize: "14px"
    },
    deliveryFee: {
        margin: "0",
        fontSize: "13px",
        color: "#6366f1",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "4px"
    },
    feeIcon: {
        fontSize: "14px"
    },
    viewMenuBtn: {
        display: "block",
        padding: "16px 20px",
        margin: "0 20px 20px 20px",
        background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
        color: "white",
        textDecoration: "none",
        borderRadius: "12px",
        fontWeight: "700",
        textAlign: "center",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 16px rgba(255, 107, 107, 0.3)"
    },
    // New Welcome Page Styles
    notLoggedIn: {
        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 25%, #ff9ff3 50%, #54a0ff 75%, #5f27cd 100%)",
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px"
    },
    welcomeCard: {
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "48px 40px",
        textAlign: "center",
        maxWidth: "600px",
        width: "100%",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
    },
    notLoggedInTitle: {
        fontSize: "48px",
        fontWeight: "800",
        marginBottom: "12px",
        color: "white",
        letterSpacing: "-1px",
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    },
    subtitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: "rgba(255, 255, 255, 0.9)",
        marginBottom: "32px",
        letterSpacing: "0.5px"
    },
    featuresPreview: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "32px"
    },
    featureItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        color: "white",
        fontWeight: "600",
        fontSize: "14px",
        border: "1px solid rgba(255, 255, 255, 0.2)"
    },
    featureIcon: {
        fontSize: "24px"
    },
    notLoggedInText: {
        fontSize: "18px",
        fontWeight: "500",
        color: "rgba(255, 255, 255, 0.9)",
        marginBottom: "32px",
        lineHeight: "1.6"
    },
    authButton: {
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 32px",
        background: "rgba(255, 255, 255, 0.2)",
        color: "white",
        textDecoration: "none",
        borderRadius: "50px",
        fontWeight: "700",
        fontSize: "18px",
        transition: "all 0.3s ease",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)"
    },
    authIcon: {
        fontSize: "20px"
    },
    loadingContainer: {
        textAlign: "center",
        padding: "80px 20px",
        color: "#64748b",
        background: "white",
        borderRadius: "20px",
        margin: "40px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
    },
    errorContainer: {
        textAlign: "center",
        padding: "80px 20px",
        color: "#dc2626",
        background: "white",
        borderRadius: "20px",
        margin: "40px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
    },
    empty: {
        textAlign: "center",
        padding: "60px",
        color: "#64748b",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        fontSize: "16px",
        fontWeight: "500"
    }
};
