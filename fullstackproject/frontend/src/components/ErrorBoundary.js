import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error details
        console.error('Error Boundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div style={styles.errorContainer}>
                    <div style={styles.errorContent}>
                        <h2 style={styles.errorTitle}>🚨 Something went wrong</h2>
                        <p style={styles.errorMessage}>
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>
                        <button 
                            onClick={() => window.location.reload()} 
                            style={styles.refreshButton}
                        >
                            🔄 Refresh Page
                        </button>
                        
                        {process.env.NODE_ENV === 'development' && (
                            <details style={styles.errorDetails}>
                                <summary style={styles.errorSummary}>Error Details (Development)</summary>
                                <pre style={styles.errorStack}>
                                    {this.state.error && this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const styles = {
    errorContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '20px'
    },
    errorContent: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '600px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
    },
    errorTitle: {
        color: '#e53e3e',
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '16px',
        margin: '0 0 16px 0'
    },
    errorMessage: {
        color: '#64748b',
        fontSize: '16px',
        lineHeight: '1.6',
        marginBottom: '24px',
        margin: '0 0 24px 0'
    },
    refreshButton: {
        backgroundColor: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: '20px'
    },
    errorDetails: {
        textAlign: 'left',
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
    },
    errorSummary: {
        cursor: 'pointer',
        fontWeight: '600',
        color: '#475569',
        marginBottom: '8px'
    },
    errorStack: {
        fontSize: '12px',
        color: '#64748b',
        overflow: 'auto',
        maxHeight: '200px',
        margin: '8px 0 0 0',
        padding: '8px',
        backgroundColor: 'white',
        borderRadius: '4px'
    }
};

export default ErrorBoundary;