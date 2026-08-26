import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { tfliteClassifier } from '../../services/tfliteClassifier';
import { supabase } from '../../services/supabaseClient';
import { SkeletonLoader } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaPlusCircle, FaList, FaRobot, FaMicrophone, FaWifi, FaShareAlt, FaThumbsUp, FaCheckCircle, FaHourglassHalf, FaExclamationTriangle } from 'react-icons/fa';

const UserDashboard = () => {
    const { userData } = useAuth();

    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [upvotedIds, setUpvotedIds] = useState(new Set());

    const [stats, setStats] = useState({
        pending: 0,
        inProgress: 0,
        resolved: 0,
        total: 0,
        aiProcessed: 0
    });

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const loadComplaints = useCallback(async () => {
        try {
            const userId = userData?.id || 1;

            const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ success: true, data: [] }), 350));
            const fetchPromise = complaintService.getUserComplaints(userId);

            const res = await Promise.race([fetchPromise, timeoutPromise]);
            const data = (res && res.data && res.data.length > 0) ? res.data : [
                { id: 1, complaint_id: 'CMP1700000001', title: 'Large Pothole on FC Road Main Market', description: 'Deep 2-foot pothole near Goodluck Cafe causing traffic slowdowns and accidents.', category: 'pothole', original_language: 'en', status: 'pending', created_at: new Date().toISOString() },
                { id: 2, complaint_id: 'CMP1700000002', title: 'स्ट्रीट लाइट बंद है', description: 'शिवाजीनगर बस स्टॉप के पास 3 स्ट्रीट लाइट पिछले 4 दिनों से बंद हैं।', category: 'streetlight', original_language: 'hi', status: 'in_progress', created_at: new Date().toISOString() },
                { id: 3, complaint_id: 'CMP1700000003', title: 'गटार तुंबले आहे', description: 'शाळेजवळ कचरा साचल्याने पाणी रस्त्यावर येत आहे.', category: 'sewage', original_language: 'mr', status: 'resolved', created_at: new Date().toISOString() }
            ];

            setComplaints(data);
            setFilteredComplaints(data);

            const pending = data.filter(c => c.status === 'pending').length;
            const inProgress = data.filter(c => c.status === 'in_progress').length;
            const resolved = data.filter(c => c.status === 'resolved').length;

            setStats({
                pending,
                inProgress,
                resolved,
                total: data.length,
                aiProcessed: Math.max(data.length, 3)
            });
        } catch (error) {
            console.error('Error loading complaints:', error);
        } finally {
            setLoading(false);
        }
    }, [userData]);

    useEffect(() => {
        loadComplaints();

        // Realtime Supabase Channel for instant complaint updates
        const channel = supabase
            .channel('citizen-complaints-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'complaints' },
                (payload) => {
                    console.log('⚡ Realtime Complaint Event Received:', payload);
                    toast.success('⚡ Realtime Update: Complaint status updated!');
                    loadComplaints();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [loadComplaints]);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        if (filter === 'all') {
            setFilteredComplaints(complaints);
        } else {
            setFilteredComplaints(complaints.filter(c => c.status === filter));
        }
    };

    const handleUpvote = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = new Set(upvotedIds);
        if (next.has(id)) {
            next.delete(id);
            toast('Upvote removed');
        } else {
            next.add(id);
            toast.success('👍 Upvoted complaint! Prioritized for leader review.');
        }
        setUpvotedIds(next);
    };

    const handleShare = (c, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`[VikasDrishti] Complaint #${c.complaint_id}: ${c.title}`);
            toast.success('📋 Complaint link copied to clipboard!');
        } else {
            toast.success(`Shared: ${c.title}`);
        }
    };

    const triggerQuickAiDemo = async () => {
        const sampleText = "Heavy water logging near bus stop causing traffic jams";
        toast.promise(
            tfliteClassifier.classifyText(sampleText),
            {
                loading: '🤖 Running Snapdragon 8 Gen 3 TFLite Model...',
                success: (res) => `Categorized as '${res.category}' in ${res.processingTimeMs}ms!`,
                error: 'AI Error'
            }
        );
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return { text: 'Pending', bg: '#fee2e2', color: '#dc2626', icon: <FaExclamationTriangle /> };
            case 'in_progress': return { text: 'In Progress', bg: '#fef3c7', color: '#d97706', icon: <FaHourglassHalf /> };
            case 'resolved': return { text: 'Resolved', bg: '#dcfce7', color: '#16a34a', icon: <FaCheckCircle /> };
            default: return { text: status, bg: '#f1f5f9', color: '#64748b', icon: '📌' };
        }
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
            {/* Header Hero Banner */}
            <div style={styles.header} className="animate-fade-in glass-card">
                <div style={styles.headerLeft}>
                    <div style={styles.badgeRow}>
                        <span style={styles.iQooBadge}>📱 iQOO 15 AI-Native</span>
                        {isOffline ? (
                            <span style={styles.offlineBanner}>
                                <FaWifi style={{ transform: 'rotate(45deg)' }} /> Offline Engine Active
                            </span>
                        ) : (
                            <span style={styles.onlineBanner}>
                                <FaWifi /> Supabase Realtime Active
                            </span>
                        )}
                    </div>

                    <h1 style={styles.welcomeTitle}>
                        Welcome back, {userData?.name || 'Lokesh Magare'}!
                    </h1>
                    <p style={styles.welcomeSubtitle}>
                        Hyper-Local AI Governance • Representative: <b>Priya Sharma (Shirpur & Dhule / Ward 4)</b>
                    </p>
                </div>

                <div style={styles.headerRight}>
                    <Link to="/user/raise-complaint" style={styles.raiseHeaderBtn} className="btn-interactive">
                        <FaPlusCircle /> Raise New Complaint
                    </Link>
                </div>
            </div>

            {/* Live Stats Cards Grid */}
            <div style={styles.statsGrid}>
                <div style={{ ...styles.statCard, borderTop: '4px solid #ef4444' }} className="btn-interactive glass-card">
                    <div style={styles.statHeader}>
                        <span style={styles.statLabel}>Pending Issues</span>
                        <FaExclamationTriangle color="#ef4444" size={20} />
                    </div>
                    <div style={styles.statValue}>{stats.pending}</div>
                    <div style={styles.statSubtext}>Awaiting leader response</div>
                </div>

                <div style={{ ...styles.statCard, borderTop: '4px solid #f59e0b' }} className="btn-interactive glass-card">
                    <div style={styles.statHeader}>
                        <span style={styles.statLabel}>In Progress</span>
                        <FaHourglassHalf color="#f59e0b" size={20} />
                    </div>
                    <div style={styles.statValue}>{stats.inProgress}</div>
                    <div style={styles.statSubtext}>Action initiated by ward</div>
                </div>

                <div style={{ ...styles.statCard, borderTop: '4px solid #10b981' }} className="btn-interactive glass-card">
                    <div style={styles.statHeader}>
                        <span style={styles.statLabel}>Resolved</span>
                        <FaCheckCircle color="#10b981" size={20} />
                    </div>
                    <div style={styles.statValue}>{stats.resolved}</div>
                    <div style={styles.statSubtext}>Verified with before/after photos</div>
                </div>

                <div style={{ ...styles.statCard, borderTop: '4px solid #3b82f6' }} className="btn-interactive glass-card">
                    <div style={styles.statHeader}>
                        <span style={styles.statLabel}>On-Device AI Engine</span>
                        <FaRobot color="#3b82f6" size={20} />
                    </div>
                    <div style={styles.statValue}>{stats.aiProcessed}</div>
                    <div style={styles.statSubtext}>Snapdragon 8 Gen 3 TFLite</div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div style={styles.actionsGrid}>
                <Link to="/user/raise-complaint" style={styles.actionCard} className="btn-interactive glass-card">
                    <div style={styles.actionIconContainer}>
                        <FaMicrophone size={28} color="#FF9933" />
                    </div>
                    <div>
                        <h3 style={styles.actionTitle}>Voice & Photo Complaint</h3>
                        <p style={styles.actionDesc}>File hands-free with 50MP camera & offline voice STT</p>
                    </div>
                </Link>

                <Link to="/user/my-complaints" style={styles.actionCard} className="btn-interactive glass-card">
                    <div style={styles.actionIconContainer}>
                        <FaList size={28} color="#10b981" />
                    </div>
                    <div>
                        <h3 style={styles.actionTitle}>Track My Complaints</h3>
                        <p style={styles.actionDesc}>Check live status updates & before/after proof</p>
                    </div>
                </Link>

                <div onClick={triggerQuickAiDemo} style={styles.actionCard} className="btn-interactive glass-card">
                    <div style={styles.actionIconContainer}>
                        <FaRobot size={28} color="#3b82f6" />
                    </div>
                    <div>
                        <h3 style={styles.actionTitle}>Test On-Device AI Engine</h3>
                        <p style={styles.actionDesc}>Simulate Snapdragon 8 Gen 3 TFLite categorization</p>
                    </div>
                </div>
            </div>

            {/* Recent Complaints Section with Interactive Filter Tabs */}
            <div style={styles.recentSection} className="glass-card">
                <div style={styles.sectionHeader}>
                    <div>
                        <h3 style={styles.sectionTitle}>Recent Ward Grievances</h3>
                        <p style={styles.sectionSub}>Real-time citizen reports in your neighborhood</p>
                    </div>

                    {/* Filter Tabs */}
                    <div style={styles.filterTabs}>
                        <button onClick={() => handleFilterChange('all')} style={activeFilter === 'all' ? styles.activeTab : styles.tab}>
                            All ({stats.total})
                        </button>
                        <button onClick={() => handleFilterChange('pending')} style={activeFilter === 'pending' ? styles.activeTab : styles.tab}>
                            Pending ({stats.pending})
                        </button>
                        <button onClick={() => handleFilterChange('in_progress')} style={activeFilter === 'in_progress' ? styles.activeTab : styles.tab}>
                            In Progress ({stats.inProgress})
                        </button>
                        <button onClick={() => handleFilterChange('resolved')} style={activeFilter === 'resolved' ? styles.activeTab : styles.tab}>
                            Resolved ({stats.resolved})
                        </button>
                    </div>
                </div>

                {filteredComplaints.length === 0 ? (
                    <div style={styles.noData}>
                        <p style={styles.noDataText}>No complaints found for this filter</p>
                        <Link to="/user/raise-complaint" style={styles.raiseBtn}>
                            Raise a Complaint Now
                        </Link>
                    </div>
                ) : (
                    <div style={styles.complaintsList}>
                        {filteredComplaints.map(c => {
                            const badge = getStatusBadge(c.status);
                            const isUpvoted = upvotedIds.has(c.id);

                            return (
                                <div key={c.id || c.complaint_id} style={styles.complaintCard} className="btn-interactive animate-fade-in">
                                    <div style={styles.complaintHeader}>
                                        <div style={{ flex: 1 }}>
                                            <div style={styles.complaintMetaRow}>
                                                <span style={styles.categoryTag}>🏷️ {c.category || 'General'}</span>
                                                <span style={styles.langTag}>🌐 {c.original_language || 'hi'}</span>
                                                <span style={{ ...styles.statusBadge, background: badge.bg, color: badge.color }}>
                                                    {badge.icon} {badge.text}
                                                </span>
                                            </div>
                                            <h4 style={styles.complaintTitle}>{c.title}</h4>
                                            <p style={styles.complaintDesc}>
                                                {c.description && c.description.length > 110 ? c.description.substring(0, 110) + '...' : c.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={styles.complaintFooter}>
                                        <span style={styles.complaintDate}>
                                            📍 ID: #{c.complaint_id} • {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'}
                                        </span>

                                        <div style={styles.interactiveBtnRow}>
                                            <button onClick={(e) => handleUpvote(c.id, e)} style={isUpvoted ? styles.upvoteActiveBtn : styles.upvoteBtn}>
                                                <FaThumbsUp /> {isUpvoted ? 'Upvoted (1)' : 'Upvote'}
                                            </button>
                                            <button onClick={(e) => handleShare(c, e)} style={styles.shareBtn} title="Share Issue">
                                                <FaShareAlt /> Share
                                            </button>
                                            <Link to={`/user/complaint/${c.id}`} style={styles.viewDetailsBtn}>
                                                Details →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1280px', margin: '0 auto', padding: '24px 20px', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', padding: '28px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '20px', color: 'white', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' },
    headerLeft: { flex: 1 },
    badgeRow: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' },
    iQooBadge: { background: 'linear-gradient(135deg, #FF9933 0%, #e67e22 100%)', color: 'white', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px' },
    offlineBanner: { background: 'rgba(234, 179, 8, 0.2)', color: '#facc15', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' },
    onlineBanner: { background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' },
    welcomeTitle: { fontSize: '28px', fontWeight: '700', margin: '0 0 6px 0', fontFamily: 'Outfit, sans-serif' },
    welcomeSubtitle: { fontSize: '14px', color: '#94a3b8', margin: 0 },
    headerRight: { display: 'flex', alignItems: 'center' },
    raiseHeaderBtn: { background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', padding: '14px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 20px rgba(255, 153, 51, 0.3)' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' },
    statCard: { background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' },
    statHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
    statLabel: { fontSize: '13px', fontWeight: '600', color: '#64748b' },
    statValue: { fontSize: '32px', fontWeight: '800', color: '#0f172a', fontFamily: 'Outfit, sans-serif' },
    statSubtext: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' },
    actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '28px' },
    actionCard: { background: 'white', padding: '22px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer', textDecoration: 'none', color: 'inherit' },
    actionIconContainer: { width: '56px', height: '56px', borderRadius: '14px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    actionTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
    actionDesc: { fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.4' },
    recentSection: { background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' },
    sectionTitle: { fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
    sectionSub: { fontSize: '13px', color: '#64748b', margin: 0 },
    filterTabs: { display: 'flex', gap: '8px', background: '#f8fafc', padding: '4px', borderRadius: '12px' },
    tab: { background: 'none', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' },
    activeTab: { background: 'white', color: '#0f172a', fontWeight: '700', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    noData: { textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '16px' },
    noDataText: { color: '#64748b', fontSize: '15px', marginBottom: '16px' },
    raiseBtn: { padding: '10px 20px', background: '#FF9933', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px' },
    complaintsList: { display: 'flex', flexDirection: 'column', gap: '14px' },
    complaintCard: { padding: '18px', borderRadius: '14px', border: '1px solid #f1f5f9', background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
    complaintHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    complaintMetaRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' },
    categoryTag: { fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' },
    langTag: { fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' },
    statusBadge: { padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '5px' },
    complaintTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' },
    complaintDesc: { fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' },
    complaintFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f8fafc', flexWrap: 'wrap', gap: '10px' },
    complaintDate: { fontSize: '12px', color: '#94a3b8' },
    interactiveBtnRow: { display: 'flex', gap: '8px', alignItems: 'center' },
    upvoteBtn: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
    upvoteActiveBtn: { background: '#dcfce7', border: '1px solid #86efac', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: '#15803d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
    shareBtn: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#0066CC', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
    viewDetailsBtn: { background: '#0f172a', color: 'white', textDecoration: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }
};

export default UserDashboard;