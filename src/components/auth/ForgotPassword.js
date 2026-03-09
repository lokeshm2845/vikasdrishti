import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const { resetPassword } = useAuth();

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        setLoading(true);

        try {
            const result = await resetPassword(email);

            if (result.success) {
                setSubmitted(true);
                toast.success('Password reset email sent! Check your inbox.');
            } else {
                toast.error(result.error || 'Failed to send reset email');
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
        style = { styles.backLink } >
        <
        FaArrowLeft / > Back to Login <
        /Link>

        <
        h2 style = { styles.title } > VikasDrishti < /h2> <
        h3 style = { styles.subtitle } > Reset Password < /h3>

        {
            submitted ? ( <
                div style = { styles.success } >
                <
                div style = { styles.successIcon } > ✅ < /div> <
                h4 style = { styles.successTitle } > Email Sent! < /h4> <
                p style = { styles.successMessage } >
                We 've sent a password reset link to:<br /> <
                strong > { email } < /strong> < /
                p > <
                p style = { styles.successNote } >
                Check your email and click the link to reset your password.If you don 't see it, check your spam folder. < /
                p > <
                Link to = "/login"
                style = { styles.returnBtn } >
                Return to Login <
                /Link> < /
                div >
            ) : ( <
                form onSubmit = { handleSubmit }
                style = { styles.form } >
                <
                p style = { styles.instructions } >
                Enter your email address and we 'll send you a link to reset your password. < /
                p >

                <
                div style = { styles.inputGroup } >
                <
                FaEnvelope style = { styles.inputIcon }
                /> <
                input type = "email"
                placeholder = "Enter your email"
                value = { email }
                onChange = {
                    (e) => setEmail(e.target.value)
                }
                style = { styles.input }
                required /
                >
                <
                /div>

                <
                button type = "submit"
                disabled = { loading }
                style = { loading ? styles.buttonDisabled : styles.button } > { loading ? 'Sending...' : 'Send Reset Link' } <
                /button>

                <
                div style = { styles.links } >
                <
                Link to = "/login"
                style = { styles.link } >
                Remember your password ? Sign In <
                /Link> < /
                div > <
                /form>
            )
        } <
        /div> < /
        div >
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
        maxWidth: '450px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative'
    },
    backLink: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#666',
        textDecoration: 'none',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
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
    instructions: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '25px',
        fontSize: '14px',
        lineHeight: '1.6',
        padding: '0 10px'
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
        boxSizing: 'border-box'
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
    },
    links: {
        textAlign: 'center',
        marginTop: '20px'
    },
    link: {
        color: '#138808',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500'
    },
    success: {
        textAlign: 'center',
        padding: '20px 0'
    },
    successIcon: {
        fontSize: '60px',
        marginBottom: '20px'
    },
    successTitle: {
        color: '#138808',
        fontSize: '24px',
        margin: '0 0 15px 0'
    },
    successMessage: {
        color: '#666',
        fontSize: '16px',
        lineHeight: '1.6',
        marginBottom: '20px'
    },
    successNote: {
        color: '#999',
        fontSize: '14px',
        lineHeight: '1.6',
        marginBottom: '30px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '10px'
    },
    returnBtn: {
        display: 'inline-block',
        background: '#138808',
        color: 'white',
        padding: '12px 30px',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        transition: 'background 0.3s'
    }
};

export default ForgotPassword;