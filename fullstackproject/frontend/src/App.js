import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import PremiumHome from "./pages/PremiumHome";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import OrderTracking from "./pages/OrderTracking";
import RestaurantLogin from "./pages/RestaurantLogin";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <Navbar />
                <Routes>
                    {/* Use PremiumHome as default, keep old Home for comparison */}
                    <Route path="/" element={<PremiumHome />} />
                    <Route path="/classic" element={<Home />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
                    <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                    <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                    <Route path="/tracking/:orderId" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
                    
                    {/* Restaurant Routes */}
                    <Route path="/restaurant-login" element={<RestaurantLogin />} />
                    <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
                </Routes>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
