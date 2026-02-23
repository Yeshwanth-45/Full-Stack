import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import aiEngine from "../services/aiEngine";
import TasteProfileSetup from "../components/TasteProfileSetup";
import PremiumRestaurantCard from "../components/PremiumRestaurantCard";
import SmartSearchBar from "../components/SmartSearchBar";
import MoodSelector from "../components/MoodSelector";

export default function PremiumHome() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMood, setSelectedMood] = useState(null);
    const [showTasteProfile, setShowTasteProfile] = useState(false);
    const [sortBy, setSortBy] = useState("tasteMatch");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const token = localStorage.getItem("token");

    // Check if user has completed taste profile
    useEffect(() => {
        const profile = aiEngine.loadUserProfile();
        if (profile.preferredCuisines.length === 0 && token) {
            setShowTasteProfile(true);
        }
    }, [token]);

    const loadRestaurants = useCallback(async () => {
        setLoading(true);
        setError("");
        
        try {
            const response = await fetch("http://localhost:8080/api/restaurants", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                let data = await response.json();
                data = Array.isArray(data) ? data : [];
                
                // Enhance with AI scores
                data = data.map(r => ({
                    ...r,
                    tasteMatch: aiEngine.calculateTasteMatch(r),
                    deliveryAccuracy: aiEngine.calculateDeliveryAccuracy(r),
                    nudges: aiEngine.getPersonalizedNudges(r)
                }));

                setRestaurants(data);
            } else {
                setError("Failed to load restaurants");
            }
        } catch (err) {
            console.error("Error loading restaurants:", err);
            setError("Cannot connect to server");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            loadRestaurants();
        }
    }, [token, loadRestaurants]);

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: "Good Morning", emoji: "🌅", time: "breakfast" };
        if (hour < 17) return { text: "Good Afternoon", emoji: "☀️", time: "lunch" };
        if (hour < 21) return { text: "Good Evening", emoji: "🌆", time: "dinner" };
        return { text: "Late Night Cravings", emoji: "🌙", time: "latenight" };
    };

    const greeting = getGreeting();

    // Filter and sort restaurants
    const getFilteredRestaurants = () => {
        let filtered = restaurants;

        // Apply mood filter
        if (selectedMood) {
            filtered = aiEngine.getMoodRecommendations(selectedMood, filtered);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(r => 
                r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.cuisineType?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        switch(sortBy) {
            case "tasteMatch":
                return filtered.sort((a, b) => b.tasteMatch - a.tasteMatch);
            case "rating":
                return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case "deliveryTime":
                return filtered.sort((a, b) => (a.deliveryTime || 30) - (b.deliveryTime || 30));
            case "deliveryAccuracy":
                return filtered.sort((a, b) => b.deliveryAccuracy - a.deliveryAccuracy);
            default:
                return filtered;
        }
    };

    const filteredRestaurants = getFilteredRestaurants();

    // Show login page if not authenticated
    if (!token) {
        return (
            <div style={styles.welcomeContainer}>
                <div style={styles.welcomeGlass}>
                    <div style={styles.welcomeContent}>
                        <h1 style={styles.welcomeTitle}>
                            <span style={styles.logoGradient}>FoodieHub</span>
                            <span style={styles.aiTag}>AI-Powered</span>
                        </h1>
                        <p style={styles.welcomeSubtitle}>
                            Next-generation food delivery with hyper-personalization
                        </p>
                        
                        <div style={styles.featuresShowcase}>
                            <div style={styles.featureCard}>
                                <div style={styles.featureIconLarge}>🎯</div>
                                <h3>Taste Match AI</h3>
                                <p>Get personalized recommendations based on your unique taste profile</p>
                            </div>
                            <div style={styles.featureCard}>
                                <div style={styles.featureIconLarge}>🧠</div>
                                <h3>Mood-Based Ordering</h3>
                                <p>Order based on how you feel - comfort, party, healthy, or lazy</p>
                            </div>
                            <div style={styles.featureCard}>
                                <div style={styles.featureIconLarge}>🔍</div>
                                <h3>Full Transparency</h3>
                                <p>See real delivery accuracy, hygiene ratings, and carbon footprint</p>
                            </div>
                        </div>

                        <div style={styles.welcomeActions}>
                            <Link to="/register" style={styles.primaryBtn}>
                                Get Started →
                            </Link>
                            <Link to="/login" style={styles.secondaryBtn}>
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show taste profile setup
    if (showTasteProfile) {
        return (
            <div style={styles.profileSetupContainer}>
                <TasteProfileSetup onComplete={() => {
                    setShowTasteProfile(false);
                    loadRestaurants();
                }} />
            </div>
        );
    }

    if (loading) return (
        <div style={styles.loadingContainer}>
            <div style={styles.loader}></div>
            <p style={styles.loadingText}>Finding perfect matches for you...</p>
        </div>
    );

    if (error) return (
        <div style={styles.errorContainer}>
            <p>{error}</p>
            <button onClick={loadRestaurants} style={styles.retryBtn}>Retry</button>
        </div>
    );

    return (
        <div style={{...styles.container, ...(isDarkMode ? styles.darkMode : {})}}>
            {/* Premium Hero Section with Glassmorphism */}
            <div style={styles.heroSection}>
                <div style={styles.heroGlass}>
                    <div style={styles.heroContent}>
                        <div style={styles.greetingSection}>
                            <span style={styles.greetingEmoji}>{greeting.emoji}</span>
                            <h1 style={styles.greetingText}>{greeting.text}</h1>
                        </div>
                        <p style={styles.heroSubtitle}>
                            What are you in the mood for?
                        </p>

                        {/* Smart Search Bar */}
                        <SmartSearchBar 
                            value={searchTerm}
                            onChange={setSearchTerm}
                            suggestions={aiEngine.getSmartSuggestions()}
                        />

                        {/* Mood Selector */}
                        <MoodSelector 
                            selected={selectedMood}
                            onSelect={setSelectedMood}
                        />
                    </div>
                </div>

                {/* Floating particles effect */}
                <div style={styles.particles}>
                    {[...Array(20)].map((_, i) => (
                        <div 
                            key={i} 
                            style={{
                                ...styles.particle,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Smart Filters */}
            <div style={styles.filtersSection}>
                <div style={styles.filtersContainer}>
                    <div style={styles.sortButtons}>
                        {[
                            { value: 'tasteMatch', label: '🎯 Best Match', icon: '🎯' },
                            { value: 'rating', label: '⭐ Top Rated', icon: '⭐' },
                            { value: 'deliveryTime', label: '⚡ Fastest', icon: '⚡' },
                            { value: 'deliveryAccuracy', label: '📊 Most Accurate', icon: '📊' }
                        ].map(option => (
                            <button
                                key={option.value}
                                onClick={() => setSortBy(option.value)}
                                style={{
                                    ...styles.sortBtn,
                                    ...(sortBy === option.value ? styles.sortBtnActive : {})
                                }}
                            >
                                <span style={styles.sortIcon}>{option.icon}</span>
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => setShowTasteProfile(true)}
                        style={styles.editProfileBtn}
                    >
                        ⚙️ Edit Taste Profile
                    </button>
                </div>
            </div>

            {/* Restaurants Grid */}
            <div style={styles.restaurantsSection}>
                <div style={styles.sectionHeader}>
                    <div>
                        <h2 style={styles.sectionTitle}>
                            {selectedMood ? `Perfect for ${selectedMood} mood` : 'Restaurants for you'}
                        </h2>
                        <p style={styles.sectionSubtitle}>
                            {filteredRestaurants.length} restaurants • Sorted by {sortBy}
                        </p>
                    </div>
                </div>

                <div style={styles.restaurantGrid}>
                    {filteredRestaurants.map(restaurant => (
                        <PremiumRestaurantCard 
                            key={restaurant.id}
                            restaurant={restaurant}
                            isDarkMode={isDarkMode}
                        />
                    ))}
                </div>

                {filteredRestaurants.length === 0 && (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>🔍</div>
                        <h3>No restaurants found</h3>
                        <p>Try adjusting your filters or search term</p>
                    </div>
                )}
            </div>

            {/* Dark Mode Toggle */}
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={styles.darkModeToggle}
                title="Toggle dark mode"
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        transition: 'all 0.3s ease'
    },
    darkMode: {
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#f8fafc'
    },
    
    // Welcome Page
    welcomeContainer: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
    },
    welcomeGlass: {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        padding: '60px 40px',
        maxWidth: '1100px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    welcomeContent: {
        textAlign: 'center'
    },
    welcomeTitle: {
        fontSize: '4rem',
        fontWeight: '900',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
    },
    logoGradient: {
        background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    aiTag: {
        fontSize: '1rem',
        background: 'rgba(255, 255, 255, 0.3)',
        padding: '8px 20px',
        borderRadius: '20px',
        color: 'white',
        fontWeight: '600'
    },
    welcomeSubtitle: {
        fontSize: '1.5rem',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '50px'
    },
    featuresShowcase: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        marginBottom: '50px'
    },
    featureCard: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease'
    },
    featureIconLarge: {
        fontSize: '3rem',
        marginBottom: '15px'
    },
    welcomeActions: {
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    primaryBtn: {
        padding: '16px 40px',
        background: 'white',
        color: '#667eea',
        borderRadius: '50px',
        textDecoration: 'none',
        fontSize: '1.1rem',
        fontWeight: '700',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
    },
    secondaryBtn: {
        padding: '16px 40px',
        background: 'transparent',
        color: 'white',
        border: '2px solid white',
        borderRadius: '50px',
        textDecoration: 'none',
        fontSize: '1.1rem',
        fontWeight: '700',
        transition: 'all 0.3s ease'
    },

    // Hero Section - Enhanced Glassmorphism
    heroSection: {
        position: 'relative',
        padding: '80px 20px 100px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        overflow: 'hidden',
        minHeight: '500px'
    },
    heroGlass: {
        maxWidth: '950px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        borderRadius: '40px',
        padding: '50px',
        border: '2px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        animation: 'fadeInUp 0.8s ease-out',
        transform: 'translateZ(0)'
    },
    heroContent: {
        position: 'relative',
        zIndex: 2
    },
    greetingSection: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '20px',
        animation: 'slideInDown 0.6s ease-out 0.2s both'
    },
    greetingEmoji: {
        fontSize: '4rem',
        animation: 'bounce 2s ease-in-out infinite',
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
    },
    greetingText: {
        fontSize: '3rem',
        fontWeight: '900',
        color: 'white',
        margin: 0,
        textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        letterSpacing: '-0.5px'
    },
    heroSubtitle: {
        fontSize: '1.3rem',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '30px',
        textAlign: 'center'
    },
    particles: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden'
    },
    particle: {
        position: 'absolute',
        width: '6px',
        height: '6px',
        background: 'rgba(255, 255, 255, 0.6)',
        borderRadius: '50%',
        animation: 'particle-float 3s linear infinite'
    },

    // Filters Section
    filtersSection: {
        padding: '20px',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: '70px',
        zIndex: 10,
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.95)'
    },
    filtersContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap'
    },
    sortButtons: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
    },
    sortBtn: {
        padding: '12px 24px',
        border: '2px solid #e2e8f0',
        borderRadius: '60px',
        background: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '700',
        color: '#64748b',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden'
    },
    sortBtnActive: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: '2px solid transparent',
        transform: 'scale(1.08) translateY(-2px)',
        boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4), 0 0 0 3px rgba(102, 126, 234, 0.2)'
    },
    sortIcon: {
        fontSize: '16px'
    },
    editProfileBtn: {
        padding: '10px 20px',
        border: '2px solid #667eea',
        borderRadius: '50px',
        background: 'white',
        color: '#667eea',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease'
    },

    // Restaurants Section
    restaurantsSection: {
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    sectionHeader: {
        marginBottom: '30px'
    },
    sectionTitle: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: '0 0 8px 0'
    },
    sectionSubtitle: {
        fontSize: '1rem',
        color: '#64748b',
        margin: 0
    },
    restaurantGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '30px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#64748b'
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '20px'
    },

    // Loading & Error
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: '#64748b'
    },
    loader: {
        width: '60px',
        height: '60px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
    },
    loadingText: {
        fontSize: '1.1rem',
        fontWeight: '500'
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        color: '#ef4444'
    },
    retryBtn: {
        padding: '12px 30px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '20px'
    },

    // Dark Mode Toggle
    darkModeToggle: {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '65px',
        height: '65px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        fontSize: '1.8rem',
        cursor: 'pointer',
        boxShadow: '0 15px 40px rgba(102, 126, 234, 0.5), 0 5px 15px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'
    },

    // Profile Setup
    profileSetupContainer: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '40px 20px'
    }
};
