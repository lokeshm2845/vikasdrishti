import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { FullPageLoader } from './components/common/LoadingSpinner';
import Profile from './components/common/Profile';
import Notifications from './components/common/Notifications';

// Pages
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import FAQ from './components/pages/FAQ';
import HowItWorks from './components/pages/HowItWorks';

// Auth
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

// Dashboards & Features
import UserDashboard from './components/user/UserDashboard';
import RaiseComplaint from './components/user/RaiseComplaint';
import MyComplaints from './components/user/MyComplaints';
import ComplaintStatus from './components/user/ComplaintStatus';
import LeaderDashboard from './components/leader/LeaderDashboard';
import GeofenceMap from './components/leader/GeofenceMap';
import SendUpdate from './components/leader/SendUpdate';
import ComplaintsList from './components/leader/ComplaintsList';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, userRole, loading } = useAuth();

    if (loading) {
        return <FullPageLoader text="Authenticating..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && userRole !== allowedRole) {
        if (userRole === 'user') {
            return <Navigate to="/user/dashboard" replace />;
        } else if (userRole === 'leader') {
            return <Navigate to="/leader/dashboard" replace />;
        }
    }

    return children;
};

function AppContent() {
    const { loading } = useAuth();

    if (loading) {
        return <FullPageLoader text="Loading VikasDrishti..." />;
    }

    return (
        <Router>
            <Navbar />
            <Toaster position="top-right" toastOptions={{
                duration: 4000,
                style: { background: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '14px', border: '1px solid #334155' },
                success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } }
            }} />
            <div style={styles.mainContent}>
                <Routes>
                    {/* Public Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Protected Citizen Routes */}
                    <Route path="/user/dashboard" element={<ProtectedRoute allowedRole="user"><UserDashboard /></ProtectedRoute>} />
                    <Route path="/user/raise-complaint" element={<ProtectedRoute allowedRole="user"><RaiseComplaint /></ProtectedRoute>} />
                    <Route path="/user/my-complaints" element={<ProtectedRoute allowedRole="user"><MyComplaints /></ProtectedRoute>} />
                    <Route path="/user/complaint/:id" element={<ProtectedRoute allowedRole="user"><ComplaintStatus /></ProtectedRoute>} />
                    <Route path="/user/profile" element={<ProtectedRoute allowedRole="user"><Profile /></ProtectedRoute>} />

                    {/* Protected Leader Routes */}
                    <Route path="/leader/dashboard" element={<ProtectedRoute allowedRole="leader"><LeaderDashboard /></ProtectedRoute>} />
                    <Route path="/leader/map" element={<ProtectedRoute allowedRole="leader"><GeofenceMap /></ProtectedRoute>} />
                    <Route path="/leader/send-update" element={<ProtectedRoute allowedRole="leader"><SendUpdate /></ProtectedRoute>} />
                    <Route path="/leader/complaints" element={<ProtectedRoute allowedRole="leader"><ComplaintsList /></ProtectedRoute>} />
                    <Route path="/leader/profile" element={<ProtectedRoute allowedRole="leader"><Profile /></ProtectedRoute>} />

                    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

                    {/* Fallback 404 */}
                    <Route path="*" element={
                        <div style={styles.notFound}>
                            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a' }}>404 - Page Not Found</h1>
                            <p style={{ color: '#64748b', fontSize: '15px' }}>The page you are looking for does not exist.</p>
                            <button onClick={() => window.history.back()} style={styles.backButton}>Go Back</button>
                        </div>
                    } />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

const styles = {
    mainContent: {
        minHeight: 'calc(100vh - 70px - 280px)',
        backgroundColor: '#f8fafc'
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
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '700'
    }
};

export default App;