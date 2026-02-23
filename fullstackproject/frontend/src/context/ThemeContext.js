import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.body.style.background = isDark ? '#0f172a' : '#ffffff';
        document.body.style.color = isDark ? '#f1f5f9' : '#0f172a';
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const theme = {
        isDark,
        toggleTheme,
        colors: isDark ? darkColors : lightColors
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

const lightColors = {
    // Backgrounds
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    
    // Text
    text: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#64748b',
    
    // Borders
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    
    // Accents
    accent: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    accentHover: 'linear-gradient(135deg, #ee5a24, #ff6b6b)',
    
    // Status
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Cards
    card: '#ffffff',
    cardHover: '#f8fafc',
    
    // Shadows
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    shadowHover: '0 12px 40px rgba(0, 0, 0, 0.15)'
};

const darkColors = {
    // Backgrounds
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
    
    // Text
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    
    // Borders
    border: '#334155',
    borderLight: '#475569',
    
    // Accents
    accent: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    accentHover: 'linear-gradient(135deg, #ee5a24, #ff6b6b)',
    
    // Status
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Cards
    card: '#1e293b',
    cardHover: '#334155',
    
    // Shadows
    shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    shadowHover: '0 12px 40px rgba(0, 0, 0, 0.6)'
};
