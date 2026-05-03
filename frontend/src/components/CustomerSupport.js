import { useState, useEffect } from 'react';

export default function CustomerSupport({ onClose }) {
    const [activeTab, setActiveTab] = useState('faq');
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({
        subject: '',
        description: '',
        category: 'order_issues',
        priority: 'medium'
    });
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const supportCategories = [
        { id: 'order_issues', label: 'Order Issues', icon: '🍽️' },
        { id: 'payment_problems', label: 'Payment Problems', icon: '💳' },
        { id: 'delivery_concerns', label: 'Delivery Concerns', icon: '🚚' },
        { id: 'account_help', label: 'Account Help', icon: '👤' },
        { id: 'technical_issues', label: 'Technical Issues', icon: '⚙️' },
        { id: 'other', label: 'Other', icon: '❓' }
    ];

    const faqs = [
        {
            id: 1,
            question: 'How can I track my order?',
            answer: 'You can track your order in real-time by going to "My Orders" and clicking "Track Order" on any active order. You\'ll see live updates including preparation, pickup, and delivery status.',
            category: 'order_issues'
        },
        {
            id: 2,
            question: 'What if my order is delayed?',
            answer: 'If your order is delayed beyond the estimated time, you\'ll receive automatic notifications. You can also contact the delivery partner directly or reach out to our support team for assistance.',
            category: 'delivery_concerns'
        },
        {
            id: 3,
            question: 'How do I cancel my order?',
            answer: 'You can cancel your order within 2 minutes of placing it for free. After that, cancellation depends on the restaurant\'s preparation status. Go to "My Orders" and click "Cancel Order".',
            category: 'order_issues'
        },
        {
            id: 4,
            question: 'How do refunds work?',
            answer: 'Refunds are processed automatically based on our policy: Full refund within 2 minutes, partial refund if restaurant hasn\'t started preparation, and full refund for restaurant/delivery issues. Refunds take 3-5 business days.',
            category: 'payment_problems'
        },
        {
            id: 5,
            question: 'Why was my payment declined?',
            answer: 'Payment can be declined due to insufficient funds, incorrect card details, or bank security measures. Please check your card details and try again, or use a different payment method.',
            category: 'payment_problems'
        },
        {
            id: 6,
            question: 'How do I change my delivery address?',
            answer: 'You can change your delivery address before the restaurant confirms your order. Go to your order details and click "Edit Address". After confirmation, address changes may not be possible.',
            category: 'account_help'
        },
        {
            id: 7,
            question: 'How do I report food quality issues?',
            answer: 'If you\'re not satisfied with food quality, please report it through "My Orders" → "Report Issue" or contact our support team. We take food quality seriously and will work with the restaurant to resolve the issue.',
            category: 'order_issues'
        },
        {
            id: 8,
            question: 'How do I contact the delivery partner?',
            answer: 'Once your order is out for delivery, you\'ll see the delivery partner\'s details in the tracking page. You can call them directly or share your location for easier delivery.',
            category: 'delivery_concerns'
        }
    ];

    useEffect(() => {
        // Load existing tickets
        const loadTickets = () => {
            // Mock data - in real app, fetch from API
            setTickets([
                {
                    id: 1,
                    subject: 'Order not delivered',
                    category: 'delivery_concerns',
                    status: 'open',
                    priority: 'high',
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    lastUpdate: 'Investigating with delivery partner'
                },
                {
                    id: 2,
                    subject: 'Payment charged twice',
                    category: 'payment_problems',
                    status: 'resolved',
                    priority: 'medium',
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    lastUpdate: 'Refund processed successfully'
                }
            ]);
        };

        // Initialize chat with welcome message
        setChatMessages([
            {
                id: 1,
                sender: 'support',
                message: 'Hi! I\'m here to help you with any questions or issues. How can I assist you today?',
                timestamp: new Date().toISOString()
            }
        ]);

        loadTickets();
    }, []);

    const createTicket = async () => {
        if (!newTicket.subject.trim() || !newTicket.description.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const ticket = {
                id: Date.now(),
                ...newTicket,
                status: 'open',
                createdAt: new Date().toISOString(),
                lastUpdate: 'Ticket created - awaiting response'
            };

            setTickets(prev => [ticket, ...prev]);
            setNewTicket({
                subject: '',
                description: '',
                category: 'order_issues',
                priority: 'medium'
            });

            alert('Support ticket created successfully! We\'ll get back to you soon.');
            setActiveTab('tickets');
        } catch (error) {
            console.error('Failed to create ticket:', error);
            alert('Failed to create ticket. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const sendChatMessage = () => {
        if (!newMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            message: newMessage,
            timestamp: new Date().toISOString()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setNewMessage('');

        // Simulate support response
        setTimeout(() => {
            const responses = [
                'Thank you for reaching out! Let me help you with that.',
                'I understand your concern. Let me check this for you.',
                'That\'s a great question! Here\'s what I can tell you...',
                'I\'m looking into this issue right now. Please give me a moment.',
                'Thanks for the details. I\'ll escalate this to the appropriate team.'
            ];

            const supportMessage = {
                id: Date.now() + 1,
                sender: 'support',
                message: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date().toISOString()
            };

            setChatMessages(prev => [...prev, supportMessage]);
        }, 2000);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return '#f59e0b';
            case 'in_progress': return '#3b82f6';
            case 'resolved': return '#10b981';
            case 'closed': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#6b7280';
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>🎧 Help & Support</h2>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {/* Tab Navigation */}
                <div style={styles.tabNav}>
                    {[
                        { id: 'faq', label: '❓ FAQ', count: faqs.length },
                        { id: 'tickets', label: '🎫 My Tickets', count: tickets.length },
                        { id: 'chat', label: '💬 Live Chat', count: null },
                        { id: 'create', label: '➕ New Ticket', count: null }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                ...styles.tabBtn,
                                ...(activeTab === tab.id ? styles.tabBtnActive : {})
                            }}
                        >
                            {tab.label}
                            {tab.count !== null && (
                                <span style={styles.tabCount}>{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                <div style={styles.content}>
                    {/* FAQ Tab */}
                    {activeTab === 'faq' && (
                        <div style={styles.faqSection}>
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}>Frequently Asked Questions</h3>
                                <p style={styles.sectionDesc}>
                                    Find quick answers to common questions
                                </p>
                            </div>

                            <div style={styles.faqList}>
                                {faqs.map(faq => (
                                    <details key={faq.id} style={styles.faqItem}>
                                        <summary style={styles.faqQuestion}>
                                            {faq.question}
                                        </summary>
                                        <div style={styles.faqAnswer}>
                                            {faq.answer}
                                        </div>
                                    </details>
                                ))}
                            </div>

                            <div style={styles.faqFooter}>
                                <p style={styles.faqFooterText}>
                                    Can't find what you're looking for?
                                </p>
                                <button 
                                    onClick={() => setActiveTab('create')}
                                    style={styles.createTicketBtn}
                                >
                                    Create Support Ticket
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tickets Tab */}
                    {activeTab === 'tickets' && (
                        <div style={styles.ticketsSection}>
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}>Your Support Tickets</h3>
                                <p style={styles.sectionDesc}>
                                    Track the status of your support requests
                                </p>
                            </div>

                            {tickets.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <div style={styles.emptyIcon}>🎫</div>
                                    <h4 style={styles.emptyTitle}>No support tickets yet</h4>
                                    <p style={styles.emptyDesc}>
                                        When you create a support ticket, it will appear here
                                    </p>
                                    <button 
                                        onClick={() => setActiveTab('create')}
                                        style={styles.createTicketBtn}
                                    >
                                        Create Your First Ticket
                                    </button>
                                </div>
                            ) : (
                                <div style={styles.ticketsList}>
                                    {tickets.map(ticket => (
                                        <div key={ticket.id} style={styles.ticketCard}>
                                            <div style={styles.ticketHeader}>
                                                <h4 style={styles.ticketSubject}>
                                                    {ticket.subject}
                                                </h4>
                                                <div style={styles.ticketMeta}>
                                                    <span style={{
                                                        ...styles.statusBadge,
                                                        background: getStatusColor(ticket.status)
                                                    }}>
                                                        {ticket.status.replace('_', ' ')}
                                                    </span>
                                                    <span style={{
                                                        ...styles.priorityBadge,
                                                        color: getPriorityColor(ticket.priority)
                                                    }}>
                                                        {ticket.priority} priority
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div style={styles.ticketBody}>
                                                <div style={styles.ticketInfo}>
                                                    <span style={styles.ticketLabel}>Category:</span>
                                                    <span style={styles.ticketValue}>
                                                        {supportCategories.find(c => c.id === ticket.category)?.label}
                                                    </span>
                                                </div>
                                                <div style={styles.ticketInfo}>
                                                    <span style={styles.ticketLabel}>Created:</span>
                                                    <span style={styles.ticketValue}>
                                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div style={styles.ticketInfo}>
                                                    <span style={styles.ticketLabel}>Last Update:</span>
                                                    <span style={styles.ticketValue}>
                                                        {ticket.lastUpdate}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Live Chat Tab */}
                    {activeTab === 'chat' && (
                        <div style={styles.chatSection}>
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}>Live Chat Support</h3>
                                <p style={styles.sectionDesc}>
                                    Get instant help from our support team
                                </p>
                            </div>

                            <div style={styles.chatContainer}>
                                <div style={styles.chatMessages}>
                                    {chatMessages.map(message => (
                                        <div 
                                            key={message.id} 
                                            style={{
                                                ...styles.chatMessage,
                                                ...(message.sender === 'user' ? styles.userMessage : styles.supportMessage)
                                            }}
                                        >
                                            <div style={styles.messageContent}>
                                                {message.message}
                                            </div>
                                            <div style={styles.messageTime}>
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={styles.chatInput}>
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                        style={styles.messageInput}
                                    />
                                    <button 
                                        onClick={sendChatMessage}
                                        style={styles.sendBtn}
                                        disabled={!newMessage.trim()}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Create Ticket Tab */}
                    {activeTab === 'create' && (
                        <div style={styles.createSection}>
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}>Create Support Ticket</h3>
                                <p style={styles.sectionDesc}>
                                    Describe your issue and we'll help you resolve it
                                </p>
                            </div>

                            <div style={styles.createForm}>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Category *</label>
                                    <select
                                        value={newTicket.category}
                                        onChange={(e) => setNewTicket(prev => ({...prev, category: e.target.value}))}
                                        style={styles.formSelect}
                                    >
                                        {supportCategories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.icon} {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Priority</label>
                                    <select
                                        value={newTicket.priority}
                                        onChange={(e) => setNewTicket(prev => ({...prev, priority: e.target.value}))}
                                        style={styles.formSelect}
                                    >
                                        <option value="low">🟢 Low - General inquiry</option>
                                        <option value="medium">🟡 Medium - Issue affecting experience</option>
                                        <option value="high">🔴 High - Urgent issue</option>
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Subject *</label>
                                    <input
                                        type="text"
                                        placeholder="Brief description of your issue"
                                        value={newTicket.subject}
                                        onChange={(e) => setNewTicket(prev => ({...prev, subject: e.target.value}))}
                                        style={styles.formInput}
                                        maxLength={100}
                                    />
                                    <div style={styles.charCount}>
                                        {newTicket.subject.length}/100 characters
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Description *</label>
                                    <textarea
                                        placeholder="Please provide detailed information about your issue, including any error messages, order numbers, or steps to reproduce the problem."
                                        value={newTicket.description}
                                        onChange={(e) => setNewTicket(prev => ({...prev, description: e.target.value}))}
                                        style={styles.formTextarea}
                                        rows="6"
                                        maxLength={1000}
                                    />
                                    <div style={styles.charCount}>
                                        {newTicket.description.length}/1000 characters
                                    </div>
                                </div>

                                <button
                                    onClick={createTicket}
                                    disabled={isSubmitting || !newTicket.subject.trim() || !newTicket.description.trim()}
                                    style={{
                                        ...styles.submitBtn,
                                        ...(isSubmitting || !newTicket.subject.trim() || !newTicket.description.trim() ? styles.submitBtnDisabled : {})
                                    }}
                                >
                                    {isSubmitting ? '⏳ Creating Ticket...' : '🎫 Create Support Ticket'}
                                </button>

                                <div style={styles.formFooter}>
                                    <p style={styles.responseTime}>
                                        📧 We typically respond within 2-4 hours during business hours
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '20px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    header: {
        padding: '24px 24px 0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        background: 'white',
        zIndex: 1
    },
    title: {
        margin: 0,
        fontSize: '24px',
        fontWeight: '800',
        color: '#1e293b'
    },
    closeBtn: {
        background: '#f1f5f9',
        border: 'none',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#64748b'
    },
    tabNav: {
        display: 'flex',
        padding: '0 24px',
        borderBottom: '1px solid #e2e8f0',
        overflowX: 'auto'
    },
    tabBtn: {
        background: 'none',
        border: 'none',
        padding: '16px 20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: '#64748b',
        borderBottom: '2px solid transparent',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    tabBtnActive: {
        color: '#667eea',
        borderBottomColor: '#667eea'
    },
    tabCount: {
        background: '#e2e8f0',
        color: '#64748b',
        padding: '2px 6px',
        borderRadius: '10px',
        fontSize: '11px',
        fontWeight: '700'
    },
    content: {
        padding: '24px'
    },
    sectionHeader: {
        marginBottom: '24px',
        textAlign: 'center'
    },
    sectionTitle: {
        margin: '0 0 8px 0',
        fontSize: '20px',
        fontWeight: '700',
        color: '#1e293b'
    },
    sectionDesc: {
        margin: 0,
        fontSize: '14px',
        color: '#64748b'
    },
    faqList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '32px'
    },
    faqItem: {
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
    },
    faqQuestion: {
        padding: '16px 20px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        color: '#374151',
        listStyle: 'none',
        userSelect: 'none'
    },
    faqAnswer: {
        padding: '0 20px 16px 20px',
        fontSize: '14px',
        color: '#64748b',
        lineHeight: '1.6'
    },
    faqFooter: {
        textAlign: 'center',
        padding: '24px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
    },
    faqFooterText: {
        margin: '0 0 16px 0',
        fontSize: '16px',
        color: '#374151'
    },
    createTicketBtn: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px'
    },
    emptyIcon: {
        fontSize: '48px',
        marginBottom: '16px'
    },
    emptyTitle: {
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#374151'
    },
    emptyDesc: {
        margin: '0 0 24px 0',
        fontSize: '14px',
        color: '#64748b'
    },
    ticketsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    ticketCard: {
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px'
    },
    ticketHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
    },
    ticketSubject: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '700',
        color: '#1e293b'
    },
    ticketMeta: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
    },
    statusBadge: {
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '600',
        color: 'white',
        textTransform: 'uppercase'
    },
    priorityBadge: {
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    ticketBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    ticketInfo: {
        display: 'flex',
        gap: '8px'
    },
    ticketLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#64748b',
        minWidth: '80px'
    },
    ticketValue: {
        fontSize: '13px',
        color: '#374151'
    },
    chatContainer: {
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        height: '400px',
        display: 'flex',
        flexDirection: 'column'
    },
    chatMessages: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    chatMessage: {
        maxWidth: '70%',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    userMessage: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end'
    },
    supportMessage: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start'
    },
    messageContent: {
        padding: '12px 16px',
        borderRadius: '12px',
        fontSize: '14px',
        lineHeight: '1.4'
    },
    messageTime: {
        fontSize: '11px',
        color: '#64748b',
        padding: '0 4px'
    },
    chatInput: {
        padding: '16px 20px',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        gap: '12px'
    },
    messageInput: {
        flex: 1,
        padding: '12px 16px',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '14px',
        outline: 'none'
    },
    sendBtn: {
        padding: '12px 20px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    createForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    formLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151'
    },
    formInput: {
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    formSelect: {
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '14px',
        outline: 'none',
        background: 'white',
        cursor: 'pointer'
    },
    formTextarea: {
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '14px',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
        lineHeight: '1.5'
    },
    charCount: {
        fontSize: '12px',
        color: '#64748b',
        textAlign: 'right'
    },
    submitBtn: {
        padding: '16px 24px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '16px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    submitBtnDisabled: {
        background: '#e5e7eb',
        color: '#9ca3af',
        cursor: 'not-allowed'
    },
    formFooter: {
        textAlign: 'center',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
    },
    responseTime: {
        margin: 0,
        fontSize: '13px',
        color: '#64748b'
    }
};