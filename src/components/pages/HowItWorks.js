import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaMapMarkedAlt, FaBell, FaCheckCircle } from 'react-icons/fa';

const HowItWorks = () => {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>How It Works</h1>
                <p style={styles.subtitle}>Simple, transparent, and efficient governance at your fingertips</p>
            </div>

            {/* For Citizens */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>For Citizens</h2>
                <div style={styles.stepsContainer}>
                    <div style={styles.step}>
                        <div style={styles.stepIcon}>📝</div>
                        <div style={styles.stepNumber}>Step 1</div>
                        <h3>Register as Citizen</h3>
                        <p>Create your account with basic details and location</p>
                    </div>
                    <div style={styles.step}>
                        <div style={styles.stepIcon}>📍</div>
                        <div style={styles.stepNumber}>Step 2</div>
                        <h3>Raise Complaint</h3>
                        <p>Report issues with photos, description, and location</p>
                    </div>
                    <div style={styles.step}>
                        <div style={styles.stepIcon}>👥</div>
                        <div style={styles.stepNumber}>Step 3</div>
                        <h3>Leader Assigned</h3>
                        <p>Your local leader gets notified and takes action</p>
                    </div>
                    <div style={styles.step}>
                        <div style={styles.stepIcon}>📱</div>
                        <div style={styles.stepNumber}>Step 4</div>
                        <h3>Track Status</h3>
                        <p>Get real-time updates via SMS and app notifications</p>
                    </div>
                    <div style={styles.step}>
                        <div style={styles.stepIcon}>⭐</div>
                        <div style={styles.stepNumber}>Step 5</div>
                        <h3>Give Feedback</h3>
                        <p>Rate the resolution and share your experience</p>
                    </div>
                </div>
            </div>

            {/* For Leaders */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>For Leaders</h2>
                <div style={styles.stepsContainer}>
                    <div style={styles.step}>
                        <div style={styles.stepIcon}>👥</div>
                        <div style={styles.stepNumber}>Step 1</div>
                        <h3>Register as Leader</h3>
                        <p>Sign up with your constituency and title</p>
                    </div>
                    <div style={styles.step}>
                        <div style={styles.stepIcon}>🗺️</div>
                        <div style={styles.stepNumber}>Step 2</div>
                        <h3>Draw Geofence</h3>
                        <p>Mark areas on map to target voters</p>
                    </div>
                    <div style={styles.step}>
                        <div style={styles.stepIcon}>🔍</div>
                        <div style={styles.stepNumber}>Step 3</div>
                        <h3>Find Voters</h3>
                        <p>See all residents in the drawn area</p>
                    </div>
                    <div style={styles.step}>
                        <div style={styles.stepIcon}>📢</div>
                        <div style={styles.stepNumber}>Step 4</div>
                        <h3>Send Updates</h3>
                        <p>Notify residents about completed work with photos</p>
                    </div>
                    <div style={styles.step}>
                        <div style={styles.stepIcon}>✅</div>
                        <div style={styles.stepNumber}>Step 5</div>
                        <h3>Resolve Complaints</h3>
                        <p>Manage and resolve citizen complaints efficiently</p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div style={styles.ctaSection}>
                <h2>Ready to Get Started?</h2>
                <div style={styles.ctaButtons}>
                    <Link to="/register" style={styles.primaryBtn}>
                        <FaUserPlus /> Register as Citizen
                    </Link>
                    <Link to="/register?role=leader" style={styles.secondaryBtn}>
                        Register as Leader
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        textAlign: 'center',
        marginBottom: '50px'
    },
    title: {
        fontSize: '48px',
        color: '#FF9933',
        marginBottom: '15px'
    },
    subtitle: {
        fontSize: '18px',
        color: '#666'
    },
    section: {
        marginBottom: '60px'
    },
    sectionTitle: {
        fontSize: '28px',
        color: '#333',
        marginBottom: '30px',
        textAlign: 'center'
    },
    stepsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
    },
    step: {
        background: 'white',
        padding: '25px',
        borderRadius: '15px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s'
    },
    stepIcon: {
        fontSize: '40px',
        marginBottom: '10px'
    },
    stepNumber: {
        fontSize: '12px',
        color: '#FF9933',
        fontWeight: 'bold',
        marginBottom: '10px'
    },
    ctaSection: {
        textAlign: 'center',
        background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)',
        padding: '50px',
        borderRadius: '20px',
        color: 'white'
    },
    ctaButtons: {
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        marginTop: '20px',
        flexWrap: 'wrap'
    },
    primaryBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'white',
        color: '#FF9933',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold'
    },
    secondaryBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'transparent',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        border: '2px solid white'
    }
};

export default HowItWorks;