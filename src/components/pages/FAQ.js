import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What is VikasDrishti?",
            answer: "VikasDrishti is a hyper-local governance platform that connects citizens with their elected representatives (MLAs, MPs, Councilors) for transparent and accountable governance."
        },
        {
            question: "How do I register as a citizen?",
            answer: "Click on 'Register' button on the homepage, select 'Citizen' role, fill in your details (name, email, phone, address), and click Register."
        },
        {
            question: "How do I register as a leader?",
            answer: "Click on 'Register' button, select 'Leader/MLA' role, fill in your details including title, constituency, and party, then register."
        },
        {
            question: "How do I raise a complaint?",
            answer: "Login as a citizen, go to 'Raise Complaint' from your dashboard, fill in the details, upload a photo, and submit. You'll receive SMS updates on status."
        },
        {
            question: "How does geofencing work?",
            answer: "Leaders can draw a polygon on the map to select a specific area. The system then finds all voters in that area and allows the leader to send targeted updates."
        },
        {
            question: "What languages are supported?",
            answer: "VikasDrishti supports Hindi, English, Punjabi, Bengali, and Telugu. Messages are auto-translated to the user's preferred language."
        },
        {
            question: "Is VikasDrishti free?",
            answer: "Yes! VikasDrishti is completely free for both citizens and leaders."
        },
        {
            question: "How do I track my complaint status?",
            answer: "Login to your account, go to 'My Complaints' section. You'll see the status (Pending, In Progress, Resolved) and can click to view details."
        },
        {
            question: "Will I receive SMS notifications?",
            answer: "Yes, you'll receive SMS updates when your complaint status changes or when your leader sends an update about projects in your area."
        },
        {
            question: "How can leaders send updates?",
            answer: "Leaders can draw a geofence, find voters in that area, enter project details, and send personalized updates with before/after photos."
        }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Frequently Asked Questions</h1>
                <p style={styles.subtitle}>Find answers to common questions about VikasDrishti</p>
            </div>

            <div style={styles.faqContainer}>
                {faqs.map((faq, index) => (
                    <div key={index} style={styles.faqItem}>
                        <div 
                            style={styles.question} 
                            onClick={() => toggleFAQ(index)}
                        >
                            <h3>{faq.question}</h3>
                            <span style={styles.icon}>
                                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                        </div>
                        {openIndex === index && (
                            <div style={styles.answer}>
                                <p>{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div style={styles.contactSection}>
                <h3>Still have questions?</h3>
                <p>Contact our support team for further assistance.</p>
                <a href="/contact" style={styles.contactBtn}>Contact Us</a>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
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
    faqContainer: {
        marginBottom: '50px'
    },
    faqItem: {
        marginBottom: '15px',
        border: '1px solid #eee',
        borderRadius: '10px',
        overflow: 'hidden'
    },
    question: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        background: '#f8f9fa',
        cursor: 'pointer',
        transition: 'background 0.3s'
    },
    icon: {
        color: '#FF9933'
    },
    answer: {
        padding: '20px',
        background: 'white',
        borderTop: '1px solid #eee'
    },
    contactSection: {
        textAlign: 'center',
        padding: '40px',
        background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)',
        borderRadius: '20px',
        color: 'white'
    },
    contactBtn: {
        display: 'inline-block',
        marginTop: '20px',
        padding: '12px 30px',
        background: 'white',
        color: '#FF9933',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: 'bold'
    }
};

export default FAQ;