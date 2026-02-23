import { useState, useEffect } from 'react';

export default function ReviewSystem({ orderId, restaurantId, onClose, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [photos, setPhotos] = useState([]);
    const [criteria, setCriteria] = useState([
        { id: 'food_quality', label: 'Food Quality', rating: 0, icon: '🍽️' },
        { id: 'delivery_speed', label: 'Delivery Speed', rating: 0, icon: '⚡' },
        { id: 'packaging', label: 'Packaging', rating: 0, icon: '📦' },
        { id: 'value_for_money', label: 'Value for Money', rating: 0, icon: '💰' }
    ]);
    const [tags, setTags] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    const availableTags = [
        { id: 'delicious', label: 'Delicious', emoji: '😋' },
        { id: 'hot_fresh', label: 'Hot & Fresh', emoji: '🔥' },
        { id: 'good_portion', label: 'Good Portion', emoji: '🍽️' },
        { id: 'fast_delivery', label: 'Fast Delivery', emoji: '⚡' },
        { id: 'well_packed', label: 'Well Packed', emoji: '📦' },
        { id: 'value_for_money', label: 'Great Value', emoji: '💰' },
        { id: 'recommend', label: 'Recommend', emoji: '👍' },
        { id: 'will_order_again', label: 'Will Order Again', emoji: '🔄' }
    ];

    useEffect(() => {
        // Load order details for context
        const loadOrderDetails = () => {
            // Mock order data - in real app, fetch from API
            setOrderDetails({
                id: orderId,
                restaurant: 'Spicy Hub',
                items: ['Butter Chicken', 'Naan Bread', 'Basmati Rice'],
                total: 450,
                deliveredAt: new Date().toISOString()
            });
        };

        loadOrderDetails();
    }, [orderId]);

    const updateCriterion = (criterionId, newRating) => {
        setCriteria(prev => prev.map(c => 
            c.id === criterionId ? { ...c, rating: newRating } : c
        ));
    };

    const toggleTag = (tagId) => {
        setTags(prev => 
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handlePhotoUpload = (event) => {
        const files = Array.from(event.target.files);
        const photoUrls = files.map(file => URL.createObjectURL(file));
        setPhotos(prev => [...prev, ...photoUrls]);
    };

    const removePhoto = (index) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const calculateOverallRating = () => {
        const totalRating = criteria.reduce((sum, c) => sum + c.rating, 0);
        return Math.round(totalRating / criteria.length);
    };

    const submitReview = async () => {
        setIsSubmitting(true);
        
        const reviewData = {
            orderId,
            restaurantId,
            overallRating: calculateOverallRating(),
            criteriaRatings: criteria,
            reviewText: review,
            tags,
            photos,
            submittedAt: new Date().toISOString()
        };

        try {
            // In real app, submit to API
            console.log('Submitting review:', reviewData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (onSubmit) {
                onSubmit(reviewData);
            }
            
            alert('Thank you for your review! 🌟');
            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const StarRating = ({ rating, onChange, size = 24 }) => {
        return (
            <div style={styles.starRating}>
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        onClick={() => onChange(star)}
                        style={{
                            ...styles.star,
                            fontSize: `${size}px`,
                            color: star <= rating ? '#fbbf24' : '#e5e7eb'
                        }}
                    >
                        ⭐
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>⭐ Rate Your Experience</h2>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {/* Order Context */}
                {orderDetails && (
                    <div style={styles.orderContext}>
                        <div style={styles.contextHeader}>
                            <h3 style={styles.restaurantName}>{orderDetails.restaurant}</h3>
                            <span style={styles.orderTotal}>₹{orderDetails.total}</span>
                        </div>
                        <div style={styles.orderItems}>
                            {orderDetails.items.join(' • ')}
                        </div>
                        <div style={styles.deliveryTime}>
                            Delivered on {new Date(orderDetails.deliveredAt).toLocaleDateString()}
                        </div>
                    </div>
                )}

                <div style={styles.content}>
                    {/* Overall Rating */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Overall Rating</h3>
                        <div style={styles.overallRating}>
                            <StarRating 
                                rating={calculateOverallRating()}
                                onChange={setRating}
                                size={32}
                            />
                            <span style={styles.ratingText}>
                                {calculateOverallRating() > 0 ? `${calculateOverallRating()}/5` : 'Tap to rate'}
                            </span>
                        </div>
                    </div>

                    {/* Detailed Criteria */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Rate Each Aspect</h3>
                        <div style={styles.criteriaList}>
                            {criteria.map(criterion => (
                                <div key={criterion.id} style={styles.criterionItem}>
                                    <div style={styles.criterionHeader}>
                                        <span style={styles.criterionIcon}>{criterion.icon}</span>
                                        <span style={styles.criterionLabel}>{criterion.label}</span>
                                    </div>
                                    <StarRating 
                                        rating={criterion.rating}
                                        onChange={(rating) => updateCriterion(criterion.id, rating)}
                                        size={20}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Tags */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Quick Tags (Optional)</h3>
                        <div style={styles.tagsGrid}>
                            {availableTags.map(tag => (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleTag(tag.id)}
                                    style={{
                                        ...styles.tagButton,
                                        ...(tags.includes(tag.id) ? styles.tagButtonActive : {})
                                    }}
                                >
                                    <span style={styles.tagEmoji}>{tag.emoji}</span>
                                    <span style={styles.tagLabel}>{tag.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Written Review */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Share Your Experience (Optional)</h3>
                        <textarea
                            placeholder="Tell others about your experience... What did you love? What could be better?"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            style={styles.reviewTextarea}
                            maxLength={500}
                        />
                        <div style={styles.characterCount}>
                            {review.length}/500 characters
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Add Photos (Optional)</h3>
                        <div style={styles.photoSection}>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                style={styles.photoInput}
                                id="photo-upload"
                            />
                            <label htmlFor="photo-upload" style={styles.photoUploadBtn}>
                                📷 Add Photos
                            </label>
                            
                            {photos.length > 0 && (
                                <div style={styles.photoPreview}>
                                    {photos.map((photo, index) => (
                                        <div key={`photo-${index}-${photo.substring(0, 20)}`} style={styles.photoItem}>
                                            <img src={photo} alt={`Review ${index + 1}`} style={styles.photoImage} />
                                            <button 
                                                onClick={() => removePhoto(index)}
                                                style={styles.removePhotoBtn}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={styles.submitSection}>
                        <button
                            onClick={submitReview}
                            disabled={isSubmitting || calculateOverallRating() === 0}
                            style={{
                                ...styles.submitBtn,
                                ...(isSubmitting || calculateOverallRating() === 0 ? styles.submitBtnDisabled : {})
                            }}
                        >
                            {isSubmitting ? '⏳ Submitting...' : '🌟 Submit Review'}
                        </button>
                        
                        <p style={styles.submitNote}>
                            Your review helps other customers make better choices and helps restaurants improve their service.
                        </p>
                    </div>
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
        maxWidth: '600px',
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
    orderContext: {
        padding: '24px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white'
    },
    contextHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    restaurantName: {
        margin: 0,
        fontSize: '20px',
        fontWeight: '700'
    },
    orderTotal: {
        fontSize: '18px',
        fontWeight: '700'
    },
    orderItems: {
        fontSize: '14px',
        opacity: 0.9,
        marginBottom: '4px'
    },
    deliveryTime: {
        fontSize: '12px',
        opacity: 0.8
    },
    content: {
        padding: '24px'
    },
    section: {
        marginBottom: '32px'
    },
    sectionTitle: {
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1e293b'
    },
    overallRating: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '24px',
        background: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid #e2e8f0'
    },
    starRating: {
        display: 'flex',
        gap: '4px'
    },
    star: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        transition: 'transform 0.2s'
    },
    ratingText: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#64748b'
    },
    criteriaList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    criterionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
    },
    criterionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    criterionIcon: {
        fontSize: '20px'
    },
    criterionLabel: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#374151'
    },
    tagsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px'
    },
    tagButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        background: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '14px',
        fontWeight: '600'
    },
    tagButtonActive: {
        background: '#dbeafe',
        borderColor: '#3b82f6',
        color: '#1e40af'
    },
    tagEmoji: {
        fontSize: '16px'
    },
    tagLabel: {
        fontSize: '13px'
    },
    reviewTextarea: {
        width: '100%',
        minHeight: '120px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '14px',
        fontFamily: 'inherit',
        resize: 'vertical',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    characterCount: {
        textAlign: 'right',
        fontSize: '12px',
        color: '#64748b',
        marginTop: '8px'
    },
    photoSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    photoInput: {
        display: 'none'
    },
    photoUploadBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        background: '#f3f4f6',
        border: '2px dashed #d1d5db',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        transition: 'all 0.2s'
    },
    photoPreview: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '12px'
    },
    photoItem: {
        position: 'relative',
        aspectRatio: '1',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    photoImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    removePhotoBtn: {
        position: 'absolute',
        top: '4px',
        right: '4px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    submitSection: {
        textAlign: 'center'
    },
    submitBtn: {
        width: '100%',
        padding: '16px 24px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '16px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '16px'
    },
    submitBtnDisabled: {
        background: '#e5e7eb',
        color: '#9ca3af',
        cursor: 'not-allowed'
    },
    submitNote: {
        fontSize: '12px',
        color: '#64748b',
        margin: 0,
        lineHeight: '1.4'
    }
}
       