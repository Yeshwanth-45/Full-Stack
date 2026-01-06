const API_URL = "http://localhost:8080/api";

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
