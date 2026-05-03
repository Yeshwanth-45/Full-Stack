import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LiveOrderTracking from '../components/LiveOrderTracking';
import FloatingChatButton from '../components/FloatingChatButton';

const OrderTrackingPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }
    }, [token, navigate]);

    if (!token) {
        return null;
    }

    return (
        <div style={styles.pageContainer}>
            <LiveOrderTracking orderId={orderId} />
            
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
        background: '#f8fafc',
        paddingTop: '80px'
    }
};

export default OrderTrackingPage;