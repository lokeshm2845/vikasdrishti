import React from 'react';
import { FaBullhorn, FaMapMarkedAlt, FaHandshake, FaChartLine } from 'react-icons/fa';

const About = () => {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>About VikasDrishti</h1>
                <p style={styles.subtitle}>Empowering citizens, enabling leaders, building a better tomorrow</p>
            </div>

            {/* Mission Section */}
            <div style={styles.missionSection}>
                <div style={styles.missionContent}>
                    <h2 style={styles.sectionTitle}>Our Mission</h2>
                    <p style={styles.missionText}>
                        To bridge the gap between citizens and their elected representatives through 
                        technology, ensuring transparency, accountability, and efficient governance.
                    </p>
                </div>
                <div style={styles.visionContent}>
                    <h2 style={styles.sectionTitle}>Our Vision</h2>
                    <p style={styles.visionText}>
                        A India where every citizen feels heard, every leader is accountable, 
                        and every development project is visible to those it serves.
                    </p>
                </div>
            </div>

            {/* Core Values */}
            <div style={styles.valuesSection}>
                <h2 style={styles.sectionTitle}>Our Core Values</h2>
                <div style={styles.valuesGrid}>
                    <div style={styles.valueCard}>
                        <FaBullhorn size={40} color="#FF9933" />
                        <h3>Transparency</h3>
                        <p>Every action is visible and trackable</p>
                    </div>
                    <div style={styles.valueCard}>
                        <FaMapMarkedAlt size={40} color="#FF9933" />
                        <h3>Accountability</h3>
                        <p>Leaders are accountable for their work</p>
                    </div>
                    <div style={styles.valueCard}>
                        <FaHandshake size={40} color="#FF9933" />
                        <h3>Trust</h3>
                        <p>Building trust through proof of work</p>
                    </div>
                    <div style={styles.valueCard}>
                        <FaChartLine size={40} color="#FF9933" />
                        <h3>Growth</h3>
                        <p>Continuous improvement for better governance</p>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div style={styles.teamSection}>
                <h2 style={styles.sectionTitle}>Our Team</h2>
                <div style={styles.teamGrid}>
                    <div style={styles.teamCard}>
                        <div style={styles.avatar}>👨‍💻</div>
                        <h3>Team Vertex Victors </h3>
                        <p>Passionate innovators building for Digital India</p>
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
    missionSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '40px',
        marginBottom: '60px',
        background: 'linear-gradient(135deg, #fff8f0 0%, #fff 100%)',
        padding: '40px',
        borderRadius: '20px'
    },
    sectionTitle: {
        fontSize: '28px',
        color: '#333',
        marginBottom: '20px'
    },
    missionText: {
        fontSize: '16px',
        color: '#666',
        lineHeight: '1.6'
    },
    visionText: {
        fontSize: '16px',
        color: '#666',
        lineHeight: '1.6'
    },
    valuesSection: {
        marginBottom: '60px'
    },
    valuesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '30px',
        marginTop: '30px'
    },
    valueCard: {
        textAlign: 'center',
        padding: '30px',
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    teamSection: {
        textAlign: 'center'
    },
    teamGrid: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '30px'
    },
    teamCard: {
        textAlign: 'center',
        padding: '30px',
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '300px'
    },
    avatar: {
        fontSize: '60px',
        marginBottom: '15px'
    }
};

export default About;