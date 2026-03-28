import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('AuthProvider mounted - checking session...');
        
        // Add a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            console.log('⚠️ Loading timeout - forcing loading to false');
            setLoading(false);
        }, 5000);

        const checkUser = async () => {
            try {
                // Get current session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) {
                    console.error('Session error:', sessionError);
                    setError(sessionError.message);
                    clearTimeout(timeoutId);
                    setLoading(false);
                    return;
                }

                console.log('Session found:', session ? 'Yes' : 'No');
                
                if (session?.user) {
                    setUser(session.user);
                    await fetchUserProfile(session.user.id);
                } else {
                    console.log('No user logged in');
                    clearTimeout(timeoutId);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Unexpected error in checkUser:', err);
                setError(err.message);
                clearTimeout(timeoutId);
                setLoading(false);
            }
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event);
                setUser(session?.user ?? null);
                
                if (session?.user) {
                    await fetchUserProfile(session.user.id);
                } else {
                    setUserRole(null);
                    setUserData(null);
                    clearTimeout(timeoutId);
                    setLoading(false);
                }
            }
        );

        return () => {
            subscription?.unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    const fetchUserProfile = async (userId) => {
        try {
            console.log('Fetching user profile for:', userId);
            
            // Check in users table
            const { data: userProfile, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('auth_id', userId)
                .maybeSingle();

            if (userProfile) {
                console.log('Found user profile in users table');
                setUserRole('user');
                setUserData(userProfile);
                setLoading(false);
                return;
            }

            // Check in leaders table
            const { data: leaderProfile, error: leaderError } = await supabase
                .from('leaders')
                .select('*')
                .eq('auth_id', userId)
                .maybeSingle();

            if (leaderProfile) {
                console.log('Found user profile in leaders table');
                setUserRole('leader');
                setUserData(leaderProfile);
                setLoading(false);
                return;
            }

            console.log('No profile found in either table');
            setLoading(false);
            
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const signIn = async (email, password) => {
        try {
            console.log('Attempting sign in...');
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            console.log('Sign in successful:', data.user.email);
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    };

    const signOut = async () => {
        try {
            console.log('Signing out...');
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            setUserRole(null);
            setUserData(null);
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        userRole,
        userData,
        loading,
        error,
        signIn,
        signOut
    };

    // Show error if there is one
    if (error) {
        console.error('Auth Error:', error);
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};