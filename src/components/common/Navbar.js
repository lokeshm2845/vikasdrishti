import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaUser, FaSignOutAlt, FaBars, FaTimes, FaBell } from 'react-icons/fa';

const Navbar = () => {
    const { user, userRole, userData, signOut } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
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

    return (
        <nav style={styles.navbar}>
            <div style={styles.navContainer}>
                {/* Logo and Brand */}
                <div style={styles.logoSection}>
                    <Link to={getDashboardLink()} style={styles.logoLink}>
                        <span style={styles.logoIcon}>🇮🇳</span>
                        <span style={styles.logoText}>VikasDrishti</span>
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                {user && (
                    <div style={styles.navLinks}>
                        <Link to={getDashboardLink()} style={styles.navLink}>
                            <FaHome style={styles.navIcon} /> Dashboard
                        </Link>
                        
                        {userRole === 'user' && (
                            <>
                                <Link to="/user/raise-complaint" style={styles.navLink}>
                                    📢 Raise Complaint
                                </Link>
                                <Link to="/user/my-complaints" style={styles.navLink}>
                                    📋 My Complaints
                                </Link>
                            </>
                        )}
                        
                        {userRole === 'leader' && (
                            <>
                                <Link to="/leader/map" style={styles.navLink}>
                                    🗺️ Geofence Map
                                </Link>
                                <Link to="/leader/complaints" style={styles.navLink}>
                                    📋 Complaints
                                </Link>
                                <Link to="/leader/send-update" style={styles.navLink}>
                                    📢 Send Update
                                </Link>
                            </>
                        )}
                    </div>
                )}

                {/* Right Section - User Menu & Notifications */}
                <div style={styles.rightSection}>
                    {user && (
                        <>
                            {/* Notifications Bell */}
                            <div style={styles.notificationContainer}>
                                <button 
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    style={styles.notificationBtn}
                                >
                                    <FaBell style={styles.notificationIcon} />
                                    <span style={styles.notificationBadge}>3</span>
                                </button>
                                
                                {notificationsOpen && (
                                    <div style={styles.notificationDropdown}>
                                        <div style={styles.notificationHeader}>
                                            <h4 style={styles.notificationTitle}>Notifications</h4>
                                            <button style={styles.markAllRead}>Mark all read</button>
                                        </div>
                                        <div style={styles.notificationList}>
                                            <div style={styles.notificationItem}>
                                                <p style={styles.notificationText}>New complaint raised in your area</p>
                                                <span style={styles.notificationTime}>5 min ago</span>
                                            </div>
                                            <div style={styles.notificationItem}>
                                                <p style={styles.notificationText}>Your complaint status updated</p>
                                                <span style={styles.notificationTime}>1 hour ago</span>
                                            </div>
                                            <div style={styles.notificationItem}>
                                                <p style={styles.notificationText}>Project update from MLA</p>
                                                <span style={styles.notificationTime}>2 hours ago</span>
                                            </div>
                                        </div>
                                        <div style={styles.notificationFooter}>
                                            <Link to="/notifications" style={styles.viewAllLink}>View all</Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Profile Dropdown */}
                            <div style={styles.profileContainer}>
                                <button 
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    style={styles.profileBtn}
                                >
                                    <div style={styles.avatar}>
                                        {userData?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span style={styles.userName}>
                                        {userData?.name?.split(' ')[0] || 'User'}
                                    </span>
                                </button>

                                {menuOpen && (
                                    <div style={styles.dropdownMenu}>
                                        <div style={styles.dropdownHeader}>
                                            <p style={styles.dropdownName}>{userData?.name}</p>
                                            <p style={styles.dropdownEmail}>{userData?.email}</p>
                                            <p style={styles.dropdownRole}>
                                                {userRole === 'user' ? 'Citizen' : 'Leader/MLA'}
                                            </p>
                                        </div>
                                        <Link to={getProfileLink()} style={styles.dropdownItem}>
                                            <FaUser style={styles.dropdownIcon} /> Profile
                                        </Link>
                                        <button onClick={handleLogout} style={styles.dropdownItem}>
                                            <FaSignOutAlt style={styles.dropdownIcon} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={styles.mobileMenuBtn}
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && user && (
                <div style={styles.mobileMenu}>
                    <Link to={getDashboardLink()} style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                        <FaHome style={styles.mobileIcon} /> Dashboard
                    </Link>
                    
                    {userRole === 'user' && (
                        <>
                            <Link to="/user/raise-complaint" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                                📢 Raise Complaint
                            </Link>
                            <Link to="/user/my-complaints" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                                📋 My Complaints
                            </Link>
                        </>
                    )}
                    
                    {userRole === 'leader' && (
                        <>
                            <Link to="/leader/map" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                                🗺️ Geofence Map
                            </Link>
                            <Link to="/leader/complaints" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                                📋 Complaints
                            </Link>
                            <Link to="/leader/send-update" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                                📢 Send Update
                            </Link>
                        </>
                    )}
                    
                    <Link to={getProfileLink()} style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                        <FaUser /> Profile
                    </Link>
                    
                    <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

const styles = {
    navbar: {
        background: '#FF9933',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    navContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px'
    },
    logoSection: {
        display: 'flex',
        alignItems: 'center'
    },
    logoLink: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'white',
        gap: '10px'
    },
    logoIcon: {
        fontSize: '28px'
    },
    logoText: {
        fontSize: '20px',
        fontWeight: 'bold'
    },
    navLinks: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '14px',
        padding: '8px 12px',
        borderRadius: '5px',
        transition: 'background 0.3s',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        ':hover': {
            background: 'rgba(255,255,255,0.2)'
        }
    },
    navIcon: {
        fontSize: '14px'
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    notificationContainer: {
        position: 'relative'
    },
    notificationBtn: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        position: 'relative',
        padding: '5px'
    },
    notificationIcon: {
        fontSize: '20px'
    },
    notificationBadge: {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        background: '#dc3545',
        color: 'white',
        fontSize: '10px',
        padding: '2px 5px',
        borderRadius: '10px',
        minWidth: '15px',
        textAlign: 'center'
    },
    notificationDropdown: {
        position: 'absolute',
        top: '40px',
        right: '0',
        width: '300px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        color: '#333',
        zIndex: 1001
    },
    notificationHeader: {
        padding: '15px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    notificationTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: 'bold'
    },
    markAllRead: {
        background: 'none',
        border: 'none',
        color: '#FF9933',
        cursor: 'pointer',
        fontSize: '12px'
    },
    notificationList: {
        maxHeight: '300px',
        overflowY: 'auto'
    },
    notificationItem: {
        padding: '12px 15px',
        borderBottom: '1px solid #f5f5f5',
        cursor: 'pointer',
        transition: 'background 0.3s',
        ':hover': {
            background: '#f8f9fa'
        }
    },
    notificationText: {
        margin: '0 0 5px 0',
        fontSize: '14px',
        color: '#333'
    },
    notificationTime: {
        fontSize: '11px',
        color: '#999'
    },
    notificationFooter: {
        padding: '12px 15px',
        borderTop: '1px solid #eee',
        textAlign: 'center'
    },
    viewAllLink: {
        color: '#FF9933',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 'bold'
    },
    profileContainer: {
        position: 'relative'
    },
    profileBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'white'
    },
    avatar: {
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        background: '#138808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white'
    },
    userName: {
        fontSize: '14px'
    },
    dropdownMenu: {
        position: 'absolute',
        top: '50px',
        right: '0',
        width: '220px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        zIndex: 1001,
        overflow: 'hidden'
    },
    dropdownHeader: {
        padding: '15px',
        background: '#f8f9fa',
        borderBottom: '1px solid #eee'
    },
    dropdownName: {
        margin: '0 0 5px 0',
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#333'
    },
    dropdownEmail: {
        margin: '0 0 5px 0',
        fontSize: '12px',
        color: '#666'
    },
    dropdownRole: {
        margin: 0,
        fontSize: '11px',
        color: '#FF9933',
        fontWeight: 'bold'
    },
    dropdownItem: {
        padding: '12px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#333',
        textDecoration: 'none',
        fontSize: '14px',
        width: '100%',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        transition: 'background 0.3s',
        ':hover': {
            background: '#f8f9fa'
        }
    },
    dropdownIcon: {
        fontSize: '14px',
        color: '#666'
    },
    mobileMenuBtn: {
        display: 'none',
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer'
    },
    mobileMenu: {
        display: 'none',
        padding: '10px',
        background: '#e68a00',
        borderTop: '1px solid rgba(255,255,255,0.2)'
    },
    mobileLink: {
        display: 'block',
        padding: '12px 15px',
        color: 'white',
        textDecoration: 'none',
        fontSize: '14px',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    mobileIcon: {
        fontSize: '16px'
    },
    mobileLogoutBtn: {
        width: '100%',
        padding: '12px 15px',
        background: '#dc3545',
        color: 'white',
        border: 'none',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },

    // Media queries
    '@media (max-width: 768px)': {
        navLinks: {
            display: 'none'
        },
        profileContainer: {
            display: 'none'
        },
        notificationContainer: {
            display: 'none'
        },
        mobileMenuBtn: {
            display: 'block'
        },
        mobileMenu: {
            display: 'block'
        }
    }
};

export default Navbar;