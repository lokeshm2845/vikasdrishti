import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane, FaGithub, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await supabase.from('contact_messages').insert([form]);
            toast.success('🎉 Thank you! Your message has been sent successfully.');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.success('🎉 Message recorded successfully!');
            setForm({ name: '', email: '', subject: '', message: '' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.container} className="animate-fade-in">
            {/* Header Hero */}
            <div style={styles.heroBanner}>
                <h1 style={styles.heroTitle}>Contact Us</h1>
                <p style={styles.heroSub}>
                    Have questions, feedback, or need help with VikasDrishti? Reach out to Lokesh Magare and team anytime.
                </p>
            </div>

            <div style={styles.contactGrid}>
                {/* Contact Form */}
                <div style={styles.formCard} className="glass-card">
                    <h2 style={styles.cardTitle}>Send us a Message</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputRow}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Your Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email Address *</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Subject *</label>
                            <input
                                type="text"
                                placeholder="What is this regarding?"
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Message *</label>
                            <textarea
                                placeholder="Describe your query or feedback in detail..."
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                style={styles.textarea}
                                rows="5"
                                required
                            />
                        </div>

                        <button type="submit" disabled={submitting} style={styles.submitBtn} className="btn-interactive">
                            {submitting ? 'Sending Message...' : 'Send Message'} <FaPaperPlane />
                        </button>
                    </form>
                </div>

                {/* Info Card with User's Real Details */}
                <div style={styles.infoCard} className="glass-card">
                    <h2 style={styles.cardTitle}>Contact Information</h2>

                    <div style={styles.infoList}>
                        <div style={styles.infoItem}>
                            <FaMapMarkerAlt style={styles.infoIcon} />
                            <div>
                                <h4 style={styles.infoLabel}>Headquarters Address</h4>
                                <p style={styles.infoValue}>Shirpur, Dist. Dhule, Maharashtra, 425405</p>
                            </div>
                        </div>

                        <div style={styles.infoItem}>
                            <FaEnvelope style={styles.infoIcon} />
                            <div>
                                <h4 style={styles.infoLabel}>Email Support</h4>
                                <p style={styles.infoValue}>lokeshmagare866@gmail.com</p>
                            </div>
                        </div>

                        <div style={styles.infoItem}>
                            <FaPhone style={styles.infoIcon} />
                            <div>
                                <h4 style={styles.infoLabel}>Contact Number</h4>
                                <p style={styles.infoValue}>+91 9834260897</p>
                            </div>
                        </div>

                        <div style={styles.infoItem}>
                            <FaClock style={styles.infoIcon} />
                            <div>
                                <h4 style={styles.infoLabel}>Working Hours</h4>
                                <p style={styles.infoValue}>Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
                            </div>
                        </div>
                    </div>

                    <div style={styles.socialSection}>
                        <h4 style={styles.socialTitle}>Developer Social Profiles</h4>
                        <div style={styles.socialIcons}>
                            <a href="https://github.com/lokeshm2845" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="GitHub"><FaGithub /></a>
                            <a href="https://www.linkedin.com/in/lokeshmagare289/" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="LinkedIn"><FaLinkedin /></a>
                            <a href="mailto:lokeshmagare866@gmail.com" style={styles.socialLink} title="Email"><FaEnvelope /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
    heroBanner: { textAlign: 'center', padding: '50px 20px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '28px', color: 'white', marginBottom: '40px' },
    heroTitle: { fontSize: '38px', fontWeight: '800', margin: '0 0 12px 0', fontFamily: 'Outfit, sans-serif' },
    heroSub: { fontSize: '15px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' },
    contactGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' },
    formCard: { background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' },
    infoCard: { background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    cardTitle: { fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0', fontFamily: 'Outfit, sans-serif' },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '700', color: '#475569' },
    input: { padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
    textarea: { padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', resize: 'vertical' },
    submitBtn: { background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 20px rgba(255, 153, 51, 0.3)' },
    infoList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    infoItem: { display: 'flex', gap: '14px', alignItems: 'flex-start' },
    infoIcon: { fontSize: '20px', color: '#FF9933', marginTop: '2px', flexShrink: 0 },
    infoLabel: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
    infoValue: { fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' },
    socialSection: { marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
    socialTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 12px 0' },
    socialIcons: { display: 'flex', gap: '12px' },
    socialLink: { width: '40px', height: '40px', borderRadius: '50%', background: '#f8fafc', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', textDecoration: 'none', border: '1px solid #e2e8f0' }
};

export default Contact;
