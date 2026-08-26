import { supabase } from './supabaseClient';

export const authService = {
    async register(email, password, userData, role = 'user') {
        try {
            const { user, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) throw error;

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

    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    getCurrentUser() {
        return supabase.auth.user();
    },

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

    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.api.resetPasswordForEmail(email);
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

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