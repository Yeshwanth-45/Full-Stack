import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsEnabled } from '../config/maps';

const GoogleMap = ({ 
    deliveryLocation, 
    driverLocation, 
    height = '400px',
    width = '100%',
    zoom = 13 
}) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [deliveryMarker, setDeliveryMarker] = useState(null);
    const [driverMarker, setDriverMarker] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isGoogleMapsEnabled()) {
            setError('Google Maps API key not configured. Please add your API key to enable maps.');
            return;
        }

        const initMap = async () => {
            const loader = new Loader(GOOGLE_MAPS_CONFIG);

            try {
                const google = await loader.load();
                
                // Default center (Bangalore)
                const defaultCenter = { lat: 12.9716, lng: 77.5946 };
                const center = deliveryLocation || defaultCenter;

                const mapInstance = new google.maps.Map(mapRef.current, {
                    center: center,
                    zoom: zoom,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    styles: [
                        {
                            featureType: 'poi',
                            elementType: 'labels',
                            stylers: [{ visibility: 'off' }]
                        }
                    ]
                });

                setMap(mapInstance);
                
                // Initialize directions service and renderer
                const directionsServiceInstance = new google.maps.DirectionsService();
                const directionsRendererInstance = new google.maps.DirectionsRenderer({
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: '#4285F4',
                        strokeWeight: 4
                    }
                });
                
                directionsRendererInstance.setMap(mapInstance);
                setDirectionsService(directionsServiceInstance);
                setDirectionsRenderer(directionsRendererInstance);

            } catch (error) {
                console.error('Error loading Google Maps:', error);
                setError('Failed to load Google Maps. Please check your internet connection.');
            }
        };

        if (mapRef.current) {
            initMap();
        }
    }, []);

    // Update delivery marker
    useEffect(() => {
        if (map && deliveryLocation) {
            if (deliveryMarker) {
                deliveryMarker.setMap(null);
            }

            const marker = new window.google.maps.Marker({
                position: { lat: deliveryLocation.latitude, lng: deliveryLocation.longitude },
                map: map,
                title: 'Delivery Location',
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="12" fill="#FF5722" stroke="#fff" stroke-width="2"/>
                            <circle cx="16" cy="16" r="4" fill="white"/>
                        </svg>
                    `),
                    scaledSize: new window.google.maps.Size(32, 32)
                }
            });

            setDeliveryMarker(marker);
        }
    }, [map, deliveryLocation]);

    // Update driver marker and route
    useEffect(() => {
        if (map && driverLocation) {
            if (driverMarker) {
                driverMarker.setMap(null);
            }

            const marker = new window.google.maps.Marker({
                position: { lat: driverLocation.latitude, lng: driverLocation.longitude },
                map: map,
                title: 'Driver Location',
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="12" fill="#4CAF50" stroke="#fff" stroke-width="2"/>
                            <circle cx="16" cy="16" r="4" fill="white"/>
                        </svg>
                    `),
                    scaledSize: new window.google.maps.Size(32, 32)
                }
            });

            setDriverMarker(marker);

            // Draw route if both locations are available
            if (deliveryLocation && directionsService && directionsRenderer) {
                const request = {
                    origin: { lat: driverLocation.latitude, lng: driverLocation.longitude },
                    destination: { lat: deliveryLocation.latitude, lng: deliveryLocation.longitude },
                    travelMode: window.google.maps.TravelMode.DRIVING
                };

                directionsService.route(request, (result, status) => {
                    if (status === 'OK') {
                        directionsRenderer.setDirections(result);
                    }
                });
            }

            // Adjust map bounds to show both markers
            if (deliveryLocation) {
                const bounds = new window.google.maps.LatLngBounds();
                bounds.extend({ lat: driverLocation.latitude, lng: driverLocation.longitude });
                bounds.extend({ lat: deliveryLocation.latitude, lng: deliveryLocation.longitude });
                map.fitBounds(bounds);
            }
        }
    }, [map, driverLocation, deliveryLocation, directionsService, directionsRenderer]);

    if (error) {
        return (
            <div style={{ 
                width, 
                height, 
                borderRadius: '8px', 
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '20px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{error}</div>
                <div style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
                    Map functionality will be available once Google Maps is configured
                </div>
            </div>
        );
    }

    return (
        <div style={{ width, height, borderRadius: '8px', overflow: 'hidden' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default GoogleMap;