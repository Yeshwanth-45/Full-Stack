// For Android app: 10.0.2.2 maps to host machine's localhost in Android emulator
// For real device testing: use your computer's local IP (e.g., 192.168.x.x)
// For production: use your deployed server URL
const isCapacitor = window.Capacitor !== undefined;
const API_URL = isCapacitor 
    ? "http://10.0.2.2:8080/api"  // Android emulator → host machine
    : "http://localhost:8080/api";  // Web browser

export const api = async (path, options = {}) => {
    const token = localStorage.getItem("token");

    return fetch(`${API_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        ...options
    });
};
