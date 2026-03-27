import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUsers, FaHandshake, FaRocket, FaArrowRight, FaShieldAlt, FaClock, FaMobileAlt } from 'react-icons/fa';

const Home = () => {
    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>
                        Connect Citizens with Leaders
                        <span style={styles.heroHighlight}> for Transparent Governance</span>
                    </h1>
                    <p style={styles.heroSubtitle}>
                        VikasDrishti is a hyper-local governance platform that bridges the gap between citizens and their leaders, 
                        ensuring transparent development and accountable governance.
                    </p>
                    <div style={styles.heroButtons}>
                        <Link to="/register" style={styles.primaryBtn}>
                            Get Started <FaArrowRight style={styles.btnIcon} />
                        </Link>
                        <Link to="/how-it-works" style={styles.secondaryBtn}>
                            How It Works
                        </Link>
                    </div>
                </div>
                <div style={styles.heroImage}>
                    <div style={styles.heroGraphic}>
                        <div style={styles.mapIcon}>🗺️</div>
                        <div style={styles.notificationIcon}>📢</div>
                        <div style={styles.complaintIcon}>📝</div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div style={styles.stats}>
                <div style={styles.statItem}>
                    <div style={styles.statNumber}>1000+</div>
                    <div style={styles.statLabel}>Complaints Resolved</div>
                </div>
                <div style={styles.statItem}>
                    <div style={styles.statNumber}>50+</div>
                    <div style={styles.statLabel}>Active Leaders</div>
                </div>
                <div style={styles.statItem}>
                    <div style={styles.statNumber}>5000+</div>
                    <div style={styles.statLabel}>Active Citizens</div>
                </div>
                <div style={styles.statItem}>
                    <div style={styles.statNumber}>24/7</div>
                    <div style={styles.statLabel}>Support</div>
                </div>
            </div>

            {/* Features Section */}
            <div style={styles.features}>
                <h2 style={styles.sectionTitle}>Why Choose VikasDrishti?</h2>
                <div style={styles.featuresGrid}>
                    <div style={styles.featureCard}>
                        <div style={styles.featureIcon}>📍</div>
                        <h3 style={styles.featureTitle}>Hyper-Local Targeting</h3>
                        <p style={styles.featureDesc}>Notify only the residents of a specific street about development work in their area.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <div style={styles.featureIcon}>📸</div>
                        <h3 style={styles.featureTitle}>Photo Proof</h3>
                        <p style={styles.featureDesc}>Upload before/after photos to show real impact and build trust.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <div style={styles.featureIcon}>🗣️</div>
                        <h3 style={styles.featureTitle}>Multi-Language Support</h3>
                        <p style={styles.featureDesc}>Messages in Hindi, English, Punjabi, Bengali, and Telugu.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <div style={styles.featureIcon}>📱</div>
                        <h3 style={styles.featureTitle}>Real-Time Updates</h3>
                        <p style={styles.featureDesc}>Get SMS and push notifications for complaint status changes.</p>
                    </div>
                </div>
            </div>

            {/* How It Works Preview */}
            <div style={styles.previewSection}>
                <h2 style={styles.sectionTitle}>How It Works</h2>
                <div style={styles.stepsContainer}>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>1</div>
                        <h3 style={styles.stepTitle}>Raise a Complaint</h3>
                        <p style={styles.stepDesc}>Citizens report issues with photos and location</p>
                    </div>
                    <div style={styles.stepArrow}>→</div>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>2</div>
                        <h3 style={styles.stepTitle}>Leader Reviews</h3>
                        <p style={styles.stepDesc}>Leader gets notified and reviews the complaint</p>
                    </div>
                    <div style={styles.stepArrow}>→</div>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>3</div>
                        <h3 style={styles.stepTitle}>Work in Progress</h3>
                        <p style={styles.stepDesc}>Leader updates status and works on resolution</p>
                    </div>
                    <div style={styles.stepArrow}>→</div>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>4</div>
                        <h3 style={styles.stepTitle}>Resolved & Feedback</h3>
                        <p style={styles.stepDesc}>Issue resolved, citizen gives feedback</p>
                    </div>
                </div>
                <Link to="/how-it-works" style={styles.learnMoreBtn}>
                    Learn More <FaArrowRight />
                </Link>
            </div>

            {/* CTA Section */}
            <div style={styles.ctaSection}>
                <div style={styles.ctaContent}>
                    <h2 style={styles.ctaTitle}>Ready to Make a Difference?</h2>
                    <p style={styles.ctaDesc}>Join VikasDrishti today and be part of transparent governance.</p>
                    <div style={styles.ctaButtons}>
                        <Link to="/register" style={styles.ctaPrimaryBtn}>Register as Citizen</Link>
                        <Link to="/register?role=leader" style={styles.ctaSecondaryBtn}>Register as Leader</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        fontFamily: 'Arial, sans-serif'
    },
    hero: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 0',
        gap: '50px',
        flexWrap: 'wrap'
    },
    heroContent: {
        flex: 1,
        minWidth: '300px'
    },
    heroTitle: {
        fontSize: '48px',
        color: '#333',
        marginBottom: '20px',
        lineHeight: '1.2'
    },
    heroHighlight: {
        color: '#FF9933'
    },
    heroSubtitle: {
        fontSize: '18px',
        color: '#666',
        lineHeight: '1.6',
        marginBottom: '30px'
    },
    heroButtons: {
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
    },
    primaryBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: '#FF9933',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'background 0.3s'
    },
    secondaryBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        background: 'transparent',
        color: '#FF9933',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        border: '2px solid #FF9933',
        transition: 'all 0.3s'
    },
    btnIcon: {
        fontSize: '14px'
    },
    heroImage: {
        flex: 1,
        minWidth: '300px',
        display: 'flex',
        justifyContent: 'center'
    },
    heroGraphic: {
        position: 'relative',
        width: '300px',
        height: '300px',
        background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)',
        borderRadius: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    },
    mapIcon: {
        fontSize: '80px',
        position: 'absolute',
        top: '50px',
        left: '50px',
        animation: 'float 3s ease-in-out infinite'
    },
    notificationIcon: {
        fontSize: '60px',
        position: 'absolute',
        bottom: '50px',
        right: '40px',
        animation: 'float 3s ease-in-out infinite 1s'
    },
    complaintIcon: {
        fontSize: '70px',
        position: 'absolute',
        top: '40px',
        right: '80px',
        animation: 'float 3s ease-in-out infinite 0.5s'
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        padding: '40px 0',
        borderTop: '1px solid #eee',
        borderBottom: '1px solid #eee',
        marginBottom: '40px'
    },
    statItem: {
        textAlign: 'center'
    },
    statNumber: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#FF9933'
    },
    statLabel: {
        fontSize: '14px',
        color: '#666'
    },
    features: {
        padding: '40px 0'
    },
    sectionTitle: {
        textAlign: 'center',
        fontSize: '32px',
        color: '#333',
        marginBottom: '40px'
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '30px'
    },
    featureCard: {
        textAlign: 'center',
        padding: '30px 20px',
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s'
    },
    featureIcon: {
        fontSize: '48px',
        marginBottom: '15px'
    },
    featureTitle: {
        fontSize: '20px',
        color: '#333',
        marginBottom: '10px'
    },
    featureDesc: {
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.5'
    },
    previewSection: {
        padding: '40px 0',
        background: '#f8f9fa',
        borderRadius: '20px',
        margin: '40px 0',
        textAlign: 'center'
    },
    stepsContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '30px'
    },
    step: {
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        width: '200px',
        textAlign: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    stepNumber: {
        width: '40px',
        height: '40px',
        background: '#FF9933',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 15px',
        fontSize: '18px',
        fontWeight: 'bold'
    },
    stepTitle: {
        fontSize: '16px',
        color: '#333',
        marginBottom: '10px'
    },
    stepDesc: {
        fontSize: '12px',
        color: '#666'
    },
    stepArrow: {
        fontSize: '24px',
        color: '#FF9933'
    },
    learnMoreBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: '#FF9933',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop: '20px'
    },
    ctaSection: {
        background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)',
        borderRadius: '20px',
        padding: '60px',
        margin: '40px 0',
        textAlign: 'center'
    },
    ctaContent: {
        color: 'white'
    },
    ctaTitle: {
        fontSize: '32px',
        marginBottom: '15px'
    },
    ctaDesc: {
        fontSize: '18px',
        marginBottom: '30px',
        opacity: 0.9
    },
    ctaButtons: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    ctaPrimaryBtn: {
        background: 'white',
        color: '#FF9933',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'transform 0.3s'
    },
    ctaSecondaryBtn: {
        background: 'transparent',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        border: '2px solid white',
        transition: 'all 0.3s'
    }
};

// Add keyframes for animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }
`;
document.head.appendChild(styleSheet);

export default Home;