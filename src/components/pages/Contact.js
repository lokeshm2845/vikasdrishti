import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production, send to your backend API
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Contact Us</h1>
                <p style={styles.subtitle}>We'd love to hear from you. Get in touch with us.</p>
            </div>

            <div style={styles.content}>
                {/* Contact Info */}
                <div style={styles.infoSection}>
                    <h2 style={styles.infoTitle}>Get in Touch</h2>
                    
                    <div style={styles.infoItem}>
                        <FaMapMarkerAlt style={styles.infoIcon} />
                        <div>
                            <h4>Visit Us</h4>
                            <p>VikasDrishti Office, New Delhi, India - 110001</p>
                        </div>
                    </div>

                    <div style={styles.infoItem}>
                        <FaPhone style={styles.infoIcon} />
                        <div>
                            <h4>Call Us</h4>
                            <p>+91 11-2345-6789</p>
                            <p>Toll Free: 1800-123-4567</p>
                        </div>
                    </div>

                    <div style={styles.infoItem}>
                        <FaEnvelope style={styles.infoIcon} />
                        <div>
                            <h4>Email Us</h4>
                            <p>support@vikasdrishti.gov.in</p>
                            <p>feedback@vikasdrishti.gov.in</p>
                        </div>
                    </div>

                    <div style={styles.infoItem}>
                        <FaClock style={styles.infoIcon} />
                        <div>
                            <h4>Working Hours</h4>
                            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p>Saturday: 10:00 AM - 4:00 PM</p>
                            <p>Sunday: Closed</p>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div style={styles.socialSection}>
                        <h4 style={styles.socialTitle}>Follow Us</h4>
                        <div style={styles.socialLinks}>
                            <a href="https://github.com/lokeshm2845/vikasdrishti" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <FaGithub size={24} />
                            </a>
                            <a href="https://twitter.com/vikasdrishti" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <FaTwitter size={24} />
                            </a>
                            <a href="https://linkedin.com/company/vikasdrishti" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <FaLinkedin size={24} />
                            </a>
                            <a href="mailto:support@vikasdrishti.gov.in" style={styles.socialLink}>
                                <FaEnvelope size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div style={styles.formSection}>
                    <h2 style={styles.formTitle}>Send us a Message</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            style={styles.textarea}
                            required
                        />
                        <button type="submit" style={styles.button}>
                            Send Message
                        </button>
                        {submitted && <p style={styles.successMsg}>✅ Message sent successfully!</p>}
                    </form>
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
    content: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '50px'
    },
    infoSection: {
        background: '#f8f9fa',
        padding: '30px',
        borderRadius: '20px'
    },
    infoTitle: {
        fontSize: '24px',
        color: '#333',
        marginBottom: '25px'
    },
    infoItem: {
        display: 'flex',
        gap: '15px',
        marginBottom: '25px'
    },
    infoIcon: {
        fontSize: '24px',
        color: '#FF9933',
        marginTop: '5px'
    },
    socialSection: {
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #ddd'
    },
    socialTitle: {
        fontSize: '16px',
        color: '#333',
        marginBottom: '15px'
    },
    socialLinks: {
        display: 'flex',
        gap: '15px'
    },
    socialLink: {
        color: '#666',
        transition: 'color 0.3s'
    },
    formSection: {
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    formTitle: {
        fontSize: '24px',
        color: '#333',
        marginBottom: '25px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    input: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px'
    },
    textarea: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px',
        resize: 'vertical'
    },
    button: {
        padding: '12px',
        background: '#FF9933',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    successMsg: {
        textAlign: 'center',
        color: '#28a745',
        marginTop: '10px'
    }
};

export default Contact;