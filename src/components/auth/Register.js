import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [role, setRole] = useState('user');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        // User specific
        address: '',
        street: '',
        locality: '',
        // Leader specific
        title: '',
        constituency: '',
        ward: '',
        party: ''
    });
    const [loading, setLoading] = useState(false);
    
    const { signUp } = useAuth();
    const navigate = useNavigate();

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
            // Prepare profile data based on role
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
                toast.success('Registration successful! Please login.');
                navigate('/login');
            } else {
                toast.error(result.error || 'Registration failed');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>🇮🇳 VikasDrishti</h2>
                <h3 style={styles.subtitle}>Create New Account</h3>

                {/* Role Selector */}
                <div style={styles.roleSelector}>
                    <button
                        style={role === 'user' ? styles.roleActive : styles.roleButton}
                        onClick={() => setRole('user')}
                    >
                        👤 Citizen
                    </button>
                    <button
                        style={role === 'leader' ? styles.roleActive : styles.roleButton}
                        onClick={() => setRole('leader')}
                    >
                        👥 Leader/MLA
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Common Fields */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    {/* User-specific fields */}
                    {role === 'user' && (
                        <>
                            <input
                                type="text"
                                name="address"
                                placeholder="House/Flat Number"
                                value={formData.address}
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <input
                                type="text"
                                name="street"
                                placeholder="Street Name"
                                value={formData.street}
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <input
                                type="text"
                                name="locality"
                                placeholder="Locality/Area"
                                value={formData.locality}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </>
                    )}

                    {/* Leader-specific fields */}
                    {role === 'leader' && (
                        <>
                            <select
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Select Title</option>
                                <option value="MLA">MLA</option>
                                <option value="MP">MP</option>
                                <option value="Councilor">Councilor</option>
                                <option value="Mayor">Mayor</option>
                            </select>
                            
                            <input
                                type="text"
                                name="constituency"
                                placeholder="Constituency"
                                value={formData.constituency}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                            
                            <input
                                type="text"
                                name="ward"
                                placeholder="Ward Number (if applicable)"
                                value={formData.ward}
                                onChange={handleChange}
                                style={styles.input}
                            />
                            
                            <input
                                type="text"
                                name="party"
                                placeholder="Political Party"
                                value={formData.party}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={loading ? styles.buttonDisabled : styles.button}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div style={styles.links}>
                    <Link to="/login" style={styles.link}>
                        Already have an account? Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)',
        padding: '20px'
    },
    card: {
        background: 'white',
        borderRadius: '15px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        maxHeight: '90vh',
        overflowY: 'auto'
    },
    title: {
        textAlign: 'center',
        color: '#FF9933',
        fontSize: '28px',
        marginBottom: '5px'
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '30px',
        fontSize: '18px'
    },
    roleSelector: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px'
    },
    roleButton: {
        flex: 1,
        padding: '12px',
        border: '2px solid #ddd',
        background: 'white',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.3s'
    },
    roleActive: {
        flex: 1,
        padding: '12px',
        border: '2px solid #FF9933',
        background: '#FF9933',
        color: 'white',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.3s'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.3s'
    },
    button: {
        background: '#FF9933',
        color: 'white',
        padding: '14px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.3s',
        marginTop: '10px'
    },
    buttonDisabled: {
        background: '#ccc',
        color: '#666',
        padding: '14px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'not-allowed',
        marginTop: '10px'
    },
    links: {
        textAlign: 'center',
        marginTop: '20px'
    },
    link: {
        color: '#138808',
        textDecoration: 'none',
        fontSize: '14px'
    }
};

export default Register;