import { useState, useEffect, useRef } from 'react';

export default function InAppChat({ isOpen, onClose, orderId, restaurantName }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        // Load chat history
        loadChatHistory();
        
        // Simulate real-time updates (in production, use WebSocket)
        const interval = setInterval(() => {
            checkForNewMessages();
        }, 3000);

        return () => clearInterval(interval);
    }, [orderId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadChatHistory = () => {
        // Mock chat history
        const mockHistory = [
            {
                id: 1,
                sender: 'system',
                message: `Chat started for order #${orderId || '123'}`,
                timestamp: new Date(Date.now() - 300000).toISOString(),
                type: 'system'
            },
            {
                id: 2,
                sender: 'restaurant',
                senderName: restaurantName || 'Restaurant',
                message: 'Hello! Your order is being prepared. Expected time: 25 minutes.',
                timestamp: new Date(Date.now() - 240000).toISOString(),
                type: 'received'
            }
        ];
        setMessages(mockHistory);
    };

    const checkForNewMessages = () => {
        // Simulate receiving messages (in production, use WebSocket)
        if (Math.random() > 0.9 && messages.length < 10) {
            const newMsg = {
                id: Date.now(),
                sender: 'restaurant',
                senderName: restaurantName || 'Restaurant',
                message: getRandomUpdate(),
                timestamp: new Date().toISOString(),
                type: 'received'
            };
            setMessages(prev => [...prev, newMsg]);
        }
    };

    const getRandomUpdate = () => {
        const updates = [
            'Your order is almost ready!',
            'We are packing your order now.',
            'Delivery partner has been assigned.',
            'Your food is on the way!',
            'Thank you for your patience!'
        ];
        return updates[Math.floor(Math.random() * updates.length)];
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const message = {
            id: Date.now(),
            sender: 'user',
            senderName: user.name || 'You',
            message: newMessage,
            timestamp: new Date().toISOString(),
            type: 'sent'
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // Simulate typing indicator
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            // Auto-reply
            const reply = {
                id: Date.now() + 1,
                sender: 'restaurant',
                senderName: restaurantName || 'Restaurant',
                message: getAutoReply(newMessage),
                timestamp: new Date().toISOString(),
                type: 'received'
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    const getAutoReply = (userMessage) => {
        const msg = userMessage.toLowerCase();
        if (msg.includes('time') || msg.includes('when')) {
            return 'Your order will be delivered in approximately 20-25 minutes.';
        } else if (msg.includes('cancel')) {
            return 'To cancel your order, please go to Orders page and click Cancel button.';
        } else if (msg.includes('change') || msg.includes('modify')) {
            return 'Unfortunately, we cannot modify the order once it\'s confirmed. Please contact support.';
        } else if (msg.includes('track')) {
            return 'You can track your order in real-time from the Order Tracking page.';
        } else {
            return 'Thank you for your message. Our team will respond shortly!';
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const quickReplies = [
        '⏱️ How long?',
        '📍 Where is my order?',
        '🔄 Change order',
        '❌ Cancel order',
        '📞 Call support'
    ];

    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.chatContainer} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.headerLeft}>
                        <div style={styles.avatar}>
                            {(restaurantName || 'R').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 style={styles.headerTitle}>{restaurantName || 'Restaurant'}</h3>
                            <p style={styles.headerSubtitle}>
                                Order #{orderId || '123'} • <span style={styles.onlineStatus}>● Online</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {/* Messages */}
                <div style={styles.messagesContainer}>
                    {messages.map(msg => (
                        <div 
                            key={msg.id} 
                            style={{
                                ...styles.messageWrapper,
                                justifyContent: msg.type === 'sent' ? 'flex-end' : 'flex-start'
                            }}
                        >
                            {msg.type === 'system' ? (
                                <div style={styles.systemMessage}>
                                    {msg.message}
                                </div>
                            ) : (
                                <div style={{
                                    ...styles.messageBubble,
                                    ...(msg.type === 'sent' ? styles.sentMessage : styles.receivedMessage)
                                }}>
                                    {msg.type === 'received' && (
                                        <div style={styles.senderName}>{msg.senderName}</div>
                                    )}
                                    <div style={styles.messageText}>{msg.message}</div>
                                    <div style={styles.messageTime}>{formatTime(msg.timestamp)}</div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div style={styles.messageWrapper}>
                            <div style={{...styles.messageBubble, ...styles.receivedMessage}}>
                                <div style={styles.typingIndicator}>
                                    <span style={styles.typingDot}></span>
                                    <span style={styles.typingDot}></span>
                                    <span style={styles.typingDot}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div style={styles.quickReplies}>
                    {quickReplies.map((reply, index) => (
                        <button
                            key={index}
                            onClick={() => setNewMessage(reply.substring(2))}
                            style={styles.quickReplyBtn}
                        >
                            {reply}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div style={styles.inputContainer}>
                    <button style={styles.attachBtn} title="Attach file">
                        📎
                    </button>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        style={styles.input}
                    />
                    <button 
                        onClick={handleSendMessage}
                        style={styles.sendBtn}
                        disabled={!newMessage.trim()}
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out'
    },
    chatContainer: {
        background: 'white',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '500px',
        height: '600px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    avatar: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: '700',
        border: '2px solid rgba(255, 255, 255, 0.5)'
    },
    headerTitle: {
        margin: '0 0 4px 0',
        fontSize: '18px',
        fontWeight: '700'
    },
    headerSubtitle: {
        margin: 0,
        fontSize: '13px',
        opacity: 0.9
    },
    onlineStatus: {
        color: '#4ade80'
    },
    closeBtn: {
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
    },
    messagesContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    messageWrapper: {
        display: 'flex',
        animation: 'fadeInUp 0.3s ease-out'
    },
    messageBubble: {
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '18px',
        wordWrap: 'break-word'
    },
    sentMessage: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        borderBottomRightRadius: '4px'
    },
    receivedMessage: {
        background: 'white',
        color: '#1e293b',
        borderBottomLeftRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    systemMessage: {
        background: 'rgba(100, 116, 139, 0.1)',
        color: '#64748b',
        padding: '8px 16px',
        borderRadius: '12px',
        fontSize: '13px',
        textAlign: 'center',
        width: '100%'
    },
    senderName: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#667eea',
        marginBottom: '4px'
    },
    messageText: {
        fontSize: '15px',
        lineHeight: '1.5',
        marginBottom: '4px'
    },
    messageTime: {
        fontSize: '11px',
        opacity: 0.7,
        textAlign: 'right'
    },
    typingIndicator: {
        display: 'flex',
        gap: '4px',
        padding: '4px 0'
    },
    typingDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#94a3b8',
        animation: 'typing 1.4s infinite'
    },
    quickReplies: {
        display: 'flex',
        gap: '8px',
        padding: '12px 20px',
        overflowX: 'auto',
        background: 'white',
        borderTop: '1px solid #e2e8f0'
    },
    quickReplyBtn: {
        padding: '8px 16px',
        background: '#f1f5f9',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.3s ease'
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 20px',
        background: 'white',
        borderTop: '1px solid #e2e8f0'
    },
    attachBtn: {
        background: 'transparent',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '8px',
        color: '#64748b',
        transition: 'all 0.3s ease'
    },
    input: {
        flex: 1,
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '24px',
        fontSize: '15px',
        outline: 'none',
        transition: 'all 0.3s ease'
    },
    sendBtn: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        color: 'white',
        fontSize: '18px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
    }
};
