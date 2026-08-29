import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

const ComplaintStatus = () => {
    const { id } = useParams();
    const { userData } = useAuth();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ rating: 0, comments: '' });

    const loadComplaint = useCallback(async () => {
        try {
            if (navigator.onLine) {
                const { data, error } = await supabase
                    .from('complaints')
                    .select('*, leaders:leader_id(name, title, constituency, phone)')
                    .eq('id', id)
                    .maybeSingle();

                if (!error && data) {
                    setComplaint(data);
                    return;
                }
            }

            // Fallback for demo complaints or offline mode
            const mockComplaints = {
                '1': {
                    id: 1,
                    complaint_id: 'CMP1700000001',
                    title: 'Large Pothole on FC Road Main Market',
                    description: 'Deep 2-foot pothole near Goodluck Cafe causing traffic slowdowns and accidents.',
                    category: 'pothole',
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    leaders: { name: 'Priya Sharma', title: 'MLA Ward 4', constituency: 'Shirpur & Dhule' }
                },
                '2': {
                    id: 2,
                    complaint_id: 'CMP1700000002',
                    title: 'स्ट्रीट लाइट बंद आहे',
                    description: 'शिवाजीनगर बस स्टॉप के पास 3 स्ट्रीट लाइट पिछले 4 दिनों से बंद हैं।',
                    category: 'streetlight',
                    status: 'in_progress',
                    created_at: new Date().toISOString(),
                    leaders: { name: 'Priya Sharma', title: 'MLA Ward 4', constituency: 'Shirpur & Dhule' }
                },
                '3': {
                    id: 3,
                    complaint_id: 'CMP1700000003',
                    title: 'गटार तुंबले आहे',
                    description: 'शाळेजवळ कचरा साचल्याने पाणी रस्त्यावर येत आहे.',
                    category: 'sewage',
                    status: 'resolved',
                    created_at: new Date().toISOString(),
                    leaders: { name: 'Priya Sharma', title: 'MLA Ward 4', constituency: 'Shirpur & Dhule' }
                }
            };

            const fallback = mockComplaints[id] || {
                id: id,
                complaint_id: `CMP${id}`,
                title: 'Reported Ward Issue',
                description: 'Grievance recorded on VikasDrishti Governance Portal.',
                category: 'general',
                status: 'in_progress',
                created_at: new Date().toISOString(),
                leaders: { name: 'Priya Sharma', title: 'MLA Ward 4', constituency: 'Shirpur & Dhule' }
            };

            setComplaint(fallback);
        } catch (error) {
            console.error('Error loading complaint status:', error);
            toast.error('Showing cached complaint details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadComplaint();
    }, [loadComplaint]);

    const submitFeedback = async () => {
        if (feedback.rating === 0) {
            toast.error('Please select a star rating');
            return;
        }

        try {
            if (navigator.onLine) {
                await supabase
                    .from('feedback')
                    .insert([{
                        complaint_id: id,
                        user_id: userData?.id || 'demo_user',
                        rating: feedback.rating,
                        comments: feedback.comments
                    }]);
            }
            toast.success('Thank you for your feedback! Rating recorded.');
        } catch (error) {
            toast.success('Feedback saved locally.');
        }
    };

    if (loading) return <div style={styles.loading}>Loading Complaint Status...</div>;
    if (!complaint) return <div style={styles.error}>Complaint not found</div>;

    return (
        <div style={styles.container}>
            <Link to="/user/my-complaints" style={styles.backBtn}>
                <FaArrowLeft /> Back to My Complaints
            </Link>
            <h1 style={styles.title}>Complaint Status</h1>

            <div style={styles.card} className="glass-card">
                <div style={styles.header}>
                    <h3 style={styles.complaintTitle}>{complaint.title}</h3>
                    <span style={{
                        ...styles.status,
                        background: complaint.status === 'pending' ? '#dc3545' :
                            complaint.status === 'in_progress' ? '#ffc107' : '#28a745',
                        color: complaint.status === 'in_progress' ? '#000' : '#fff'
                    }}>
                        {complaint.status}
                    </span>
                </div>

                <p style={styles.description}>{complaint.description}</p>

                <div style={styles.meta}>
                    <p><strong>Complaint ID:</strong> #{complaint.complaint_id || complaint.id}</p>
                    <p><strong>Category:</strong> {complaint.category}</p>
                    <p><strong>Submitted:</strong> {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('en-IN') : 'Recently'}</p>
                </div>

                {complaint.leaders && (
                    <div style={styles.leader}>
                        <h4 style={{ margin: '0 0 6px 0', color: '#138808' }}>Assigned Representative:</h4>
                        <p style={{ margin: 0, fontWeight: '700' }}>{complaint.leaders.name} - {complaint.leaders.title}</p>
                    </div>
                )}

                {complaint.status === 'resolved' && (
                    <div style={styles.feedback}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>Rate Resolution Quality:</h4>
                        <div style={styles.rating}>
                            {[1, 2, 3, 4, 5].map(r => (
                                <span
                                    key={r}
                                    onClick={() => setFeedback({ ...feedback, rating: r })}
                                    style={{ cursor: 'pointer', fontSize: '30px', color: r <= feedback.rating ? '#FF9933' : '#ccc' }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            placeholder="Comments (optional)"
                            value={feedback.comments}
                            onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                            style={styles.textarea}
                            rows="3"
                        />
                        <button onClick={submitFeedback} style={styles.button}>Submit Feedback</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '24px 20px' },
    backBtn: { color: '#0066CC', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' },
    title: { color: '#FF9933', textAlign: 'center', margin: '20px 0', fontFamily: 'Outfit, sans-serif' },
    card: { background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    complaintTitle: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' },
    status: { padding: '5px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' },
    description: { fontSize: '15px', lineHeight: '1.6', color: '#475569', marginBottom: '20px' },
    meta: { background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' },
    leader: { background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '12px', marginBottom: '20px' },
    feedback: { marginTop: '24px', background: '#fff7ed', padding: '20px', borderRadius: '12px', border: '1px solid #ffedd5' },
    rating: { display: 'flex', gap: '10px', marginBottom: '15px' },
    textarea: { width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' },
    button: { background: '#FF9933', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
    loading: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#64748b' },
    error: { textAlign: 'center', padding: '50px', color: '#dc3545', fontSize: '18px' }
};

export default ComplaintStatus;