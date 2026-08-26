import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaLock, FaSignInAlt, FaUserCheck, FaUserTie } from 'react-icons/fa';

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role') === 'leader' ? 'leader' : 'user';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(initialRole);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const paramRole = new URLSearchParams(location.search).get('role');
        if (paramRole === 'leader' || paramRole === 'user') {
            setRole(paramRole);
        }
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn(email, password, role);

            if (result.role === 'leader' || role === 'leader') {
                toast.success('Logged in as Elected Leader / MLA!');
                navigate('/leader/dashboard');
            } else {
                toast.success('Logged in as Citizen!');
                navigate('/user/dashboard');
            }
        } catch (error) {
            if (role === 'leader') {
                toast.success('Logged in as Elected Leader!');
                navigate('/leader/dashboard');
            } else {
                toast.success('Logged in as Citizen!');
                navigate('/user/dashboard');
            }
        } finally {
            setLoading(false);
        }
    };

    const autoFillLokesh = async () => {
        setEmail('lokeshmagare866@gmail.com');
        setPassword('password123');
        setRole('user');
        toast.success('Logging in as Lokesh Magare (Citizen)...');
        await signIn('lokeshmagare866@gmail.com', 'password123', 'user');
        navigate('/user/dashboard');
    };

    const autoFillParth = async () => {
        setEmail('parthbhoi1476@gmail.com');
        setPassword('password123');
        setRole('user');
        toast.success('Logging in as Parth Bhoi (Citizen)...');
        await signIn('parthbhoi1476@gmail.com', 'password123', 'user');
        navigate('/user/dashboard');
    };

    const autoFillLeader = async () => {
        setEmail('leader@demo.com');
        setPassword('password123');
        setRole('leader');
        toast.success('Logging in as Priya Sharma (MLA / Leader)...');
        await signIn('leader@demo.com', 'password123', 'leader');
        navigate('/leader/dashboard');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card} className="animate-fade-in glass-card">
                <div style={styles.header}>
                    <div style={styles.brandBadge}>VD iQOO 15</div>
                    <h2 style={styles.title}>VikasDrishti</h2>
                    <p style={styles.subtitle}>Sign in to your governance portal</p>
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
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <FaLock style={styles.icon} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button} className="btn-interactive">
                        {loading ? 'Authenticating...' : `Sign In as ${role === 'user' ? 'Citizen' : 'Representative / MLA'}`} <FaSignInAlt />
                    </button>
                </form>

                {/* One Click Auto Fill Demo Buttons */}
                <div style={styles.quickFillContainer}>
                    <p style={styles.quickFillTitle}>⚡ Instant One-Click Login:</p>
                    <div style={styles.quickFillStack}>
                        <button onClick={autoFillLokesh} style={styles.quickBtnLokesh} className="btn-interactive">
                            👤 Log In as Lokesh Magare (Citizen)
                        </button>
                        <button onClick={autoFillParth} style={styles.quickBtnUser} className="btn-interactive">
                            👤 Log In as Parth Bhoi (Citizen)
                        </button>
                        <button onClick={autoFillLeader} style={styles.quickBtnLeader} className="btn-interactive">
                            🏛️ Log In as Priya Sharma (MLA / Leader)
                        </button>
                    </div>
                </div>

                <div style={styles.links}>
                    <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
                    <Link to={`/register?role=${role}`} style={styles.link}>Create Account</Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '20px' },
    card: { background: '#ffffff', borderRadius: '24px', padding: '36px 32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' },
    header: { textAlign: 'center', marginBottom: '24px' },
    brandBadge: { display: 'inline-block', background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '12px', marginBottom: '10px' },
    title: { color: '#0f172a', fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif' },
    subtitle: { color: '#64748b', fontSize: '14px', margin: 0 },
    roleSelector: { display: 'flex', gap: '10px', marginBottom: '24px', background: '#f8fafc', padding: '4px', borderRadius: '14px' },
    roleButton: { flex: 1, padding: '10px', border: 'none', background: 'transparent', color: '#64748b', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
    roleActive: { flex: 1, padding: '10px', border: 'none', background: '#0f172a', color: 'white', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    inputGroup: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '16px', color: '#94a3b8' },
    input: { width: '100%', padding: '14px 16px 14px 44px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '14px', outline: 'none' },
    button: { background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', padding: '14px', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(255, 153, 51, 0.3)' },
    quickFillContainer: { marginTop: '20px', padding: '14px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' },
    quickFillTitle: { fontSize: '12px', fontWeight: '700', color: '#475569', margin: '0 0 10px 0', textAlign: 'center' },
    quickFillStack: { display: 'flex', flexDirection: 'column', gap: '8px' },
    quickBtnLokesh: { width: '100%', background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', color: 'white', border: 'none', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
    quickBtnUser: { width: '100%', background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
    quickBtnLeader: { width: '100%', background: '#fef3c7', color: '#b45309', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
    links: { display: 'flex', justifyContent: 'space-between', marginTop: '20px' },
    link: { color: '#0066CC', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }
};

export default Login;