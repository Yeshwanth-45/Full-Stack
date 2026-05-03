import { useState, useEffect } from 'react';
import aiEngine from '../services/aiEngine';

export default function TasteProfileSetup({ onComplete }) {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState(aiEngine.userProfile);

    const cuisines = [
        { name: 'Indian', emoji: '🍛' },
        { name: 'Italian', emoji: '🍕' },
        { name: 'Chinese', emoji: '🥡' },
        { name: 'Thai', emoji: '🍜' },
        { name: 'Mexican', emoji: '🌮' },
        { name: 'Japanese', emoji: '🍱' },
        { name: 'Korean', emoji: '🍲' },
        { name: 'American', emoji: '🍔' },
        { name: 'South Indian', emoji: '🥘' },
        { name: 'Fast Food', emoji: '🍟' }
    ];

    const dietaryOptions = [
        { name: 'Vegetarian', emoji: '🥗' },
        { name: 'Vegan', emoji: '🌱' },
        { name: 'Gluten-Free', emoji: '🌾' },
        { name: 'Jain', emoji: '🙏' },
        { name: 'Keto', emoji: '🥑' },
        { name: 'No Restrictions', emoji: '✨' }
    ];

    const handleSave = () => {
        aiEngine.saveUserProfile(profile);
        if (onComplete) onComplete();
    };

    const toggleCuisine = (cuisine) => {
        const updated = profile.preferredCuisines.includes(cuisine)
            ? profile.preferredCuisines.filter(c => c !== cuisine)
            : [...profile.preferredCuisines, cuisine];
        setProfile({ ...profile, preferredCuisines: updated });
    };

    const toggleDietary = (option) => {
        const updated = profile.dietaryRestrictions.includes(option)
            ? profile.dietaryRestrictions.filter(d => d !== option)
            : [...profile.dietaryRestrictions, option];
        setProfile({ ...profile, dietaryRestrictions: updated });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>🎯 Build Your Taste Profile</h2>
                <p style={styles.subtitle}>Help us personalize your food experience</p>
                <div style={styles.progressBar}>
                    <div style={{...styles.progress, width: `${(step / 4) * 100}%`}} />
                </div>
            </div>

            {step === 1 && (
                <div style={styles.step}>
                    <h3 style={styles.stepTitle}>How spicy do you like your food?</h3>
                    <div style={styles.sliderContainer}>
                        <span style={styles.sliderLabel}>😊 Mild</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={profile.spiceLevel}
                            onChange={(e) => setProfile({...profile, spiceLevel: parseInt(e.target.value)})}
                            style={styles.slider}
                        />
                        <span style={styles.sliderLabel}>🔥 Extra Hot</span>
                    </div>
                    <div style={styles.sliderValue}>{profile.spiceLevel}% Spicy</div>
                </div>
            )}

            {step === 2 && (
                <div style={styles.step}>
                    <h3 style={styles.stepTitle}>Sweet or Savory?</h3>
                    <div style={styles.sliderContainer}>
                        <span style={styles.sliderLabel}>🧂 Savory</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={profile.sweetVsSavory}
                            onChange={(e) => setProfile({...profile, sweetVsSavory: parseInt(e.target.value)})}
                            style={styles.slider}
                        />
                        <span style={styles.sliderLabel}>🍰 Sweet</span>
                    </div>
                    <div style={styles.sliderValue}>
                        {profile.sweetVsSavory < 40 ? 'Savory Lover' : 
                         profile.sweetVsSavory > 60 ? 'Sweet Tooth' : 'Balanced'}
                    </div>

                    <h3 style={{...styles.stepTitle, marginTop: '40px'}}>Healthy or Indulgent?</h3>
                    <div style={styles.sliderContainer}>
                        <span style={styles.sliderLabel}>🥗 Healthy</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={profile.healthyVsIndulgent}
                            onChange={(e) => setProfile({...profile, healthyVsIndulgent: parseInt(e.target.value)})}
                            style={styles.slider}
                        />
                        <span style={styles.sliderLabel}>🍔 Indulgent</span>
                    </div>
                    <div style={styles.sliderValue}>
                        {profile.healthyVsIndulgent < 40 ? 'Health Conscious' : 
                         profile.healthyVsIndulgent > 60 ? 'Indulgence Seeker' : 'Balanced'}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div style={styles.step}>
                    <h3 style={styles.stepTitle}>Select your favorite cuisines</h3>
                    <div style={styles.optionsGrid}>
                        {cuisines.map(cuisine => (
                            <button
                                key={cuisine.name}
                                onClick={() => toggleCuisine(cuisine.name)}
                                style={{
                                    ...styles.optionCard,
                                    ...(profile.preferredCuisines.includes(cuisine.name) ? styles.optionCardActive : {})
                                }}
                            >
                                <div style={styles.optionEmoji}>{cuisine.emoji}</div>
                                <div style={styles.optionName}>{cuisine.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 4 && (
                <div style={styles.step}>
                    <h3 style={styles.stepTitle}>Dietary preferences</h3>
                    <div style={styles.optionsGrid}>
                        {dietaryOptions.map(option => (
                            <button
                                key={option.name}
                                onClick={() => toggleDietary(option.name)}
                                style={{
                                    ...styles.optionCard,
                                    ...(profile.dietaryRestrictions.includes(option.name) ? styles.optionCardActive : {})
                                }}
                            >
                                <div style={styles.optionEmoji}>{option.emoji}</div>
                                <div style={styles.optionName}>{option.name}</div>
                            </button>
                        ))}
                    </div>

                    <h3 style={{...styles.stepTitle, marginTop: '40px'}}>Budget Range (per order)</h3>
                    <div style={styles.budgetInputs}>
                        <input
                            type="number"
                            placeholder="Min"
                            value={profile.budgetRange.min}
                            onChange={(e) => setProfile({
                                ...profile, 
                                budgetRange: {...profile.budgetRange, min: parseInt(e.target.value) || 0}
                            })}
                            style={styles.budgetInput}
                        />
                        <span style={styles.budgetSeparator}>to</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={profile.budgetRange.max}
                            onChange={(e) => setProfile({
                                ...profile, 
                                budgetRange: {...profile.budgetRange, max: parseInt(e.target.value) || 1000}
                            })}
                            style={styles.budgetInput}
                        />
                    </div>
                </div>
            )}

            <div style={styles.actions}>
                {step > 1 && (
                    <button onClick={() => setStep(step - 1)} style={styles.backBtn}>
                        ← Back
                    </button>
                )}
                {step < 4 ? (
                    <button onClick={() => setStep(step + 1)} style={styles.nextBtn}>
                        Next →
                    </button>
                ) : (
                    <button onClick={handleSave} style={styles.saveBtn}>
                        ✓ Complete Profile
                    </button>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '30px',
        maxWidth: '700px',
        margin: '0 auto'
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px'
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1e293b',
        margin: '0 0 10px 0'
    },
    subtitle: {
        fontSize: '16px',
        color: '#64748b',
        margin: '0 0 20px 0'
    },
    progressBar: {
        height: '6px',
        background: '#e2e8f0',
        borderRadius: '10px',
        overflow: 'hidden'
    },
    progress: {
        height: '100%',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        transition: 'width 0.3s ease'
    },
    step: {
        minHeight: '300px'
    },
    stepTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '30px',
        textAlign: 'center'
    },
    sliderContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '15px'
    },
    sliderLabel: {
        fontSize: '14px',
        color: '#64748b',
        fontWeight: '500',
        minWidth: '80px'
    },
    slider: {
        flex: 1,
        height: '8px',
        borderRadius: '10px',
        outline: 'none',
        background: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
    sliderValue: {
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: '600',
        color: '#667eea',
        marginTop: '10px'
    },
    optionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
    },
    optionCard: {
        padding: '20px',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        background: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center'
    },
    optionCardActive: {
        border: '2px solid #667eea',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        transform: 'scale(1.05)'
    },
    optionEmoji: {
        fontSize: '32px',
        marginBottom: '10px'
    },
    optionName: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#1e293b'
    },
    budgetInputs: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        justifyContent: 'center'
    },
    budgetInput: {
        width: '120px',
        padding: '12px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '16px',
        textAlign: 'center',
        outline: 'none'
    },
    budgetSeparator: {
        fontSize: '16px',
        color: '#64748b',
        fontWeight: '500'
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '40px',
        gap: '15px'
    },
    backBtn: {
        padding: '14px 30px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        background: 'white',
        color: '#64748b',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    nextBtn: {
        flex: 1,
        padding: '14px 30px',
        border: 'none',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    saveBtn: {
        flex: 1,
        padding: '14px 30px',
        border: 'none',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #00b894, #00cec9)',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    }
};
