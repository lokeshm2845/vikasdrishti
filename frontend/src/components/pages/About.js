import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaEye, FaChartLine, FaAward } from 'react-icons/fa';

const About = () => {
    const teamMembers = [
        { name: 'Lokesh Magare', role: 'Lead Full-Stack Developer & AI Systems Architect', desc: 'Specializing in React.js, Supabase PostGIS, and Snapdragon 8 Gen 3 TFLite NPU optimizations.' },
        { name: 'Parth Bhoi', role: 'UI/UX & Mobile Developer', desc: 'Expert in responsive glassmorphic interfaces, offline IndexedDB storage, and Bhashini AI language integrations.' }

    ];

    const coreValues = [
        { title: 'Transparency', desc: 'Every complaint, status update, and visual proof is visible to both citizens and ward representatives in real-time.', icon: <FaEye color="#FF9933" size={28} /> },
        { title: 'Accountability', desc: 'Elected representatives receive direct ward geotagged issues with direct SLA tracking and before/after verification.', icon: <FaShieldAlt color="#138808" size={28} /> },
        { title: 'Trust & Authenticity', desc: 'Geotagged EXIF verification ensures that all submitted grievances are real and attached to exact ground coordinates.', icon: <FaAward color="#0066CC" size={28} /> },
        { title: 'Inclusive Growth', desc: 'With 100+ Indian regional language offline translations, no citizen is left behind regardless of language barriers.', icon: <FaChartLine color="#8b5cf6" size={28} /> }
    ];

    return (
        <div style={styles.container} className="animate-fade-in">
            {/* Header Hero */}
            <div style={styles.heroBanner}>
                <span style={styles.badge}>Team Vertex Victors • iQOO Hackathon 2026</span>
                <h1 style={styles.heroTitle}>About VikasDrishti</h1>
                <p style={styles.heroSub}>
                    Connecting citizens directly with elected ward representatives through hyper-local geofencing and on-device AI technology.
                </p>
            </div>

            {/* Mission & Vision Section */}
            <div style={styles.missionGrid}>
                <div style={styles.missionCard} className="glass-card">
                    <h2 style={styles.cardTitle}>🎯 Our Mission</h2>
                    <p style={styles.cardText}>
                        To bridge the gap between Indian citizens and their elected MLAs/Ward Councillors by turning smartphones into instant governance hubs that work offline and eliminate bureaucratic friction.
                    </p>
                </div>
                <div style={styles.missionCard} className="glass-card">
                    <h2 style={styles.cardTitle}>👁️ Our Vision</h2>
                    <p style={styles.cardText}>
                        A digitally empowered India where every gali has transparent governance, zero delayed resolutions, and direct accountability powered by edge-AI and PostGIS mapping.
                    </p>
                </div>
            </div>

            {/* Core Values Section */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Our Core Values</h2>
                    <p style={styles.sectionSub}>The principles guiding the development of VikasDrishti</p>
                </div>

                <div style={styles.valuesGrid}>
                    {coreValues.map((v, idx) => (
                        <div key={idx} style={styles.valueCard} className="glass-card btn-interactive">
                            <div style={styles.iconBox}>{v.icon}</div>
                            <h3 style={styles.valueTitle}>{v.title}</h3>
                            <p style={styles.valueDesc}>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Team Vertex Victors</h2>
                    <p style={styles.sectionSub}>The passionate developers behind VikasDrishti</p>
                </div>

                <div style={styles.teamGrid}>
                    {teamMembers.map((m, idx) => (
                        <div key={idx} style={styles.teamCard} className="glass-card btn-interactive">
                            <div style={styles.avatar}>
                                {m.name.charAt(0)}
                            </div>
                            <h3 style={styles.memberName}>{m.name}</h3>
                            <p style={styles.memberRole}>{m.role}</p>
                            <p style={styles.memberDesc}>{m.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div style={styles.ctaCard} className="glass-card">
                <h2 style={styles.ctaTitle}>Be Part of the Digital Governance Movement</h2>
                <p style={styles.ctaSub}>Register today as a citizen or elected representative.</p>
                <div style={styles.ctaGroup}>
                    <Link to="/register?role=user" style={styles.primaryBtn} className="btn-interactive">
                        Register as Citizen
                    </Link>
                    <Link to="/register?role=leader" style={styles.leaderBtn} className="btn-interactive">
                        Register as Leader
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
    heroBanner: { textAlign: 'center', padding: '50px 20px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '28px', color: 'white', marginBottom: '40px' },
    badge: { display: 'inline-block', background: 'rgba(255, 153, 51, 0.15)', color: '#FF9933', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '16px' },
    heroTitle: { fontSize: '38px', fontWeight: '800', margin: '0 0 12px 0', fontFamily: 'Outfit, sans-serif' },
    heroSub: { fontSize: '15px', color: '#94a3b8', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' },
    missionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '50px' },
    missionCard: { background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #f1f5f9' },
    cardTitle: { fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 12px 0' },
    cardText: { fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: 0 },
    section: { marginBottom: '50px' },
    sectionHeader: { textAlign: 'center', marginBottom: '32px' },
    sectionTitle: { fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', fontFamily: 'Outfit, sans-serif' },
    sectionSub: { fontSize: '14px', color: '#64748b', margin: 0 },
    valuesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
    valueCard: { background: 'white', padding: '24px', borderRadius: '18px', border: '1px solid #f1f5f9' },
    iconBox: { width: '56px', height: '56px', borderRadius: '14px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
    valueTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' },
    valueDesc: { fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 },
    teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' },
    teamCard: { background: 'white', padding: '28px', borderRadius: '20px', border: '1px solid #f1f5f9', textAlign: 'center' },
    avatar: { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 6px 16px rgba(255, 153, 51, 0.3)' },
    memberName: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
    memberRole: { fontSize: '12px', fontWeight: '700', color: '#0066CC', margin: '0 0 10px 0' },
    memberDesc: { fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 },
    ctaCard: { padding: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', color: 'white', textAlign: 'center' },
    ctaTitle: { fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif' },
    ctaSub: { fontSize: '14px', color: '#94a3b8', marginBottom: '24px' },
    ctaGroup: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
    primaryBtn: { background: 'linear-gradient(135deg, #FF9933 0%, #e67e22 100%)', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' },
    leaderBtn: { background: 'linear-gradient(135deg, #138808 0%, #16a34a 100%)', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }
};

export default About;
