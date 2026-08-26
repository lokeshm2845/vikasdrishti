import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaGithub, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.mainContent}>
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>
                            <span style={styles.logoBadge}>VD</span> VikasDrishti
                        </h3>
                        <p style={styles.description}>
                            Hyper-local AI governance platform connecting citizens with elected representatives for transparent, accountable gali development.
                        </p>
                        <div style={styles.contactInfo}>
                            <p style={styles.contactItem}>
                                <FaEnvelope style={styles.contactIcon} /> lokeshmagare866@gmail.com
                            </p>
                            <p style={styles.contactItem}>
                                <FaPhone style={styles.contactIcon} /> +91 9834260897
                            </p>
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Quick Links</h3>
                        <ul style={styles.linkList}>
                            <li style={styles.linkItem}><Link to="/" style={styles.link}>Home</Link></li>
                            <li style={styles.linkItem}><Link to="/about" style={styles.link}>About Us</Link></li>
                            <li style={styles.linkItem}><Link to="/how-it-works" style={styles.link}>How It Works</Link></li>
                            <li style={styles.linkItem}><Link to="/contact" style={styles.link}>Contact Us</Link></li>
                            <li style={styles.linkItem}><Link to="/faq" style={styles.link}>Frequently Asked Questions</Link></li>
                        </ul>
                    </div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>For Citizens</h3>
                        <ul style={styles.linkList}>
                            <li style={styles.linkItem}><Link to="/user/raise-complaint" style={styles.link}>Raise Complaint</Link></li>
                            <li style={styles.linkItem}><Link to="/user/my-complaints" style={styles.link}>Track Complaints</Link></li>
                            <li style={styles.linkItem}><Link to="/register?role=user" style={styles.link}>Register as Citizen</Link></li>
                        </ul>
                    </div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>For Leaders / MLAs</h3>
                        <ul style={styles.linkList}>
                            <li style={styles.linkItem}><Link to="/leader/map" style={styles.link}>Geofence Map</Link></li>
                            <li style={styles.linkItem}><Link to="/leader/complaints" style={styles.link}>Manage Complaints</Link></li>
                            <li style={styles.linkItem}><Link to="/leader/send-update" style={styles.link}>Send Updates</Link></li>
                            <li style={styles.linkItem}><Link to="/register?role=leader" style={styles.link}>Register as Leader</Link></li>
                        </ul>
                    </div>
                </div>

                <div style={styles.socialSection}>
                    <h3 style={styles.socialTitle}>Connect With Developer (Lokesh Magare)</h3>
                    <div style={styles.socialLinks}>
                        <a href="https://github.com/lokeshm2845" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="GitHub"><FaGithub /></a>
                        <a href="https://www.linkedin.com/in/lokeshmagare289/" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="LinkedIn"><FaLinkedin /></a>
                        <a href="mailto:lokeshmagare866@gmail.com" style={styles.socialLink} title="Email"><FaEnvelope /></a>
                    </div>
                </div>

                <div style={styles.bottomBar}>
                    <p style={styles.copyright}>©{currentYear} VikasDrishti • iQOO Hackathon 2026. All rights reserved.</p>
                    <div style={styles.bottomLinks}>
                        <Link to="/" style={styles.bottomLink}>Privacy Policy</Link>
                        <Link to="/" style={styles.bottomLink}>Terms of Service</Link>
                    </div>
                    <p style={styles.madeWith}>Built with <FaHeart style={styles.heartIcon} /> by Team Vertex Victors</p>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: { background: '#0f172a', color: '#f8fafc', padding: '50px 0 24px', marginTop: '60px', borderTop: '1px solid #1e293b' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '0 20px' },
    mainContent: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px', marginBottom: '40px' },
    section: { textAlign: 'left' },
    sectionTitle: { color: '#FF9933', fontSize: '16px', marginBottom: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Outfit, sans-serif' },
    logoBadge: { background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', fontWeight: '800', fontSize: '14px', padding: '4px 8px', borderRadius: '8px' },
    description: { fontSize: '13px', lineHeight: '1.6', color: '#94a3b8', marginBottom: '18px' },
    contactInfo: { marginTop: '12px' },
    contactItem: { fontSize: '13px', color: '#cbd5e1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    contactIcon: { color: '#FF9933', fontSize: '13px' },
    linkList: { listStyle: 'none', padding: 0, margin: 0 },
    linkItem: { marginBottom: '10px' },
    link: { color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' },
    socialSection: { textAlign: 'center', padding: '24px 0', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', marginBottom: '20px' },
    socialTitle: { color: '#f8fafc', fontSize: '14px', marginBottom: '14px', fontWeight: '700' },
    socialLinks: { display: 'flex', justifyContent: 'center', gap: '16px' },
    socialLink: { color: '#cbd5e1', fontSize: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' },
    bottomBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', padding: '16px 0', fontSize: '12px', color: '#64748b' },
    copyright: { margin: 0 },
    bottomLinks: { display: 'flex', gap: '16px' },
    bottomLink: { color: '#64748b', textDecoration: 'none', fontSize: '12px' },
    madeWith: { margin: 0, display: 'flex', alignItems: 'center', gap: '4px' },
    heartIcon: { color: '#ef4444', fontSize: '12px' }
};

export default Footer;