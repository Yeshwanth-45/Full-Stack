// Google Maps Configuration
// To get your API key:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable Google Maps JavaScript API
// 4. Create credentials (API Key)
// 5. Replace the placeholder below with your actual API key

export const GOOGLE_MAPS_CONFIG = {
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
    libraries: ['places'],
    version: 'weekly'
};

// For development, you can use a placeholder
// For production, make sure to set REACT_APP_GOOGLE_MAPS_API_KEY in your environment variables
export const isGoogleMapsEnabled = () => {
    return GOOGLE_MAPS_CONFIG.apiKey && GOOGLE_MAPS_CONFIG.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
};