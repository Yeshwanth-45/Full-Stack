import { useState } from "react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    const handleRegister = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const text = await res.text();

            if (!res.ok) {
                setMsg("Register failed: " + text);
                return;
            }

            setMsg("Registered successfully — now login.");
        } catch {
            setMsg("Cannot connect to server");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "100px auto" }}>
            <h2>Register</h2>

            {msg && <p>{msg}</p>}

            <input
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

            <button onClick={handleRegister} style={{ width: "100%", padding: 10 }}>
                Register
            </button>
        </div>
    );
}
