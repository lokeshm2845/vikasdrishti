import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dynamic role resolution from DB tables by auth_id
    const fetchUserRoleAndProfile = async (authId, userEmail) => {
        try {
            // 1. Check leaders table (MLAs / Councilors)
            const { data: leaderProfile } = await supabase
                .from('leaders')
                .select('*')
                .eq('auth_id', authId)
                .maybeSingle();

            if (leaderProfile) {
                return { role: 'leader', profile: leaderProfile };
            }

            // 2. Check users table (Citizens)
            const { data: citizenProfile } = await supabase
                .from('users')
                .select('*')
                .eq('auth_id', authId)
                .maybeSingle();

            if (citizenProfile) {
                return { role: 'user', profile: citizenProfile };
            }

            // 3. Fallback check by email matching for demo profiles
            if (userEmail && (userEmail.includes('leader') || userEmail.includes('priya'))) {
                return {
                    role: 'leader',
                    profile: {
                        id: 101,
                        auth_id: authId,
                        name: 'Priya Sharma (MLA)',
                        email: userEmail,
                        phone: '+91 98100 11001',
                        title: 'Elected Member of Legislative Assembly',
                        constituency: 'Shirpur & Dhule / Ward 4',
                        party: 'Representative Party (MLAs)',
                        role: 'leader'
                    }
                };
            }

            if (userEmail && userEmail.includes('parth')) {
                return {
                    role: 'user',
                    profile: {
                        id: 2,
                        auth_id: authId,
                        name: 'Parth Bhoi',
                        email: userEmail,
                        phone: '+91 98100 11101',
                        address: 'FC Road, Shivajinagar, Pune',
                        preferred_language: 'hi',
                        role: 'user'
                    }
                };
            }

            // Default Citizen User: Lokesh Magare
            return {
                role: 'user',
                profile: {
                    id: 1,
                    auth_id: authId,
                    name: 'Lokesh Magare',
                    email: userEmail || 'lokeshmagare866@gmail.com',
                    phone: '+91 9834260897',
                    address: 'Shirpur, Dist. Dhule, Maharashtra, 425405',
                    preferred_language: 'hi',
                    role: 'user'
                }
            };
        } catch (error) {
            console.error('Error in fetchUserRoleAndProfile:', error);
            return {
                role: 'user',
                profile: {
                    id: 1,
                    name: 'Lokesh Magare',
                    email: userEmail || 'lokeshmagare866@gmail.com',
                    phone: '+91 9834260897',
                    address: 'Shirpur, Dist. Dhule, Maharashtra, 425405',
                    role: 'user'
                }
            };
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            try {
                let activeSession = null;
                try {
                    const sessionRes = await supabase.auth.getSession();
                    activeSession = sessionRes?.data?.session;
                } catch (e) {
                    console.warn('Supabase session fetch bypassed:', e);
                }

                if (activeSession?.user) {
                    const activeUser = activeSession.user;
                    if (isMounted) {
                        setUser(activeUser);
                        const { role, profile } = await fetchUserRoleAndProfile(activeUser.id, activeUser.email);
                        setUserRole(role);
                        setUserData(profile);
                        localStorage.setItem('vd_demo_role', role);
                        localStorage.setItem('vd_demo_user', JSON.stringify(profile));
                    }
                } else if (isMounted) {
                    // Check local storage for persistent demo/local login
                    const savedRole = localStorage.getItem('vd_demo_role');
                    const savedUserRaw = localStorage.getItem('vd_demo_user');
                    if (savedRole && savedUserRaw) {
                        try {
                            const parsedProfile = JSON.parse(savedUserRaw);
                            setUser({ id: parsedProfile.auth_id || parsedProfile.id || 'demo_user', email: parsedProfile.email });
                            setUserRole(savedRole);
                            setUserData(parsedProfile);
                        } catch (e) {
                            setUser(null);
                            setUserRole(null);
                            setUserData(null);
                        }
                    } else {
                        setUser(null);
                        setUserRole(null);
                        setUserData(null);
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                if (isMounted) {
                    const savedRole = localStorage.getItem('vd_demo_role');
                    const savedUserRaw = localStorage.getItem('vd_demo_user');
                    if (savedRole && savedUserRaw) {
                        try {
                            const parsedProfile = JSON.parse(savedUserRaw);
                            setUser({ id: parsedProfile.auth_id || parsedProfile.id || 'demo_user', email: parsedProfile.email });
                            setUserRole(savedRole);
                            setUserData(parsedProfile);
                        } catch (e) {
                            setUser(null);
                            setUserRole(null);
                            setUserData(null);
                        }
                    } else {
                        setUser(null);
                        setUserRole(null);
                        setUserData(null);
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                try {
                    if (session?.user && isMounted) {
                        setUser(session.user);
                        const { role, profile } = await fetchUserRoleAndProfile(session.user.id, session.user.email);
                        setUserRole(role);
                        setUserData(profile);
                        localStorage.setItem('vd_demo_role', role);
                        localStorage.setItem('vd_demo_user', JSON.stringify(profile));
                    } else if (event === 'SIGNED_OUT' && isMounted) {
                        setUser(null);
                        setUserRole(null);
                        setUserData(null);
                        localStorage.removeItem('vd_demo_role');
                        localStorage.removeItem('vd_demo_user');
                    }
                } catch (error) {
                    console.error('Auth state change error:', error);
                } finally {
                    if (isMounted) setLoading(false);
                }
            }
        );

        return () => {
            isMounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    const signIn = async (email, password, desiredRole = 'user') => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            const activeUser = data.user;
            setUser(activeUser);

            const { role, profile } = await fetchUserRoleAndProfile(activeUser.id, activeUser.email);
            setUserRole(role);
            setUserData(profile);

            localStorage.setItem('vd_demo_role', role);
            localStorage.setItem('vd_demo_user', JSON.stringify(profile));

            return { success: true, user: activeUser, role, profile };
        } catch (error) {
            console.warn('Supabase auth signIn error, activating demo mode fallback:', error.message);

            const isLeader = desiredRole === 'leader' || (email && (email.includes('leader') || email.includes('priya')));
            const activeRole = isLeader ? 'leader' : 'user';

            let demoProfile;
            if (isLeader) {
                demoProfile = {
                    id: 101,
                    auth_id: 'leader_101',
                    name: 'Priya Sharma (MLA)',
                    email: email || 'leader@demo.com',
                    phone: '+91 98100 11001',
                    title: 'Elected Member of Legislative Assembly',
                    constituency: 'Shirpur & Dhule / Ward 4',
                    party: 'Representative Party (MLAs)',
                    role: 'leader'
                };
            } else if (email && email.includes('parth')) {
                demoProfile = {
                    id: 2,
                    auth_id: 'user_2',
                    name: 'Parth Bhoi',
                    email: email || 'parthbhoi1476@gmail.com',
                    phone: '+91 98100 11101',
                    address: 'FC Road, Shivajinagar, Pune',
                    preferred_language: 'hi',
                    role: 'user'
                };
            } else {
                demoProfile = {
                    id: 1,
                    auth_id: 'user_1',
                    name: 'Lokesh Magare',
                    email: email || 'lokeshmagare866@gmail.com',
                    phone: '+91 9834260897',
                    address: 'Shirpur, Dist. Dhule, Maharashtra, 425405',
                    preferred_language: 'hi',
                    role: 'user'
                };
            }

            const mockUserObj = { id: demoProfile.auth_id, email: demoProfile.email };
            setUser(mockUserObj);
            setUserRole(activeRole);
            setUserData(demoProfile);

            localStorage.setItem('vd_demo_role', activeRole);
            localStorage.setItem('vd_demo_user', JSON.stringify(demoProfile));

            return { success: true, isDemo: true, role: activeRole, profile: demoProfile };
        }
    };

    const signUp = async (email, password, role, profileData) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) throw error;

            const authId = data.user.id;
            const targetTable = role === 'leader' ? 'leaders' : 'users';

            const recordToInsert = role === 'leader' ? {
                auth_id: authId,
                name: profileData.name,
                email: email,
                phone: profileData.phone,
                title: profileData.title || 'Elected Representative',
                constituency: profileData.constituency || 'Ward 4',
                party: profileData.party || 'Independent'
            } : {
                auth_id: authId,
                name: profileData.name,
                email: email,
                phone: profileData.phone,
                address: profileData.address,
                locality: profileData.locality,
                city: profileData.city || 'Dhule'
            };

            await supabase.from(targetTable).insert([recordToInsert]);

            return { success: true, user: data.user, role };
        } catch (error) {
            console.warn('Supabase signUp warning, creating demo profile:', error.message);
            const mockProfile = {
                id: Date.now(),
                auth_id: `user_${Date.now()}`,
                name: profileData.name,
                email: email,
                phone: profileData.phone,
                address: profileData.address || profileData.constituency || 'Shirpur',
                role: role
            };

            setUser({ id: mockProfile.auth_id, email: email });
            setUserRole(role);
            setUserData(mockProfile);

            localStorage.setItem('vd_demo_role', role);
            localStorage.setItem('vd_demo_user', JSON.stringify(mockProfile));

            return { success: true, isDemo: true, role };
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (e) {
            // Ignore offline signout error
        }
        setUser(null);
        setUserRole(null);
        setUserData(null);
        localStorage.clear();
        toast.success('Successfully logged out!');
    };

    const updateProfile = (updatedFields) => {
        const merged = { ...userData, ...updatedFields };
        setUserData(merged);
        localStorage.setItem('vd_demo_user', JSON.stringify(merged));
        toast.success('Profile updated successfully!');
    };

    const value = {
        user,
        userRole,
        userData,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};