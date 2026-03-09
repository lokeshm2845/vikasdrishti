import { supabase } from './supabaseClient';

export const authService = {
    // Register new user
    async register(email, password, userData, role = 'user') {
        try {
            // Create auth user
            const { user, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) throw error;

            // Add to appropriate table
            const table = role === 'user' ? 'users' : 'leaders';
            const { error: profileError } = await supabase
                .from(table)
                .insert([{
                    auth_id: user.id,
                    email,
                    ...userData
                }]);

            if (profileError) throw profileError;

            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Login
    async login(email, password) {
        try {
            const { user, error } = await supabase.auth.signIn({
                email,
                password
            });

            if (error) throw error;

            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Logout
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get current user
    getCurrentUser() {
        return supabase.auth.user();
    },

    // Get user profile
    async getUserProfile(userId, role) {
        try {
            const table = role === 'user' ? 'users' : 'leaders';
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq('auth_id', userId)
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update profile
    async updateProfile(userId, role, updates) {
        try {
            const table = role === 'user' ? 'users' : 'leaders';
            const { error } = await supabase
                .from(table)
                .update(updates)
                .eq('auth_id', userId);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Reset password
    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.api.resetPasswordForEmail(email);
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update password
    async updatePassword(newPassword) {
        try {
            const { error } = await supabase.auth.update({
                password: newPassword
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};