import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState("phone"); // "phone", "otp", "success"
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!phoneNumber || phoneNumber.length !== 10) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(`OTP sent to ${phoneNumber}. Check your SMS or backend console.`);
                setStep("otp");
            } else {
                setError(data?.message || "Failed to send OTP");
            }
        } catch (err) {
            console.error(err);
            setError("Cannot connect to server. Check if backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber, otp })
            });

            const data = await res.json();

            if (res.ok && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify({ phoneNumber: data.phoneNumber }));
                setSuccess("Login successful! Redirecting...");
                setStep("success");
                setTimeout(() => navigate("/"), 1500);
            } else {
                setError(data?.message || "Invalid OTP");
            }
        } catch (err) {
            console.error(err);
            setError("Cannot connect to server");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep("phone");
        setPhoneNumber("");
        setOtp("");
        setError("");
        setSuccess("");
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>FoodDelivery</h1>
                <p style={styles.subtitle}>Secure Phone + OTP Authentication</p>

                {error && <div style={styles.errorMessage}>{error}</div>}
                {success && <div style={styles.successMessage}>{success}</div>}

                {step === "phone" && (
                    <form onSubmit={handleSendOtp} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Phone Number</label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="Enter 10-digit phone number"
                                style={styles.input}
                                disabled={loading}
                                maxLength="10"
                            />
                            <small style={styles.hint}>We'll send you a 6-digit OTP</small>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || phoneNumber.length !== 10}
                            style={{
                                ...styles.submitBtn,
                                opacity: (loading || phoneNumber.length !== 10) ? 0.6 : 1
                            }}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === "otp" && (
                    <form onSubmit={handleVerifyOtp} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter 6-digit OTP"
                                style={styles.input}
                                disabled={loading}
                                maxLength="6"
                            />
                            <small style={styles.hint}>
                                OTP sent to {phoneNumber}. Check backend console for development.
                            </small>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            style={{
                                ...styles.submitBtn,
                                opacity: (loading || otp.length !== 6) ? 0.6 : 1
                            }}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            style={styles.backBtn}
                            disabled={loading}
                        >
                            Back to Phone Number
                        </button>
                    </form>
                )}

                {step === "success" && (
                    <div style={styles.successContainer}>
                        <div style={styles.successIcon}>✓</div>
                        <h3 style={styles.successTitle}>Login Successful!</h3>
                        <p style={styles.successText}>Redirecting to home page...</p>
                    </div>
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
        fontSize: "16px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        boxSizing: "border-box",
        transition: "border-color 0.3s ease",
        fontFamily: "inherit"
    },
    hint: {
        display: "block",
        marginTop: "6px",
        fontSize: "12px",
        color: "#666"
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
    backBtn: {
        width: "100%",
        padding: "10px 16px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#667eea",
        background: "transparent",
        border: "2px solid #667eea",
        borderRadius: "8px",
        cursor: "pointer",
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
    successContainer: {
        textAlign: "center",
        padding: "20px 0"
    },
    successIcon: {
        fontSize: "48px",
        color: "#4CAF50",
        marginBottom: "16px"
    },
    successTitle: {
        margin: "0 0 8px 0",
        fontSize: "20px",
        fontWeight: "600",
        color: "#1a1a1a"
    },
    successText: {
        margin: "0",
        fontSize: "14px",
        color: "#666"
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
