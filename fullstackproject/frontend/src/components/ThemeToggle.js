import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={styles.toggleButton}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <div style={{...styles.iconContainer, transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)'}}>
                {isDark ? '🌙' : '☀️'}
            </div>
        </button>
    );
}

const styles = {
    toggleButton: {
        position: 'fixed',
        bottom: '170px',
        right: '24px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: 'white',
        border: 'none',
        fontSize: '28px',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
        zIndex: 998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
    },
    iconContainer: {
        transition: 'transform 0.5s ease',
        fontSize: '28px'
    }
};
