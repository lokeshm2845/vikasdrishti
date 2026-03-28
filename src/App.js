import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { FullPageLoader } from './components/common/LoadingSpinner';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

// User Components
import UserDashboard from './components/user/UserDashboard';
import RaiseComplaint from './components/user/RaiseComplaint';
import MyComplaints from './components/user/MyComplaints';
import ComplaintStatus from './components/user/ComplaintStatus';

// Leader Components
import LeaderDashboard from './components/leader/LeaderDashboard';
import GeofenceMap from './components/leader/GeofenceMap';
import SendUpdate from './components/leader/SendUpdate';
import ComplaintsList from './components/leader/ComplaintsList';


// Page Components
import Home from './components/pages/Home';
import About from './components/pages/About';
import HowItWorks from './components/pages/HowItWorks';
import Contact from './components/pages/Contact';
import FAQ from './components/pages/FAQ';


// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, userRole, loading } = useAuth();

    if (loading) {
        return <FullPageLoader text = "Authenticating..." / > ;
    }

    // If not logged in, redirect to login
    if (!user) {
        return <Navigate to = "/login"
        replace / > ;
    }

    // If logged in but role doesn't match, redirect to appropriate dashboard
    if (allowedRole && userRole !== allowedRole) {
        if (userRole === 'user') {
            return <Navigate to = "/user/dashboard"
            replace / > ;
        } else if (userRole === 'leader') {
            return <Navigate to = "/leader/dashboard"
            replace / > ;
        }
    }

    return children;
};

// Main App Content with Routes
function AppContent() {
    const { userRole, loading } = useAuth();

    if (loading) {
        return <FullPageLoader text = "Loading..." / > ;
    }

    return ( <
        Router >
        <
        Navbar / >
        <
        Toaster position = "top-right"
        toastOptions = {
            {
                duration: 4000,
                style: {
                    background: '#363636',
                    color: '#fff',
                },
                success: {
                    duration: 3000,
                    iconTheme: {
                        primary: '#28a745',
                        secondary: '#fff',
                    },
                },
                error: {
                    duration: 4000,
                    iconTheme: {
                        primary: '#dc3545',
                        secondary: '#fff',
                    },
                },
            }
        }
        /> <
        div style = { styles.mainContent } >
        <
        Routes > { /* Public Routes - If logged in, redirect to dashboard */ } <
        Route path = "/login"
        element = {
            userRole ? (
                userRole === 'user' ? ( <
                    Navigate to = "/user/dashboard"
                    replace / >
                ) : ( <
                    Navigate to = "/leader/dashboard"
                    replace / >
                )
            ) : ( <
                Login / >
            )
        }
        /> <
        Route path = "/register"
        element = {
            userRole ? (
                userRole === 'user' ? ( <
                    Navigate to = "/user/dashboard"
                    replace / >
                ) : ( <
                    Navigate to = "/leader/dashboard"
                    replace / >
                )
            ) : ( <
                Register / >
            )
        }
        /> <
        Route path = "/forgot-password"
        element = { < ForgotPassword / > }
        /> <
        Route path = "/reset-password"
        element = { < ResetPassword / > }
        />

        { /* User Routes */ } <
        Route path = "/user/dashboard"
        element = { <
            ProtectedRoute allowedRole = "user" >
            <
            UserDashboard / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/user/raise-complaint"
        element = { <
            ProtectedRoute allowedRole = "user" >
            <
            RaiseComplaint / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/user/my-complaints"
        element = { <
            ProtectedRoute allowedRole = "user" >
            <
            MyComplaints / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/user/complaint/:id"
        element = { <
            ProtectedRoute allowedRole = "user" >
            <
            ComplaintStatus / >
            <
            /ProtectedRoute>
        }
        />

        { /* Leader Routes */ } <
        Route path = "/leader/dashboard"
        element = { <
            ProtectedRoute allowedRole = "leader" >
            <
            LeaderDashboard / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/leader/map"
        element = { <
            ProtectedRoute allowedRole = "leader" >
            <
            GeofenceMap / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/leader/send-update"
        element = { <
            ProtectedRoute allowedRole = "leader" >
            <
            SendUpdate / >
            <
            /ProtectedRoute>
        }
        /> <
        Route path = "/leader/complaints"
        element = { <
            ProtectedRoute allowedRole = "leader" >
            <
            ComplaintsList / >
            <
            /ProtectedRoute>
        }
        />
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />


        { /* Default Redirect */ } <
        Route path = "/"
        element = {
            userRole ? (
                userRole === 'user' ? ( <
                    Navigate to = "/user/dashboard"
                    replace / >
                ) : ( <
                    Navigate to = "/leader/dashboard"
                    replace / >
                )
            ) : ( <
                Navigate to = "/login"
                replace / >
            )
        }
        />

        { /* 404 Catch-all */ } <
        Route path = "*"
        element = { <
            div style = { styles.notFound } >
            <
            h1 > 404 - Page Not Found < /h1> <
            p > The page you 're looking for doesn'
            t exist. < /p> <
            button
            onClick = {
                () => window.history.back() }
            style = { styles.backButton } >
            Go Back <
            /button> <
            /div>
        }
        /> <
        /Routes> <
        /div> <
        Footer / >
        <
        /Router>
    );
}

// Main App Component
function App() {
    return ( <
        AuthProvider >
        <
        AppContent / >
        <
        /AuthProvider>
    );
}

// Styles
const styles = {
    mainContent: {
        minHeight: 'calc(100vh - 70px - 300px)',
        backgroundColor: '#f5f5f5'
    },
    notFound: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '20px'
    },
    backButton: {
        marginTop: '20px',
        padding: '10px 20px',
        background: '#FF9933',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    }
};

export default App;
