import { useState, useEffect } from 'react';

export default function LiveLocationDetector({ onLocationDetected, onLocationError }) {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        // Don't auto-detect on mount, wait for user action
    }, []);

    const detectLocation = () => {
        setLoading(true);
        setError('');

        if (!navigator.geolocation) {
            const errorMsg = 'Geolocation is not supported by this browser. Please use Chrome, Firefox, or Safari.';
            setError(errorMsg);
            onLocationError?.(errorMsg);
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const locationData = { latitude, longitude };
                
                setLocation(locationData);
                
                // Get address from coordinates
                try {
                    const addressData = await reverseGeocode(latitude, longitude);
                    setAddress(addressData.formatted);
                    onLocationDetected?.({
                        ...locationData,
                        address: addressData.formatted,
                        city: addressData.city,
                        area: addressData.area,
                        state: addressData.state,
                        country: addressData.country,
                        postalCode: addressData.postalCode
                    });
                } catch (err) {
                    console.error('Reverse geocoding failed:', err);
                    const fallbackAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    setAddress(fallbackAddress);
                    onLocationDetected?.({
                        ...locationData,
                        address: fallbackAddress
                    });
                }
                
                setLoading(false);
            },
            (error) => {
                let errorMsg = 'Unable to retrieve location';
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = '❌ Location access denied. Please allow location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = '❌ Location information unavailable. Please check your device settings.';
                        break;
                    case error.TIMEOUT:
                        errorMsg = '⏱️ Location request timed out. Please try again.';
                        break;
                    default:
                        errorMsg = '❌ An unknown error occurred while detecting location.';
                        break;
                }
                
                setError(errorMsg);
                onLocationError?.(errorMsg);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'FoodieHub/1.0'
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                const addr = data.address || {};
                
                return {
                    formatted: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                    area: addr.suburb || addr.neighbourhood || addr.hamlet || addr.locality || '',
                    city: addr.city || addr.town || addr.village || addr.municipality || '',
                    state: addr.state || addr.province || '',
                    country: addr.country || '',
                    postalCode: addr.postcode || '',
                    road: addr.road || '',
                    houseNumber: addr.house_number || ''
                };
            }
        } catch (error) {
            console.error('Geocoding failed:', error);
        }
        
        return {
            formatted: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            area: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            road: '',
            houseNumber: ''
        };
    };

    const requestLocationPermission = () => {
        detectLocation();
    };
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>📍 Live Location Detection</h3>
                <p style={styles.subtitle}>Get accurate delivery location automatically</p>
            </div>

            <div style={styles.content}>
                {loading && (
                    <div style={styles.loadingState}>
                        <div style={styles.spinner}></div>
                        <p style={styles.loadingText}>🔍 Detecting your location...</p>
                    </div>
                )}

                {error && (
                    <div style={styles.errorState}>
                        <div style={styles.errorIcon}>⚠️</div>
                        <p style={styles.errorText}>{error}</p>
                        <button 
                            onClick={requestLocationPermission}
                            style={styles.retryButton}
                        >
                            🔄 Try Again
                        </button>
                    </div>
                )}

                {location && !loading && (
                    <div style={styles.successState}>
                        <div style={styles.successIcon}>✅</div>
                        <div style={styles.locationInfo}>
                            <h4 style={styles.locationTitle}>Location Detected!</h4>
                            {address && (
                                <p style={styles.addressText}>📍 {address}</p>
                            )}
                            <div style={styles.coordinates}>
                                <span style={styles.coordLabel}>Coordinates:</span>
                                <span style={styles.coordValue}>
                                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={detectLocation}
                            style={styles.refreshButton}
                        >
                            🔄 Refresh Location
                        </button>
                    </div>
                )}

                {!location && !loading && !error && (
                    <div style={styles.initialState}>
                        <div style={styles.locationIcon}>🎯</div>
                        <p style={styles.initialText}>
                            Click below to detect your current location for accurate delivery
                        </p>
                        <button 
                            onClick={detectLocation}
                            style={styles.detectButton}
                        >
                            📍 Detect My Location
                        </button>
                    </div>
                )}
            </div>

            <div style={styles.features}>
                <div style={styles.feature}>
                    <span style={styles.featureIcon}>🎯</span>
                    <span style={styles.featureText}>Accurate GPS tracking</span>
                </div>
                <div style={styles.feature}>
                    <span style={styles.featureIcon}>🚚</span>
                    <span style={styles.featureText}>Faster delivery</span>
                </div>
                <div style={styles.feature}>
                    <span style={styles.featureIcon}>🔒</span>
                    <span style={styles.featureText}>Privacy protected</span>
                </div>
            </div>
        </div>
    );
}
const styles = {
    container: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef',
        maxWidth: '600px',
        margin: '0 auto'
    },
    header: {
        textAlign: 'center',
        marginBottom: '24px',
        borderBottom: '2px solid #f1f3f5',
        paddingBottom: '16px'
    },
    title: {
        color: '#2d3436',
        fontSize: '24px',
        fontWeight: '700',
        margin: '0 0 8px 0'
    },
    subtitle: {
        color: '#636e72',
        fontSize: '14px',
        margin: '0'
    },
    content: {
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingState: {
        textAlign: 'center'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #00b894',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
    },
    loadingText: {
        color: '#636e72',
        fontSize: '16px',
        margin: '0'
    },
    errorState: {
        textAlign: 'center',
        color: '#d63031'
    },
    errorIcon: {
        fontSize: '48px',
        marginBottom: '16px'
    },
    errorText: {
        fontSize: '16px',
        marginBottom: '20px',
        lineHeight: '1.5'
    },
    retryButton: {
        background: '#e17055',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    successState: {
        textAlign: 'center',
        width: '100%'
    },
    successIcon: {
        fontSize: '48px',
        marginBottom: '16px'
    },
    locationInfo: {
        marginBottom: '20px'
    },
    locationTitle: {
        color: '#00b894',
        fontSize: '20px',
        fontWeight: '600',
        margin: '0 0 12px 0'
    },
    addressText: {
        color: '#2d3436',
        fontSize: '16px',
        margin: '0 0 12px 0',
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
    },
    coordinates: {
        fontSize: '14px',
        color: '#636e72'
    },
    coordLabel: {
        fontWeight: '600',
        marginRight: '8px'
    },
    coordValue: {
        fontFamily: 'monospace',
        background: '#f1f3f4',
        padding: '4px 8px',
        borderRadius: '4px'
    },
    refreshButton: {
        background: '#0984e3',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    initialState: {
        textAlign: 'center'
    },
    locationIcon: {
        fontSize: '64px',
        marginBottom: '20px'
    },
    initialText: {
        color: '#636e72',
        fontSize: '16px',
        marginBottom: '24px',
        lineHeight: '1.5'
    },
    detectButton: {
        background: 'linear-gradient(135deg, #00b894, #00a085)',
        color: 'white',
        border: 'none',
        padding: '16px 32px',
        borderRadius: '12px',
        fontSize: '18px',
        cursor: 'pointer',
        fontWeight: '700',
        boxShadow: '0 4px 12px rgba(0, 184, 148, 0.3)',
        transition: 'all 0.3s ease'
    },
    features: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '24px',
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
        marginBottom: '8px'
    },
    featureText: {
        fontSize: '12px',
        color: '#636e72',
        fontWeight: '500'
    }
};