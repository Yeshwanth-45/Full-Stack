import { useState, useRef, useEffect } from 'react';

export default function ARMenuViewer({ menuItems }) {
    const [isARActive, setIsARActive] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cameraStream, setCameraStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    const startAR = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsARActive(true);
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Camera access required for AR experience');
        }
    };

    const stopAR = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setIsARActive(false);
        setSelectedItem(null);
    };

    const selectItemForAR = (item) => {
        setSelectedItem(item);
    };

    const renderAROverlay = () => {
        if (!selectedItem) return null;

        return (
            <div style={styles.arOverlay}>
                <div style={styles.arItemCard}>
                    <div style={styles.arItemImage}>
                        <img 
                            src={selectedItem.imageUrl} 
                            alt={selectedItem.name}
                            style={styles.arFoodImage}
                        />
                        <div style={styles.ar3DEffect}></div>
                    </div>
                    <div style={styles.arItemInfo}>
                        <h3 style={styles.arItemName}>{selectedItem.name}</h3>
                        <p style={styles.arItemDesc}>{selectedItem.description}</p>
                        <div style={styles.arItemMeta}>
                            <span style={styles.arPrice}>₹{selectedItem.price}</span>
                            <span style={styles.arCalories}>{selectedItem.calories} cal</span>
                        </div>
                        <div style={styles.arBadges}>
                            {selectedItem.isVeg && <span style={styles.arVegBadge}>🟢 Veg</span>}
                            {selectedItem.isSpicy && <span style={styles.arSpicyBadge}>🌶️ Spicy</span>}
                            {selectedItem.hygieneRating && (
                                <span style={styles.arHygieneBadge}>
                                    🛡️ {selectedItem.hygieneRating}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div style={styles.arControls}>
                    <button style={styles.arRotateBtn}>🔄 Rotate</button>
                    <button style={styles.arZoomBtn}>🔍 Zoom</button>
                    <button style={styles.arAddBtn}>➕ Add to Cart</button>
                </div>
            </div>
        );
    };

    if (!isARActive) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.title}>📱 AR Menu Experience</h2>
                    <p style={styles.subtitle}>See your food in 3D before ordering!</p>
                </div>
                
                <div style={styles.arPreview}>
                    <div style={styles.arIcon}>🥘</div>
                    <h3 style={styles.previewTitle}>Immersive Food Visualization</h3>
                    <ul style={styles.featureList}>
                        <li>📱 View food in your real environment</li>
                        <li>🔄 360° rotation and zoom</li>
                        <li>📏 See actual size portions</li>
                        <li>🎨 Realistic food textures</li>
                        <li>📊 Nutritional info overlay</li>
                    </ul>
                    
                    <button onClick={startAR} style={styles.startARBtn}>
                        🚀 Start AR Experience
                    </button>
                </div>
                
                <div style={styles.menuGrid}>
                    <h3 style={styles.menuTitle}>Select Item for AR View</h3>
                    <div style={styles.itemsGrid}>
                        {menuItems.slice(0, 6).map(item => (
                            <div 
                                key={item.id} 
                                style={styles.menuItemCard}
                                onClick={() => selectItemForAR(item)}
                            >
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.name}
                                    style={styles.menuItemImage}
                                />
                                <div style={styles.menuItemInfo}>
                                    <h4 style={styles.menuItemName}>{item.name}</h4>
                                    <p style={styles.menuItemPrice}>₹{item.price}</p>
                                </div>
                                <div style={styles.arBadge}>AR</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.arContainer}>
            <div style={styles.arHeader}>
                <h2 style={styles.arTitle}>AR Menu Viewer</h2>
                <button onClick={stopAR} style={styles.closeARBtn}>✕</button>
            </div>
            
            <div style={styles.arViewport}>
                <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={styles.arVideo}
                />
                <canvas 
                    ref={canvasRef}
                    style={styles.arCanvas}
                />
                {renderAROverlay()}
                
                <div style={styles.arInstructions}>
                    <p>📱 Point camera at a flat surface</p>
                    <p>👆 Tap to place food item</p>
                </div>
            </div>
            
            <div style={styles.arBottomPanel}>
                <div style={styles.arItemSelector}>
                    {menuItems.slice(0, 4).map(item => (
                        <button
                            key={item.id}
                            onClick={() => selectItemForAR(item)}
                            style={{
                                ...styles.arSelectorBtn,
                                ...(selectedItem?.id === item.id ? styles.arSelectorActive : {})
                            }}
                        >
                            <img src={item.imageUrl} alt={item.name} style={styles.selectorImage} />
                            <span style={styles.selectorName}>{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '24px',
        margin: '20px 0',
        color: 'white'
    },
    header: {
        textAlign: 'center',
        marginBottom: '24px'
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '28px',
        fontWeight: '800'
    },
    subtitle: {
        margin: 0,
        opacity: 0.9,
        fontSize: '16px'
    },
    arPreview: {
        textAlign: 'center',
        marginBottom: '32px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '24px'
    },
    arIcon: {
        fontSize: '60px',
        marginBottom: '16px'
    },
    previewTitle: {
        margin: '0 0 16px 0',
        fontSize: '24px',
        fontWeight: '700'
    },
    featureList: {
        textAlign: 'left',
        maxWidth: '300px',
        margin: '0 auto 24px',
        paddingLeft: '20px'
    },
    startARBtn: {
        padding: '16px 32px',
        background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '18px',
        boxShadow: '0 8px 20px rgba(255, 107, 107, 0.3)'
    },
    menuGrid: {
        marginTop: '24px'
    },
    menuTitle: {
        margin: '0 0 16px 0',
        fontSize: '20px',
        fontWeight: '700',
        textAlign: 'center'
    },
    itemsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px'
    },
    menuItemCard: {
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        padding: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        border: '2px solid transparent'
    },
    menuItemImage: {
        width: '100%',
        height: '80px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '8px'
    },
    menuItemInfo: {
        textAlign: 'center'
    },
    menuItemName: {
        margin: '0 0 4px 0',
        fontSize: '14px',
        fontWeight: '600'
    },
    menuItemPrice: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '700',
        color: '#ffd700'
    },
    arBadge: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: '#ff6b6b',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '10px',
        fontWeight: '700'
    },
    arContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'black',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
    },
    arHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white'
    },
    arTitle: {
        margin: 0,
        fontSize: '20px',
        fontWeight: '700'
    },
    closeARBtn: {
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        fontSize: '18px'
    },
    arViewport: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden'
    },
    arVideo: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    arCanvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
    },
    arOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '16px',
        padding: '20px',
        color: 'white',
        maxWidth: '300px'
    },
    arItemCard: {
        textAlign: 'center',
        marginBottom: '16px'
    },
    arItemImage: {
        position: 'relative',
        marginBottom: '12px'
    },
    arFoodImage: {
        width: '120px',
        height: '120px',
        objectFit: 'cover',
        borderRadius: '12px',
        border: '3px solid #ff6b6b'
    },
    ar3DEffect: {
        position: 'absolute',
        top: '5px',
        left: '5px',
        right: '5px',
        bottom: '5px',
        border: '2px solid rgba(255, 107, 107, 0.5)',
        borderRadius: '12px',
        animation: 'pulse 2s infinite'
    },
    arItemInfo: {
        textAlign: 'center'
    },
    arItemName: {
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: '700'
    },
    arItemDesc: {
        margin: '0 0 12px 0',
        fontSize: '14px',
        opacity: 0.8
    },
    arItemMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px'
    },
    arPrice: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#ffd700'
    },
    arCalories: {
        fontSize: '14px',
        color: '#10b981'
    },
    arBadges: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    arVegBadge: {
        background: '#10b981',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px'
    },
    arSpicyBadge: {
        background: '#ef4444',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px'
    },
    arHygieneBadge: {
        background: '#6366f1',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px'
    },
    arControls: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center'
    },
    arRotateBtn: {
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    arZoomBtn: {
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    arAddBtn: {
        background: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600'
    },
    arInstructions: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '8px',
        padding: '12px',
        color: 'white',
        fontSize: '14px'
    },
    arBottomPanel: {
        background: 'rgba(0, 0, 0, 0.9)',
        padding: '16px'
    },
    arItemSelector: {
        display: 'flex',
        gap: '12px',
        overflowX: 'auto'
    },
    arSelectorBtn: {
        background: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid transparent',
        borderRadius: '12px',
        padding: '8px',
        cursor: 'pointer',
        minWidth: '80px',
        color: 'white'
    },
    arSelectorActive: {
        borderColor: '#ff6b6b'
    },
    selectorImage: {
        width: '40px',
        height: '40px',
        objectFit: 'cover',
        borderRadius: '6px',
        marginBottom: '4px'
    },
    selectorName: {
        display: 'block',
        fontSize: '10px',
        textAlign: 'center'
    }
};