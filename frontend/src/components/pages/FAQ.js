import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaSearch } from 'react-icons/fa';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const faqs = [
        {
            q: "How do I raise a complaint as a citizen?",
            a: "Log in as a citizen, click 'Raise Complaint', type or record your complaint via offline voice AI, attach a 50MP photo proof if available, and submit. The on-device TFLite model automatically categorizes the issue and maps it to your exact gali geofence."
        },
        {
            q: "Does VikasDrishti work offline without an internet connection?",
            a: "Yes! Powered by iQOO 15's local NPU and native IndexedDB storage, all complaints, voice-to-text input, and Bhashini language translations process locally. Once an internet connection is reconnected, background sync automatically uploads pending complaints to Supabase."
        },
        {
            q: "Which regional Indian languages are supported?",
            a: "VikasDrishti supports 100+ Indian regional languages through Bhashini offline translation module, including Hindi, Marathi, Gujarati, Tamil, Telugu, Bengali, and English."
        },
        {
            q: "How does gali-level geofencing work for elected leaders?",
            a: "Leaders can draw polygon boundaries on the interactive Geofence Map. Using our sub-10ms Ray-Casting Point-in-Polygon algorithm, complaints are automatically assigned to the specific ward/gali representative."
        },
        {
            q: "How are resolutions verified?",
            a: "When a leader marks a complaint as 'Resolved', they must attach resolution notes and an optional before/after photo proof. Citizens can rate the resolution quality (1 to 5 stars) and submit feedback."
        },
        {
            q: "Is my personal identity and data secure?",
            a: "Yes. VikasDrishti uses Row-Level Security (RLS) on Supabase PostgreSQL with encrypted local storage. Only authorized ward representatives and department heads can view complaint locations."
        },
        {
            q: "How do leaders send announcements to citizens?",
            a: "Elected MLAs and representatives can use the 'Broadcast SMS' button on the Leader Dashboard to send instant SMS updates to all registered voters within their drawn geofenced ward."
        },
        {
            q: "What hardware is required to run the full AI-Native features?",
            a: "While VikasDrishti is optimized as a phone-first app running on the iQOO 15 (Snapdragon 8 Gen 3), it works seamlessly on any mobile browser, tablet, desktop, or Android Studio emulator."
        },
        {
            q: "Can I upvote existing complaints raised by neighbors in my gali?",
            a: "Yes! On your Citizen Dashboard, you can click the 'Upvote' button on any public neighborhood complaint. Upvoted complaints receive higher priority on the leader's queue."
        },
        {
            q: "How do I register as an elected representative or MLA?",
            a: "Go to the Registration page, select the 'Leader / Representative' tab, fill in your name, contact details, constituency, ward number, and political party, and click Register."
        }
    ];

    const filteredFaqs = faqs.filter(item => 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container} className="animate-fade-in">
            {/* Hero Header */}
            <div style={styles.heroBanner}>
                <h1 style={styles.heroTitle}>Frequently Asked Questions</h1>
                <p style={styles.heroSub}>
                    Find answers to common questions about VikasDrishti's hyper-local governance platform, offline AI, and geofencing.
                </p>

                {/* Search Bar */}
                <div style={styles.searchBox}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search questions or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
            </div>

            {/* Accordion List */}
            <div style={styles.accordionContainer}>
                {filteredFaqs.length === 0 ? (
                    <div style={styles.noResults}>
                        <p>No questions matched your search criteria.</p>
                    </div>
                ) : (
                    filteredFaqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div key={idx} style={styles.faqCard} className="glass-card">
                                <div
                                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                    style={styles.faqHeader}
                                    className="btn-interactive"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FaQuestionCircle color="#FF9933" size={18} />
                                        <h3 style={styles.questionText}>{faq.q}</h3>
                                    </div>
                                    <button style={styles.toggleBtn}>
                                        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>
                                </div>

                                {isOpen && (
                                    <div style={styles.faqBody} className="animate-fade-in">
                                        <p style={styles.answerText}>{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' },
    heroBanner: { textAlign: 'center', padding: '50px 20px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '28px', color: 'white', marginBottom: '40px' },
    heroTitle: { fontSize: '38px', fontWeight: '800', margin: '0 0 12px 0', fontFamily: 'Outfit, sans-serif' },
    heroSub: { fontSize: '15px', color: '#94a3b8', maxWidth: '650px', margin: '0 auto 24px auto', lineHeight: '1.6' },
    searchBox: { position: 'relative', maxWidth: '500px', margin: '0 auto', display: 'flex', alignItems: 'center' },
    searchIcon: { position: 'absolute', left: '16px', color: '#94a3b8' },
    searchInput: { width: '100%', padding: '14px 16px 14px 44px', borderRadius: '16px', border: 'none', fontSize: '14px', outline: 'none', background: 'white', color: '#0f172a', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
    accordionContainer: { display: 'flex', flexDirection: 'column', gap: '14px' },
    faqCard: { background: 'white', borderRadius: '18px', border: '1px solid #f1f5f9', overflow: 'hidden' },
    faqHeader: { padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
    questionText: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 },
    toggleBtn: { background: 'none', border: 'none', color: '#64748b', fontSize: '14px', cursor: 'pointer' },
    faqBody: { padding: '0 24px 20px 54px', borderTop: '1px solid #f8fafc', paddingTop: '14px' },
    answerText: { fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 },
    noResults: { textAlign: 'center', padding: '40px', color: '#94a3b8' }
};

export default FAQ;
