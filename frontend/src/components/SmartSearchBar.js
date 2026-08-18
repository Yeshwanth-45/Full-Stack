import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmartSearchBar({ value, onChange, suggestions = [], allMenuItems = [] }) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [nlpAnalysis, setNlpAnalysis] = useState(null);
    const [matchingDishes, setMatchingDishes] = useState([]);

    useEffect(() => {
        if (!value.trim()) {
            setNlpAnalysis(null);
            setMatchingDishes([]);
            return;
        }

        const query = value.toLowerCase();
        const analysis = {
            isHealthy: query.includes('healthy') || query.includes('diet') || query.includes('salad') || query.includes('nutrition'),
            isSpicy: query.includes('spicy') || query.includes('hot') || query.includes('chilli') || query.includes('schezwan'),
            isHighProtein: query.includes('protein') || query.includes('chicken') || query.includes('egg') || query.includes('fish'),
            maxPrice: null
        };

        // Extract budget limits, e.g. "under 300" or "under Rs 250" or "under ₹400"
        const priceMatch = query.match(/under\s*(?:rs|₹)?\s*(\d+)/i) || query.match(/below\s*(?:rs|₹)?\s*(\d+)/i);
        if (priceMatch && priceMatch[1]) {
            analysis.maxPrice = parseInt(priceMatch[1]);
        }

        setNlpAnalysis(analysis);

        // Filter matching dishes
        let filtered = allMenuItems.filter(item => 
            item.name.toLowerCase().includes(query) || 
            item.description?.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );

        if (analysis.isHealthy) {
            filtered = filtered.filter(item => item.isVeg || item.calories < 350);
        }
        if (analysis.isSpicy) {
            filtered = filtered.filter(item => item.isSpicy || item.spiceLevel > 2);
        }
        if (analysis.maxPrice) {
            filtered = filtered.filter(item => item.price <= analysis.maxPrice);
        }

        setMatchingDishes(filtered.slice(0, 5));
    }, [value, allMenuItems]);

    const addToCartDirectly = (item) => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = savedCart.find(i => i.id === item.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            savedCart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                restaurantId: item.restaurantId,
                quantity: 1
            });
        }
        localStorage.setItem('cart', JSON.stringify(savedCart));
        window.dispatchEvent(new Event('cartUpdated'));
        alert(`Added ${item.name} from ${item.restaurantName} to cart!`);
    };

    return (
        <div style={styles.container}>
            <div style={styles.searchBox}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    placeholder="Ask AI: 'Healthy chicken under ₹350' or search dishes..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                    style={styles.input}
                />
                {value && (
                    <button 
                        onClick={() => onChange('')}
                        style={styles.clearBtn}
                    >
                        ✕
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showSuggestions && (
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        style={styles.suggestionsPanel}
                    >
                        {/* NLP Analysis Badges */}
                        {nlpAnalysis && (
                            <div style={styles.nlpRow}>
                                <span style={styles.nlpLabel}>AI Intent:</span>
                                {nlpAnalysis.isHealthy && <span style={styles.nlpBadge}>🥗 Healthy Choice</span>}
                                {nlpAnalysis.isSpicy && <span style={styles.nlpBadge}>🌶️ Spicy Preference</span>}
                                {nlpAnalysis.isHighProtein && <span style={styles.nlpBadge}>🍗 High Protein</span>}
                                {nlpAnalysis.maxPrice && <span style={styles.nlpBadge}>💰 Max Price: ₹{nlpAnalysis.maxPrice}</span>}
                            </div>
                        )}

                        {/* NLP matching dishes list */}
                        {matchingDishes.length > 0 ? (
                            <div style={styles.resultsSection}>
                                <div style={styles.suggestionsHeader}>🎯 Dishes Found matching your AI prompt</div>
                                <div style={styles.resultsList}>
                                    {matchingDishes.map((item) => (
                                        <div key={item.id} style={styles.resultItem}>
                                            <div style={styles.resultDetails}>
                                                <span style={styles.dishName}>{item.name}</span>
                                                <span style={styles.restaurantSub}>{item.restaurantName} • ₹{item.price}</span>
                                            </div>
                                            <button 
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    addToCartDirectly(item);
                                                }}
                                                style={styles.quickAddBtn}
                                            >
                                                + Add
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : value.trim() ? (
                            <div style={styles.noResults}>
                                <p style={styles.noResultsText}>No exact dish matching standard filters. Try typing a simpler query or cuisine type.</p>
                            </div>
                        ) : null}

                        {/* Default suggestions */}
                        <div style={styles.suggestionsHeader}>💡 Try asking for</div>
                        <div style={styles.suggestionsList}>
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion.text}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onChange(suggestion.text);
                                    }}
                                    style={styles.suggestionItem}
                                >
                                    <span style={styles.suggestionText}>{suggestion.text}</span>
                                    <span style={styles.suggestionArrow}>→</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto 30px',
        zIndex: 50
    },
    searchBox: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '60px',
        padding: '16px 28px',
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(102, 126, 234, 0.08)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        transition: 'all 0.4s ease',
        position: 'relative',
        overflow: 'hidden'
    },
    searchIcon: {
        fontSize: '1.3rem',
        marginRight: '12px'
    },
    input: {
        flex: 1,
        border: 'none',
        outline: 'none',
        fontSize: '1.05rem',
        background: 'transparent',
        color: '#1e293b',
        fontWeight: '500'
    },
    clearBtn: {
        background: 'none',
        border: 'none',
        fontSize: '1.2rem',
        color: '#94a3b8',
        cursor: 'pointer',
        padding: '5px'
    },
    suggestionsPanel: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: '12px',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        overflow: 'hidden',
        zIndex: 100
    },
    suggestionsHeader: {
        padding: '12px 20px',
        fontSize: '11px',
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        borderBottom: '1px solid #f1f5f9'
    },
    suggestionsList: {
        padding: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4px'
    },
    suggestionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        border: 'none',
        background: 'transparent',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569',
        textAlign: 'left'
    },
    suggestionText: {
        flex: 1
    },
    suggestionArrow: {
        fontSize: '13px',
        color: '#667eea',
        opacity: 0.6
    },
    nlpRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        padding: '14px 20px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        alignItems: 'center'
    },
    nlpLabel: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase'
    },
    nlpBadge: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#4f46e5',
        background: '#e0e7ff',
        padding: '4px 10px',
        borderRadius: '8px'
    },
    resultsSection: {
        borderBottom: '1px solid #f1f5f9'
    },
    resultsList: {
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    resultItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        borderRadius: '12px',
        background: 'white',
        border: '1px solid #f1f5f9',
        transition: 'all 0.2s ease'
    },
    resultDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    dishName: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#1e293b'
    },
    restaurantSub: {
        fontSize: '12px',
        color: '#64748b'
    },
    quickAddBtn: {
        padding: '6px 14px',
        background: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '700',
        cursor: 'pointer'
    },
    noResults: {
        padding: '16px 20px',
        textAlign: 'center'
    },
    noResultsText: {
        margin: 0,
        fontSize: '13px',
        color: '#94a3b8'
    }
};
