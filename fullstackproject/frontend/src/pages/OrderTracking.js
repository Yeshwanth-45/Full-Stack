import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderTracking from '../components/OrderTracking';
import FloatingChatButton from '../components/FloatingChatButton';

const OrderTrackingPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [showTracking, setShowTracking] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }
    }, [token, navigate]);

    const handleClose = () => {
        navigate('/orders');
    };

    if (!token) {
        return null;
    }

    return (
        <div style={styles.pageContainer}>
            {showTracking && (
                <OrderTracking 
                    orderId={orderId} 
                    onClose={handleClose}
                />
            )}
            
            {/* Floating Chat Button */}
            <FloatingChatButton 
                orderId={orderId} 
                restaurantName="Restaurant Support" 
            />
        </div>
    );
};

const styles = {
    pageContainer: {
        minHeight: '100vh',
        background: '#f8fafc'
    }
};

export default OrderTrackingPage;