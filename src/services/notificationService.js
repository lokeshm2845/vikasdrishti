import { supabase } from './supabaseClient';

export const notificationService = {
    // Send notification to user
    async sendNotification(recipientId, recipientType, data) {
        try {
            const notificationId = `NOT${Date.now()}${Math.floor(Math.random() * 1000)}`;

            const notificationData = {
                notification_id: notificationId,
                type: data.type,
                channel: data.channel || 'in_app',
                message: data.message,
                message_hindi: data.messageHindi,
                phone_number: data.phoneNumber,
                status: 'pending'
            };

            if (recipientType === 'user') {
                notificationData.user_id = recipientId;
            } else {
                notificationData.leader_id = recipientId;
            }

            if (data.complaintId) {
                notificationData.complaint_id = data.complaintId;
            }

            const { error } = await supabase
                .from('notifications')
                .insert([notificationData]);

            if (error) throw error;

            // If SMS, send via SMS service
            if (data.channel === 'sms' && data.phoneNumber) {
                await sendSMS(data.phoneNumber, data.message);
            }

            return { success: true };
        } catch (error) {
            console.error('Error sending notification:', error);
            return { success: false, error: error.message };
        }
    },

    // Get user notifications
    async getUserNotifications(userId) {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get leader notifications
    async getLeaderNotifications(leaderId) {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('leader_id', leaderId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Mark notification as read
    async markAsRead(notificationId) {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ status: 'read' })
                .eq('id', notificationId);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Mark all as read
    async markAllAsRead(userId, userType) {
        try {
            let query = supabase
                .from('notifications')
                .update({ status: 'read' })
                .eq('status', 'pending');

            if (userType === 'user') {
                query = query.eq('user_id', userId);
            } else {
                query = query.eq('leader_id', userId);
            }

            const { error } = await query;

            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete notification
    async deleteNotification(notificationId) {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// Helper function to send SMS (mock for demo)
async function sendSMS(phoneNumber, message) {
    console.log(`📱 SMS to ${phoneNumber}: ${message}`);

    // In production, integrate with Twilio or other SMS service
    return { success: true };
}