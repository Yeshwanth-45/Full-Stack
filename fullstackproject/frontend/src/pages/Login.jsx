import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Store JWT token
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', data.email);
                
                // Navigate to home page
                navigate('/');
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <div style={styles.header}>
                    <h2 style={styles.title}>🍽️ Welcome Back to FoodieHub</h2>
                    <p style={styles.subtitle}>Sign in to continue your food journey</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && (
                        <div style={styles.errorMessage}>
                            <span style={styles.errorIcon}>⚠️</span>
                            {error}
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.loginButton,
                            ...(loading ? styles.loginButtonDisabled : {})
                        }}
                    >
                        {loading ? (
                            <>
                                <span style={styles.spinner}></span>
                                Signing In...
                            </>
                        ) : (
                            '🔐 Sign In'
                        )}
                    </button>
                </form>

                <div style={styles.divider}>
                    <span style={styles.dividerText}>or</span>
                </div>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Don't have an account?{' '}
                        <Link to="/register" style={styles.link}>
                            Create Account
                        </Link>
                    </p>
                    <p style={styles.footerText}>
                        Restaurant Partner?{' '}
                        <Link to="/restaurant-login" style={styles.link}>
                            Restaurant Login
                        </Link>
                    </p>
                </div>

                <div style={styles.features}>
                    <div style={styles.feature}>
                        <span style={styles.featureIcon}>🚚</span>
                        <span style={styles.featureText}>Fast Delivery</span>
                    </div>
                    <div style={styles.feature}>
                        <span style={styles.featureIcon}>🎯</span>
                        <span style={styles.featureText}>Live Tracking</span>
                    </div>
                    <div style={styles.feature}>
                        <span style={styles.featureIcon}>💰</span>
                        <span style={styles.featureText}>Best Prices</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    loginBox: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '450px',
        width: '100%'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    title: {
        color: '#2d3436',
        fontSize: '28px',
        fontWeight: '700',
        margin: '0 0 10px 0'
    },
    subtitle: {
        color: '#636e72',
        fontSize: '16px',
        margin: '0'
    },
    form: {
        marginBottom: '25px'
    },
    errorMessage: {
        background: '#ffe6e6',
        border: '1px solid #ff6b6b',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '20px',
        color: '#d63031',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    errorIcon: {
        fontSize: '16px'
    },
    inputGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        color: '#2d3436',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px'
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        border: '2px solid #e9ecef',
        borderRadius: '10px',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        outline: 'none',
        boxSizing: 'border-box'
    },
    loginButton: {
        width: '100%',
        background: 'linear-gradient(135deg, #00b894, #00a085)',
        color: 'white',
        border: 'none',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '18px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0, 184, 148, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    },
    loginButtonDisabled: {
        background: '#95a5a6',
        cursor: 'not-allowed',
        boxShadow: 'none'
    },
    spinner: {
        width: '16px',
        height: '16px',
        border: '2px solid transparent',
        borderTop: '2px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    divider: {
        textAlign: 'center',
        margin: '25px 0',
        position: 'relative'
    },
    dividerText: {
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '0 15px',
        color: '#636e72',
        fontSize: '14px'
    },
    footer: {
        textAlign: 'center',
        marginBottom: '25px'
    },
    footerText: {
        color: '#636e72',
        fontSize: '14px',
        margin: '8px 0'
    },
    link: {
        color: '#00b894',
        textDecoration: 'none',
        fontWeight: '600'
    },
    features: {
        display: 'flex',
        justifyContent: 'space-around',
        paddingTop: '20px',
        borderTop: '1px solid #e9ecef'
    },
    feature: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    },
    featureIcon: {
        fontSize: '24px',
        marginBottom: '5px'
    },
    featureText: {
        fontSize: '12px',
        color: '#636e72',
        fontWeight: '500'
    }
};