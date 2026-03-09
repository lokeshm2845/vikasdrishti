import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaSearch, FaEye, FaStar, FaFilter } from 'react-icons/fa';

const MyComplaints = () => {
    const { userData } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [feedback, setFeedback] = useState({
        rating: 0,
        comments: ''
    });
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    useEffect(() => {
        loadComplaints();
    }, []);

    useEffect(() => {
        filterComplaints();
    }, [complaints, filter, searchTerm]);

    const loadComplaints = async () => {
        if (!userData) return;
        
        try {
            const { data, error } = await supabase
                .from('complaints')
                .select(`
                    *,
                    leaders:leader_id (name, title, constituency, phone)
                `)
                .eq('user_id', userData.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            setComplaints(data || []);
            setFilteredComplaints(data || []);
        } catch (error) {
            console.error('Error loading complaints:', error);
            toast.error('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    const filterComplaints = () => {
        let filtered = [...complaints];

        // Apply status filter
        if (filter !== 'all') {
            filtered = filtered.filter(c => c.status === filter);
        }

        // Apply search filter - FIXED: Removed optional chaining
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(c => {
                const titleMatch = c.title ? c.title.toLowerCase().includes(term) : false;
                const descMatch = c.description ? c.description.toLowerCase().includes(term) : false;
                const categoryMatch = c.category ? c.category.toLowerCase().includes(term) : false;
                const idMatch = c.complaint_id ? c.complaint_id.toLowerCase().includes(term) : false;
                const leaderMatch = c.leaders && c.leaders.name ? c.leaders.name.toLowerCase().includes(term) : false;
                
                return titleMatch || descMatch || categoryMatch || idMatch || leaderMatch;
            });
        }

        setFilteredComplaints(filtered);
    };

    const viewDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setFeedback({ rating: 0, comments: '' });
        setShowDetails(true);
    };

    const submitFeedback = async () => {
        if (!selectedComplaint) return;
        
        if (feedback.rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setSubmittingFeedback(true);

        try {
            // Check if feedback already exists
            const { data: existingFeedback } = await supabase
                .from('feedback')
                .select('id')
                .eq('complaint_id', selectedComplaint.id)
                .eq('user_id', userData.id)
                .maybeSingle();

            if (existingFeedback) {
                // Update existing feedback
                const { error } = await supabase
                    .from('feedback')
                    .update({
                        rating: feedback.rating,
                        comments: feedback.comments,
                        updated_at: new Date()
                    })
                    .eq('id', existingFeedback.id);

                if (error) throw error;
                toast.success('Feedback updated successfully!');
            } else {
                // Insert new feedback
                const { error } = await supabase
                    .from('feedback')
                    .insert([{
                        complaint_id: selectedComplaint.id,
                        user_id: userData.id,
                        rating: feedback.rating,
                        comments: feedback.comments
                    }]);

                if (error) throw error;
                toast.success('Thank you for your feedback!');
            }

            setShowDetails(false);
            loadComplaints(); // Reload to update status
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Failed to submit feedback');
        } finally {
            setSubmittingFeedback(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return '#dc3545';
            case 'in_progress': return '#ffc107';
            case 'resolved': return '#28a745';
            default: return '#6c757d';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'pending': return 'Pending';
            case 'in_progress': return 'In Progress';
            case 'resolved': return 'Resolved';
            default: return status;
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'pending': return '⏳';
            case 'in_progress': return '🔄';
            case 'resolved': return '✅';
            default: return '📌';
        }
    };

    const getSeverityColor = (severity) => {
        switch(severity) {
            case 'high': return '#dc3545';
            case 'medium': return '#ffc107';
            case 'low': return '#28a745';
            default: return '#6c757d';
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
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading your complaints...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <Link to="/user/dashboard" style={styles.backBtn}>
                    <FaArrowLeft /> Back to Dashboard
                </Link>
                <h1 style={styles.title}>My Complaints</h1>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <div style={{...styles.statCard, borderLeft: '4px solid #dc3545'}}>
                    <div style={styles.statValue}>{stats.pending}</div>
                    <div style={styles.statLabel}>Pending</div>
                    <div style={styles.statIcon}>⏳</div>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #ffc107'}}>
                    <div style={styles.statValue}>{stats.inProgress}</div>
                    <div style={styles.statLabel}>In Progress</div>
                    <div style={styles.statIcon}>🔄</div>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #28a745'}}>
                    <div style={styles.statValue}>{stats.resolved}</div>
                    <div style={styles.statLabel}>Resolved</div>
                    <div style={styles.statIcon}>✅</div>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #FF9933'}}>
                    <div style={styles.statValue}>{stats.total}</div>
                    <div style={styles.statLabel}>Total</div>
                    <div style={styles.statIcon}>📊</div>
                </div>
            </div>

            {/* Filters and Search */}
            <div style={styles.filterSection}>
                <div style={styles.filterHeader}>
                    <FaFilter style={styles.filterIcon} />
                    <span style={styles.filterTitle}>Filter by Status:</span>
                </div>
                <div style={styles.filterTabs}>
                    <button 
                        onClick={() => setFilter('all')}
                        style={filter === 'all' ? styles.filterActive : styles.filterBtn}
                    >
                        All ({complaints.length})
                    </button>
                    <button 
                        onClick={() => setFilter('pending')}
                        style={filter === 'pending' ? styles.filterActive : styles.filterBtn}
                    >
                        Pending ({stats.pending})
                    </button>
                    <button 
                        onClick={() => setFilter('in_progress')}
                        style={filter === 'in_progress' ? styles.filterActive : styles.filterBtn}
                    >
                        In Progress ({stats.inProgress})
                    </button>
                    <button 
                        onClick={() => setFilter('resolved')}
                        style={filter === 'resolved' ? styles.filterActive : styles.filterBtn}
                    >
                        Resolved ({stats.resolved})
                    </button>
                </div>

                <div style={styles.searchBox}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by title, description, ID, or leader name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            style={styles.clearSearch}
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Complaints List */}
            {filteredComplaints.length === 0 ? (
                <div style={styles.noData}>
                    <p style={styles.noDataText}>No complaints found</p>
                    {complaints.length === 0 ? (
                        <Link to="/user/raise-complaint" style={styles.raiseBtn}>
                            Raise Your First Complaint
                        </Link>
                    ) : (
                        <button onClick={() => setSearchTerm('')} style={styles.clearBtn}>
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <div style={styles.complaintsList}>
                    {filteredComplaints.map(complaint => (
                        <div key={complaint.id} style={styles.complaintCard}>
                            <div style={styles.complaintHeader}>
                                <div style={styles.complaintTitleSection}>
                                    <h3 style={styles.complaintTitle}>{complaint.title}</h3>
                                    <p style={styles.complaintId}>ID: {complaint.complaint_id}</p>
                                </div>
                                <span style={{
                                    ...styles.statusBadge,
                                    background: getStatusColor(complaint.status)
                                }}>
                                    {getStatusIcon(complaint.status)} {getStatusText(complaint.status)}
                                </span>
                            </div>

                            <p style={styles.complaintDesc}>
                                {complaint.description && complaint.description.length > 150 
                                    ? complaint.description.substring(0, 150) + '...' 
                                    : complaint.description}
                            </p>

                            <div style={styles.metaInfo}>
                                <span style={styles.category}>
                                    📁 {complaint.category || 'N/A'}
                                </span>
                                <span style={{
                                    ...styles.severity,
                                    color: getSeverityColor(complaint.severity),
                                    backgroundColor: `${getSeverityColor(complaint.severity)}15`
                                }}>
                                    ⚡ {complaint.severity || 'N/A'}
                                </span>
                                <span style={styles.date}>
                                    📅 {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    }) : 'N/A'}
                                </span>
                            </div>

                            {complaint.leaders && (
                                <div style={styles.leaderInfo}>
                                    <strong>👤 Assigned to:</strong> {complaint.leaders.name} 
                                    <span style={styles.leaderTitle}>({complaint.leaders.title})</span>
                                </div>
                            )}

                            <div style={styles.complaintFooter}>
                                <button 
                                    onClick={() => viewDetails(complaint)}
                                    style={styles.viewBtn}
                                >
                                    <FaEye /> View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            {showDetails && selectedComplaint && (
                <div style={styles.modalOverlay} onClick={() => setShowDetails(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Complaint Details</h2>
                            <button onClick={() => setShowDetails(false)} style={styles.closeBtn}>×</button>
                        </div>
                        
                        <div style={styles.modalBody}>
                            {/* Complaint Information */}
                            <div style={styles.detailSection}>
                                <h4 style={styles.detailSectionTitle}>📋 Complaint Information</h4>
                                <div style={styles.detailGrid}>
                                    <p><strong>ID:</strong> {selectedComplaint.complaint_id}</p>
                                    <p><strong>Title:</strong> {selectedComplaint.title}</p>
                                    <p><strong>Category:</strong> {selectedComplaint.category}</p>
                                    <p><strong>Severity:</strong> 
                                        <span style={{
                                            ...styles.severityBadge,
                                            color: getSeverityColor(selectedComplaint.severity),
                                            backgroundColor: `${getSeverityColor(selectedComplaint.severity)}15`,
                                            marginLeft: '8px'
                                        }}>
                                            {selectedComplaint.severity}
                                        </span>
                                    </p>
                                    <p><strong>Status:</strong> 
                                        <span style={{
                                            ...styles.statusBadge,
                                            background: getStatusColor(selectedComplaint.status),
                                            marginLeft: '8px',
                                            padding: '3px 10px',
                                            fontSize: '12px'
                                        }}>
                                            {getStatusText(selectedComplaint.status)}
                                        </span>
                                    </p>
                                    <p><strong>Submitted:</strong> {new Date(selectedComplaint.created_at).toLocaleString()}</p>
                                    {selectedComplaint.resolved_at && (
                                        <p><strong>Resolved:</strong> {new Date(selectedComplaint.resolved_at).toLocaleString()}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div style={styles.detailSection}>
                                <h4 style={styles.detailSectionTitle}>📝 Description</h4>
                                <p style={styles.descriptionText}>{selectedComplaint.description}</p>
                            </div>

                            {/* Leader Information */}
                            {selectedComplaint.leaders && (
                                <div style={styles.detailSection}>
                                    <h4 style={styles.detailSectionTitle}>👥 Assigned Leader</h4>
                                    <div style={styles.leaderDetails}>
                                        <p><strong>Name:</strong> {selectedComplaint.leaders.name}</p>
                                        <p><strong>Title:</strong> {selectedComplaint.leaders.title}</p>
                                        <p><strong>Constituency:</strong> {selectedComplaint.leaders.constituency}</p>
                                        <p><strong>Contact:</strong> {selectedComplaint.leaders.phone}</p>
                                    </div>
                                </div>
                            )}

                            {/* Complaint Photo */}
                            {selectedComplaint.photo_url && (
                                <div style={styles.detailSection}>
                                    <h4 style={styles.detailSectionTitle}>📸 Complaint Photo</h4>
                                    <img 
                                        src={selectedComplaint.photo_url} 
                                        alt="Complaint" 
                                        style={styles.modalPhoto}
                                    />
                                </div>
                            )}

                            {/* Resolution Notes */}
                            {selectedComplaint.resolution_notes && (
                                <div style={styles.detailSection}>
                                    <h4 style={styles.detailSectionTitle}>✅ Resolution Notes</h4>
                                    <p style={styles.resolutionNotes}>{selectedComplaint.resolution_notes}</p>
                                </div>
                            )}

                            {/* Feedback Form (only for resolved complaints) */}
                            {selectedComplaint.status === 'resolved' && (
                                <div style={styles.feedbackSection}>
                                    <h4 style={styles.detailSectionTitle}>⭐ Rate this Resolution</h4>
                                    <div style={styles.ratingContainer}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span
                                                key={star}
                                                onClick={() => setFeedback({...feedback, rating: star})}
                                                style={{
                                                    ...styles.star,
                                                    color: star <= feedback.rating ? '#FF9933' : '#ddd',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <textarea
                                        placeholder="Share your feedback or comments (optional)"
                                        value={feedback.comments}
                                        onChange={(e) => setFeedback({...feedback, comments: e.target.value})}
                                        style={styles.feedbackTextarea}
                                        rows="3"
                                    />
                                    <button
                                        onClick={submitFeedback}
                                        disabled={submittingFeedback}
                                        style={submittingFeedback ? styles.submitBtnDisabled : styles.submitBtn}
                                    >
                                        {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
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
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
    },
    loadingSpinner: {
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #FF9933',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
    },
    loadingText: {
        color: '#666',
        fontSize: '18px'
    },
    header: {
        marginBottom: '30px'
    },
    backBtn: {
        color: '#666',
        textDecoration: 'none',
        fontSize: '14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        marginBottom: '10px',
        transition: 'color 0.3s',
        ':hover': {
            color: '#FF9933'
        }
    },
    title: {
        color: '#FF9933',
        fontSize: '28px',
        margin: 0
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '30px'
    },
    statCard: {
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden'
    },
    statValue: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '5px'
    },
    statLabel: {
        fontSize: '14px',
        color: '#666'
    },
    statIcon: {
        position: 'absolute',
        right: '20px',
        bottom: '20px',
        fontSize: '24px',
        opacity: 0.2
    },
    filterSection: {
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
    },
    filterHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '15px'
    },
    filterIcon: {
        color: '#FF9933'
    },
    filterTitle: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#333'
    },
    filterTabs: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
    },
    filterBtn: {
        padding: '8px 16px',
        background: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.3s',
        ':hover': {
            background: '#e9ecef'
        }
    },
    filterActive: {
        padding: '8px 16px',
        background: '#FF9933',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    searchBox: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    searchIcon: {
        position: 'absolute',
        left: '12px',
        color: '#999'
    },
    searchInput: {
        width: '100%',
        padding: '12px 40px 12px 40px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.3s',
        ':focus': {
            borderColor: '#FF9933'
        }
    },
    clearSearch: {
        position: 'absolute',
        right: '12px',
        background: 'none',
        border: 'none',
        fontSize: '20px',
        color: '#999',
        cursor: 'pointer',
        ':hover': {
            color: '#333'
        }
    },
    noData: {
        textAlign: 'center',
        padding: '60px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    noDataText: {
        color: '#999',
        fontSize: '16px',
        marginBottom: '20px'
    },
    raiseBtn: {
        display: 'inline-block',
        padding: '12px 24px',
        background: '#FF9933',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        transition: 'background 0.3s',
        ':hover': {
            background: '#e68a00'
        }
    },
    clearBtn: {
        padding: '10px 20px',
        background: '#FF9933',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    complaintsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    complaintCard: {
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'transform 0.3s, boxShadow 0.3s',
        ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
        }
    },
    complaintHeader: {
        padding: '15px 20px',
        background: '#f8f9fa',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '10px'
    },
    complaintTitleSection: {
        flex: 1
    },
    complaintTitle: {
        margin: '0 0 5px 0',
        fontSize: '16px',
        color: '#333'
    },
    complaintId: {
        margin: 0,
        fontSize: '12px',
        color: '#999'
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
    },
    complaintDesc: {
        margin: '15px 20px',
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.6'
    },
    metaInfo: {
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        margin: '0 20px 15px',
        padding: '10px',
        background: '#f8f9fa',
        borderRadius: '8px'
    },
    category: {
        fontSize: '12px',
        color: '#666'
    },
    severity: {
        fontSize: '12px',
        padding: '2px 8px',
        borderRadius: '12px'
    },
    date: {
        fontSize: '12px',
        color: '#999',
        marginLeft: 'auto'
    },
    leaderInfo: {
        margin: '0 20px 15px',
        padding: '10px',
        background: '#e8f5e9',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#2e7d32'
    },
    leaderTitle: {
        marginLeft: '5px',
        fontSize: '11px',
        color: '#666'
    },
    complaintFooter: {
        padding: '15px 20px',
        background: '#f8f9fa',
        borderTop: '1px solid #eee',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    viewBtn: {
        padding: '8px 16px',
        background: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'background 0.3s',
        ':hover': {
            background: '#5a6268'
        }
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px'
    },
    modal: {
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid #FF9933'
    },
    modalTitle: {
        margin: 0,
        color: '#FF9933',
        fontSize: '24px'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '30px',
        cursor: 'pointer',
        color: '#666',
        ':hover': {
            color: '#FF9933'
        }
    },
    modalBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    detailSection: {
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px'
    },
    detailSectionTitle: {
        margin: '0 0 15px 0',
        color: '#333',
        fontSize: '16px',
        borderBottom: '1px solid #ddd',
        paddingBottom: '8px'
    },
    detailGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px'
    },
    descriptionText: {
        margin: 0,
        lineHeight: '1.6',
        color: '#666'
    },
    leaderDetails: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px'
    },
    severityBadge: {
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px'
    },
    modalPhoto: {
        maxWidth: '100%',
        maxHeight: '300px',
        borderRadius: '8px',
        marginTop: '10px'
    },
    resolutionNotes: {
        margin: 0,
        lineHeight: '1.6',
        color: '#28a745',
        background: '#e8f5e9',
        padding: '12px',
        borderRadius: '5px'
    },
    feedbackSection: {
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '10px'
    },
    ratingContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '15px',
        justifyContent: 'center'
    },
    star: {
        fontSize: '30px',
        transition: 'color 0.3s'
    },
    feedbackTextarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '15px',
        resize: 'vertical',
        fontFamily: 'inherit'
    },
    submitBtn: {
        width: '100%',
        padding: '12px',
        background: '#FF9933',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.3s',
        ':hover': {
            background: '#e68a00'
        }
    },
    submitBtnDisabled: {
        width: '100%',
        padding: '12px',
        background: '#ccc',
        color: '#666',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'not-allowed'
    }
};

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default MyComplaints;