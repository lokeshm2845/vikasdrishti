import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { tfliteClassifier } from '../../services/tfliteClassifier';
import { FaRobot, FaMobileAlt, FaArrowRight, FaCamera, FaGlobeAsia } from 'react-icons/fa';

const LandingPage = () => {
    const [simText, setSimText] = useState('Pothole on main market road causing traffic slowdown');
    const [simResult, setSimResult] = useState(null);
    const [isSimulating, setIsSimulating] = useState(false);

    const runAiSimulation = async () => {
        if (!simText.trim()) return;
        setIsSimulating(true);
        const res = await tfliteClassifier.classifyText(simText);
        setSimResult(res);
        setIsSimulating(false);
    };

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <header style={styles.hero}>
                <div style={styles.heroContent} className="animate-fade-in">
                    <div style={styles.badgeRow}>
                        <span style={styles.iQooBadge}>📱 iQOO 15 Snapdragon 8 Gen 3</span>
                        <span style={styles.openInnovBadge}>🏆 iQOO Hackathon 2026</span>
                    </div>

                    <h1 style={styles.heroTitle}>VikasDrishti</h1>
                    <p style={styles.heroSubtitle}>
                        Phone-First & AI-Native Hyper-Local Governance Platform • 100% Offline Resilient
                    </p>

                    <div style={styles.heroButtons}>
                        <Link to="/register" style={styles.primaryBtn} className="btn-interactive">
                            Get Started Now <FaArrowRight />
                        </Link>
                        <Link to="/login" style={styles.secondaryBtn} className="btn-interactive">
                            Login Account
                        </Link>
                    </div>
                </div>
            </header>

            {/* Interactive Live AI Trial Simulator Widget */}
            <section style={styles.simSection}>
                <div style={styles.simCard} className="glass-card">
                    <div style={styles.simHeader}>
                        <FaRobot size={28} color="#FF9933" />
                        <div>
                            <h3 style={styles.simTitle}>Live On-Device TFLite AI Simulator</h3>
                            <p style={styles.simSub}>Test how Snapdragon 8 Gen 3 categorizes civic complaints in &lt;50ms</p>
                        </div>
                    </div>

                    <div style={styles.simInputGroup}>
                        <input
                            type="text"
                            value={simText}
                            onChange={(e) => setSimText(e.target.value)}
                            placeholder="Type a complaint e.g., 'Street light not working'..."
                            style={styles.simInput}
                        />
                        <button onClick={runAiSimulation} disabled={isSimulating} style={styles.simBtn} className="btn-interactive">
                            {isSimulating ? 'Analyzing...' : 'Run TFLite AI'}
                        </button>
                    </div>

                    {simResult && (
                        <div style={styles.simResultBox} className="animate-fade-in">
                            <p style={styles.simResultText}>
                                🏷️ Category: <strong style={{ color: '#FF9933' }}>{simResult.category.toUpperCase()}</strong>
                                &nbsp;• Confidence: <strong>{(simResult.confidence * 100).toFixed(0)}%</strong>
                                &nbsp;• Speed: <strong style={{ color: '#138808' }}>{simResult.processingTimeMs}ms</strong>
                            </p>
                            <span style={styles.simTag}>⚡ Executed on Local NPU Hardware Engine</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section style={styles.statsSection}>
                <div style={styles.statsGrid}>
                    <div style={styles.statItem} className="btn-interactive">
                        <h2 style={styles.statNumber}>100%</h2>
                        <p style={styles.statLabel}>Offline Resilience</p>
                    </div>
                    <div style={styles.statItem} className="btn-interactive">
                        <h2 style={styles.statNumber}>&lt;50ms</h2>
                        <p style={styles.statLabel}>TFLite Inference Time</p>
                    </div>
                    <div style={styles.statItem} className="btn-interactive">
                        <h2 style={styles.statNumber}>100+</h2>
                        <p style={styles.statLabel}>Indian Languages (Bhashini)</p>
                    </div>
                    <div style={styles.statItem} className="btn-interactive">
                        <h2 style={styles.statNumber}>50MP</h2>
                        <p style={styles.statLabel}>iQOO Camera Harness</p>
                    </div>
                </div>
            </section>

            {/* Core Pillars */}
            <section style={styles.howItWorks}>
                <h2 style={styles.sectionTitle}>iQOO 15 Hardware & AI Architecture</h2>
                <div style={styles.stepGrid}>
                    <div style={styles.stepCard} className="btn-interactive">
                        <div style={styles.stepIconContainer}>
                            <FaMobileAlt style={styles.stepIcon} />
                        </div>
                        <h3 style={styles.stepTitle}>1. Phone-First Execution</h3>
                        <p style={styles.stepText}>
                            Native Android feel with local IndexedDB storage. Works completely offline in low-connectivity wards with auto cloud sync.
                        </p>
                    </div>

                    <div style={styles.stepCard} className="btn-interactive">
                        <div style={styles.stepIconContainer}>
                            <FaGlobeAsia style={styles.stepIcon} />
                        </div>
                        <h3 style={styles.stepTitle}>2. Bhashini & Speech AI</h3>
                        <p style={styles.stepText}>
                            Offline regional language translation and hands-free voice complaint filing in Hindi, Marathi, Gujarati, and English.
                        </p>
                    </div>

                    <div style={styles.stepCard} className="btn-interactive">
                        <div style={styles.stepIconContainer}>
                            <FaCamera style={styles.stepIcon} />
                        </div>
                        <h3 style={styles.stepTitle}>3. 50MP Camera & Dual GPS</h3>
                        <p style={styles.stepText}>
                            High-accuracy sub-meter coordinate capturing and visual before/after resolution proof comparison canvas.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.cta}>
                <h2 style={styles.ctaTitle}>Experience the Future of Hyper-Local Governance</h2>
                <p style={styles.ctaText}>Empowering citizens & representatives with on-device AI on iQOO 15.</p>
                <div style={styles.ctaButtons}>
                    <Link to="/register" style={styles.primaryBtn} className="btn-interactive">Register as Citizen</Link>
                    <Link to="/login" style={styles.outlineBtn} className="btn-interactive">Login Demo Account</Link>
                </div>
            </section>
        </div>
    );
};

const styles = {
    container: { color: '#0f172a', backgroundColor: '#f8fafc' },
    hero: { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', padding: '90px 20px', textAlign: 'center', minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'relative' },
    heroContent: { maxWidth: '850px' },
    badgeRow: { display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' },
    iQooBadge: { background: 'linear-gradient(135deg, #FF9933 0%, #e67e22 100%)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
    openInnovBadge: { background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(56, 189, 248, 0.3)' },
    heroTitle: { fontSize: '3.8rem', fontWeight: '900', color: '#ffffff', marginBottom: '16px', fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px' },
    heroSubtitle: { fontSize: '1.25rem', color: '#94a3b8', marginBottom: '36px', lineHeight: '1.6' },
    heroButtons: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
    primaryBtn: { background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', padding: '16px 36px', borderRadius: '30px', textDecoration: 'none', fontWeight: '700', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 20px rgba(255, 153, 51, 0.3)' },
    secondaryBtn: { background: 'rgba(255, 255, 255, 0.1)', color: 'white', padding: '16px 36px', borderRadius: '30px', textDecoration: 'none', fontWeight: '700', fontSize: '1.05rem', border: '1px solid rgba(255, 255, 255, 0.2)' },
    outlineBtn: { background: 'transparent', color: 'white', padding: '16px 36px', borderRadius: '30px', textDecoration: 'none', fontWeight: '700', fontSize: '1.05rem', border: '2px solid white' },
    simSection: { maxWidth: '850px', margin: '-40px auto 40px auto', padding: '0 20px', position: 'relative', zIndex: 10 },
    simCard: { padding: '28px', borderRadius: '20px' },
    simHeader: { display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' },
    simTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
    simSub: { fontSize: '13px', color: '#64748b', margin: 0 },
    simInputGroup: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    simInput: { flex: 1, minWidth: '260px', padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
    simBtn: { background: '#0f172a', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' },
    simResultBox: { marginTop: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 18px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
    simResultText: { fontSize: '14px', color: '#166534', margin: 0 },
    simTag: { fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' },
    statsSection: { padding: '50px 20px', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' },
    statsGrid: { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' },
    statItem: { padding: '20px', background: '#f8fafc', borderRadius: '16px' },
    statNumber: { fontSize: '2.5rem', fontWeight: '800', color: '#FF9933', margin: '0 0 6px 0', fontFamily: 'Outfit, sans-serif' },
    statLabel: { fontSize: '1rem', color: '#64748b', margin: 0, fontWeight: '600' },
    howItWorks: { padding: '80px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' },
    sectionTitle: { fontSize: '2.4rem', fontWeight: '800', marginBottom: '50px', color: '#0f172a', fontFamily: 'Outfit, sans-serif' },
    stepGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' },
    stepCard: { padding: '36px', borderRadius: '20px', background: '#ffffff', border: '1px solid #f1f5f9', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', textAlign: 'left' },
    stepIconContainer: { width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' },
    stepIcon: { fontSize: '28px', color: '#FF9933' },
    stepTitle: { fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: '#0f172a' },
    stepText: { fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', margin: 0 },
    cta: { padding: '80px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #138808 0%, #16a34a 100%)', color: 'white' },
    ctaTitle: { fontSize: '2.4rem', fontWeight: '800', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' },
    ctaText: { fontSize: '1.15rem', marginBottom: '36px', maxWidth: '650px', margin: '0 auto 36px auto', opacity: 0.9 },
    ctaButtons: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }
};

export default LandingPage;
