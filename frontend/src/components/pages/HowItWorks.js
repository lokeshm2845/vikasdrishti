import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCheck, FaUserTie, FaMicrophone, FaRobot, FaMapMarkedAlt, FaCheckCircle, FaBell, FaCamera, FaArrowRight } from 'react-icons/fa';

const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' or 'leader'

    const citizenSteps = [
        {
            num: '01',
            title: 'Sign Up & Select Preferred Language',
            desc: 'Register as a citizen. Select your preferred regional language (Hindi, Marathi, Gujarati, English). Bhashini AI handles all translations automatically.',
            icon: <FaUserCheck size={24} color="#FF9933" />
        },
        {
            num: '02',
            title: 'File Grievance via Voice or Photo',
            desc: 'Tap "Raise Complaint". Speak hands-free in your native language or upload a 50MP photo proof. Dual-frequency GPS captures your exact coordinates.',
            icon: <FaMicrophone size={24} color="#138808" />
        },
        {
            num: '03',
            title: 'On-Device AI Categorization',
            desc: 'Snapdragon 8 Gen 3 TFLite NPU classifies your issue in under 50ms into categories like pothole, streetlight, or sewage water and maps it to your gali geofence.',
            icon: <FaRobot size={24} color="#0066CC" />
        },
        {
            num: '04',
            title: 'Track Live Status & Rate Proof',
            desc: 'Receive SMS & push notifications when your MLA or councillor starts work. Once resolved with photo proof, rate the resolution quality (1–5 stars).',
            icon: <FaCheckCircle size={24} color="#16a34a" />
        }
    ];

    const leaderSteps = [
        {
            num: '01',
            title: 'Register Representative Profile',
            desc: 'Sign up as an elected MLA or Ward Councillor. Enter your constituency name, ward number, and political party.',
            icon: <FaUserTie size={24} color="#FF9933" />
        },
        {
            num: '02',
            title: 'Draw Gali Geofence Polygon',
            desc: 'Access the interactive Geofence Map. Draw custom gali or ward boundaries on OpenStreetMap to monitor incoming citizen grievances.',
            icon: <FaMapMarkedAlt size={24} color="#138808" />
        },
        {
            num: '03',
            title: 'Receive Real-Time Ward Queue',
            desc: 'View real-time grievances filed within your drawn geofenced area. Click "Start Progress" to notify the citizen and dispatch ground maintenance teams.',
            icon: <FaBell size={24} color="#0066CC" />
        },
        {
            num: '04',
            title: 'Attach Photo Proof & Broadcast SMS',
            desc: 'Mark issues as "Resolved" by attaching visual photo proof. Send broadcast SMS announcements to all registered voters in your ward.',
            icon: <FaCamera size={24} color="#8b5cf6" />
        }
    ];

    const currentSteps = activeTab === 'citizen' ? citizenSteps : leaderSteps;

    return (
        <div style={styles.container} className="animate-fade-in">
            {/* Hero Header */}
            <div style={styles.heroBanner}>
                <span style={styles.badge}>Step-by-Step Governance Guide</span>
                <h1 style={styles.heroTitle}>How VikasDrishti Works</h1>
                <p style={styles.heroSub}>
                    A complete walkthrough of how citizens file grievances and elected leaders resolve them in real-time.
                </p>

                {/* Tab Switcher */}
                <div style={styles.tabContainer}>
                    <button
                        onClick={() => setActiveTab('citizen')}
                        style={activeTab === 'citizen' ? styles.tabActive : styles.tabBtn}
                        className="btn-interactive"
                    >
                        <FaUserCheck /> For Citizens
                    </button>
                    <button
                        onClick={() => setActiveTab('leader')}
                        style={activeTab === 'leader' ? styles.tabActive : styles.tabBtn}
                        className="btn-interactive"
                    >
                        <FaUserTie /> For Leaders & MLAs
                    </button>
                </div>
            </div>

            {/* Timeline Steps */}
            <div style={styles.timelineContainer}>
                {currentSteps.map((step, idx) => (
                    <div key={idx} style={styles.timelineCard} className="glass-card btn-interactive">
                        <div style={styles.stepHeader}>
                            <div style={styles.stepNum}>{step.num}</div>
                            <div style={styles.iconWrapper}>{step.icon}</div>
                        </div>
                        <h3 style={styles.stepTitle}>{step.title}</h3>
                        <p style={styles.stepDesc}>{step.desc}</p>
                    </div>
                ))}
            </div>

            {/* Bottom CTA Banner */}
            <div style={styles.ctaBanner} className="glass-card">
                <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
                <p style={styles.ctaSub}>Join VikasDrishti and experience real-time transparent governance in your ward.</p>
                <Link to="/register" style={styles.ctaBtn} className="btn-interactive">
                    Register Now <FaArrowRight />
                </Link>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' },
    heroBanner: { textAlign: 'center', padding: '50px 20px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '28px', color: 'white', marginBottom: '40px' },
    badge: { display: 'inline-block', background: 'rgba(255, 153, 51, 0.15)', color: '#FF9933', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '16px' },
    heroTitle: { fontSize: '38px', fontWeight: '800', margin: '0 0 12px 0', fontFamily: 'Outfit, sans-serif' },
    heroSub: { fontSize: '15px', color: '#94a3b8', maxWidth: '650px', margin: '0 auto 24px auto', lineHeight: '1.6' },
    tabContainer: { display: 'inline-flex', gap: '10px', background: 'rgba(255, 255, 255, 0.1)', padding: '6px', borderRadius: '16px' },
    tabBtn: { background: 'none', border: 'none', color: '#94a3b8', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    tabActive: { background: 'white', color: '#0f172a', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    timelineContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '50px' },
    timelineCard: { background: 'white', padding: '28px', borderRadius: '20px', border: '1px solid #f1f5f9' },
    stepHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    stepNum: { fontSize: '28px', fontWeight: '800', color: '#FF9933', fontFamily: 'Outfit, sans-serif' },
    iconWrapper: { width: '48px', height: '48px', borderRadius: '14px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    stepTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' },
    stepDesc: { fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 },
    ctaBanner: { padding: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', color: 'white', textAlign: 'center' },
    ctaTitle: { fontSize: '26px', fontWeight: '800', margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif' },
    ctaSub: { fontSize: '14px', color: '#94a3b8', marginBottom: '24px' },
    ctaBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', textDecoration: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: '700', fontSize: '15px' }
};

export default HowItWorks;
