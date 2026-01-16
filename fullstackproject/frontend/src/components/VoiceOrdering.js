import { useState, useEffect, useRef } from 'react';

export default function VoiceOrdering({ onOrderComplete }) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSummary, setOrderSummary] = useState([]);
    const [currentStep, setCurrentStep] = useState('idle'); // idle, listening, processing, confirming
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(finalTranscript);
                    processVoiceCommand(finalTranscript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                setCurrentStep('idle');
            };
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            setCurrentStep('listening');
            setTranscript('');
            recognitionRef.current.start();
            
            // Auto-stop after 10 seconds
            setTimeout(() => {
                if (isListening) {
                    stopListening();
                }
            }, 10000);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            if (transcript) {
                setCurrentStep('processing');
                setIsProcessing(true);
            } else {
                setCurrentStep('idle');
            }
        }
    };

    const processVoiceCommand = (command) => {
        setIsProcessing(true);
        setCurrentStep('processing');
        
        // Simulate AI processing
        setTimeout(() => {
            const processedOrder = parseVoiceOrder(command);
            setOrderSummary(processedOrder);
            setCurrentStep('confirming');
            setIsProcessing(false);
        }, 2000);
    };

    const parseVoiceOrder = (command) => {
        // Simple voice command parsing (in real app, use NLP service)
        const lowerCommand = command.toLowerCase();
        const items = [];

        // Food item patterns
        const foodPatterns = [
            { pattern: /pizza/i, item: 'Margherita Pizza', restaurant: 'Pizza Palace', price: 300 },
            { pattern: /burger/i, item: 'Cheese Burger', restaurant: 'Burger Barn', price: 180 },
            { pattern: /biryani/i, item: 'Chicken Biryani', restaurant: 'Spicy Hub', price: 250 },
            { pattern: /butter chicken/i, item: 'Butter Chicken', restaurant: 'Spicy Hub', price: 280 },
            { pattern: /noodles/i, item: 'Hakka Noodles', restaurant: 'Chinese Wok', price: 150 },
            { pattern: /dosa/i, item: 'Masala Dosa', restaurant: 'South Indian Café', price: 100 }
        ];

        // Quantity patterns
        const quantityMatch = lowerCommand.match(/(\d+|one|two|three|four|five)/);
        let quantity = 1;
        if (quantityMatch) {
            const qtyText = quantityMatch[1];
            const qtyMap = { one: 1, two: 2, three: 3, four: 4, five: 5 };
            quantity = qtyMap[qtyText] || parseInt(qtyText) || 1;
        }

        // Find matching food items
        foodPatterns.forEach(pattern => {
            if (pattern.pattern.test(lowerCommand)) {
                items.push({
                    ...pattern,
                    quantity,
                    total: pattern.price * quantity
                });
            }
        });

        return items.length > 0 ? items : [
            { 
                item: 'Could not understand order', 
                restaurant: 'Please try again', 
                price: 0, 
                quantity: 0, 
                total: 0 
            }
        ];
    };

    const confirmOrder = () => {
        if (onOrderComplete) {
            onOrderComplete(orderSummary);
        }
        resetVoiceOrder();
    };

    const resetVoiceOrder = () => {
        setCurrentStep('idle');
        setTranscript('');
        setOrderSummary([]);
        setIsProcessing(false);
    };

    const speakResponse = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>🎤 Voice Ordering</h2>
                <p style={styles.subtitle}>Order food with your voice - hands-free!</p>
            </div>

            <div style={styles.voiceInterface}>
                {currentStep === 'idle' && (
                    <div style={styles.idleState}>
                        <div style={styles.microphoneIcon} onClick={startListening}>
                            🎤
                        </div>
                        <p style={styles.instruction}>Tap the microphone and say your order</p>
                        <div style={styles.examples}>
                            <p style={styles.exampleTitle}>Try saying:</p>
                            <ul style={styles.exampleList}>
                                <li>"I want two pizzas"</li>
                                <li>"Order one chicken biryani"</li>
                                <li>"Get me a burger and fries"</li>
                            </ul>
                        </div>
                    </div>
                )}

                {currentStep === 'listening' && (
                    <div style={styles.listeningState}>
                        <div style={styles.listeningAnimation}>
                            <div style={styles.soundWave}></div>
                            <div style={styles.soundWave}></div>
                            <div style={styles.soundWave}></div>
                        </div>
                        <p style={styles.listeningText}>Listening... Speak now!</p>
                        <button onClick={stopListening} style={styles.stopButton}>
                            Stop Listening
                        </button>
                        {transcript && (
                            <div style={styles.transcriptBox}>
                                <p style={styles.transcriptLabel}>You said:</p>
                                <p style={styles.transcriptText}>"{transcript}"</p>
                            </div>
                        )}
                    </div>
                )}

                {currentStep === 'processing' && (
                    <div style={styles.processingState}>
                        <div style={styles.aiProcessor}></div>
                        <p style={styles.processingText}>Processing your order...</p>
                        <div style={styles.processingSteps}>
                            <div style={styles.step}>🧠 Understanding speech</div>
                            <div style={styles.step}>🔍 Finding menu items</div>
                            <div style={styles.step}>📝 Creating order</div>
                        </div>
                    </div>
                )}

                {currentStep === 'confirming' && (
                    <div style={styles.confirmingState}>
                        <h3 style={styles.confirmTitle}>Order Summary</h3>
                        <div style={styles.orderItems}>
                            {orderSummary.map((item, index) => (
                                <div key={index} style={styles.orderItem}>
                                    <div style={styles.itemDetails}>
                                        <span style={styles.itemName}>{item.item}</span>
                                        <span style={styles.itemRestaurant}>{item.restaurant}</span>
                                    </div>
                                    <div style={styles.itemQuantity}>Qty: {item.quantity}</div>
                                    <div style={styles.itemPrice}>₹{item.total}</div>
                                </div>
                            ))}
                        </div>
                        <div style={styles.orderTotal}>
                            Total: ₹{orderSummary.reduce((sum, item) => sum + item.total, 0)}
                        </div>
                        <div style={styles.confirmButtons}>
                            <button onClick={confirmOrder} style={styles.confirmButton}>
                                ✅ Confirm Order
                            </button>
                            <button onClick={resetVoiceOrder} style={styles.cancelButton}>
                                ❌ Cancel
                            </button>
                            <button onClick={startListening} style={styles.retryButton}>
                                🎤 Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #ff9ff3 100%)',
        borderRadius: '20px',
        padding: '24px',
        margin: '20px 0',
        color: 'white',
        textAlign: 'center'
    },
    header: {
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
    voiceInterface: {
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    idleState: {
        textAlign: 'center'
    },
    microphoneIcon: {
        fontSize: '80px',
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        transition: 'all 0.3s ease',
        border: '3px solid rgba(255, 255, 255, 0.3)'
    },
    instruction: {
        fontSize: '18px',
        marginBottom: '20px',
        fontWeight: '600'
    },
    examples: {
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'left'
    },
    exampleTitle: {
        margin: '0 0 8px 0',
        fontWeight: '600'
    },
    exampleList: {
        margin: 0,
        paddingLeft: '20px'
    },
    listeningState: {
        textAlign: 'center'
    },
    listeningAnimation: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '20px'
    },
    soundWave: {
        width: '8px',
        height: '40px',
        background: 'white',
        borderRadius: '4px',
        animation: 'soundWave 1s ease-in-out infinite alternate'
    },
    listeningText: {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '16px'
    },
    stopButton: {
        padding: '12px 24px',
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        border: '2px solid white',
        borderRadius: '25px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '16px'
    },
    transcriptBox: {
        marginTop: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '16px'
    },
    transcriptLabel: {
        margin: '0 0 8px 0',
        fontSize: '14px',
        opacity: 0.8
    },
    transcriptText: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '600',
        fontStyle: 'italic'
    },
    processingState: {
        textAlign: 'center'
    },
    aiProcessor: {
        width: '60px',
        height: '60px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
    },
    processingText: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '20px'
    },
    processingSteps: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    step: {
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px'
    },
    confirmingState: {
        width: '100%',
        maxWidth: '400px'
    },
    confirmTitle: {
        margin: '0 0 20px 0',
        fontSize: '24px',
        fontWeight: '700'
    },
    orderItems: {
        marginBottom: '16px'
    },
    orderItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        marginBottom: '8px'
    },
    itemDetails: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        flex: 1
    },
    itemName: {
        fontWeight: '600',
        fontSize: '16px'
    },
    itemRestaurant: {
        fontSize: '12px',
        opacity: 0.8
    },
    itemQuantity: {
        fontSize: '14px',
        fontWeight: '600'
    },
    itemPrice: {
        fontSize: '16px',
        fontWeight: '700'
    },
    orderTotal: {
        fontSize: '20px',
        fontWeight: '800',
        marginBottom: '20px',
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '8px'
    },
    confirmButtons: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
    },
    confirmButton: {
        flex: 1,
        padding: '12px',
        background: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    cancelButton: {
        flex: 1,
        padding: '12px',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    retryButton: {
        flex: 1,
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        border: '2px solid white',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600'
    }
};