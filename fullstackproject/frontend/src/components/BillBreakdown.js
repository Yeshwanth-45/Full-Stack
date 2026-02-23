import { useState } from 'react';

export default function BillBreakdown({ cartItems, deliveryAddress, onClose }) {
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [showBreakdown, setShowBreakdown] = useState(true);

    // Calculate bill components
    const itemTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Distance-based delivery fee calculation
    const calculateDeliveryFee = () => {
        const baseDeliveryFee = 40;
        const distanceKm = 3.2; // Mock distance
        const perKmCharge = 8;
        return baseDeliveryFee + (distanceKm * perKmCharge);
    };

    const deliveryFee = itemTotal >= 199 ? 0 : calculateDeliveryFee();
    const platformFee = Math.round(itemTotal * 0.02); // 2% platform fee
    const gst = Math.round(itemTotal * 0.05); // 5% GST
    
    // Coupon discount
    const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
    
    // Restaurant discount (if any)
    const restaurantDiscount = itemTotal > 500 ? Math.round(itemTotal * 0.1) : 0; // 10% off on orders above ₹500
    
    const totalDiscount = couponDiscount + restaurantDiscount;
    const subtotal = itemTotal + deliveryFee + platformFee + gst - totalDiscount;
    
    // Donation (optional)
    const [donation, setDonation] = useState(0);
    
    const finalTotal = subtotal + donation;

    // Available coupons
    const availableCoupons = [
        { code: 'SAVE50', discount: 50, minOrder: 200, description: '₹50 off on orders above ₹200' },
        { code: 'FIRST100', discount: 100, minOrder: 300, description: '₹100 off on first order above ₹300' },
        { code: 'WEEKEND20', discount: Math.round(itemTotal * 0.2), minOrder: 250, description: '20% off (max ₹100)' }
    ];

    const applyCoupon = () => {
        const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase());
        if (coupon && itemTotal >= coupon.minOrder) {
            setAppliedCoupon(coupon);
            setCouponCode('');
        } else {
            alert('Invalid coupon code or minimum order not met');
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>💰 Bill Breakdown</h3>
                <button 
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    style={styles.toggleBtn}
                >
                    {showBreakdown ? '▼' : '▶'} Details
                </button>
            </div>

            {showBreakdown && (
                <div style={styles.breakdown}>
                    {/* Item Details */}
                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>🍽️ Order Summary</h4>
                        {cartItems.map(item => (
                            <div key={item.id} style={styles.itemRow}>
                                <div style={styles.itemInfo}>
                                    <span style={styles.itemName}>{item.name}</span>
                                    <span style={styles.itemQty}>x{item.quantity}</span>
                                </div>
                                <span style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(0)}</span>
                            </div>
                        ))}
                        <div style={styles.subtotalRow}>
                            <span style={styles.subtotalLabel}>Item Total</span>
                            <span style={styles.subtotalValue}>₹{itemTotal.toFixed(0)}</span>
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>🚚 Delivery Details</h4>
                        <div style={styles.deliveryInfo}>
                            <div style={styles.addressRow}>
                                <span style={styles.addressLabel}>📍 Delivering to:</span>
                                <span style={styles.addressText}>{deliveryAddress || 'Banjara Hills, Hyderabad'}</span>
                            </div>
                            <div style={styles.distanceRow}>
                                <span style={styles.distanceLabel}>📏 Distance:</span>
                                <span style={styles.distanceText}>3.2 km</span>
                            </div>
                        </div>
                        
                        <div style={styles.feeRow}>
                            <div style={styles.feeInfo}>
                                <span style={styles.feeLabel}>Delivery Fee</span>
                                {itemTotal >= 199 && (
                                    <span style={styles.freeDeliveryNote}>Free delivery on orders ≥ ₹199</span>
                                )}
                            </div>
                            <span style={{
                                ...styles.feeValue,
                                ...(deliveryFee === 0 ? styles.freeValue : {})
                            }}>
                                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                            </span>
                        </div>
                    </div>

                    {/* Charges Breakdown */}
                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>📊 Charges & Taxes</h4>
                        
                        <div style={styles.chargeRow}>
                            <div style={styles.chargeInfo}>
                                <span style={styles.chargeLabel}>Platform Fee</span>
                                <span style={styles.chargeDesc}>Helps us maintain the platform</span>
                            </div>
                            <span style={styles.chargeValue}>₹{platformFee}</span>
                        </div>
                        
                        <div style={styles.chargeRow}>
                            <div style={styles.chargeInfo}>
                                <span style={styles.chargeLabel}>GST (5%)</span>
                                <span style={styles.chargeDesc}>Government taxes</span>
                            </div>
                            <span style={styles.chargeValue}>₹{gst}</span>
                        </div>
                    </div>

                    {/* Discounts */}
                    {(restaurantDiscount > 0 || appliedCoupon) && (
                        <div style={styles.section}>
                            <h4 style={styles.sectionTitle}>🎉 Discounts & Offers</h4>
                            
                            {restaurantDiscount > 0 && (
                                <div style={styles.discountRow}>
                                    <div style={styles.discountInfo}>
                                        <span style={styles.discountLabel}>Restaurant Offer</span>
                                        <span style={styles.discountDesc}>10% off on orders above ₹500</span>
                                    </div>
                                    <span style={styles.discountValue}>-₹{restaurantDiscount}</span>
                                </div>
                            )}
                            
                            {appliedCoupon && (
                                <div style={styles.discountRow}>
                                    <div style={styles.discountInfo}>
                                        <span style={styles.discountLabel}>Coupon: {appliedCoupon.code}</span>
                                        <span style={styles.discountDesc}>{appliedCoupon.description}</span>
                                    </div>
                                    <div style={styles.discountActions}>
                                        <span style={styles.discountValue}>-₹{appliedCoupon.discount}</span>
                                        <button onClick={removeCoupon} style={styles.removeCouponBtn}>✕</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Coupon Section */}
                    {!appliedCoupon && (
                        <div style={styles.section}>
                            <h4 style={styles.sectionTitle}>🎫 Apply Coupon</h4>
                            <div style={styles.couponInput}>
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    style={styles.couponField}
                                />
                                <button onClick={applyCoupon} style={styles.applyBtn}>Apply</button>
                            </div>
                            
                            <div style={styles.availableCoupons}>
                                <span style={styles.couponsLabel}>Available Coupons:</span>
                                {availableCoupons.map(coupon => (
                                    <div key={coupon.code} style={styles.couponCard}>
                                        <div style={styles.couponInfo}>
                                            <span style={styles.couponCode}>{coupon.code}</span>
                                            <span style={styles.couponDesc}>{coupon.description}</span>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setCouponCode(coupon.code);
                                                applyCoupon();
                                            }}
                                            style={styles.useCouponBtn}
                                            disabled={itemTotal < coupon.minOrder}
                                        >
                                            {itemTotal >= coupon.minOrder ? 'Use' : `Min ₹${coupon.minOrder}`}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Donation Section */}
                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>❤️ Support a Cause (Optional)</h4>
                        <div style={styles.donationOptions}>
                            {[0, 2, 5, 10].map(amount => (
                                <button
                                    key={amount}
                                    onClick={() => setDonation(amount)}
                                    style={{
                                        ...styles.donationBtn,
                                        ...(donation === amount ? styles.donationBtnActive : {})
                                    }}
                                >
                                    {amount === 0 ? 'Skip' : `₹${amount}`}
                                </button>
                            ))}
                        </div>
                        {donation > 0 && (
                            <p style={styles.donationNote}>
                                Thank you for contributing ₹{donation} to help feed underprivileged children! 🙏
                            </p>
                        )}
                    </div>

                    {/* Total Summary */}
                    <div style={styles.totalSection}>
                        <div style={styles.savingsRow}>
                            <span style={styles.savingsLabel}>💸 Total Savings</span>
                            <span style={styles.savingsValue}>₹{totalDiscount + (itemTotal >= 199 ? calculateDeliveryFee() : 0)}</span>
                        </div>
                        
                        <div style={styles.finalTotalRow}>
                            <span style={styles.finalTotalLabel}>Grand Total</span>
                            <span style={styles.finalTotalValue}>₹{finalTotal.toFixed(0)}</span>
                        </div>
                        
                        <div style={styles.paymentNote}>
                            <span style={styles.noteIcon}>💳</span>
                            <span style={styles.noteText}>
                                Pay ₹{finalTotal.toFixed(0)} at delivery or online
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Summary (Always Visible) */}
            <div style={styles.quickSummary}>
                <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Items ({cartItems.length})</span>
                    <span style={styles.summaryValue}>₹{itemTotal}</span>
                </div>
                <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Delivery + Taxes</span>
                    <span style={styles.summaryValue}>₹{deliveryFee + platformFee + gst}</span>
                </div>
                {totalDiscount > 0 && (
                    <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>Discounts</span>
                        <span style={styles.summaryDiscount}>-₹{totalDiscount}</span>
                    </div>
                )}
                <div style={styles.summaryTotal}>
                    <span style={styles.totalLabel}>Total Amount</span>
                    <span style={styles.totalAmount}>₹{finalTotal.toFixed(0)}</span>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    title: {
        margin: 0,
        fontSize: '20px',
        fontWeight: '700',
        color: '#1e293b'
    },
    toggleBtn: {
        background: 'none',
        border: 'none',
        color: '#667eea',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '4px 8px'
    },
    breakdown: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '20px'
    },
    section: {
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
    },
    sectionTitle: {
        margin: '0 0 12px 0',
        fontSize: '16px',
        fontWeight: '700',
        color: '#374151'
    },
    itemRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #e5e7eb'
    },
    itemInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    itemName: {
        fontSize: '14px',
        color: '#374151'
    },
    itemQty: {
        fontSize: '12px',
        color: '#6b7280',
        background: '#e5e7eb',
        padding: '2px 6px',
        borderRadius: '4px'
    },
    itemPrice: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1e293b'
    },
    subtotalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0 0 0',
        marginTop: '8px',
        borderTop: '1px solid #d1d5db'
    },
    subtotalLabel: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#374151'
    },
    subtotalValue: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#1e293b'
    },
    deliveryInfo: {
        marginBottom: '12px'
    },
    addressRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px'
    },
    addressLabel: {
        fontSize: '12px',
        color: '#6b7280'
    },
    addressText: {
        fontSize: '12px',
        color: '#374151',
        fontWeight: '500'
    },
    distanceRow: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    distanceLabel: {
        fontSize: '12px',
        color: '#6b7280'
    },
    distanceText: {
        fontSize: '12px',
        color: '#374151',
        fontWeight: '500'
    },
    feeRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    feeInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    feeLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151'
    },
    freeDeliveryNote: {
        fontSize: '11px',
        color: '#10b981',
        fontWeight: '500'
    },
    feeValue: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1e293b'
    },
    freeValue: {
        color: '#10b981'
    },
    chargeRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    chargeInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    chargeLabel: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151'
    },
    chargeDesc: {
        fontSize: '11px',
        color: '#6b7280'
    },
    chargeValue: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1e293b'
    },
    discountRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    discountInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    discountLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#10b981'
    },
    discountDesc: {
        fontSize: '11px',
        color: '#6b7280'
    },
    discountActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    discountValue: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#10b981'
    },
    removeCouponBtn: {
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        fontSize: '12px',
        cursor: 'pointer'
    },
    couponInput: {
        display: 'flex',
        gap: '8px',
        marginBottom: '12px'
    },
    couponField: {
        flex: 1,
        padding: '8px 12px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none'
    },
    applyBtn: {
        padding: '8px 16px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    availableCoupons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    couponsLabel: {
        fontSize: '12px',
        color: '#6b7280',
        fontWeight: '600'
    },
    couponCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
    },
    couponInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    couponCode: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#667eea'
    },
    couponDesc: {
        fontSize: '11px',
        color: '#6b7280'
    },
    useCouponBtn: {
        padding: '4px 8px',
        background: '#f3f4f6',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: '600',
        cursor: 'pointer',
        color: '#374151'
    },
    donationOptions: {
        display: 'flex',
        gap: '8px',
        marginBottom: '8px'
    },
    donationBtn: {
        padding: '8px 16px',
        background: '#f3f4f6',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        color: '#374151'
    },
    donationBtnActive: {
        background: '#fef3c7',
        borderColor: '#f59e0b',
        color: '#d97706'
    },
    donationNote: {
        fontSize: '12px',
        color: '#10b981',
        margin: '8px 0 0 0',
        fontStyle: 'italic'
    },
    totalSection: {
        padding: '16px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '12px',
        color: 'white'
    },
    savingsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    savingsLabel: {
        fontSize: '14px',
        fontWeight: '600'
    },
    savingsValue: {
        fontSize: '14px',
        fontWeight: '700'
    },
    finalTotalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        margin: '8px 0'
    },
    finalTotalLabel: {
        fontSize: '18px',
        fontWeight: '700'
    },
    finalTotalValue: {
        fontSize: '20px',
        fontWeight: '800'
    },
    paymentNote: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '8px'
    },
    noteIcon: {
        fontSize: '16px'
    },
    noteText: {
        fontSize: '12px',
        opacity: '0.9'
    },
    quickSummary: {
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    summaryLabel: {
        fontSize: '14px',
        color: '#6b7280'
    },
    summaryValue: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151'
    },
    summaryDiscount: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#10b981'
    },
    summaryTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0 0 0',
        borderTop: '2px solid #d1d5db',
        marginTop: '8px'
    },
    totalLabel: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#1e293b'
    },
    totalAmount: {
        fontSize: '18px',
        fontWeight: '800',
        color: '#667eea'
    }
};