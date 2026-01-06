import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import Root from "./Root";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <Root />
        </GoogleOAuthProvider>
    </React.StrictMode>
);
