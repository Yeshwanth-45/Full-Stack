import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!loginData.email || !loginData.password) {
            setError("Please fill in all fields");
            return;
        }

        if (!validateEmail(loginData.email)) {
            setError("Please enter a valid email");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password
                })
            });

            const data = await res.json();

            if (res.ok && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify({ email: data.email }));
                setSuccess("Login successful! Redirecting...");
                setTimeout(() => navigate("/"), 1500);
            } else {
                setError(data?.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            setError("Cannot connect to server. Check if backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!registerData.email || !registerData.password || !registerData.name || !registerData.confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (!validateEmail(registerData.email)) {
            setError("Please enter a valid email");
            return;
        }

        if (registerData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: registerData.email,
                    password: registerData.password,
                    name: registerData.name
                })
            });

            const data = await res.json();

            if (res.ok && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify({ email: data.email, name: data.name }));
                setSuccess("Registration successful! Redirecting...");
                setTimeout(() => navigate("/"), 1500);
            } else {
                setError(data?.message || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            setError("Cannot connect to server. Check if backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>FoodDelivery</h1>
                <p style={styles.subtitle}>Sign in to your account</p>

                <div style={styles.tabs}>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeTab === "login" ? styles.tabActive : styles.tabInactive)
                        }}
                        onClick={() => setActiveTab("login")}
                    >
                        Login
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeTab === "register" ? styles.tabActive : styles.tabInactive)
                        }}
                        onClick={() => setActiveTab("register")}
                    >
                        Register
                    </button>
                </div>

                {error && <div style={styles.errorMessage}>{error}</div>}
                {success && <div style={styles.successMessage}>{success}</div>}

                {activeTab === "login" && (
                    <form onSubmit={handleLogin} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                placeholder="you@example.com"
                                style={styles.input}
                                disabled={loading}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Password</label>
                            <div style={styles.passwordContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    placeholder="••••••••"
                                    style={{...styles.input, paddingRight: "50px"}}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.showPasswordBtn}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.submitBtn,
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                )}

                {activeTab === "register" && (
                    <form onSubmit={handleRegister} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={registerData.name}
                                onChange={handleRegisterChange}
                                placeholder="John Doe"
                                style={styles.input}
                                disabled={loading}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                placeholder="you@example.com"
                                style={styles.input}
                                disabled={loading}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Password</label>
                            <div style={styles.passwordContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    placeholder="••••••••"
                                    style={{...styles.input, paddingRight: "50px"}}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.showPasswordBtn}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={registerData.confirmPassword}
                                onChange={handleRegisterChange}
                                placeholder="••••••••"
                                style={styles.input}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.submitBtn,
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                )}

                <div style={styles.divider}>
                    <span>OR</span>
                </div>

                <div style={styles.googleContainer}>
                    <button
                        onClick={() => alert("Google Sign-In not configured yet")}
                        style={styles.googleBtn}
                        disabled={loading}
                    >
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        padding: "40px",
        maxWidth: "420px",
        width: "100%"
    },
    title: {
        margin: "0 0 8px 0",
        fontSize: "32px",
        fontWeight: "700",
        color: "#1a1a1a",
        textAlign: "center"
    },
    subtitle: {
        margin: "0 0 30px 0",
        fontSize: "16px",
        color: "#666",
        textAlign: "center"
    },
    tabs: {
        display: "flex",
        gap: "12px",
        marginBottom: "30px",
        borderBottom: "2px solid #e0e0e0"
    },
    tab: {
        flex: 1,
        padding: "12px",
        border: "none",
        background: "transparent",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
        color: "#999"
    },
    tabActive: {
        color: "#667eea",
        borderBottom: "3px solid #667eea",
        marginBottom: "-2px"
    },
    tabInactive: {
        color: "#999"
    },
    form: {
        marginBottom: "20px"
    },
    formGroup: {
        marginBottom: "20px"
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#1a1a1a"
    },
    input: {
        width: "100%",
        padding: "12px 16px",
        fontSize: "14px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        boxSizing: "border-box",
        transition: "border-color 0.3s ease",
        fontFamily: "inherit"
    },
    passwordContainer: {
        position: "relative",
        display: "flex",
        alignItems: "center"
    },
    showPasswordBtn: {
        position: "absolute",
        right: "12px",
        background: "transparent",
        border: "none",
        color: "#667eea",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600",
        padding: "0"
    },
    submitBtn: {
        width: "100%",
        padding: "12px 16px",
        fontSize: "16px",
        fontWeight: "700",
        color: "white",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        marginTop: "10px"
    },
    errorMessage: {
        padding: "12px 16px",
        marginBottom: "20px",
        background: "#fee",
        border: "1px solid #faa",
        borderRadius: "8px",
        color: "#c33",
        fontSize: "14px",
        fontWeight: "500"
    },
    successMessage: {
        padding: "12px 16px",
        marginBottom: "20px",
        background: "#efe",
        border: "1px solid #afa",
        borderRadius: "8px",
        color: "#3a3",
        fontSize: "14px",
        fontWeight: "500"
    },
    divider: {
        display: "flex",
        alignItems: "center",
        margin: "30px 0 20px 0",
        color: "#999",
        fontSize: "14px"
    },
    googleContainer: {
        display: "flex",
        justifyContent: "center"
    },
    googleBtn: {
        width: "100%",
        padding: "12px 16px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#333",
        background: "white",
        border: "2px solid #ddd",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.3s ease"
    }
};
