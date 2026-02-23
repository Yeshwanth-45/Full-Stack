import { useState } from 'react';

export default function SmartSearchBar({ value, onChange, suggestions = [] }) {
    const [showSuggestions, setShowSuggestions] = useState(false);

    return (
        <div style={styles.container}>
            <div style={styles.searchBox}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    placeholder="Search restaurants, cuisines, or dishes..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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

            {showSuggestions && suggestions.length > 0 && (
                <div style={styles.suggestionsPanel}>
                    <div style={styles.suggestionsHeader}>Smart Suggestions</div>
                    <div style={styles.suggestionsList}>
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion.id || suggestion.text}
                                onClick={() => {
                                    onChange(suggestion.text);
                                    setShowSuggestions(false);
                                }}
                                style={styles.suggestionItem}
                            >
                                <span style={styles.suggestionText}>{suggestion.text}</span>
                                <span style={styles.suggestionArrow}>→</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto 30px'
    },
    searchBox: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '60px',
        padding: '12px 28px',
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(102, 126, 234, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'floatIn 0.8s ease-out 0.4s both',
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
        fontSize: '1rem',
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
        padding: '5px',
        transition: 'all 0.3s ease'
    },
    suggestionsPanel: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: '10px',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
        zIndex: 100
    },
    suggestionsHeader: {
        padding: '15px 20px',
        fontSize: '12px',
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '1px solid #e2e8f0'
    },
    suggestionsList: {
        padding: '10px'
    },
    suggestionItem: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 15px',
        border: 'none',
        background: 'transparent',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        fontWeight: '500',
        color: '#1e293b',
        textAlign: 'left'
    },
    suggestionText: {
        flex: 1
    },
    suggestionArrow: {
        fontSize: '16px',
        color: '#667eea',
        opacity: 0,
        transition: 'all 0.3s ease'
    }
};
