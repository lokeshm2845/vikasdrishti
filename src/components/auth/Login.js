import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // 'user' or 'leader'
    const [loading, setLoading] = useState(false);

    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn(email, password);

            if (result.success) {
                toast.success('Login successful!');
                // Redirect based on role
                if (role === 'leader') {
                    navigate('/leader/dashboard');
                } else {
                    navigate('/user/dashboard');
                }
            } else {
                toast.error(result.error || 'Login failed');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return ( <
        div style = { styles.container } >
        <
        div style = { styles.card } >
        <
        h2 style = { styles.title } > VikasDrishti < /h2> <
        h3 style = { styles.subtitle } > Sign In < /h3>

        { /* Role Selector */ } <
        div style = { styles.roleSelector } >
        <
        button style = { role === 'user' ? styles.roleActive : styles.roleButton }
        onClick = {
            () => setRole('user') } >
        👤Citizen <
        /button> <
        button style = { role === 'leader' ? styles.roleActive : styles.roleButton }
        onClick = {
            () => setRole('leader') } >
        👥Leader / MLA <
        /button> <
        /div>

        <
        form onSubmit = { handleSubmit }
        style = { styles.form } >
        <
        div style = { styles.inputGroup } >
        <
        FaUser style = { styles.icon }
        /> <
        input type = "email"
        placeholder = "Email"
        value = { email }
        onChange = {
            (e) => setEmail(e.target.value) }
        style = { styles.input }
        required /
        >
        <
        /div>

        <
        div style = { styles.inputGroup } >
        <
        FaLock style = { styles.icon }
        /> <
        input type = "password"
        placeholder = "Password"
        value = { password }
        onChange = {
            (e) => setPassword(e.target.value) }
        style = { styles.input }
        required /
        >
        <
        /div>

        <
        button type = "submit"
        disabled = { loading }
        style = { loading ? styles.buttonDisabled : styles.button } >
        { loading ? 'Signing in...' : 'Sign In' } < FaSignInAlt / >
        <
        /button> <
        /form>

        <
        div style = { styles.links } >
        <
        Link to = "/forgot-password"
        style = { styles.link } >
        Forgot Password ?
        <
        /Link> <
        Link to = "/register"
        style = { styles.link } >
        Create New Account <
        /Link> <
        /div>

        <
        div style = { styles.demoInfo } >
        <
        p > < strong > Demo Credentials : < /strong></p >
        <
        p > User: user @demo.com / password123 < /p> <
        p > Leader: leader @demo.com / password123 < /p> <
        /div> <
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
        padding: '20px'
    },
    card: {
        background: 'white',
        borderRadius: '15px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
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
        gap: '20px'
    },
    inputGroup: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        position: 'absolute',
        left: '15px',
        color: '#999'
    },
    input: {
        width: '100%',
        padding: '15px 15px 15px 45px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.3s'
    },
    button: {
        background: '#FF9933',
        color: 'white',
        padding: '15px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'background 0.3s'
    },
    buttonDisabled: {
        background: '#ccc',
        color: '#666',
        padding: '15px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'not-allowed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
    },
    links: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px'
    },
    link: {
        color: '#138808',
        textDecoration: 'none',
        fontSize: '14px'
    },
    demoInfo: {
        marginTop: '30px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666',
        textAlign: 'center'
    }
};

export default Login;