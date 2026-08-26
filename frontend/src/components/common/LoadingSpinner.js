import React from 'react';
import { FaRobot, FaMobileAlt } from 'react-icons/fa';

const LoadingSpinner = ({ size = 'medium', text = 'Processing on iQOO 15 AI Engine...' }) => {
    return (
        <div style={styles.container} className="animate-fade-in">
            <div style={styles.ringWrapper}>
                <div style={styles.outerGlowRing}></div>
                <div style={styles.innerPulseCircle}>
                    <FaRobot size={24} color="#FF9933" />
                </div>
            </div>
            {text && <p style={styles.text}>{text}</p>}
            <span style={styles.subtext}>Snapdragon 8 Gen 3 • Local NPU Engine</span>
        </div>
    );
};

export const FullPageLoader = ({ text = 'Initializing VikasDrishti iQOO 15 AI Engine...' }) => {
    return (
        <div style={styles.fullPage}>
            <div style={styles.fullPageCard} className="glass-card animate-fade-in">
                <div style={styles.ringWrapper}>
                    <div style={styles.outerGlowRing}></div>
                    <div style={styles.innerPulseCircle}>
                        <FaMobileAlt size={32} color="#138808" />
                    </div>
                </div>
                <h3 style={styles.brandTitle}>VikasDrishti</h3>
                <p style={styles.fullPageText}>{text}</p>
                <div style={styles.loaderBarContainer}>
                    <div style={styles.loaderBarFill}></div>
                </div>
            </div>
        </div>
    );
};

export const ButtonLoader = ({ color = 'white' }) => {
    return (
        <div style={styles.buttonLoader}>
            <div style={{ ...styles.buttonSpinner, borderTopColor: color, borderLeftColor: color }}></div>
        </div>
    );
};

export const SkeletonLoader = ({ count = 3 }) => {
    return (
        <div style={styles.skeletonContainer}>
            {[...Array(count)].map((_, i) => (
                <div key={i} style={styles.skeletonCard} className="glass-card animate-fade-in">
                    <div style={styles.skeletonHeader}>
                        <div style={styles.skeletonCircle}></div>
                        <div style={{ flex: 1 }}>
                            <div style={styles.skeletonLineShort}></div>
                            <div style={styles.skeletonLineTiny}></div>
                        </div>
                    </div>
                    <div style={styles.skeletonLineFull}></div>
                    <div style={styles.skeletonLineFull}></div>
                    <div style={{ ...styles.skeletonLineFull, width: '60%' }}></div>
                </div>
            ))}
        </div>
    );
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px' },
    ringWrapper: { position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    outerGlowRing: { position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#FF9933', borderRightColor: '#138808', borderBottomColor: '#0066CC', animation: 'spinGlow 1s linear infinite' },
    innerPulseCircle: { width: '48px', height: '48px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(255, 153, 51, 0.4)', animation: 'pulseGlow 1.5s infinite' },
    text: { marginTop: '16px', color: '#0f172a', fontSize: '15px', fontWeight: '700', fontFamily: 'Outfit, sans-serif' },
    subtext: { fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' },
    fullPage: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' },
    fullPageCard: { background: 'white', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' },
    brandTitle: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '16px 0 6px 0', fontFamily: 'Outfit, sans-serif' },
    fullPageText: { color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' },
    loaderBarContainer: { width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' },
    loaderBarFill: { width: '100%', height: '100%', background: 'linear-gradient(90deg, #FF9933 0%, #138808 50%, #0066CC 100%)', animation: 'barSlide 1.2s ease-in-out infinite' },
    buttonLoader: { display: 'inline-block', marginLeft: '8px' },
    buttonSpinner: { width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spinGlow 0.8s linear infinite' },
    skeletonContainer: { width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' },
    skeletonCard: { background: 'white', borderRadius: '16px', padding: '18px', border: '1px solid #f1f5f9' },
    skeletonHeader: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' },
    skeletonCircle: { width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', animation: 'pulseGlow 1.2s infinite' },
    skeletonLineShort: { height: '14px', background: '#e2e8f0', borderRadius: '6px', width: '40%', marginBottom: '6px', animation: 'pulseGlow 1.2s infinite' },
    skeletonLineTiny: { height: '10px', background: '#f1f5f9', borderRadius: '4px', width: '20%', animation: 'pulseGlow 1.2s infinite' },
    skeletonLineFull: { height: '12px', background: '#f1f5f9', borderRadius: '6px', width: '100%', marginBottom: '8px', animation: 'pulseGlow 1.2s infinite' }
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spinGlow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    @keyframes barSlide {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0%); }
        100% { transform: translateX(100%); }
    }
`;
document.head.appendChild(styleSheet);

export default LoadingSpinner;