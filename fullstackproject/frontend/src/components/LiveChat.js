import { useState, useEffect, useRef } from 'react';

export default function LiveChat({ restaurantId, restaurantName }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Simulate initial greeting
        if (isOpen && messages.length === 0) {
            setTimeout(() => {
                addBotMessage(`Hi! Welcome to ${restaurantName}. How can I help you today?`);
            }, 500);
        }
    }, [isOpen, restaurantName, messages.length]);

    const addBotMessage = (text) => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            text,
            sender: 'bot',
            timestamp: new Date()
        }]);
    };

    const addUserMessage = (text) => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            text,
            sender: 'user',
            timestamp: new Date()
        }]);
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        addUserMessage(inputMessage);
        const userMsg = inputMessage.toLowerCase();
        setInputMessage('');
        
        // Simulate bot typing
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            generateBotResponse(userMsg);
        }, 1000);
    };

    const generateBotResponse = (userMsg) => {
        let response = '';

        if (userMsg.includes('menu') || userMsg.includes('food')) {
            response = "You can browse our full menu on the menu page. We have amazing dishes including Biryani, Pizza, Burgers and more! 🍕🍔";
        } else if (userMsg.includes('delivery') || userMsg.includes('time')) {
            response = "Our average delivery time is 30-45 minutes. We'll keep you updated with real-time tracking! 🚚";
        } else if (userMsg.includes('discount') || userMsg.includes('offer')) {
            response = "We have great offers! Use code FIRST50 for 50% off on your first order! 🎉";
        } else if (userMsg.includes('payment')) {
            response = "We accept all major payment methods including UPI, Cards, and Cash on Delivery. 💳";
        } else if (userMsg.includes('cancel') || userMsg.includes('refund')) {
            response = "You can cancel your order within 5 minutes of placing it. Refunds are processed within 5-7 business days. 💰";
        } else if (userMsg.includes('help') || userMsg.includes('support')) {
            response = "I'm here to help! You can ask me about menu, delivery, offers, payments, or any other questions. 😊";
        } else if (userMsg.includes('hi') || userMsg.includes('hello')) {
            response = "Hello! How can I assist you today? 👋";
        } else if (userMsg.includes('thank')) {
            response = "You're welcome! Enjoy your meal! 🍽️";
        } else {
            response = "I understand you're asking about that. Let me connect you with our support team for detailed assistance. Meanwhile, feel free to browse our menu! 😊";
        }

        addBotMessage(response);
    };

    const quickReplies = [
        "Show menu",
        "Delivery time?",
        "Any offers?",
        "Payment methods"
    ];

    const handleQuickReply = (reply) => {
        setInputMessage(reply);
        handleSendMessage();
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={styles.chatButton}
                title="Chat with restaurant"
            >
                💬
            </button>
        );
    }

    return (
        <div style={styles.chatContainer}>
            <div style={styles.chatHeader}>
                <div style={styles.headerInfo}>
                    <div style={styles.restaurantAvatar}>🍽️</div>
                    <div>
                        <h3 style={styles.headerTitle}>{restaurantName}</h3>
                        <p style={styles.headerStatus}>
                            <span style={styles.onlineIndicator}></span>
                            Online
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    style={styles.closeButton}
                >
                    ✕
                </button>
            </div>

            <div style={styles.messagesContainer}>
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        style={{
                            ...styles.messageWrapper,
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <div
                            style={{
                                ...styles.message,
                                ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage)
                            }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div style={styles.messageWrapper}>
                        <div style={{...styles.message, ...styles.botMessage}}>
                            <div style={styles.typingIndicator}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {messages.length <= 2 && (
                <div style={styles.quickRepliesContainer}>
                    {quickReplies.map((reply) => (
                        <button
                            key={reply}
                            onClick={() => handleQuickReply(reply)}
                            style={styles.quickReplyButton}
                        >
                            {reply}
                        </button>
                    ))}
                </div>
            )}

            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    style={styles.input}
                />
                <button
                    onClick={handleSendMessage}
                    style={styles.sendButton}
                    disabled={!inputMessage.trim()}
                >
                    ➤
                </button>
            </div>
        </div>
    );
}

const styles = {
    chatButton: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        color: 'white',
        border: 'none',
        fontSize: '28px',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(255, 107, 107, 0.4)',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    chatContainer: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '380px',
        height: '600px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    chatHeader: {
        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        color: 'white',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    restaurantAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px'
    },
    headerTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '700'
    },
    headerStatus: {
        margin: 0,
        fontSize: '12px',
        opacity: 0.9,
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    onlineIndicator: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#10b981',
        display: 'inline-block'
    },
    closeButton: {
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        color: 'white',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    messagesContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        background: '#f8fafc'
    },
    messageWrapper: {
        display: 'flex',
        marginBottom: '12px'
    },
    message: {
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '16px',
        fontSize: '14px',
        lineHeight: '1.5',
        wordWrap: 'break-word'
    },
    userMessage: {
        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        color: 'white',
        borderBottomRightRadius: '4px'
    },
    botMessage: {
        background: 'white',
        color: '#1e293b',
        border: '1px solid #e2e8f0',
        borderBottomLeftRadius: '4px'
    },
    typingIndicator: {
        display: 'flex',
        gap: '4px',
        padding: '4px 0'
    },
    quickRepliesContainer: {
        padding: '12px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        background: 'white',
        borderTop: '1px solid #e2e8f0'
    },
    quickReplyButton: {
        padding: '8px 16px',
        background: '#f1f5f9',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '500',
        color: '#475569',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    inputContainer: {
        padding: '16px 20px',
        background: 'white',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        gap: '12px'
    },
    input: {
        flex: 1,
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '14px',
        outline: 'none',
        fontFamily: 'inherit'
    },
    sendButton: {
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        color: 'white',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
    }
};
