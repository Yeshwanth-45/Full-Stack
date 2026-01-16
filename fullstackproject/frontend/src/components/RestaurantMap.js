import { useEffect, useRef, useState } from 'react';

export default function RestaurantMap({ restaurants, selectedRestaurant, onRestaurantSelect }) {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

    useEffect(() => {
        // Check if Google Maps is available
        if (typeof window !== 'undefined' && window.google && window.google.maps) {
            setIsGoogleMapsLoaded(true);
        } else {
            setIsGoogleMapsLoaded(false);
            return;
        }

        if (!mapRef.current) return;

        // Initialize map centered on Bangalore
        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: { lat: 12.9716, lng: 77.5946 },
            zoom: 10,
            styles: [
                {
                    featureType: "all",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#f8fafc" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#e2e8f0" }]
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#ffffff" }]
                }
            ]
        });

        setMap(mapInstance);
    }, [isGoogleMapsLoaded]);

    useEffect(() => {
        if (!map || !restaurants.length || !isGoogleMapsLoaded) return;

        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));

        // Create new markers
        const newMarkers = restaurants.map(restaurant => {
            if (!restaurant.latitude || !restaurant.longitude) return null;

            const marker = new window.google.maps.Marker({
                position: { lat: restaurant.latitude, lng: restaurant.longitude },
                map: map,
                title: restaurant.name,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="18" fill="#ff6b6b" stroke="#ffffff" stroke-width="2"/>
                            <text x="20" y="26" text-anchor="middle" fill="white" font-size="20" font-weight="bold">🍽️</text>
                        </svg>
                    `),
                    scaledSize: new window.google.maps.Size(40, 40)
                }
            });

            // Create info window
            const infoWindow = new window.google.maps.InfoWindow({
                content: `
                    <div style="padding: 12px; max-width: 250px;">
                        <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px; font-weight: 700;">${restaurant.name}</h3>
                        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">${restaurant.description}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="color: #f59e0b; font-weight: 600; font-size: 13px;">⭐ ${restaurant.rating}</span>
                            <span style="color: #64748b; font-size: 13px;">${restaurant.deliveryTime} min</span>
                        </div>
                        <button onclick="window.selectRestaurant(${restaurant.id})" 
                                style="width: 100%; padding: 8px; background: linear-gradient(135deg, #ff6b6b, #ee5a24); 
                                       color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            View Menu
                        </button>
                    </div>
                `
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });

            return marker;
        }).filter(Boolean);

        setMarkers(newMarkers);

        // Fit map to show all markers
        if (newMarkers.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            newMarkers.forEach(marker => {
                bounds.extend(marker.getPosition());
            });
            map.fitBounds(bounds);
            
            // Don't zoom too close if there's only one marker
            if (newMarkers.length === 1) {
                map.setZoom(14);
            }
        }

        // Global function for info window buttons
        window.selectRestaurant = (restaurantId) => {
            if (onRestaurantSelect) {
                onRestaurantSelect(restaurantId);
            }
        };

        return () => {
            newMarkers.forEach(marker => marker.setMap(null));
        };
    }, [map, restaurants, onRestaurantSelect, markers, isGoogleMapsLoaded]);

    // If Google Maps is not available, show fallback
    if (!isGoogleMapsLoaded) {
        return (
            <div style={styles.fallbackContainer}>
                <div style={styles.fallbackContent}>
                    <h3 style={styles.fallbackTitle}>🗺️ Restaurant Locations</h3>
                    <p style={styles.fallbackText}>
                        Google Maps is not available. Here are the restaurant locations:
                    </p>
                    <div style={styles.locationsList}>
                        {restaurants.map(restaurant => (
                            <div key={restaurant.id} style={styles.locationItem}>
                                <div style={styles.locationInfo}>
                                    <strong>{restaurant.name}</strong>
                                    <span style={styles.locationAddress}>{restaurant.location}</span>
                                </div>
                                <button 
                                    onClick={() => onRestaurantSelect && onRestaurantSelect(restaurant.id)}
                                    style={styles.locationBtn}
                                >
                                    View Menu
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div ref={mapRef} style={styles.map} />
        </div>
    );
}

const styles = {
    container: {
        width: '100%',
        height: '400px',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    map: {
        width: '100%',
        height: '100%'
    },
    fallbackContainer: {
        width: '100%',
        height: '400px',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'white'
    },
    fallbackContent: {
        padding: '24px',
        height: '100%',
        overflowY: 'auto'
    },
    fallbackTitle: {
        margin: '0 0 12px 0',
        fontSize: '20px',
        fontWeight: '700',
        color: '#1e293b',
        textAlign: 'center'
    },
    fallbackText: {
        margin: '0 0 20px 0',
        fontSize: '14px',
        color: '#64748b',
        textAlign: 'center'
    },
    locationsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    locationItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
    },
    locationInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    locationAddress: {
        fontSize: '13px',
        color: '#64748b'
    },
    locationBtn: {
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '12px'
    }
};