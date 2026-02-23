import { useState, useEffect } from 'react';

export default function RefundWorkflow({ orderId, orderDetails, onClose, onRefundRequest }) {
    const [refundReason, setRefundReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [refundAmount, setRefundAmount] = useState(0);
    const [refundStatus, setRefundStatus] = useState('pending');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refundPolicy, setRefundPolicy] = useState(null);

    const refundReasons = [
        { 
            id: 'food_quality', 
            label: 'Food Quality Issue', 
            icon: '🍽️',
            description: 'Food was not fresh, cold, or not as expected',
            refundPercent: 100
        },
        { 
            id: 'wrong_order', 
            label: 'Wrong Order Delivered', 
            icon: '❌',
            description: 'Received different items than ordered',
            refundPercent: 100
        },
        { 
            id: 'delivery_delay', 
            label: 'Excessive Delivery Delay', 
            icon: '⏰',
            description: 'Order delivered much later than promised',
            refundPercent: 50
        },
        { 
            id: 'restaurant_cancelled', 
            label: 'Restaurant Cancelled Order', 
            icon: '🏪',
            description: 'Restaurant was unable to fulfill the order',
            refundPercent: 100
        },
        { 
            id: 'delivery_issue', 
            label: 'Delivery Partner Issue', 
            icon: '🚚',
            description: 'Issues with delivery partner or delivery process',
            refundPercent: 100
        },
        { 
            id: 'packaging_issue', 
            label: 'Poor Packaging', 
            icon: '📦',
            description: 'Food was spilled or packaging was damaged',
            refundPercent: 80
        },
        { 
            id: 'missing_items', 
            label: 'Missing Items', 
            icon: '🔍',
            description: 'Some items from the order were not delivered',
            refundPercent: 100
        },
        { 
            id: 'other', 
            label: 'Other Reason', 
            icon: '❓',
            description: 'Please specify your reason',
            refundPercent: 50
        }
    ];

    useEffect(() => {
        // Calculate refund policy based on order timing
        const calculateRefundPolicy = () => {
            if (!orderDetails) return;

            const orderTime = new Date(orderDetails.createdAt || Date.now());
            const currentTime = new Date();
            const timeSinceOrder = currentTime - orderTime;
            const minutesSinceOrder = Math.floor(timeSinceOrder / (1000 * 60));

            let policy = {
                canCancel: false,
                freeRefund: false,
                partialRefund: false,
                noRefund: false,
                timeWindow: minutesSinceOrder,
                message: ''
            };

            if (minutesSinceOrder <= 2) {
                policy.canCancel = true;
                policy.freeRefund = true;
                policy.message = 'Free cancellation available within 2 minutes of order';
            } else if (minutesSinceOrder <= 15 && orderDetails.status === 'PENDING') {
                policy.partialRefund = true;
                policy.message = 'Partial refund available if restaurant hasn\'t started preparation';
            } else if (orderDetails.status === 'CANCELLED' || orderDetails.status === 'RESTAURANT_CANCELLED') {
                policy.freeRefund = true;
                policy.message = 'Full refund available for cancelled orders';
            } else if (orderDetails.status === 'DELIVERED') {
                policy.partialRefund = true;
                policy.message = 'Refund available based on issue type for delivered orders';
            } else {
                policy.noRefund = true;
                policy.message = 'Refund not available at this time';
            }

            setRefundPolicy(policy);
        };

        calculateRefundPolicy();
    }, [orderDetails]);

    const calculateRefundAmount = (reason) => {
        if (!orderDetails || !refundPolicy) return 0;

        const selectedReason = refundReasons.find(r => r.id === reason);
        if (!selectedReason) return 0;

        const baseAmount = orderDetails.total || 0;
        let refundPercent = selectedReason.refundPercent;

        // Apply policy adjustments
        if (refundPolicy.freeRefund) {
            refundPercent = 100;
        } else if (refundPolicy.partialRefund) {
            refundPercent = Math.min(refundPercent, 80);
        } else if (refundPolicy.noRefund) {
            refundPercent = 0;
        }

        return Math.round(baseAmount * (refundPercent / 100));
    };

    const handleReasonChange = (reasonId) => {
        setRefundReason(reasonId);
        const amount = calculateRefundAmount(reasonId);
        setRefundAmount(amount);
    };

    const processRefund = async () => {
        if (!refundReason) {
            alert('Please select a reason for refund');
            return;
        }

        if (refundReason === 'other' && !customReason.trim()) {
            alert('Please specify your reason');
            return;
        }

        setIsSubmitting(true);
        try {
            const refundData = {
                orderId,
                reason: refundReason,
                customReason: refundReason === 'other' ? customReason : '',
                requestedAmount: refundAmount,
                requestedAt: new Date().toISOString()
            };

            // In real app, submit to API
            console.log('Processing refund:', refundData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setRefundStatus('approved');
            
            if (onRefundRequest) {
                onRefundRequest(refundData);
            }
            
            alert(`Refund request submitted successfully! ₹${refundAmount} will be processed within 3-5 business days.`);
            
            setTimeout(() => {
                if (onClose) onClose();
            }, 2000);
            
        } catch (error) {
            console.error('Failed to process refund:', error);
            alert('Failed to process refund request. Please try again.');
            setRefundStatus('failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRefundTimeframe = () => {
        return '3-5 business days';
    };

    if (!orderDetails) {
        return (
            <div style={styles.overlay} onClick={onClose}>
                <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div style={styles.header}>
                        <h2 style={styles.title}>💰 Refund Request</h2>
                        <button onClick={onClose} style={styles.closeBtn}>✕</button>
                    </div>
                    <div style={styles.content}>
                        <p>Loading order details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>💰 Request Refund</h2>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                <div style={styles.content}>
                    {/* Order Summary */}
                    <div style={styles.orderSummary}>
                        <h3 style={styles.sectionTitle}>Order Details</h3>
                        <div style={styles.orderInfo}>
                            <div style={styles.orderRow}>
                                <span style={styles.orderLabel}>Order ID:</span>
                                <span style={styles.orderValue}>#{orderId}</span>
                            </div>
                            <div style={styles.orderRow}>
                                <span style={styles.orderLabel}>Restaurant:</span>
                                <span style={styles.orderValue}>{orderDetails.restaurant || 'N/A'}</span>
                            </div>
                            <div style={styles.orderRow}>
                                <span style={styles.orderLabel}>Order Total:</span>
                                <span style={styles.orderValue}>₹{orderDetails.total || 0}</span>
                            </div>
                            <div style={styles.orderRow}>
                                <span style={styles.orderLabel}>Status:</span>
                                <span style={styles.orderValue}>{orderDetails.status || 'Unknown'}</span>
                            </div>
                            <div style={styles.orderRow}>
                                <span style={styles.orderLabel}>Order Time:</span>
                                <span style={styles.orderValue}>
                                    {new Date(orderDetails.createdAt || Date.now()).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Refund Policy */}
                    {refundPolicy && (
                        <div style={styles.policySection}>
                            <h3 style={styles.sectionTitle}>Refund Policy</h3>
                            <div style={{
                                ...styles.policyCard,
                                ...(refundPolicy.freeRefund ? styles.policySuccess : 
                                   refundPolicy.partialRefund ? styles.policyWarning : 
                                   styles.policyError)
                            }}>
                                <div style={styles.policyIcon}>
                                    {refundPolicy.freeRefund ? '✅' : 
                                     refundPolicy.partialRefund ? '⚠️' : '❌'}
                                </div>
                                <div style={styles.policyText}>
                                    <p style={styles.policyMessage}>{refundPolicy.message}</p>
                                    <p style={styles.policyDetails}>
                                        Time since order: {refundPolicy.timeWindow} minutes
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Refund Reasons */}
                    <div style={styles.reasonsSection}>
                        <h3 style={styles.sectionTitle}>Select Reason for Refund</h3>
                        <div style={styles.reasonsGrid}>
                            {refundReasons.map(reason => (
                                <div
                                    key={reason.id}
                                    onClick={() => handleReasonChange(reason.id)}
                                    style={{
                                        ...styles.reasonCard,
                                        ...(refundReason === reason.id ? styles.reasonCardSelected : {})
                                    }}
                                >
                                    <div style={styles.reasonIcon}>{reason.icon}</div>
                                    <div style={styles.reasonContent}>
                                        <h4 style={styles.reasonTitle}>{reason.label}</h4>
                                        <p style={styles.reasonDesc}>{reason.description}</p>
                                        <div style={styles.reasonRefund}>
                                            Up to {reason.refundPercent}% refund
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Custom Reason Input */}
                        {refundReason === 'other' && (
                            <div style={styles.customReasonSection}>
                                <label style={styles.customReasonLabel}>
                                    Please specify your reason:
                                </label>
                                <textarea
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    placeholder="Describe the issue you experienced..."
                                    style={styles.customReasonInput}
                                    rows="4"
                                    maxLength={500}
                                />
                                <div style={styles.charCount}>
                                    {customReason.length}/500 characters
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Refund Calculation */}
                    {refundReason && (
                        <div style={styles.calculationSection}>
                            <h3 style={styles.sectionTitle}>Refund Calculation</h3>
                            <div style={styles.calculationCard}>
                                <div style={styles.calculationRow}>
                                    <span style={styles.calcLabel}>Original Amount:</span>
                                    <span style={styles.calcValue}>₹{orderDetails.total || 0}</span>
                                </div>
                                <div style={styles.calculationRow}>
                                    <span style={styles.calcLabel}>Refund Reason:</span>
                                    <span style={styles.calcValue}>
                                        {refundReasons.find(r => r.id === refundReason)?.label}
                                    </span>
                                </div>
                                <div style={styles.calculationRow}>
                                    <span style={styles.calcLabel}>Processing Time:</span>
                                    <span style={styles.calcValue}>{getRefundTimeframe()}</span>
                                </div>
                                <div style={styles.calculationDivider}></div>
                                <div style={styles.calculationTotal}>
                                    <span style={styles.totalLabel}>Refund Amount:</span>
                                    <span style={styles.totalValue}>₹{refundAmount}</span>
                                </div>
                                
                                {refundAmount > 0 && (
                                    <div style={styles.refundNote}>
                                        <p style={styles.noteText}>
                                            💳 Refund will be processed to your original payment method
                                        </p>
                                        <p style={styles.noteText}>
                                            📧 You'll receive email confirmation once processed
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={styles.actionSection}>
                        {refundAmount > 0 ? (
                            <button
                                onClick={processRefund}
                                disabled={isSubmitting || !refundReason}
                                style={{
                                    ...styles.submitBtn,
                                    ...(isSubmitting || !refundReason ? styles.submitBtnDisabled : {})
                                }}
                            >
                                {isSubmitting ? '⏳ Processing...' : `💰 Request ₹${refundAmount} Refund`}
                            </button>
                        ) : (
                            <div style={styles.noRefundMessage}>
                                <p style={styles.noRefundText}>
                                    Unfortunately, a refund is not available for this order at this time.
                                </p>
                                <p style={styles.noRefundSubtext}>
                                    If you have concerns about your order, please contact our support team.
                                </p>
                                <button
                                    onClick={onClose}
                                    style={styles.contactSupportBtn}
                                >
                                    📞 Contact Support
                                </button>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            style={styles.cancelBtn}
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Refund Status */}
                    {refundStatus === 'approved' && (
                        <div style={styles.successMessage}>
                            <div style={styles.successIcon}>✅</div>
                            <h4 style={styles.successTitle}>Refund Request Approved!</h4>
                            <p style={styles.successText}>
                                Your refund of ₹{refundAmount} has been approved and will be processed within {getRefundTimeframe()}.
                            </p>
                        </div>
                    )}

                    {refundStatus === 'failed' && (
                        <div style={styles.errorMessage}>
                            <div style={styles.errorIcon}>❌</div>
                            <h4 style={styles.errorTitle}>Refund Request Failed</h4>
                            <p style={styles.errorText}>
                                There was an issue processing your refund request. Please try again or contact support.
                            </p>
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
        maxWidth: '700px',
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
    content: {
        padding: '24px'
    },
    orderSummary: {
        marginBottom: '24px'
    },
    sectionTitle: {
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1e293b'
    },
    orderInfo: {
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #e2e8f0'
    },
    orderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px'
    },
    orderLabel: {
        fontSize: '14px',
        color: '#64748b',
        fontWeight: '500'
    },
    orderValue: {
        fontSize: '14px',
        color: '#1e293b',
        fontWeight: '600'
    },
    policySection: {
        marginBottom: '24px'
    },
    policyCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        borderRadius: '12px',
        border: '2px solid'
    },
    policySuccess: {
        background: '#f0fdf4',
        borderColor: '#22c55e',
        color: '#166534'
    },
    policyWarning: {
        background: '#fffbeb',
        borderColor: '#f59e0b',
        color: '#92400e'
    },
    policyError: {
        background: '#fef2f2',
        borderColor: '#ef4444',
        color: '#991b1b'
    },
    policyIcon: {
        fontSize: '24px'
    },
    policyText: {
        flex: 1
    },
    policyMessage: {
        margin: '0 0 4px 0',
        fontSize: '14px',
        fontWeight: '600'
    },
    policyDetails: {
        margin: 0,
        fontSize: '12px',
        opacity: 0.8
    },
    reasonsSection: {
        marginBottom: '24px'
    },
    reasonsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
    },
    reasonCard: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '16px',
        background: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    reasonCardSelected: {
        background: '#dbeafe',
        borderColor: '#3b82f6',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
    },
    reasonIcon: {
        fontSize: '20px',
        marginTop: '2px'
    },
    reasonContent: {
        flex: 1
    },
    reasonTitle: {
        margin: '0 0 4px 0',
        fontSize: '14px',
        fontWeight: '700',
        color: '#1e293b'
    },
    reasonDesc: {
        margin: '0 0 8px 0',
        fontSize: '12px',
        color: '#64748b',
        lineHeight: '1.4'
    },
    reasonRefund: {
        fontSize: '11px',
        fontWeight: '600',
        color: '#059669',
        background: '#d1fae5',
        padding: '2px 6px',
        borderRadius: '4px',
        display: 'inline-block'
    },
    customReasonSection: {
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #e2e8f0'
    },
    customReasonLabel: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151'
    },
    customReasonInput: {
        width: '100%',
        padding: '12px',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'inherit',
        resize: 'vertical',
        outline: 'none',
        boxSizing: 'border-box'
    },
    charCount: {
        textAlign: 'right',
        fontSize: '12px',
        color: '#64748b',
        marginTop: '4px'
    },
    calculationSection: {
        marginBottom: '24px'
    },
    calculationCard: {
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e2e8f0'
    },
    calculationRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px'
    },
    calcLabel: {
        fontSize: '14px',
        color: '#64748b'
    },
    calcValue: {
        fontSize: '14px',
        color: '#1e293b',
        fontWeight: '600'
    },
    calculationDivider: {
        height: '1px',
        background: '#e2e8f0',
        margin: '16px 0'
    },
    calculationTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    totalLabel: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#1e293b'
    },
    totalValue: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#059669'
    },
    refundNote: {
        background: '#e0f2fe',
        borderRadius: '8px',
        padding: '12px',
        border: '1px solid #0284c7'
    },
    noteText: {
        margin: '0 0 4px 0',
        fontSize: '12px',
        color: '#0c4a6e'
    },
    actionSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    submitBtn: {
        width: '100%',
        padding: '16px 24px',
        background: 'linear-gradient(135deg, #059669, #047857)',
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
    cancelBtn: {
        width: '100%',
        padding: '12px 24px',
        background: '#f1f5f9',
        color: '#64748b',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    noRefundMessage: {
        textAlign: 'center',
        padding: '24px',
        background: '#fef2f2',
        borderRadius: '12px',
        border: '1px solid #fecaca',
        marginBottom: '16px'
    },
    noRefundText: {
        margin: '0 0 8px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#991b1b'
    },
    noRefundSubtext: {
        margin: '0 0 16px 0',
        fontSize: '14px',
        color: '#7f1d1d'
    },
    contactSupportBtn: {
        padding: '12px 24px',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    successMessage: {
        textAlign: 'center',
        padding: '24px',
        background: '#f0fdf4',
        borderRadius: '12px',
        border: '1px solid #bbf7d0',
        marginTop: '16px'
    },
    successIcon: {
        fontSize: '32px',
        marginBottom: '12px'
    },
    successTitle: {
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#166534'
    },
    successText: {
        margin: 0,
        fontSize: '14px',
        color: '#15803d'
    },
    errorMessage: {
        textAlign: 'center',
        padding: '24px',
        background: '#fef2f2',
        borderRadius: '12px',
        border: '1px solid #fecaca',
        marginTop: '16px'
    },
    errorIcon: {
        fontSize: '32px',
        marginBottom: '12px'
    },
    errorTitle: {
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#991b1b'
    },
    errorText: {
        margin: 0,
        fontSize: '14px',
        color: '#b91c1c'
    }
};