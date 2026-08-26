import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserCheck, FaUserTie, FaBuilding, FaIdCard } from 'react-icons/fa';

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role') === 'leader' ? 'leader' : 'user';

    const [role, setRole] = useState(initialRole);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        // Citizen specific
        address: '',
        street: '',
        locality: '',
        // Leader specific
        title: 'MLA',
        constituency: '',
        ward: '',
        party: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const paramRole = new URLSearchParams(location.search).get('role');
        if (paramRole === 'leader' || paramRole === 'user') {
            setRole(paramRole);
        }
    }, [location.search]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const profileData = {
                name: formData.name,
                phone: formData.phone
            };

            if (role === 'user') {
                profileData.address = formData.address;
                profileData.street_name = formData.street;
                profileData.locality = formData.locality;
            } else {
                profileData.title = formData.title;
                profileData.constituency = formData.constituency;
                profileData.ward_number = formData.ward;
                profileData.party = formData.party;
            }

            const result = await signUp(
                formData.email,
                formData.password,
                role,
                profileData
            );

            if (result.success) {
                toast.success('Registration successful! Redirecting to dashboard...');
                if (role === 'leader') {
                    navigate('/leader/dashboard');
                } else {
                    navigate('/user/dashboard');
                }
            } else {
                toast.error(result.error || 'Registration failed');
            }
        } catch (error) {
            toast.error('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card} className="animate-fade-in glass-card">
                <div style={styles.header}>
                    <div style={styles.brandBadge}>VD iQOO 15</div>
                    <h2 style={styles.title}>VikasDrishti</h2>
                    <p style={styles.subtitle}>Create your governance account</p>
                </div>

                {/* Role Selector */}
                <div style={styles.roleSelector}>
                    <button
                        type="button"
                        style={role === 'user' ? styles.roleActive : styles.roleButton}
                        onClick={() => setRole('user')}
                        className="btn-interactive"
                    >
                        <FaUserCheck /> Citizen
                    </button>
                    <button
                        type="button"
                        style={role === 'leader' ? styles.roleActive : styles.roleButton}
                        onClick={() => setRole('leader')}
                        className="btn-interactive"
                    >
                        <FaUserTie /> Representative / MLA
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <FaUser style={styles.icon} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name *"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <FaEnvelope style={styles.icon} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address *"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <FaPhone style={styles.icon} />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number *"
                            value={formData.phone}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <FaLock style={styles.icon} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password *"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <FaLock style={styles.icon} />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password *"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Citizen-specific fields */}
                    {role === 'user' && (
                        <>
                            <div style={styles.inputGroup}>
                                <FaBuilding style={styles.icon} />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="House/Flat Address *"
                                    value={formData.address}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <FaBuilding style={styles.icon} />
                                <input
                                    type="text"
                                    name="locality"
                                    placeholder="Locality / Area (e.g. Shivajinagar) *"
                                    value={formData.locality}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Leader-specific fields */}
                    {role === 'leader' && (
                        <>
                            <div style={styles.inputGroup}>
                                <FaIdCard style={styles.icon} />
                                <select
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    style={styles.select}
                                    required
                                >
                                    <option value="MLA">MLA (Member of Legislative Assembly)</option>
                                    <option value="MP">MP (Member of Parliament)</option>
                                    <option value="Ward Councillor">Ward Councillor</option>
                                    <option value="Mayor">Mayor</option>
                                </select>
                            </div>

                            <div style={styles.inputGroup}>
                                <FaBuilding style={styles.icon} />
                                <input
                                    type="text"
                                    name="constituency"
                                    placeholder="Constituency Name (e.g. Pune Central) *"
                                    value={formData.constituency}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <FaBuilding style={styles.icon} />
                                <input
                                    type="text"
                                    name="party"
                                    placeholder="Political Party Name *"
                                    value={formData.party}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" disabled={loading} style={styles.button} className="btn-interactive">
                        {loading ? 'Creating Account...' : `Register as ${role === 'user' ? 'Citizen' : 'Leader'}`}
                    </button>
                </form>

                <div style={styles.links}>
                    <Link to={`/login?role=${role}`} style={styles.link}>
                        Already have an account? Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '30px 20px' },
    card: { background: '#ffffff', borderRadius: '24px', padding: '36px 32px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', maxHeight: '90vh', overflowY: 'auto' },
    header: { textAlign: 'center', marginBottom: '24px' },
    brandBadge: { display: 'inline-block', background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '12px', marginBottom: '10px' },
    title: { color: '#0f172a', fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif' },
    subtitle: { color: '#64748b', fontSize: '14px', margin: 0 },
    roleSelector: { display: 'flex', gap: '10px', marginBottom: '24px', background: '#f8fafc', padding: '4px', borderRadius: '14px' },
    roleButton: { flex: 1, padding: '10px', border: 'none', background: 'transparent', color: '#64748b', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
    roleActive: { flex: 1, padding: '10px', border: 'none', background: '#0f172a', color: 'white', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)' },
    form: { display: 'flex', flexDirection: 'column', gap: '14px' },
    inputGroup: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '16px', color: '#94a3b8' },
    input: { width: '100%', padding: '12px 16px 12px 44px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '14px', outline: 'none' },
    select: { width: '100%', padding: '12px 16px 12px 44px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white' },
    button: { background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', padding: '14px', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(255, 153, 51, 0.3)', marginTop: '8px' },
    links: { textAlign: 'center', marginTop: '20px' },
    link: { color: '#0066CC', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }
};

export default Register;