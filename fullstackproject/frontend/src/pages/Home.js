import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const token = localStorage.getItem("token");

    // List of available locations
    const availableLocations = [
        "Bangalore, Indiranagar",
        "Bangalore, Koramangala",
        "Bangalore, Whitefield",
        "Hyderabad, Banjara Hills",
        "Chennai, Anna Nagar"
    ];

    useEffect(() => {
        if (!token) return;

        const fetchRestaurants = async () => {
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

        fetchRestaurants();
    }, [token, selectedLocation]);

    if (!token) {
        return (
            <div style={styles.notLoggedIn}>
                <h1>🍔 Welcome to FoodApp</h1>
                <p>Please <Link to="/auth" style={{color: "#667eea", fontWeight: "bold"}}>login or register</Link> to order food</p>
            </div>
        );
    }

    if (loading) return <div style={styles.loadingContainer}><p>🔄 Loading restaurants...</p></div>;
    if (error) return <div style={styles.errorContainer}><p>❌ {error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🏪 Available Restaurants</h1>
            
            {/* Location Filter */}
            <div style={styles.filterSection}>
                <label style={styles.filterLabel}>📍 Select Location:</label>
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
            </div>

            <div style={styles.grid}>
                {restaurants.map(r => (
                    <div key={r.id} style={styles.restaurantCard}>
                        <div style={styles.cardImage}>🏢</div>
                        <h3 style={styles.restaurantName}>{r.name}</h3>
                        <p style={styles.description}>{r.description || "No description"}</p>
                        {r.location && <p style={styles.location}>📍 {r.location}</p>}
                        <p style={styles.rating}>⭐ {r.rating || 4.5}</p>
                        <Link 
                            to={`/menu?restaurant=${r.id}`} 
                            style={styles.viewMenuBtn}
                        >
                            View Menu →
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
        margin: "0 auto"
    },
    title: {
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "30px",
        color: "#1a1a1a",
        textAlign: "center"
    },
    filterSection: {
        marginBottom: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
        flexWrap: "wrap"
    },
    filterLabel: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#1a1a1a"
    },
    filterSelect: {
        padding: "10px 15px",
        fontSize: "14px",
        border: "2px solid #667eea",
        borderRadius: "8px",
        cursor: "pointer",
        minWidth: "250px",
        backgroundColor: "white",
        color: "#1a1a1a"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px"
    },
    restaurantCard: {
        background: "white",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        cursor: "pointer"
    },
    cardImage: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        height: "180px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "64px"
    },
    restaurantName: {
        padding: "16px 16px 8px 16px",
        margin: "0",
        fontSize: "20px",
        fontWeight: "600",
        color: "#1a1a1a"
    },
    description: {
        padding: "0 16px 8px 16px",
        margin: "0",
        fontSize: "14px",
        color: "#666",
        minHeight: "40px"
    },
    location: {
        padding: "0 16px 4px 16px",
        margin: "0",
        fontSize: "13px",
        color: "#667eea",
        fontWeight: "500"
    },
    rating: {
        padding: "0 16px 12px 16px",
        margin: "0",
        fontSize: "14px",
        color: "#f39c12",
        fontWeight: "600"
    },
    viewMenuBtn: {
        display: "block",
        padding: "12px 16px",
        margin: "0 16px 16px 16px",
        background: "#667eea",
        color: "white",
        textDecoration: "none",
        borderRadius: "8px",
        fontWeight: "600",
        textAlign: "center",
        transition: "background 0.3s ease"
    },
    notLoggedIn: {
        textAlign: "center",
        padding: "60px 20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        minHeight: "calc(100vh - 60px)"
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
