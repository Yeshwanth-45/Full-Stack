import { useState, useEffect } from 'react';

export default function TrustIndicators({ restaurant }) {
    const [trustData, setTrustData] = useState({
        hygieneScore: 'A+',
        reliabilityScore: 95,
        customerSatisfaction: 4.6,
        orderAccuracy: 98,
        avgDeliveryTime: 28,
        promisedDeliveryTime: 30,
        safetyRating: 'Excellent',
        certifications: ['FSSAI', 'ISO 22000', 'Hygiene+']
    });

    useEffect(() => {
        // In real app, fetch trust data from API
        // For now, generate realistic trust scores based on restaurant rating
        const baseRating = restaurant?.rating || 4.0;
        const generateTrustData = () => {
            const reliability = Math.min(99, Math.max(75, Math.round(baseRating * 20 + Math.random() * 10)));
            const accuracy = Math.min(99, Math.max(85, Math.round(baseRating * 22 + Math.random() * 8)));
            const deliveryTime = Math.round(25 + Math.random() * 15);
            
            let hygieneGrade = 'B';
            if (baseRating >= 4.5) hygieneGrade = 'A+';
            else if (baseRating >= 4.0) hygieneGrade = 'A';
            else if (baseRating >= 3.5) hygieneGrade = 'B+';
            
            setTrustData({
                hygieneScore: hygieneGrade,
                reliabilityScore: reliability,
                customerSatisfaction: baseRating,
                orderAccuracy: accuracy,
                avgDeliveryTime: deliveryTime,
                promisedDeliveryTime: deliveryTime + 5,
                safetyRating: baseRating >= 4.0 ? 'Excellent' : 'Good',
                certifications: baseRating >= 4.0 ? ['FSSAI', 'ISO 22000', 'Hygiene+'] : ['FSSAI']
            });
        };
        
        generateTrustData();
    }, [restaurant]);

    const getHygieneColor = (score) => {
        switch (score) {
            case 'A+': return '#10b981';
            case 'A': return '#22c55e';
            case 'B+': return '#f59e0b';
            case 'B': return '#f97316';
            default: return '#ef4444';
        }
    };

    const getReliabilityColor = (score) => {
        if (score >= 95) return '#10b981';
        if (score >= 85) return '#22c55e';
        if (score >= 75) return '#f59e0b';
        return '#ef4444';
    };

    const isOnTime = trustData.avgDeliveryTime <= trustData.promisedDeliveryTime;

    return (
        <div style={styles.container}>
            {/* Main Trust Indicators */}
            <div style={styles.mainIndicators}>
                {/* Hygiene Score */}
                <div style={styles.indicator}>
                    <div style={{
                        ...styles.scoreBadge,
                        background: getHygieneColor(trustData.hygieneScore)
                    }}>
                        {trustData.hygieneScore}
                    </div>
                    <span style={styles.indicatorLabel}>Hygiene</span>
                </div>

                {/* Reliability Score */}
                <div style={styles.indicator}>
                    <div style={{
                        ...styles.scoreValue,
                        color: getReliabilityColor(trustData.reliabilityScore)
                    }}>
                        {trustData.reliabilityScore}%
                    </div>
                    <span style={styles.indicatorLabel}>On-time</span>
                </div>

                {/* Safety Certification */}
                <div style={styles.indicator}>
                    <div style={styles.safetyIcon}>🛡️</div>
                    <span style={styles.indicatorLabel}>Safe</span>
                </div>
            </div>

            {/* Detailed Trust Info (Expandable) */}
            <div style={styles.detailedInfo}>
                <div style={styles.trustMetric}>
                    <span style={styles.metricIcon}>⭐</span>
                    <span style={styles.metricText}>
                        {trustData.customerSatisfaction}/5 satisfaction
                    </span>
                </div>

                <div style={styles.trustMetric}>
                    <span style={styles.metricIcon}>🎯</span>
                    <span style={styles.metricText}>
                        {trustData.orderAccuracy}% order accuracy
                    </span>
                </div>

                <div style={styles.trustMetric}>
                    <span style={{
                        ...styles.metricIcon,
                        color: isOnTime ? '#10b981' : '#f59e0b'
                    }}>
                        ⏱️
                    </span>
                    <span style={styles.metricText}>
                        Avg {trustData.avgDeliveryTime} min delivery
                        {isOnTime && <span style={styles.onTimeTag}>On-time</span>}
                    </span>
                </div>
            </div>

            {/* Certifications */}
            {trustData.certifications.length > 0 && (
                <div style={styles.certifications}>
                    {trustData.certifications.map(cert => (
                        <span key={cert} style={styles.certBadge}>
                            {cert}
                        </span>
                    ))}
                </div>
            )}

            {/* Trust Score Summary */}
            <div style={styles.trustSummary}>
                <div style={styles.trustScoreCircle}>
                    <span style={styles.trustScoreValue}>
                        {Math.round((trustData.reliabilityScore + trustData.orderAccuracy) / 2)}
                    </span>
                </div>
                <div style={styles.trustScoreInfo}>
                    <span style={styles.trustScoreLabel}>Trust Score</span>
                    <span style={styles.trustScoreDesc}>
                        Based on hygiene, reliability & customer feedback
                    </span>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '12px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        fontSize: '12px'
    },
    mainIndicators: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px'
    },
    indicator: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        flex: 1
    },
    scoreBadge: {
        padding: '6px 10px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '800',
        minWidth: '32px',
        textAlign: 'center'
    },
    scoreValue: {
        fontSize: '16px',
        fontWeight: '800',
        textAlign: 'center'
    },
    safetyIcon: {
        fontSize: '20px',
        color: '#10b981'
    },
    indicatorLabel: {
        fontSize: '10px',
        color: '#64748b',
        fontWeight: '600',
        textAlign: 'center'
    },
    detailedInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        paddingTop: '8px',
        borderTop: '1px solid #e2e8f0'
    },
    trustMetric: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    metricIcon: {
        fontSize: '12px',
        width: '16px',
        textAlign: 'center'
    },
    metricText: {
        fontSize: '11px',
        color: '#475569',
        fontWeight: '500'
    },
    onTimeTag: {
        marginLeft: '6px',
        padding: '2px 6px',
        background: '#dcfce7',
        color: '#166534',
        borderRadius: '4px',
        fontSize: '9px',
        fontWeight: '600'
    },
    certifications: {
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap'
    },
    certBadge: {
        padding: '3px 8px',
        background: '#dbeafe',
        color: '#1e40af',
        borderRadius: '6px',
        fontSize: '9px',
        fontWeight: '600'
    },
    trustSummary: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        paddingTop: '8px',
        borderTop: '1px solid #e2e8f0'
    },
    trustScoreCircle: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    trustScoreValue: {
        color: 'white',
        fontSize: '14px',
        fontWeight: '800'
    },
    trustScoreInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    trustScoreLabel: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#1e293b'
    },
    trustScoreDesc: {
        fontSize: '9px',
        color: '#64748b',
        lineHeight: '1.2'
    }
};