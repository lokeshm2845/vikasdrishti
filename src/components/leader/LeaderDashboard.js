import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { FaMapMarkedAlt, FaList, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LeaderDashboard = () => {
    const { userData, signOut } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pending: 0,
        inProgress: 0,
        resolved: 0,
        total: 0
    });

    // Load complaints function
    const loadComplaints = async () => {
        if (!userData) {
            console.log('No userData, skipping load');
            setLoading(false);
            return;
        }
        
        try {
            console.log('Loading complaints for leader:', userData.id);
            
            const { data, error } = await supabase
                .from('complaints')
                .select('*')
                .eq('leader_id', userData.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            console.log('Complaints loaded:', data);
            const complaintsData = data || [];
            setComplaints(complaintsData);
            
            // Calculate stats
            const pending = complaintsData.filter(c => c.status === 'pending').length;
            const inProgress = complaintsData.filter(c => c.status === 'in_progress').length;
            const resolved = complaintsData.filter(c => c.status === 'resolved').length;
            
            setStats({
                pending,
                inProgress,
                resolved,
                total: complaintsData.length
            });
        } catch (error) {
            console.error('Error loading complaints:', error);
            toast.error('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    // Load complaints on mount and when userData changes
    useEffect(() => {
        console.log('LeaderDashboard mounted');
        loadComplaints();
    }, [userData]);

    // Real-time subscription for new complaints
    useEffect(() => {
        if (!userData) return;

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('leader-complaints')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'complaints',
                    filter: `leader_id=eq.${userData.id}`
                },
                (payload) => {
                    console.log('New complaint received:', payload);
                    setComplaints(prev => [payload.new, ...prev]);
                    setStats(prev => ({
                        ...prev,
                        pending: prev.pending + 1,
                        total: prev.total + 1
                    }));
                    toast.success(`New complaint: ${payload.new.title}`);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'complaints',
                    filter: `leader_id=eq.${userData.id}`
                },
                (payload) => {
                    console.log('Complaint updated:', payload);
                    setComplaints(prev => 
                        prev.map(c => c.id === payload.new.id ? payload.new : c)
                    );
                    // Recalculate stats
                    const updatedComplaints = complaints.map(c => 
                        c.id === payload.new.id ? payload.new : c
                    );
                    const pending = updatedComplaints.filter(c => c.status === 'pending').length;
                    const inProgress = updatedComplaints.filter(c => c.status === 'in_progress').length;
                    const resolved = updatedComplaints.filter(c => c.status === 'resolved').length;
                    setStats({ pending, inProgress, resolved, total: updatedComplaints.length });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [userData, complaints]);

    const updateComplaintStatus = async (complaintId, newStatus) => {
        let resolutionNotes = '';
        
        if (newStatus === 'resolved') {
            resolutionNotes = prompt('Enter resolution notes:');
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

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}>VikasDrishti</h1>
                    {userData && (
                        <div style={styles.leaderInfo}>
                            <h2 style={styles.leaderName}>{userData.name}</h2>
                            <p style={styles.leaderTitle}>
                                {userData.title || ''} | {userData.constituency || ''} | {userData.party || ''}
                            </p>
                        </div>
                    )}
                </div>
                <div style={styles.headerRight}>
                    <button onClick={signOut} style={styles.logoutBtn}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <div style={{...styles.statCard, borderLeft: '4px solid #dc3545'}}>
                    <div style={styles.statValue}>{stats.pending}</div>
                    <div style={styles.statLabel}>Pending Complaints</div>
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
                    <div style={styles.statLabel}>Total Complaints</div>
                    <div style={styles.statIcon}>📊</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.actionsGrid}>
                <Link to="/leader/map" style={styles.actionCard}>
                    <FaMapMarkedAlt size={40} color="#FF9933" />
                    <h3 style={styles.actionTitle}>Geofence Map</h3>
                    <p style={styles.actionDesc}>Draw areas and send updates to voters</p>
                </Link>
                <Link to="/leader/complaints" style={styles.actionCard}>
                    <FaList size={40} color="#138808" />
                    <h3 style={styles.actionTitle}>Manage Complaints</h3>
                    <p style={styles.actionDesc}>View and resolve citizen complaints</p>
                </Link>
            </div>

            {/* Recent Complaints */}
            <div style={styles.recentSection}>
                <h3 style={styles.sectionTitle}>Recent Complaints</h3>
                {complaints.length === 0 ? (
                    <p style={styles.noData}>No complaints yet</p>
                ) : (
                    <div style={styles.complaintsList}>
                        {complaints.slice(0, 5).map(complaint => (
                            <div key={complaint.id} style={styles.complaintCard}>
                                <div style={styles.complaintHeader}>
                                    <div>
                                        <h4 style={styles.complaintTitle}>{complaint.title}</h4>
                                        <p style={styles.complaintUser}>
                                            Complaint ID: {complaint.complaint_id}
                                        </p>
                                    </div>
                                    <span style={{
                                        ...styles.statusBadge,
                                        background: getStatusColor(complaint.status)
                                    }}>
                                        {getStatusIcon(complaint.status)} {getStatusText(complaint.status)}
                                    </span>
                                </div>
                                <p style={styles.complaintDesc}>
                                    {complaint.description && complaint.description.length > 100 
                                        ? complaint.description.substring(0, 100) + '...' 
                                        : complaint.description}
                                </p>
                                <div style={styles.complaintFooter}>
                                    <span style={styles.complaintDate}>
                                        {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : ''}
                                    </span>
                                    {complaint.status === 'pending' && (
                                        <button
                                            onClick={() => updateComplaintStatus(complaint.id, 'in_progress')}
                                            style={styles.startBtn}
                                        >
                                            Start Work
                                        </button>
                                    )}
                                    {complaint.status === 'in_progress' && (
                                        <button
                                            onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                                            style={styles.resolveBtn}
                                        >
                                            Mark Resolved
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {complaints.length > 5 && (
                    <Link to="/leader/complaints" style={styles.viewAllLink}>
                        View All Complaints →
                    </Link>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px',
        color: '#FF9933'
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    headerLeft: {
        flex: 1
    },
    title: {
        color: '#FF9933',
        fontSize: '28px',
        margin: '0 0 10px 0'
    },
    leaderInfo: {
        marginTop: '5px'
    },
    leaderName: {
        fontSize: '20px',
        margin: '0 0 5px 0',
        color: '#333'
    },
    leaderTitle: {
        fontSize: '14px',
        color: '#666',
        margin: '0'
    },
    headerRight: {
        display: 'flex',
        gap: '15px'
    },
    logoutBtn: {
        padding: '10px 20px',
        background: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
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
    actionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '30px'
    },
    actionCard: {
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        textDecoration: 'none',
        color: '#333',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        textAlign: 'center'
    },
    actionTitle: {
        margin: '15px 0 10px 0',
        fontSize: '18px'
    },
    actionDesc: {
        margin: '0',
        fontSize: '14px',
        color: '#666'
    },
    recentSection: {
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
        margin: '0 0 20px 0',
        fontSize: '20px',
        color: '#333'
    },
    noData: {
        textAlign: 'center',
        color: '#999',
        padding: '40px',
        fontSize: '16px'
    },
    complaintsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    complaintCard: {
        padding: '15px',
        border: '1px solid #eee',
        borderRadius: '10px'
    },
    complaintHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '10px'
    },
    complaintTitle: {
        margin: '0 0 5px 0',
        fontSize: '16px',
        color: '#333'
    },
    complaintUser: {
        margin: '0',
        fontSize: '12px',
        color: '#999'
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    complaintDesc: {
        margin: '0 0 10px 0',
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.5'
    },
    complaintDate: {
        margin: '0',
        fontSize: '12px',
        color: '#999'
    },
    complaintFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px'
    },
    startBtn: {
        padding: '5px 12px',
        background: '#ffc107',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '12px'
    },
    resolveBtn: {
        padding: '5px 12px',
        background: '#28a745',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '12px'
    },
    viewAllLink: {
        display: 'block',
        textAlign: 'center',
        marginTop: '20px',
        color: '#138808',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: 'bold'
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

export default LeaderDashboard;