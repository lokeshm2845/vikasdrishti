import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaIdCard, FaSignOutAlt, FaSave, FaMobileAlt, FaBuilding, FaShieldAlt } from 'react-icons/fa';

const Profile = () => {
    const { userData, userRole, signOut, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: userData?.name || (userRole === 'leader' ? 'Priya Sharma (MLA)' : 'Lokesh Magare'),
        phone: userData?.phone || '+91 9834260897',
        address: userData?.address || 'Shirpur, Dist. Dhule, Maharashtra, 425405',
        constituency: userData?.constituency || 'Dhule / Ward 12',
        title: userData?.title || 'Elected Representative / MLA',
        party: userData?.party || 'Representative Party',
        language: userData?.preferred_language || 'hi'
    });

    const handleSave = (e) => {
        e.preventDefault();
        updateProfile(form);
        setIsEditing(false);
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card} className="glass-card animate-fade-in">
                {/* Profile Header */}
                <div style={styles.header}>
                    <div style={styles.avatar}>
                        {form.name ? form.name.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <h2 style={styles.name}>{form.name}</h2>
                    <p style={styles.email}>{userData?.email || 'lokeshmagare866@gmail.com'}</p>

                    <div style={styles.roleBadgeRow}>
                        <span style={userRole === 'leader' ? styles.leaderBadge : styles.citizenBadge}>
                            {userRole === 'leader' ? '🏛️ Elected Representative / MLA' : '📱 iQOO Verified Citizen'}
                        </span>
                    </div>
                </div>

                {/* iQOO 15 Hardware & Account Metadata Grid */}
                <div style={styles.hardwareGrid}>
                    <div style={styles.hardwareItem}>
                        <FaMobileAlt color="#FF9933" />
                        <div>
                            <span style={styles.hwLabel}>Hardware</span>
                            <p style={styles.hwVal}>iQOO 15 Snapdragon 8 Gen 3</p>
                        </div>
                    </div>
                    <div style={styles.hardwareItem}>
                        <FaShieldAlt color="#138808" />
                        <div>
                            <span style={styles.hwLabel}>Storage Engine</span>
                            <p style={styles.hwVal}>IndexedDB + Supabase Sync</p>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSave} style={styles.form}>
                    <div style={styles.sectionTitle}>
                        <h3>Personal Details</h3>
                        {!isEditing ? (
                            <button type="button" onClick={() => setIsEditing(true)} style={styles.editBtn} className="btn-interactive">
                                Edit Profile
                            </button>
                        ) : (
                            <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelBtn}>
                                Cancel
                            </button>
                        )}
                    </div>

                    <div style={styles.infoGroup}>
                        <label style={styles.label}><FaUser style={styles.icon} /> Full Name</label>
                        {isEditing ? (
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={styles.input} required />
                        ) : (
                            <p style={styles.value}>{form.name}</p>
                        )}
                    </div>

                    <div style={styles.infoGroup}>
                        <label style={styles.label}><FaEnvelope style={styles.icon} /> Email Address</label>
                        <p style={styles.valueReadonly}>{userData?.email || 'lokeshmagare866@gmail.com'} <span style={styles.verifiedTag}>Verified</span></p>
                    </div>

                    <div style={styles.infoGroup}>
                        <label style={styles.label}><FaPhone style={styles.icon} /> Contact Phone</label>
                        {isEditing ? (
                            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={styles.input} required />
                        ) : (
                            <p style={styles.value}>{form.phone}</p>
                        )}
                    </div>

                    {userRole === 'user' ? (
                        <>
                            <div style={styles.infoGroup}>
                                <label style={styles.label}><FaMapMarkerAlt style={styles.icon} /> Street Address / Locality</label>
                                {isEditing ? (
                                    <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={styles.input} required />
                                ) : (
                                    <p style={styles.value}>{form.address}</p>
                                )}
                            </div>

                            <div style={styles.infoGroup}>
                                <label style={styles.label}><FaGlobe style={styles.icon} /> Preferred Language (Bhashini AI)</label>
                                {isEditing ? (
                                    <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} style={styles.select}>
                                        <option value="hi">हिन्दी (Hindi)</option>
                                        <option value="mr">मराठी (Marathi)</option>
                                        <option value="gu">ગુજરાતી (Gujarati)</option>
                                        <option value="en">English</option>
                                    </select>
                                ) : (
                                    <p style={styles.value}>{form.language === 'hi' ? 'हिन्दी (Hindi)' : form.language === 'mr' ? 'मराठी (Marathi)' : 'English'}</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={styles.infoGroup}>
                                <label style={styles.label}><FaBuilding style={styles.icon} /> Constituency / Ward</label>
                                {isEditing ? (
                                    <input type="text" value={form.constituency} onChange={(e) => setForm({ ...form, constituency: e.target.value })} style={styles.input} required />
                                ) : (
                                    <p style={styles.value}>{form.constituency}</p>
                                )}
                            </div>

                            <div style={styles.infoGroup}>
                                <label style={styles.label}><FaIdCard style={styles.icon} /> Title / Political Party</label>
                                {isEditing ? (
                                    <input type="text" value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })} style={styles.input} required />
                                ) : (
                                    <p style={styles.value}>{form.party}</p>
                                )}
                            </div>
                        </>
                    )}

                    {isEditing && (
                        <button type="submit" style={styles.saveBtn} className="btn-interactive">
                            <FaSave /> Save Changes
                        </button>
                    )}
                </form>

                {/* Sign Out Button */}
                <div style={styles.logoutContainer}>
                    <button onClick={handleLogout} style={styles.logoutBtn} className="btn-interactive">
                        <FaSignOutAlt /> Sign Out of Account
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px 20px', display: 'flex', justifyContent: 'center', minHeight: '85vh', background: '#f8fafc' },
    card: { background: 'white', borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
    header: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' },
    avatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', fontSize: '36px', fontWeight: '800', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '12px', boxShadow: '0 8px 20px rgba(255, 153, 51, 0.3)', fontFamily: 'Outfit, sans-serif' },
    name: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif' },
    email: { fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' },
    roleBadgeRow: { display: 'flex', gap: '8px' },
    citizenBadge: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
    leaderBadge: { background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
    hardwareGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #f1f5f9' },
    hardwareItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' },
    hwLabel: { fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', display: 'block' },
    hwVal: { fontSize: '12px', fontWeight: '700', color: '#334155', margin: 0 },
    sectionTitle: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    infoGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' },
    icon: { color: '#0066CC' },
    value: { fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0, padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' },
    valueReadonly: { fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0, padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    verifiedTag: { fontSize: '10px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' },
    input: { padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
    select: { padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
    editBtn: { background: '#f1f5f9', border: 'none', color: '#0066CC', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
    cancelBtn: { background: '#fee2e2', border: 'none', color: '#dc2626', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
    saveBtn: { background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' },
    logoutContainer: { marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
    logoutBtn: { width: '100%', background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.2)' }
};

export default Profile;
