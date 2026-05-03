import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { StatusBar } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import "./index.css";
import Root from "./Root";

// Initialize native plugins when running on a native platform
if (Capacitor.isNativePlatform()) {
    StatusBar.setBackgroundColor({ color: '#667eea' }).catch(() => {});
    SplashScreen.hide().catch(() => {});
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <Root />
        </GoogleOAuthProvider>
    </React.StrictMode>
);
