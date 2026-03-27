import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return ( <
        footer style = { styles.footer } >
        <
        div style = { styles.container } > { /* Main Footer Content */ } <
        div style = { styles.mainContent } > { /* About Section */ } <
        div style = { styles.section } >
        <
        h3 style = { styles.sectionTitle } >
        <
        span style = { styles.logoIcon } > < /span> VikasDrishti <
        /h3> <
        p style = { styles.description } >
        A hyper - local governance platform connecting citizens with their leaders
        for transparent and accountable development. <
        /p> <
        div style = { styles.contactInfo } >
        <
        p style = { styles.contactItem } >
        <
        FaEnvelope style = { styles.contactIcon }
        /> support@vikasdrishti.gov.in <
        /p> <
        p style = { styles.contactItem } >
        <
        FaPhone style = { styles.contactIcon }
        /> +91 11-2345-6789 <
        /p> <
        /div> <
        /div>

        { /* Quick Links */ } <
        div style = { styles.section } >
        <
        h3 style = { styles.sectionTitle } > Quick Links < /h3> <
        ul style = { styles.linkList } >
        <
        li style = { styles.linkItem } >
        <
        Link to = "/"
        style = { styles.link } > Home < /Link> <
        /li> <
        li style = { styles.linkItem } >
        <
        Link to = "/about"
        style = { styles.link } > About Us < /Link> <
        /li> <
        li style = { styles.linkItem } >
        <
        Link to = "/how-it-works"
        style = { styles.link } > How It Works < /Link> <
        /li> <
        li style = { styles.linkItem } >

        <div style={styles.socialLinks}>
        <a href="https://github.com/lokeshm2845/vikasdrishti" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
            <FaGithub style={styles.socialIcon} />
        </a>
        <a href="https://twitter.com/vikasdrishti" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
            <FaTwitter style={styles.socialIcon} />
        </a>
        <a href="https://linkedin.com/company/vikasdrishti" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
            <FaLinkedin style={styles.socialIcon} />
        </a>
        <a href="mailto:support@vikasdrishti.gov.in" style={styles.socialLink}>
            <FaEnvelope style={styles.socialIcon} />
        </a>
        </div>
        
        <
        Link to = "/user/raise-complaint"
        style = { styles.link } > Raise Complaint < /Link> <
        /li> <
        li style = { styles.linkItem } >
        <
        Link to = "/user/my-complaints"
        style = { styles.link } > Track Complaints < /Link> <
        /li> <
        li style = { styles.linkItem } >
        <
        Link to = "/register?role=user"
        style = { styles.link } > Register as Citizen < /Link> <
        /li> <
        li style = { styles.linkItem } >
        <
        Link to = "/schemes"
        style = { styles.link } > Government Schemes < /Link> <
        /li> <
        /ul> <
        /div>

        { /* For Leaders */ } <
        div style = { styles.section } >
        <
        h3 style = { styles.sectionTitle } > For Leaders < /h3> <
        ul style = { styles.linkList } >
        <
        li style = { styles.linkItem } >
        <
        Link to = "/leader/map"
        style = { styles.link } > Geofence Map < /Link> <
        /li> <
        li style = { styles.linkItem } >
        <
        Link to = "/leader/complaints"
        style = { styles.link } > Manage Complaints < /Link> <
        /li> <
        li style = { styles.linkItem } >
        <
        Link to = "/leader/send-update"
        style = { styles.link } > Send Updates < /Link> <
        /li> <
        li style = { styles.linkItem } >
        <
        Link to = "/register?role=leader"
        style = { styles.link } > Register as Leader < /Link> <
        /li> <
        /ul> <
        /div> <
        /div>

        { /* Social Links */ } <
        div style = { styles.socialSection } >
        <
        h3 style = { styles.socialTitle } > Follow Us < /h3> <
        div style = { styles.socialLinks } >
        <
        a href = "https://github.com"
        target = "_blank"
        rel = "noopener noreferrer"
        style = { styles.socialLink } >
        <
        FaGithub style = { styles.socialIcon }
        /> <
        /a> <
        a href = "https://twitter.com"
        target = "_blank"
        rel = "noopener noreferrer"
        style = { styles.socialLink } >
        <
        FaTwitter style = { styles.socialIcon }
        /> <
        /a> <
        a href = "https://linkedin.com"
        target = "_blank"
        rel = "noopener noreferrer"
        style = { styles.socialLink } >
        <
        FaLinkedin style = { styles.socialIcon }
        /> <
        /a> <
        a href = "mailto:support@vikasdrishti.gov.in"
        style = { styles.socialLink } >
        <
        FaEnvelope style = { styles.socialIcon }
        /> <
        /a> <
        /div> <
        /div>

        { /* Bottom Bar */ } <
        div style = { styles.bottomBar } >
        <
        p style = { styles.copyright } > ©{ currentYear }
        VikasDrishti.All rights reserved. <
        /p> <
        div style = { styles.bottomLinks } >
        <
        Link to = "/privacy"
        style = { styles.bottomLink } > Privacy Policy < /Link> <
        Link to = "/terms"
        style = { styles.bottomLink } > Terms of Service < /Link> <
        Link to = "/accessibility"
        style = { styles.bottomLink } > Accessibility < /Link> <
        Link to = "/sitemap"
        style = { styles.bottomLink } > Sitemap < /Link> <
        /div> <
        p style = { styles.madeWith } >
        Made with < FaHeart style = { styles.heartIcon }
        /> for Digital India <
        /p> <
        /div> <
        /div> <
        /footer>
    );
};

const styles = {
    footer: {
        background: '#1a1a1a',
        color: '#f0f0f0',
        padding: '50px 0 20px',
        marginTop: '50px',
        fontFamily: 'Arial, sans-serif'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '30px',
        marginBottom: '40px'
    },
    section: {
        textAlign: 'left'
    },
    sectionTitle: {
        color: '#FF9933',
        fontSize: '18px',
        marginBottom: '20px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    logoIcon: {
        fontSize: '24px'
    },
    description: {
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#ccc',
        marginBottom: '20px'
    },
    contactInfo: {
        marginTop: '15px'
    },
    contactItem: {
        fontSize: '13px',
        color: '#ccc',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    contactIcon: {
        color: '#FF9933',
        fontSize: '14px'
    },
    linkList: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    linkItem: {
        marginBottom: '12px'
    },
    link: {
        color: '#ccc',
        textDecoration: 'none',
        fontSize: '14px',
        transition: 'color 0.3s',
        ':hover': {
            color: '#FF9933'
        }
    },
    socialSection: {
        textAlign: 'center',
        padding: '30px 0',
        borderTop: '1px solid #333',
        borderBottom: '1px solid #333',
        marginBottom: '20px'
    },
    socialTitle: {
        color: '#f0f0f0',
        fontSize: '16px',
        marginBottom: '15px'
    },
    socialLinks: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px'
    },
    socialLink: {
        color: '#ccc',
        fontSize: '24px',
        transition: 'color 0.3s, transform 0.3s',
        ':hover': {
            color: '#FF9933',
            transform: 'translateY(-3px)'
        }
    },
    socialIcon: {
        fontSize: '24px'
    },
    bottomBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        padding: '20px 0',
        fontSize: '13px',
        color: '#999'
    },
    copyright: {
        margin: 0
    },
    bottomLinks: {
        display: 'flex',
        gap: '20px'
    },
    bottomLink: {
        color: '#999',
        textDecoration: 'none',
        fontSize: '12px',
        transition: 'color 0.3s',
        ':hover': {
            color: '#FF9933'
        }
    },
    madeWith: {
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    heartIcon: {
        color: '#FF9933',
        fontSize: '12px',
        animation: 'heartbeat 1.5s infinite'
    },

    // Media queries
    '@media (max-width: 768px)': {
        mainContent: {
            gridTemplateColumns: 'repeat(2, 1fr)'
        },
        bottomBar: {
            flexDirection: 'column',
            textAlign: 'center'
        },
        bottomLinks: {
            flexWrap: 'wrap',
            justifyContent: 'center'
        }
    },
    '@media (max-width: 480px)': {
        mainContent: {
            gridTemplateColumns: '1fr'
        }
    }
};

// Add heartbeat animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes heartbeat {
        0% { transform: scale(1); }
        25% { transform: scale(1.1); }
        50% { transform: scale(1); }
        75% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(styleSheet);

export default Footer;