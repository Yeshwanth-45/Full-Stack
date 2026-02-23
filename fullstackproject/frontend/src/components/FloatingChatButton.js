import { useState } from 'react';
import InAppChat from './InAppChat';

export default function FloatingChatButton({ orderId, restaurantName }) {
    const [showChat, setShowChat] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);

    return (
        <>
            <button
                onClick={() => {
                    setShowChat(true);
                    setHasUnread(false);
                }}
                style={styles.floatingBtn}
                title="Chat with restaurant"
            >
                💬
                {hasUnread && <span style={styles.badge}>1</span>}
            </button>

            {showChat && (
                <InAppChat
                    isOpen={showChat}
                    onClose={() => setShowChat(false)}
                    orderId={orderId}
                    restaurantName={restaurantName}
                />
            )}
        </>
    );
}

const styles = {
    floatingBtn: {
        position: 'fixed',
        bottom: '100px',
        right: '30px',
        width: '65px',
        height: '65px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        border: 'none',
        fontSize: '28px',
        cursor: 'pointer',
        boxShadow: '0 15px 40px rgba(16, 185, 129, 0.5), 0 5px 15px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'pulse 2s infinite'
    },
    badge: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: '#ef4444',
        color: 'white',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        fontSize: '12px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid white',
        animation: 'bounce 1s infinite'
    }
};
