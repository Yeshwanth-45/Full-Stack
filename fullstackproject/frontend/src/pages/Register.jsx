import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
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

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store JWT token
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', data.email);
                
                // Navigate to home page
                navigate('/');
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.registerBox}>
                <div style={styles.header}>
                    <h2 style={styles.title}>🍽️ Join FoodieHub</h2>
                    <p style={styles.subtitle}>Create your account and start ordering delicious food</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && (
                        <div style={styles.errorMessage}>
                            <span style={styles.errorIcon}>⚠️</span>
                            {error}
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

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
                        <label style={styles.label}>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="Enter your phone number"
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
                            placeholder="Create a password (min 6 characters)"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.registerButton,
                            ...(loading ? styles.registerButtonDisabled : {})
                        }}
                    >
                        {loading ? (
                            <>
                                <span style={styles.spinner}></span>
                                Creating Account...
                            </>
                        ) : (
                            '🚀 Create Account'
                        )}
                    </button>
                </form>

                <div style={styles.divider}>
                    <span style={styles.dividerText}>or</span>
                </div>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.link}>
                            Sign In
                        </Link>
                    </p>
                    <p style={styles.footerText}>
                        Restaurant Partner?{' '}
                        <Link to="/restaurant-login" style={styles.link}>
                            Restaurant Registration
                        </Link>
                    </p>
                </div>

                <div style={styles.features}>
                    <div style={styles.feature}>
                        <span style={styles.featureIcon}>🎁</span>
                        <span style={styles.featureText}>Welcome Offers</span>
                    </div>
                    <div style={styles.feature}>
                        <span style={styles.featureIcon}>⭐</span>
                        <span style={styles.featureText}>Loyalty Rewards</span>
                    </div>
                    <div style={styles.feature}>
                        <span style={styles.featureIcon}>🔔</span>
                        <span style={styles.featureText}>Order Updates</span>
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
    registerBox: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
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
        marginBottom: '18px'
    },
    label: {
        display: 'block',
        color: '#2d3436',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '6px'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e9ecef',
        borderRadius: '10px',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        outline: 'none',
        boxSizing: 'border-box'
    },
    registerButton: {
        width: '100%',
        background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
        color: 'white',
        border: 'none',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '18px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    },
    registerButtonDisabled: {
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
        margin: '20px 0',
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
        marginBottom: '20px'
    },
    footerText: {
        color: '#636e72',
        fontSize: '14px',
        margin: '6px 0'
    },
    link: {
        color: '#6c5ce7',
        textDecoration: 'none',
        fontWeight: '600'
    },
    features: {
        display: 'flex',
        justifyContent: 'space-around',
        paddingTop: '15px',
        borderTop: '1px solid #e9ecef'
    },
    feature: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    },
    featureIcon: {
        fontSize: '20px',
        marginBottom: '4px'
    },
    featureText: {
        fontSize: '11px',
        color: '#636e72',
        fontWeight: '500'
    }
};