import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { syncManager } from '../../services/syncManager';
import toast from 'react-hot-toast';
import { FaHome, FaUser, FaSignOutAlt, FaBars, FaTimes, FaBell, FaWifi, FaCheckDouble, FaTrashAlt, FaInfoCircle, FaPhone, FaQuestionCircle, FaCogs, FaUserCheck, FaUserTie } from 'react-icons/fa';

const Navbar = () => {
    const { user, userRole, userData, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const [notifications, setNotifications] = useState([
        { id: 1, text: '📱 iQOO 15 Local Storage Active', time: 'Just now', unread: true },
        { id: 2, text: '🤖 TFLite categorized pothole issue in Ward 4', time: '10m ago', unread: true },
        { id: 3, text: '🎉 Complaint CMP1700000003 resolved by MLA', time: '1h ago', unread: false }
    ]);

    useEffect(() => {
        const unsubscribe = syncManager.subscribe((event) => {
            if (event.status === 'online') setIsOnline(true);
            if (event.status === 'offline') setIsOnline(false);
            if (event.status === 'sync_complete' && event.syncedCount > 0) {
                toast.success(`⚡ Background Sync: ${event.syncedCount} complaints uploaded to cloud!`);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async (e) => {
        if (e) e.preventDefault();
        setMenuOpen(false);
        setNotificationsOpen(false);
        await signOut();
        navigate('/');
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
        toast.success('All notifications marked as read');
    };

    const clearNotifications = () => {
        setNotifications([]);
        toast('Notifications cleared');
    };

    const getDashboardLink = () => {
        if (userRole === 'user') return '/user/dashboard';
        if (userRole === 'leader') return '/leader/dashboard';
        return '/';
    };

    const getProfileLink = () => {
        if (userRole === 'user') return '/user/profile';
        if (userRole === 'leader') return '/leader/profile';
        return '/';
    };

    const isActive = (path) => location.pathname === path;

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleRoleSelect = (role) => {
        setRoleModalOpen(false);
        navigate(`/login?role=${role}`);
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.navContainer}>
                {/* Logo Brand */}
                <div style={styles.logoSection}>
                    <Link to="/" style={styles.logoLink}>
                        <div style={styles.logoBadge}>VD</div>
                        <div>
                            <span style={styles.logoText}>VikasDrishti</span>
                            <span style={styles.logoSubtext}>iQOO 15 AI-Native</span>
                        </div>
                    </Link>

                    {/* Network Status Pill */}
                    <div style={isOnline ? styles.onlinePill : styles.offlinePill} title={isOnline ? 'Cloud Sync Online' : 'Local iQOO Storage Active'}>
                        <FaWifi style={{ transform: isOnline ? 'none' : 'rotate(45deg)' }} />
                        <span>{isOnline ? 'Online' : 'Offline Engine'}</span>
                    </div>
                </div>

                {/* Desktop Main Navigation Links */}
                <div style={styles.navLinks}>
                    <Link to="/" style={{ ...styles.navLink, ...(isActive('/') ? styles.activeNavLink : {}) }}>
                        <FaHome /> Home
                    </Link>
                    <Link to="/about" style={{ ...styles.navLink, ...(isActive('/about') ? styles.activeNavLink : {}) }}>
                        <FaInfoCircle /> About
                    </Link>
                    <Link to="/how-it-works" style={{ ...styles.navLink, ...(isActive('/how-it-works') ? styles.activeNavLink : {}) }}>
                        <FaCogs /> How It Works
                    </Link>
                    <Link to="/contact" style={{ ...styles.navLink, ...(isActive('/contact') ? styles.activeNavLink : {}) }}>
                        <FaPhone /> Contact
                    </Link>
                    <Link to="/faq" style={{ ...styles.navLink, ...(isActive('/faq') ? styles.activeNavLink : {}) }}>
                        <FaQuestionCircle /> FAQ
                    </Link>

                    {user && (
                        <Link to={getDashboardLink()} style={{ ...styles.navLink, ...(isActive(getDashboardLink()) ? styles.activeNavLink : {}) }}>
                            ⚡ Dashboard
                        </Link>
                    )}
                </div>

                {/* Right Actions */}
                <div style={styles.rightSection}>
                    {user ? (
                        <>
                            {/* Notification Dropdown */}
                            <div style={styles.notificationContainer}>
                                <button
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    style={styles.notificationBtn}
                                    title="Notifications"
                                >
                                    <FaBell />
                                    {unreadCount > 0 && <span style={styles.notificationBadge}>{unreadCount}</span>}
                                </button>

                                {notificationsOpen && (
                                    <div style={styles.notificationDropdown} className="animate-fade-in">
                                        <div style={styles.notificationHeader}>
                                            <h4 style={styles.notificationTitle}>Notifications ({notifications.length})</h4>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={markAllRead} style={styles.actionBtn}>
                                                    <FaCheckDouble /> Read
                                                </button>
                                                <button onClick={clearNotifications} style={styles.actionBtnClear}>
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </div>

                                        <div style={styles.notificationList}>
                                            {notifications.length === 0 ? (
                                                <p style={styles.emptyNotif}>No new notifications</p>
                                            ) : (
                                                notifications.map(n => (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => {
                                                            setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item));
                                                            toast(`Notification: ${n.text}`);
                                                        }}
                                                        style={{ ...styles.notificationItem, ...(n.unread ? styles.unreadItem : {}) }}
                                                    >
                                                        <p style={styles.notificationText}>{n.text}</p>
                                                        <span style={styles.notificationTime}>{n.time}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Profile Menu */}
                            <div style={styles.profileContainer}>
                                <button onClick={() => setMenuOpen(!menuOpen)} style={styles.profileBtn}>
                                    <div style={styles.avatar}>
                                        {userData?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                    </div>
                                    <span style={styles.userName}>
                                        {userData?.name?.split(' ')[0] || 'Profile'}
                                    </span>
                                </button>

                                {menuOpen && (
                                    <div style={styles.dropdownMenu} className="animate-fade-in">
                                        <div style={styles.dropdownHeader}>
                                            <p style={styles.dropdownName}>{userData?.name || 'User'}</p>
                                            <p style={styles.dropdownEmail}>{user?.email || ''}</p>
                                        </div>

                                        <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} style={styles.dropdownItem}>
                                            ⚡ My Dashboard
                                        </Link>
                                        <Link to={getProfileLink()} onClick={() => setMenuOpen(false)} style={styles.dropdownItem}>
                                            <FaUser /> My Profile
                                        </Link>
                                        <button onClick={handleLogout} style={styles.logoutDropdownItem}>
                                            <FaSignOutAlt /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={styles.guestLinks}>
                            <button onClick={() => setRoleModalOpen(true)} style={styles.loginBtn} className="btn-interactive">
                                Login
                            </button>
                            <Link to="/register" style={styles.registerBtn} className="btn-interactive">
                                Register
                            </Link>
                        </div>
                    )}

                    <button onClick={() => setMenuOpen(!menuOpen)} style={styles.mobileMenuBtn}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Role Selection Modal on Login Click */}
            {roleModalOpen && (
                <div style={styles.modalOverlay} onClick={() => setRoleModalOpen(false)}>
                    <div style={styles.roleModal} onClick={e => e.stopPropagation()} className="animate-fade-in glass-card">
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Select Login Role</h3>
                            <button onClick={() => setRoleModalOpen(false)} style={styles.closeBtn}>×</button>
                        </div>

                        <p style={styles.modalSub}>How would you like to access VikasDrishti?</p>

                        <div style={styles.roleOptionGrid}>
                            <div onClick={() => handleRoleSelect('user')} style={styles.roleOptionCard} className="btn-interactive">
                                <div style={styles.roleIconUser}>
                                    <FaUserCheck size={28} />
                                </div>
                                <h4 style={styles.roleOptionTitle}>Citizen Portal</h4>
                                <p style={styles.roleOptionDesc}>Report gali issues, track resolution proof, and upvote neighborhood complaints.</p>
                            </div>

                            <div onClick={() => handleRoleSelect('leader')} style={styles.roleOptionCard} className="btn-interactive">
                                <div style={styles.roleIconLeader}>
                                    <FaUserTie size={28} />
                                </div>
                                <h4 style={styles.roleOptionTitle}>Representative / MLA</h4>
                                <p style={styles.roleOptionDesc}>Draw ward geofences, assign maintenance teams, and broadcast SMS updates.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Navigation Drawer */}
            {menuOpen && (
                <div style={styles.mobileMenu} className="animate-fade-in">
                    <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/about" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>About Us</Link>
                    <Link to="/how-it-works" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>How It Works</Link>
                    <Link to="/contact" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Contact</Link>
                    <Link to="/faq" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>FAQ</Link>

                    {user ? (
                        <>
                            <Link to={getDashboardLink()} style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Dashboard</Link>
                            <Link to={getProfileLink()} style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Profile</Link>
                            <button onClick={handleLogout} style={styles.mobileLogoutBtn}>Sign Out</button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button onClick={() => { setMenuOpen(false); setRoleModalOpen(true); }} style={styles.loginBtn}>Login</button>
                            <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Register</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

const styles = {
    navbar: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
    navContainer: { maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '12px' },
    logoLink: { display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white', gap: '10px' },
    logoBadge: { background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', fontWeight: '800', fontSize: '18px', padding: '6px 10px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(255, 153, 51, 0.4)' },
    logoText: { fontSize: '20px', fontWeight: '700', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' },
    logoSubtext: { display: 'block', fontSize: '10px', color: '#38bdf8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
    onlinePill: { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
    offlinePill: { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
    navLinks: { display: 'flex', gap: '6px', alignItems: 'center' },
    navLink: { color: '#94a3b8', textDecoration: 'none', fontSize: '13px', fontWeight: '600', padding: '8px 12px', borderRadius: '10px', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px' },
    activeNavLink: { color: 'white', background: 'rgba(255, 255, 255, 0.1)', fontWeight: '700' },
    rightSection: { display: 'flex', alignItems: 'center', gap: '14px' },
    guestLinks: { display: 'flex', gap: '10px', alignItems: 'center' },
    loginBtn: { background: 'none', border: 'none', color: 'white', fontSize: '14px', fontWeight: '600', padding: '8px 16px', cursor: 'pointer' },
    registerBtn: { background: 'linear-gradient(135deg, #FF9933 0%, #e67e22 100%)', color: 'white', padding: '8px 18px', borderRadius: '20px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(255, 153, 51, 0.3)' },
    notificationContainer: { position: 'relative' },
    notificationBtn: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '16px', cursor: 'pointer', position: 'relative', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    notificationBadge: { position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    notificationDropdown: { position: 'absolute', top: '50px', right: '0', width: '300px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', color: '#0f172a', zIndex: 1001, overflow: 'hidden', border: '1px solid #e2e8f0' },
    notificationHeader: { padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    notificationTitle: { margin: 0, fontSize: '13px', fontWeight: '700', color: '#0f172a' },
    actionBtn: { background: 'none', border: 'none', color: '#0066CC', cursor: 'pointer', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' },
    actionBtnClear: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' },
    notificationList: { maxHeight: '250px', overflowY: 'auto' },
    notificationItem: { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' },
    unreadItem: { background: '#f0f7ff' },
    emptyNotif: { padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' },
    notificationText: { margin: '0 0 4px 0', fontSize: '13px', color: '#334155', lineHeight: '1.4' },
    notificationTime: { fontSize: '10px', color: '#94a3b8' },
    profileContainer: { position: 'relative' },
    profileBtn: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '4px 12px 4px 4px', borderRadius: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' },
    avatar: { width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #138808 0%, #16a34a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: 'white' },
    userName: { fontSize: '13px', fontWeight: '600' },
    dropdownMenu: { position: 'absolute', top: '50px', right: '0', width: '220px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', zIndex: 1001, overflow: 'hidden', border: '1px solid #e2e8f0' },
    dropdownHeader: { padding: '14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    dropdownName: { margin: '0 0 2px 0', fontSize: '14px', fontWeight: '700', color: '#0f172a' },
    dropdownEmail: { margin: 0, fontSize: '11px', color: '#64748b' },
    dropdownItem: { padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', textDecoration: 'none', fontSize: '13px', fontWeight: '600', width: '100%', border: 'none', background: 'none', cursor: 'pointer' },
    logoutDropdownItem: { padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', textDecoration: 'none', fontSize: '13px', fontWeight: '700', width: '100%', border: 'none', background: 'none', cursor: 'pointer', borderTop: '1px solid #f1f5f9' },
    mobileMenuBtn: { display: 'none', background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' },
    mobileMenu: { display: 'none', padding: '16px', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)' },
    mobileLink: { padding: '10px 0', color: 'white', textDecoration: 'none', fontSize: '14px', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    mobileLogoutBtn: { width: '100%', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', marginTop: '10px', cursor: 'pointer', fontWeight: '700' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' },
    roleModal: { background: 'white', borderRadius: '24px', width: '100%', maxWidth: '520px', padding: '28px', color: '#0f172a', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
    modalTitle: { fontSize: '20px', fontWeight: '800', margin: 0, fontFamily: 'Outfit, sans-serif' },
    closeBtn: { background: 'none', border: 'none', fontSize: '24px', color: '#94a3b8', cursor: 'pointer' },
    modalSub: { fontSize: '13px', color: '#64748b', marginBottom: '20px' },
    roleOptionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    roleOptionCard: { background: '#f8fafc', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'center' },
    roleIconUser: { width: '50px', height: '50px', borderRadius: '14px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' },
    roleIconLeader: { width: '50px', height: '50px', borderRadius: '14px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' },
    roleOptionTitle: { fontSize: '15px', fontWeight: '700', margin: '0 0 6px 0', color: '#0f172a' },
    roleOptionDesc: { fontSize: '12px', color: '#64748b', margin: 0, lineHeight: '1.4' }
};

export default Navbar;