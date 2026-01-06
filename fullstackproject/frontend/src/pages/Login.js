import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            console.log("STATUS:", res.status);

            const body = await res.text();
            console.log("RESPONSE:", body);

            if (!res.ok) {
                setError(body || `Login failed (${res.status})`);
                return;
            }

            // Backend may return either a plain token OR JSON
            let token = body;
            try {
                const json = JSON.parse(body);
                if (json.token) token = json.token;
            } catch (_) {}

            localStorage.setItem("token", token);
            window.location.href = "/";

        } catch (err) {
            console.error(err);
            setError("Cannot connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "100px auto" }}>
            <h2>Login</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <button
                onClick={handleLogin}
                disabled={loading}
                style={{ width: "100%", padding: 10, opacity: loading ? 0.7 : 1 }}
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
    );
}
