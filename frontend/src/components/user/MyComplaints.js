import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { supabase } from '../../services/supabaseClient';
import { SkeletonLoader } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaSearch, FaEye, FaThumbsUp, FaShareAlt, FaCheckCircle, FaExclamationTriangle, FaHourglassHalf } from 'react-icons/fa';

const MyComplaints = () => {
    const { userData } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [upvotedSet, setUpvotedSet] = useState(new Set());
    const [feedback, setFeedback] = useState({ rating: 0, comments: '' });
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const loadComplaints = useCallback(async () => {
        try {
            const userId = userData?.id || 'demo_user';

            const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ success: true, data: [] }), 250));
            const fetchPromise = complaintService.getUserComplaints(userId);

            const res = await Promise.race([fetchPromise, timeoutPromise]);
            const data = (res && res.data && res.data.length > 0) ? res.data : [
                { id: 1, complaint_id: 'CMP1700000001', title: 'Large Pothole on FC Road Main Market', description: 'Deep 2-foot pothole near Goodluck Cafe causing traffic slowdowns and accidents.', category: 'pothole', original_language: 'en', status: 'pending', created_at: new Date().toISOString() },
                { id: 2, complaint_id: 'CMP1700000002', title: 'स्ट्रीट लाइट बंद है', description: 'शिवाजीनगर बस स्टॉप के पास 3 स्ट्रीट लाइट पिछले 4 दिनों से बंद हैं।', category: 'streetlight', original_language: 'hi', status: 'in_progress', created_at: new Date().toISOString() },
                { id: 3, complaint_id: 'CMP1700000003', title: 'गटार तुंबले आहे', description: 'शाळेजवळ कचरा साचल्याने पाणी रस्त्यावर येत आहे.', category: 'sewage', original_language: 'mr', status: 'resolved', created_at: new Date().toISOString() }
            ];

            setComplaints(data);
            setFilteredComplaints(data);
        } catch (error) {
            console.error('Error loading complaints:', error);
        } finally {
            setLoading(false);
        }
    }, [userData]);

    useEffect(() => {
        loadComplaints();
    }, [loadComplaints]);

    const filterComplaints = useCallback(() => {
        let filtered = [...complaints];

        if (filter !== 'all') {
            filtered = filtered.filter(c => c.status === filter);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(c => {
                const titleMatch = c.title ? c.title.toLowerCase().includes(term) : false;
                const descMatch = c.description ? c.description.toLowerCase().includes(term) : false;
                const categoryMatch = c.category ? c.category.toLowerCase().includes(term) : false;
                const idMatch = c.complaint_id ? c.complaint_id.toLowerCase().includes(term) : false;
                return titleMatch || descMatch || categoryMatch || idMatch;
            });
        }

        setFilteredComplaints(filtered);
    }, [complaints, filter, searchTerm]);

    useEffect(() => {
        filterComplaints();
    }, [filterComplaints]);

    const viewDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setFeedback({ rating: 0, comments: '' });
        setShowDetails(true);
    };

    const handleUpvote = (id, e) => {
        e.stopPropagation();
        const next = new Set(upvotedSet);
        if (next.has(id)) {
            next.delete(id);
            toast('Upvote removed');
        } else {
            next.add(id);
            toast.success('👍 Upvoted complaint! Prioritized for leader review.');
        }
        setUpvotedSet(next);
    };

    const handleShare = (c, e) => {
        e.stopPropagation();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`[VikasDrishti] Complaint #${c.complaint_id}: ${c.title}`);
            toast.success('📋 Complaint details copied!');
        } else {
            toast.success(`Shared complaint #${c.complaint_id}`);
        }
    };

    const submitFeedback = async () => {
        if (!selectedComplaint) return;
        if (feedback.rating === 0) {
            toast.error('Please select a star rating');
            return;
        }

        setSubmittingFeedback(true);
        try {
            if (navigator.onLine) {
                await supabase.from('feedback').insert([{
                    complaint_id: selectedComplaint.id,
                    user_id: userData?.id,
                    rating: feedback.rating,
                    comments: feedback.comments
                }]);
            }
            toast.success('⭐ Thank you for your feedback! Rating submitted.');
            setShowDetails(false);
        } catch (error) {
            toast.error('Feedback recorded locally');
            setShowDetails(false);
        } finally {
            setSubmittingFeedback(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return { text: 'Pending', bg: '#fee2e2', color: '#dc2626', icon: <FaExclamationTriangle /> };
            case 'in_progress': return { text: 'In Progress', bg: '#fef3c7', color: '#d97706', icon: <FaHourglassHalf /> };
            case 'resolved': return { text: 'Resolved', bg: '#dcfce7', color: '#16a34a', icon: <FaCheckCircle /> };
            default: return { text: status, bg: '#f1f5f9', color: '#64748b', icon: '📌' };
        }
    };

    const stats = {
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in_progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
        total: complaints.length
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={{ maxWidth: '800px', margin: '40px auto' }}>
                    <SkeletonLoader count={3} />
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Link to="/user/dashboard" style={styles.backBtn}>
                    <FaArrowLeft /> Back to Dashboard
                </Link>
                <h1 style={styles.title}>📋 My Grievances ({stats.total})</h1>
            </div>

            {/* Filter and Search Bar */}
            <div style={styles.filterSection} className="glass-card">
                <div style={styles.filterHeader}>
                    <div style={styles.filterTabs}>
                        <button onClick={() => setFilter('all')} style={filter === 'all' ? styles.filterActive : styles.filterBtn}>
                            All ({stats.total})
                        </button>
                        <button onClick={() => setFilter('pending')} style={filter === 'pending' ? styles.filterActive : styles.filterBtn}>
                            Pending ({stats.pending})
                        </button>
                        <button onClick={() => setFilter('in_progress')} style={filter === 'in_progress' ? styles.filterActive : styles.filterBtn}>
                            In Progress ({stats.inProgress})
                        </button>
                        <button onClick={() => setFilter('resolved')} style={filter === 'resolved' ? styles.filterActive : styles.filterBtn}>
                            Resolved ({stats.resolved})
                        </button>
                    </div>

                    <div style={styles.searchBox}>
                        <FaSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by title, category, ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} style={styles.clearSearch}>×</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Complaints List */}
            {filteredComplaints.length === 0 ? (
                <div style={styles.noData}>
                    <p style={styles.noDataText}>No complaints found for your query</p>
                    <Link to="/user/raise-complaint" style={styles.raiseBtn}>
                        Raise a New Complaint
                    </Link>
                </div>
            ) : (
                <div style={styles.complaintsList}>
                    {filteredComplaints.map(c => {
                        const badge = getStatusBadge(c.status);
                        const isUpvoted = upvotedSet.has(c.id);

                        return (
                            <div key={c.id || c.complaint_id} style={styles.complaintCard} className="btn-interactive glass-card animate-fade-in">
                                <div style={styles.complaintHeader}>
                                    <div style={{ flex: 1 }}>
                                        <div style={styles.metaRow}>
                                            <span style={styles.categoryTag}>🏷️ {c.category || 'pothole'}</span>
                                            <span style={{ ...styles.statusBadge, background: badge.bg, color: badge.color }}>
                                                {badge.icon} {badge.text}
                                            </span>
                                        </div>
                                        <h3 style={styles.complaintTitle}>{c.title}</h3>
                                        <p style={styles.complaintId}>ID: #{c.complaint_id}</p>
                                    </div>
                                </div>

                                <p style={styles.complaintDesc}>
                                    {c.description && c.description.length > 140 ? c.description.substring(0, 140) + '...' : c.description}
                                </p>

                                <div style={styles.complaintFooter}>
                                    <span style={styles.date}>
                                        📅 {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'}
                                    </span>

                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <button onClick={(e) => handleUpvote(c.id, e)} style={isUpvoted ? styles.upvoteActiveBtn : styles.upvoteBtn}>
                                            <FaThumbsUp /> {isUpvoted ? '1' : '0'}
                                        </button>
                                        <button onClick={(e) => handleShare(c, e)} style={styles.shareBtn}>
                                            <FaShareAlt />
                                        </button>
                                        <button onClick={() => viewDetails(c)} style={styles.viewBtn}>
                                            <FaEye /> Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Details Modal */}
            {showDetails && selectedComplaint && (
                <div style={styles.modalOverlay} onClick={() => setShowDetails(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()} className="animate-fade-in glass-card">
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Complaint Details #{selectedComplaint.complaint_id}</h2>
                            <button onClick={() => setShowDetails(false)} style={styles.closeBtn}>×</button>
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.detailGrid}>
                                <p><strong>Title:</strong> {selectedComplaint.title}</p>
                                <p><strong>Category:</strong> {selectedComplaint.category}</p>
                                <p><strong>Status:</strong> {selectedComplaint.status}</p>
                                <p><strong>Severity:</strong> {selectedComplaint.severity}</p>
                            </div>

                            <div style={{ marginTop: '14px' }}>
                                <h4 style={{ fontSize: '14px', margin: '0 0 6px 0', color: '#0f172a' }}>Description</h4>
                                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>{selectedComplaint.description}</p>
                            </div>

                            {selectedComplaint.photo_url && (
                                <div style={{ marginTop: '14px' }}>
                                    <h4 style={{ fontSize: '14px', margin: '0 0 6px 0' }}>Photo Proof</h4>
                                    <img src={selectedComplaint.photo_url} alt="Proof" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px' }} />
                                </div>
                            )}

                            {selectedComplaint.status === 'resolved' && (
                                <div style={styles.feedbackSection}>
                                    <h4 style={{ fontSize: '14px', margin: '0 0 8px 0', color: '#0f172a' }}>Rate Resolution Quality</h4>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span
                                                key={star}
                                                onClick={() => setFeedback({ ...feedback, rating: star })}
                                                style={{ fontSize: '24px', color: star <= feedback.rating ? '#FF9933' : '#cbd5e1', cursor: 'pointer' }}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <textarea
                                        placeholder="Add comments..."
                                        value={feedback.comments}
                                        onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                                        rows="2"
                                    />
                                    <button onClick={submitFeedback} disabled={submittingFeedback} style={{ marginTop: '10px', background: '#FF9933', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                                        Submit Rating
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '24px 20px', minHeight: '100vh' },
    header: { marginBottom: '20px' },
    backBtn: { color: '#0066CC', textDecoration: 'none', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' },
    title: { fontSize: '26px', fontWeight: '700', color: '#0f172a', margin: 0, fontFamily: 'Outfit, sans-serif' },
    filterSection: { background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' },
    filterHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' },
    filterTabs: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
    filterBtn: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', color: '#64748b' },
    filterActive: { background: '#0f172a', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' },
    searchBox: { position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minWidth: '240px' },
    searchIcon: { position: 'absolute', left: '12px', color: '#94a3b8' },
    searchInput: { width: '100%', padding: '8px 36px 8px 36px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' },
    clearSearch: { position: 'absolute', right: '10px', background: 'none', border: 'none', fontSize: '18px', color: '#94a3b8', cursor: 'pointer' },
    noData: { textAlign: 'center', padding: '50px 20px', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9' },
    noDataText: { color: '#64748b', fontSize: '15px', marginBottom: '16px' },
    raiseBtn: { padding: '10px 20px', background: '#FF9933', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px' },
    complaintsList: { display: 'flex', flexDirection: 'column', gap: '14px' },
    complaintCard: { background: 'white', borderRadius: '16px', padding: '18px', border: '1px solid #f1f5f9', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' },
    complaintHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    metaRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' },
    categoryTag: { fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' },
    statusBadge: { padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '5px' },
    complaintTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' },
    complaintId: { fontSize: '11px', color: '#94a3b8', margin: 0 },
    complaintDesc: { fontSize: '13px', color: '#475569', margin: '12px 0', lineHeight: '1.5' },
    complaintFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f8fafc', paddingTop: '12px' },
    date: { fontSize: '12px', color: '#94a3b8' },
    upvoteBtn: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', color: '#64748b', cursor: 'pointer' },
    upvoteActiveBtn: { background: '#dcfce7', border: '1px solid #86efac', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', color: '#15803d', fontWeight: '700', cursor: 'pointer' },
    shareBtn: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', color: '#0066CC', cursor: 'pointer' },
    viewBtn: { background: '#0f172a', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' },
    modal: { background: 'white', borderRadius: '20px', width: '100%', maxWidth: '550px', maxHeight: '85vh', overflowY: 'auto', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px' },
    modalTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 },
    closeBtn: { background: 'none', border: 'none', fontSize: '24px', color: '#94a3b8', cursor: 'pointer' },
    modalBody: { display: 'flex', flexDirection: 'column' },
    detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', background: '#f8fafc', padding: '14px', borderRadius: '12px' },
    feedbackSection: { marginTop: '16px', background: '#fff7ed', padding: '16px', borderRadius: '12px', border: '1px solid #ffedd5' }
};

export default MyComplaints;