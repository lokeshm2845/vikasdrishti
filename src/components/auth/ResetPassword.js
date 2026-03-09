import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        number: false,
        uppercase: false,
        lowercase: false,
        special: false
    });

    const { updatePassword } = useAuth();
    const navigate = useNavigate();

    // Check password strength
    useEffect(() => {
        const checks = {
            length: password.length >= 8,
            number: /[0-9]/.test(password),
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };

        setPasswordChecks(checks);

        const strengthCount = Object.values(checks).filter(Boolean).length;
        setPasswordStrength(strengthCount);
    }, [password]);

    const getStrengthColor = () => {
        if (passwordStrength <= 2) return '#dc3545';
        if (passwordStrength <= 4) return '#ffc107';
        return '#28a745';
    };

    const getStrengthText = () => {
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 4) return 'Medium';
        return 'Strong';
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        // Validation
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        if (passwordStrength < 3) {
            toast.error('Please choose a stronger password');
            return;
        }

        setLoading(true);

        try {
            const result = await updatePassword(password);

            if (result.success) {
                toast.success('Password updated successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                toast.error(result.error || 'Failed to update password');
            }
        } catch (error) {
            toast.error('An error occurred');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return ( <
        div style = { styles.container } >
        <
        div style = { styles.card } >
        <
        Link to = "/login"
        style = { styles.backLink } > ←Back to Login <
        /Link>

        <
        h2 style = { styles.title } > VikasDrishti < /h2> <
        h3 style = { styles.subtitle } > Create New Password < /h3>

        <
        form onSubmit = { handleSubmit }
        style = { styles.form } > { /* New Password Field */ } <
        div style = { styles.inputGroup } >
        <
        FaLock style = { styles.inputIcon }
        /> <
        input type = { showPassword ? "text" : "password" }
        placeholder = "New Password"
        value = { password }
        onChange = {
            (e) => setPassword(e.target.value) }
        style = { styles.input }
        required /
        >
        <
        button type = "button"
        onClick = {
            () => setShowPassword(!showPassword) }
        style = { styles.eyeButton } >
        { showPassword ? < FaEyeSlash / > : < FaEye / > } <
        /button> <
        /div>

        { /* Password Strength Meter */ } {
            password && ( <
                div style = { styles.strengthContainer } >
                <
                div style = { styles.strengthBar } >
                <
                div style = {
                    {
                        ...styles.strengthFill,
                            width: `${(passwordStrength / 5) * 100}%`,
                            background: getStrengthColor()
                    }
                }
                /> <
                /div> <
                span style = {
                    {
                        ...styles.strengthText,
                            color: getStrengthColor()
                    }
                } > { getStrengthText() }
                Password <
                /span> <
                /div>
            )
        }

        { /* Password Requirements */ } {
            password && ( <
                div style = { styles.requirements } >
                <
                p style = { styles.requirementsTitle } > Password must contain: < /p> <
                ul style = { styles.requirementsList } >
                <
                li style = {
                    {
                        ...styles.requirement,
                            color: passwordChecks.length ? '#28a745' : '#dc3545'
                    }
                } > { passwordChecks.length ? '✅' : '❌' }
                At least 8 characters <
                /li> <
                li style = {
                    {
                        ...styles.requirement,
                            color: passwordChecks.number ? '#28a745' : '#dc3545'
                    }
                } > { passwordChecks.number ? '✅' : '❌' }
                At least 1 number <
                /li> <
                li style = {
                    {
                        ...styles.requirement,
                            color: passwordChecks.uppercase ? '#28a745' : '#dc3545'
                    }
                } > { passwordChecks.uppercase ? '✅' : '❌' }
                At least 1 uppercase letter <
                /li> <
                li style = {
                    {
                        ...styles.requirement,
                            color: passwordChecks.lowercase ? '#28a745' : '#dc3545'
                    }
                } > { passwordChecks.lowercase ? '✅' : '❌' }
                At least 1 lowercase letter <
                /li> <
                li style = {
                    {
                        ...styles.requirement,
                            color: passwordChecks.special ? '#28a745' : '#dc3545'
                    }
                } > { passwordChecks.special ? '✅' : '❌' }
                At least 1 special character(!@# $ % ^ & * ) <
                /li> <
                /ul> <
                /div>
            )
        }

        { /* Confirm Password Field */ } <
        div style = { styles.inputGroup } >
        <
        FaLock style = { styles.inputIcon }
        /> <
        input type = { showConfirmPassword ? "text" : "password" }
        placeholder = "Confirm New Password"
        value = { confirmPassword }
        onChange = {
            (e) => setConfirmPassword(e.target.value) }
        style = { styles.input }
        required /
        >
        <
        button type = "button"
        onClick = {
            () => setShowConfirmPassword(!showConfirmPassword) }
        style = { styles.eyeButton } >
        { showConfirmPassword ? < FaEyeSlash / > : < FaEye / > } <
        /button> <
        /div>

        { /* Password Match Indicator */ } {
            confirmPassword && ( <
                div style = { styles.matchIndicator } > {
                    password === confirmPassword ? ( <
                        span style = {
                            { color: '#28a745' } } >
                        <
                        FaCheckCircle / > Passwords match <
                        /span>
                    ) : ( <
                        span style = {
                            { color: '#dc3545' } } > ❌Passwords do not match <
                            /span>
                    )
                } <
                /div>
            )
        }

        <
        button type = "submit"
        disabled = { loading || password !== confirmPassword || passwordStrength < 3 }
        style = {
            (loading || password !== confirmPassword || passwordStrength < 3) ? styles.buttonDisabled : styles.button } >
        { loading ? 'Updating...' : 'Update Password' } <
        /button> <
        /form> <
        /div> <
        /div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    card: {
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative'
    },
    backLink: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#666',
        textDecoration: 'none',
        fontSize: '14px'
    },
    title: {
        textAlign: 'center',
        color: '#FF9933',
        fontSize: '32px',
        margin: '20px 0 5px 0',
        fontWeight: 'bold'
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '30px',
        fontSize: '18px',
        fontWeight: 'normal'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    inputIcon: {
        position: 'absolute',
        left: '15px',
        color: '#999',
        fontSize: '16px'
    },
    input: {
        width: '100%',
        padding: '15px 15px 15px 45px',
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        fontSize: '16px',
        outline: 'none',
        transition: 'all 0.3s',
        boxSizing: 'border-box',
        paddingRight: '50px'
    },
    eyeButton: {
        position: 'absolute',
        right: '15px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#999',
        fontSize: '16px'
    },
    strengthContainer: {
        marginTop: '5px'
    },
    strengthBar: {
        height: '6px',
        background: '#e0e0e0',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '5px'
    },
    strengthFill: {
        height: '100%',
        transition: 'width 0.3s, background 0.3s'
    },
    strengthText: {
        fontSize: '12px',
        fontWeight: 'bold'
    },
    requirements: {
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '10px',
        marginTop: '5px'
    },
    requirementsTitle: {
        margin: '0 0 10px 0',
        fontSize: '13px',
        color: '#666',
        fontWeight: 'bold'
    },
    requirementsList: {
        listStyle: 'none',
        padding: '0',
        margin: '0'
    },
    requirement: {
        fontSize: '12px',
        marginBottom: '5px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    matchIndicator: {
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 0'
    },
    button: {
        background: '#FF9933',
        color: 'white',
        padding: '16px',
        border: 'none',
        borderRadius: '12px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.3s',
        marginTop: '10px',
        boxShadow: '0 4px 10px rgba(255, 153, 51, 0.3)'
    },
    buttonDisabled: {
        background: '#ccc',
        color: '#666',
        padding: '16px',
        border: 'none',
        borderRadius: '12px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'not-allowed',
        marginTop: '10px'
    }
};

export default ResetPassword;