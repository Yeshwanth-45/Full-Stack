import { useState } from 'react';

export default function GroupOrder() {
    const [showModal, setShowModal] = useState(false);
    const [groupCode, setGroupCode] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [isHost, setIsHost] = useState(false);

    const createGroupOrder = () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setGroupCode(code);
        setIsHost(true);
        setGroupMembers([{ name: 'You (Host)', items: [], total: 0 }]);
        alert(`Group Order Created! Share code: ${code}`);
    };

    const joinGroupOrder = () => {
        const code = prompt('Enter Group Order Code:');
        if (code) {
            setGroupCode(code);
            setIsHost(false);
            // Simulate joining
            setGroupMembers([
                { name: 'Host', items: [{ name: 'Pizza', price: 300 }], total: 300 },
                { name: 'You', items: [], total: 0 }
            ]);
            alert(`Joined group order: ${code}`);
        }
    };

    const calculateGroupTotal = () => {
        return groupMembers.reduce((sum, member) => sum + member.total, 0);
    };

    if (!showModal) {
        return (
            <button
                onClick={() => setShowModal(true)}
                style={styles.groupButton}
                title="Group Order"
            >
                👥
            </button>
        );
    }

    return (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>👥 Group Order</h2>
                    <button onClick={() => setShowModal(false)} style={styles.closeBtn}>✕</button>
                </div>

                {!groupCode ? (
                    <div style={styles.content}>
                        <div style={styles.welcomeSection}>
                            <div style={styles.welcomeIcon}>🍕</div>
                            <h3 style={styles.welcomeTitle}>Order Together, Save Together!</h3>
                            <p style={styles.welcomeText}>
                                Create or join a group order to split delivery fees and enjoy food with friends!
                            </p>
                        </div>

                        <div style={styles.features}>
                            <div style={styles.feature}>
                                <span style={styles.featureIcon}>💰</span>
                                <span style={styles.featureText}>Split delivery costs</span>
                            </div>
                            <div style={styles.feature}>
                                <span style={styles.featureIcon}>⏱️</span>
                                <span style={styles.featureText}>Order together, arrive together</span>
                            </div>
                            <div style={styles.feature}>
                                <span style={styles.featureIcon}>🎉</span>
                                <span style={styles.featureText}>Perfect for parties & events</span>
                            </div>
                        </div>

                        <div style={styles.actions}>
                            <button onClick={createGroupOrder} style={styles.createButton}>
                                <span style={styles.buttonIcon}>➕</span>
                                Create Group Order
                            </button>
                            <button onClick={joinGroupOrder} style={styles.joinButton}>
                                <span style={styles.buttonIcon}>🔗</span>
                                Join Group Order
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={styles.content}>
                        <div style={styles.codeSection}>
                            <p style={styles.codeLabel}>Group Code</p>
                            <div style={styles.codeBox}>
                                <span style={styles.code}>{groupCode}</span>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(groupCode);
                                        alert('Code copied!');
                                    }}
                                    style={styles.copyButton}
                                >
                                    📋 Copy
                                </button>
                            </div>
                            {isHost && (
                                <p style={styles.shareText}>Share this code with friends to join!</p>
                            )}
                        </div>

                        <div style={styles.membersSection}>
                            <h3 style={styles.sectionTitle}>Group Members ({groupMembers.length})</h3>
                            <div style={styles.membersList}>
                                {groupMembers.map((member) => (
                                    <div key={`${member.name}-${member.total}`} style={styles.memberCard}>
                                        <div style={styles.memberInfo}>
                                            <div style={styles.memberAvatar}>
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={styles.memberName}>{member.name}</div>
                                                <div style={styles.memberItems}>
                                                    {member.items.length} items
                                                </div>
                                            </div>
                                        </div>
                                        <div style={styles.memberTotal}>₹{member.total}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={styles.summarySection}>
                            <div style={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{calculateGroupTotal()}</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>Delivery Fee</span>
                                <span>₹40</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>Per Person</span>
                                <span>₹{Math.ceil((calculateGroupTotal() + 40) / groupMembers.length)}</span>
                            </div>
                            <div style={{...styles.summaryRow, ...styles.totalRow}}>
                                <span>Total</span>
                                <span>₹{calculateGroupTotal() + 40}</span>
                            </div>
                        </div>

                        {isHost && (
                            <button style={styles.placeOrderButton}>
                                Place Group Order
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    groupButton: {
        position: 'fixed',
        bottom: '240px',
        right: '24px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        color: 'white',
        border: 'none',
        fontSize: '28px',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
        zIndex: 997,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    modal: {
        background: 'white',
        borderRadius: '24px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    header: {
        padding: '24px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
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
    content: {
        padding: '24px'
    },
    welcomeSection: {
        textAlign: 'center',
        marginBottom: '32px'
    },
    welcomeIcon: {
        fontSize: '64px',
        marginBottom: '16px'
    },
    welcomeTitle: {
        margin: '0 0 12px 0',
        fontSize: '24px',
        fontWeight: '700',
        color: '#1e293b'
    },
    welcomeText: {
        margin: 0,
        fontSize: '16px',
        color: '#64748b',
        lineHeight: '1.6'
    },
    features: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '32px'
    },
    feature: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '12px'
    },
    featureIcon: {
        fontSize: '24px'
    },
    featureText: {
        fontSize: '15px',
        fontWeight: '500',
        color: '#475569'
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    createButton: {
        padding: '16px',
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    },
    joinButton: {
        padding: '16px',
        background: 'white',
        color: '#3b82f6',
        border: '2px solid #3b82f6',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    },
    buttonIcon: {
        fontSize: '20px'
    },
    codeSection: {
        textAlign: 'center',
        marginBottom: '24px'
    },
    codeLabel: {
        margin: '0 0 8px 0',
        fontSize: '14px',
        color: '#64748b',
        fontWeight: '500'
    },
    codeBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '2px dashed #cbd5e1'
    },
    code: {
        fontSize: '32px',
        fontWeight: '800',
        color: '#3b82f6',
        letterSpacing: '4px'
    },
    copyButton: {
        padding: '8px 16px',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    shareText: {
        margin: '12px 0 0 0',
        fontSize: '14px',
        color: '#64748b'
    },
    membersSection: {
        marginBottom: '24px'
    },
    sectionTitle: {
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1e293b'
    },
    membersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    memberCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '12px'
    },
    memberInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    memberAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: '700'
    },
    memberName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1e293b'
    },
    memberItems: {
        fontSize: '14px',
        color: '#64748b'
    },
    memberTotal: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#3b82f6'
    },
    summarySection: {
        padding: '20px',
        background: '#f8fafc',
        borderRadius: '12px',
        marginBottom: '16px'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        fontSize: '15px',
        color: '#475569'
    },
    totalRow: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#1e293b',
        paddingTop: '12px',
        borderTop: '2px solid #e2e8f0',
        marginBottom: 0
    },
    placeOrderButton: {
        width: '100%',
        padding: '16px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer'
    }
};
