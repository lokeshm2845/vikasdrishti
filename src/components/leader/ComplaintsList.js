import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaCheck, FaPlay, FaSearch, FaFilter, FaEye } from 'react-icons/fa';

const ComplaintsList = () => {
    const { userData } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

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
                    users:user_id (name, phone, email, address, street_name, locality)
                `)
                .eq('leader_id', userData.id)
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

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(c => 
                c.title.toLowerCase().includes(term) ||
                c.description.toLowerCase().includes(term) ||
                (c.users?.name?.toLowerCase().includes(term)) ||
                (c.users?.phone?.includes(term)) ||
                c.category?.toLowerCase().includes(term)
            );
        }

        setFilteredComplaints(filtered);
    };

    const updateStatus = async (complaintId, newStatus) => {
        let resolutionNotes = '';
        
        if (newStatus === 'resolved') {
            resolutionNotes = prompt('Enter resolution notes (how was this issue resolved?):');
            if (!resolutionNotes) return;
        }

        try {
            const updates = {
                status: newStatus,
                updated_at: new Date()
            };

            if (newStatus === 'in_progress') {
                updates.assigned_at = new Date();
            } else if (newStatus === 'resolved') {
                updates.resolved_at = new Date();
                updates.resolution_notes = resolutionNotes;
            }

            const { error } = await supabase
                .from('complaints')
                .update(updates)
                .eq('id', complaintId);

            if (error) throw error;

            toast.success(`Complaint marked as ${newStatus}!`);
            loadComplaints(); // Reload list
        } catch (error) {
            console.error('Error updating complaint:', error);
            toast.error('Failed to update complaint');
        }
    };

    const viewDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setShowDetails(true);
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
                <p>Loading complaints...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <Link to="/leader/dashboard" style={styles.backBtn}>
                    <FaArrowLeft /> Back to Dashboard
                </Link>
                <h1 style={styles.title}>Constituency Complaints</h1>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <div style={{...styles.statCard, borderLeft: '4px solid #dc3545'}}>
                    <div style={styles.statValue}>{stats.pending}</div>
                    <div style={styles.statLabel}>Pending</div>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #ffc107'}}>
                    <div style={styles.statValue}>{stats.inProgress}</div>
                    <div style={styles.statLabel}>In Progress</div>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #28a745'}}>
                    <div style={styles.statValue}>{stats.resolved}</div>
                    <div style={styles.statLabel}>Resolved</div>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #FF9933'}}>
                    <div style={styles.statValue}>{stats.total}</div>
                    <div style={styles.statLabel}>Total</div>
                </div>
            </div>

            {/* Filters and Search */}
            <div style={styles.filterSection}>
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
                        placeholder="Search by title, description, user name, phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
            </div>

            {/* Complaints List */}
            {filteredComplaints.length === 0 ? (
                <div style={styles.noData}>
                    <p style={styles.noDataText}>No complaints found</p>
                    {searchTerm && (
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
                                <div style={styles.userInfo}>
                                    <h3 style={styles.userName}>{complaint.users?.name}</h3>
                                    <p style={styles.userContact}>
                                        📞 {complaint.users?.phone} | 📍 {complaint.users?.locality || 'Unknown'}
                                    </p>
                                </div>
                                <span style={{
                                    ...styles.statusBadge,
                                    background: getStatusColor(complaint.status)
                                }}>
                                    {getStatusIcon(complaint.status)} {getStatusText(complaint.status)}
                                </span>
                            </div>

                            <div style={styles.complaintBody}>
                                <h4 style={styles.complaintTitle}>{complaint.title}</h4>
                                <p style={styles.complaintDesc}>{complaint.description}</p>
                                
                                <div style={styles.metaInfo}>
                                    <span style={styles.category}>
                                        Category: {complaint.category}
                                    </span>
                                    <span style={{
                                        ...styles.severity,
                                        color: getSeverityColor(complaint.severity),
                                        background: `${getSeverityColor(complaint.severity)}20`
                                    }}>
                                        Severity: {complaint.severity}
                                    </span>
                                    <span style={styles.date}>
                                        {new Date(complaint.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                {complaint.photo_url && (
                                    <div style={styles.photoPreview}>
                                        <img 
                                            src={complaint.photo_url} 
                                            alt="Complaint" 
                                            style={styles.photo}
                                        />
                                    </div>
                                )}

                                {complaint.status === 'resolved' && complaint.resolution_notes && (
                                    <div style={styles.resolution}>
                                        <strong>Resolution Notes:</strong>
                                        <p>{complaint.resolution_notes}</p>
                                    </div>
                                )}
                            </div>

                            <div style={styles.complaintFooter}>
                                <button 
                                    onClick={() => viewDetails(complaint)}
                                    style={styles.viewBtn}
                                >
                                    <FaEye /> View Details
                                </button>
                                
                                {complaint.status === 'pending' && (
                                    <button
                                        onClick={() => updateStatus(complaint.id, 'in_progress')}
                                        style={styles.startBtn}
                                    >
                                        <FaPlay /> Start Work
                                    </button>
                                )}
                                
                                {complaint.status === 'in_progress' && (
                                    <button
                                        onClick={() => updateStatus(complaint.id, 'resolved')}
                                        style={styles.resolveBtn}
                                    >
                                        <FaCheck /> Mark Resolved
                                    </button>
                                )}
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
                            <div style={styles.detailSection}>
                                <h4>Complaint Information</h4>
                                <p><strong>ID:</strong> {selectedComplaint.complaint_id}</p>
                                <p><strong>Title:</strong> {selectedComplaint.title}</p>
                                <p><strong>Description:</strong> {selectedComplaint.description}</p>
                                <p><strong>Category:</strong> {selectedComplaint.category}</p>
                                <p><strong>Severity:</strong> {selectedComplaint.severity}</p>
                                <p><strong>Status:</strong> {selectedComplaint.status}</p>
                                <p><strong>Submitted:</strong> {new Date(selectedComplaint.created_at).toLocaleString()}</p>
                                {selectedComplaint.resolved_at && (
                                    <p><strong>Resolved:</strong> {new Date(selectedComplaint.resolved_at).toLocaleString()}</p>
                                )}
                            </div>

                            <div style={styles.detailSection}>
                                <h4>Citizen Information</h4>
                                <p><strong>Name:</strong> {selectedComplaint.users?.name}</p>
                                <p><strong>Phone:</strong> {selectedComplaint.users?.phone}</p>
                                <p><strong>Email:</strong> {selectedComplaint.users?.email}</p>
                                <p><strong>Address:</strong> {selectedComplaint.users?.address}</p>
                                <p><strong>Street:</strong> {selectedComplaint.users?.street_name}</p>
                                <p><strong>Locality:</strong> {selectedComplaint.users?.locality}</p>
                            </div>

                            {selectedComplaint.photo_url && (
                                <div style={styles.detailSection}>
                                    <h4>Complaint Photo</h4>
                                    <img 
                                        src={selectedComplaint.photo_url} 
                                        alt="Complaint" 
                                        style={styles.modalPhoto}
                                    />
                                </div>
                            )}

                            {selectedComplaint.resolution_notes && (
                                <div style={styles.detailSection}>
                                    <h4>Resolution Notes</h4>
                                    <p>{selectedComplaint.resolution_notes}</p>
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
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
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
    filterSection: {
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
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
        padding: '12px 12px 12px 40px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        ':focus': {
            borderColor: '#FF9933'
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
    clearBtn: {
        padding: '10px 20px',
        background: '#FF9933',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
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
        overflow: 'hidden'
    },
    complaintHeader: {
        padding: '15px 20px',
        background: '#f8f9fa',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
    },
    userInfo: {
        flex: 1
    },
    userName: {
        margin: '0 0 5px 0',
        fontSize: '16px',
        color: '#333'
    },
    userContact: {
        margin: 0,
        fontSize: '13px',
        color: '#666'
    },
    statusBadge: {
        padding: '6px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '13px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
    },
    complaintBody: {
        padding: '20px'
    },
    complaintTitle: {
        margin: '0 0 10px 0',
        fontSize: '18px',
        color: '#333'
    },
    complaintDesc: {
        margin: '0 0 15px 0',
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.6'
    },
    metaInfo: {
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        marginBottom: '15px'
    },
    category: {
        fontSize: '13px',
        color: '#666',
        background: '#f8f9fa',
        padding: '4px 10px',
        borderRadius: '15px'
    },
    severity: {
        fontSize: '13px',
        padding: '4px 10px',
        borderRadius: '15px'
    },
    date: {
        fontSize: '13px',
        color: '#999',
        marginLeft: 'auto'
    },
    photoPreview: {
        marginBottom: '15px'
    },
    photo: {
        maxWidth: '200px',
        maxHeight: '150px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    resolution: {
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '15px'
    },
    complaintFooter: {
        padding: '15px 20px',
        background: '#f8f9fa',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '10px',
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
        ':hover': {
            background: '#5a6268'
        }
    },
    startBtn: {
        padding: '8px 16px',
        background: '#ffc107',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        ':hover': {
            background: '#e0a800'
        }
    },
    resolveBtn: {
        padding: '8px 16px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        ':hover': {
            background: '#218838'
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
        zIndex: 1000
    },
    modal: {
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    modalTitle: {
        margin: 0,
        color: '#FF9933'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#666'
    },
    modalBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    detailSection: {
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px'
    },
    modalPhoto: {
        maxWidth: '100%',
        maxHeight: '300px',
        borderRadius: '5px'
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

export default ComplaintsList;