import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { FaPlusCircle, FaList, FaUser, FaSignOutAlt } from 'react-icons/fa';

const UserDashboard = () => {
    const { userData, signOut } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pending: 0,
        inProgress: 0,
        resolved: 0,
        total: 0
    });

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async() => {
        if (!userData) return;

        try {
            const { data, error } = await supabase
                .from('complaints')
                .select('*')
                .eq('user_id', userData.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const complaintsData = data || [];
            setComplaints(complaintsData);

            // Calculate stats - FIXED: removed optional chaining
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
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#dc3545';
            case 'in_progress':
                return '#ffc107';
            case 'resolved':
                return '#28a745';
            default:
                return '#6c757d';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'in_progress':
                return 'In Progress';
            case 'resolved':
                return 'Resolved';
            default:
                return status;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return '⏳';
            case 'in_progress':
                return '🔄';
            case 'resolved':
                return '✅';
            default:
                return '📌';
        }
    };

    if (loading) {
        return ( <
            div style = { styles.loadingContainer } >
            <
            div style = { styles.loadingSpinner } > < /div> <
            p style = { styles.loadingText } > Loading your dashboard... < /p> <
            /div>
        );
    }

    return ( <
        div style = { styles.container } > { /* Header */ } <
        div style = { styles.header } >
        <
        div style = { styles.headerLeft } >
        <
        h1 style = { styles.title } > VikasDrishti < /h1> {
            userData && ( <
                div style = { styles.userInfo } >
                <
                h2 style = { styles.userName } >
                <
                FaUser style = { styles.userIcon }
                /> {userData.name || 'User'} <
                /h2> <
                p style = { styles.userEmail } > { userData.email || '' } < /p> <
                /div>
            )
        } <
        /div> <
        button onClick = { signOut }
        style = { styles.logoutBtn } >
        <
        FaSignOutAlt / > Logout <
        /button> <
        /div>

        { /* Stats Cards */ } <
        div style = { styles.statsGrid } >
        <
        div style = {
            {...styles.statCard, borderLeft: '4px solid #dc3545' } } >
        <
        div style = { styles.statValue } > { stats.pending } < /div> <
        div style = { styles.statLabel } > Pending Complaints < /div> <
        div style = { styles.statIcon } > ⏳ < /div> <
        /div> <
        div style = {
            {...styles.statCard, borderLeft: '4px solid #ffc107' } } >
        <
        div style = { styles.statValue } > { stats.inProgress } < /div> <
        div style = { styles.statLabel } > In Progress < /div> <
        div style = { styles.statIcon } > 🔄 < /div> <
        /div> <
        div style = {
            {...styles.statCard, borderLeft: '4px solid #28a745' } } >
        <
        div style = { styles.statValue } > { stats.resolved } < /div> <
        div style = { styles.statLabel } > Resolved < /div> <
        div style = { styles.statIcon } > ✅ < /div> <
        /div> <
        div style = {
            {...styles.statCard, borderLeft: '4px solid #FF9933' } } >
        <
        div style = { styles.statValue } > { stats.total } < /div> <
        div style = { styles.statLabel } > Total Complaints < /div> <
        div style = { styles.statIcon } > 📊 < /div> <
        /div> <
        /div>

        { /* Quick Actions */ } <
        div style = { styles.actionsGrid } >
        <
        Link to = "/user/raise-complaint"
        style = { styles.actionCard } >
        <
        FaPlusCircle size = { 48 }
        color = "#FF9933" / >
        <
        h3 style = { styles.actionTitle } > Raise Complaint < /h3> <
        p style = { styles.actionDesc } > Report a new issue in your area < /p> <
        span style = { styles.actionArrow } > → < /span> <
        /Link> <
        Link to = "/user/my-complaints"
        style = { styles.actionCard } >
        <
        FaList size = { 48 }
        color = "#138808" / >
        <
        h3 style = { styles.actionTitle } > My Complaints < /h3> <
        p style = { styles.actionDesc } > Track status of your complaints < /p> <
        span style = { styles.actionArrow } > → < /span> <
        /Link> <
        /div>

        { /* Recent Complaints */ } <
        div style = { styles.recentSection } >
        <
        h3 style = { styles.sectionTitle } > Recent Complaints < /h3> {
            complaints.length === 0 ? ( <
                div style = { styles.noData } >
                <
                p style = { styles.noDataText } > No complaints yet < /p> <
                Link to = "/user/raise-complaint"
                style = { styles.raiseBtn } >
                Raise Your First Complaint <
                /Link> <
                /div>
            ) : ( <
                div style = { styles.complaintsList } > {
                    complaints.slice(0, 3).map(complaint => ( <
                        Link to = { `/user/complaint/${complaint.id}` }
                        key = { complaint.id }
                        style = { styles.complaintCard } >
                        <
                        div style = { styles.complaintHeader } >
                        <
                        div >
                        <
                        h4 style = { styles.complaintTitle } > { complaint.title } < /h4> <
                        p style = { styles.complaintDesc } > {
                            complaint.description && complaint.description.length > 100 ?
                            complaint.description.substring(0, 100) + '...' :
                                complaint.description
                        } <
                        /p> <
                        /div> <
                        div style = { styles.complaintRight } >
                        <
                        span style = {
                            {
                                ...styles.statusBadge,
                                    background: getStatusColor(complaint.status)
                            }
                        } > { getStatusIcon(complaint.status) } { getStatusText(complaint.status) } <
                        /span> <
                        /div> <
                        /div> <
                        div style = { styles.complaintFooter } >
                        <
                        span style = { styles.complaintDate } > {
                            complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            }) : ''
                        } <
                        /span> <
                        span style = { styles.viewDetails } > View Details→ < /span> <
                        /div> <
                        /Link>
                    ))
                } <
                /div>
            )
        } {
            complaints.length > 3 && ( <
                Link to = "/user/my-complaints"
                style = { styles.viewAllLink } >
                View All Complaints({ stats.total }) <
                /Link>
            )
        } <
        /div>

        { /* Quick Tips */ } <
        div style = { styles.tipsSection } >
        <
        h3 style = { styles.tipsTitle } > 💡Quick Tips < /h3> <
        ul style = { styles.tipsList } >
        <
        li > 📸Upload clear photos of the issue < /li> <
        li > 📍Enable location
        for faster resolution < /li> <
        li > 📝Describe the problem in detail < /li> <
        li > 📞Keep your phone number updated
        for SMS alerts < /li> <
        /ul> <
        /div> <
        /div>
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
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    userName: {
        fontSize: '18px',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        color: '#333'
    },
    userIcon: {
        color: '#FF9933'
    },
    userEmail: {
        fontSize: '14px',
        color: '#666',
        margin: 0
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
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
    },
    actionTitle: {
        margin: '15px 0 10px 0',
        fontSize: '20px',
        color: '#333'
    },
    actionDesc: {
        margin: '0',
        fontSize: '14px',
        color: '#666'
    },
    actionArrow: {
        position: 'absolute',
        right: '20px',
        bottom: '20px',
        fontSize: '20px',
        color: '#ccc'
    },
    recentSection: {
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
    },
    sectionTitle: {
        margin: '0 0 20px 0',
        fontSize: '20px',
        color: '#333'
    },
    noData: {
        textAlign: 'center',
        padding: '40px',
        background: '#f8f9fa',
        borderRadius: '10px'
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
        fontWeight: 'bold'
    },
    complaintsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    complaintCard: {
        padding: '15px',
        border: '1px solid #eee',
        borderRadius: '10px',
        textDecoration: 'none',
        color: '#333',
        display: 'block'
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
        fontWeight: 'bold',
        color: '#333'
    },
    complaintDesc: {
        margin: '0',
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.4'
    },
    complaintRight: {
        marginLeft: '15px'
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-block',
        whiteSpace: 'nowrap'
    },
    complaintFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid #eee'
    },
    complaintDate: {
        fontSize: '12px',
        color: '#999'
    },
    viewDetails: {
        fontSize: '12px',
        color: '#FF9933',
        fontWeight: 'bold'
    },
    viewAllLink: {
        display: 'block',
        textAlign: 'center',
        marginTop: '20px',
        color: '#138808',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '10px'
    },
    tipsSection: {
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    tipsTitle: {
        margin: '0 0 15px 0',
        fontSize: '18px',
        color: '#333'
    },
    tipsList: {
        margin: 0,
        paddingLeft: '20px',
        color: '#666',
        lineHeight: '1.8'
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

export default UserDashboard;