export default function MoodSelector({ selected, onSelect }) {
    const moods = [
        { id: 'comfort', emoji: '🤗', label: 'Comfort', color: '#ff6b6b' },
        { id: 'party', emoji: '🎉', label: 'Party', color: '#f093fb' },
        { id: 'healthy', emoji: '🥗', label: 'Healthy', color: '#4facfe' },
        { id: 'lazy', emoji: '😴', label: 'Lazy', color: '#feca57' },
        { id: 'quickBite', emoji: '⚡', label: 'Quick Bite', color: '#48dbfb' }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.label}>I'm feeling...</div>
            <div style={styles.moodsGrid}>
                {moods.map(mood => (
                    <button
                        key={mood.id}
                        onClick={() => onSelect(selected === mood.id ? null : mood.id)}
                        style={{
                            ...styles.moodCard,
                            ...(selected === mood.id ? {
                                ...styles.moodCardActive,
                                borderColor: mood.color,
                                background: `linear-gradient(135deg, ${mood.color}15, ${mood.color}25)`
                            } : {})
                        }}
                    >
                        <div style={styles.moodEmoji}>{mood.emoji}</div>
                        <div style={styles.moodLabel}>{mood.label}</div>
                        {selected === mood.id && (
                            <div style={{...styles.checkmark, background: mood.color}}>✓</div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        marginTop: '20px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '15px',
        textAlign: 'center'
    },
    moodsGrid: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    moodCard: {
        position: 'relative',
        padding: '20px 24px',
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(15px) saturate(180%)',
        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
        border: '2px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '24px',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        minWidth: '110px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
    },
    moodCardActive: {
        transform: 'scale(1.15) translateY(-4px)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
    },
    moodEmoji: {
        fontSize: '2rem'
    },
    moodLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: 'white'
    },
    checkmark: {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    }
};
