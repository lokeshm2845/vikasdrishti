import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            
            if (session?.user) {
                await fetchUserRole(session.user.id);
            }
            
            setLoading(false);
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchUserRole(session.user.id);
                } else {
                    setUserRole(null);
                    setUserData(null);
                }
                setLoading(false);
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const fetchUserRole = async (userId) => {
        try {
            // Check if user exists in users table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('auth_id', userId)
                .maybeSingle();

            if (userData) {
                setUserRole('user');
                setUserData(userData);
                return;
            }

            // Check if user exists in leaders table
            const { data: leaderData, error: leaderError } = await supabase
                .from('leaders')
                .select('*')
                .eq('auth_id', userId)
                .maybeSingle();

            if (leaderData) {
                setUserRole('leader');
                setUserData(leaderData);
                return;
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };

    const signUp = async (email, password, role, profileData) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) throw error;

            if (data.user) {
                if (role === 'user') {
                    const { error: profileError } = await supabase
                        .from('users')
                        .insert([{
                            auth_id: data.user.id,
                            email: email,
                            ...profileData
                        }]);

                    if (profileError) throw profileError;
                } else if (role === 'leader') {
                    const { error: profileError } = await supabase
                        .from('leaders')
                        .insert([{
                            auth_id: data.user.id,
                            email: email,
                            ...profileData
                        }]);

                    if (profileError) throw profileError;
                }
            }

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error signing out:', error);
    };

    const resetPassword = async (email) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const updatePassword = async (newPassword) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        userRole,
        userData,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};