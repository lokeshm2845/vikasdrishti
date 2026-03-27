import { supabase } from './supabaseClient';

export const complaintService = {
    // User: Raise a new complaint
    async raiseComplaint(complaintData, user) {
        try {
            // Generate unique complaint ID
            const complaintId = `CMP${Date.now()}${Math.floor(Math.random() * 1000)}`;

            // Get location coordinates (if available)
            let latitude = complaintData.latitude;
            let longitude = complaintData.longitude;
            let locationPoint = null;

            if (latitude && longitude) {
                locationPoint = `POINT(${longitude} ${latitude})`;
            }

            // Insert complaint
            const { data, error } = await supabase
                .from('complaints')
                .insert([{
                    complaint_id: complaintId,
                    user_id: user.id,
                    title: complaintData.title,
                    description: complaintData.description,
                    original_language: complaintData.language || 'hi',
                    category: complaintData.category,
                    latitude: latitude,
                    longitude: longitude,
                    location: locationPoint ? supabase.rpc('ST_GeogFromText', { text: locationPoint }) : null,
                    photo_url: complaintData.photoUrl,
                    status: 'pending',
                    severity: complaintData.severity || 'medium'
                }])
                .select()
                .single();

            if (error) throw error;

            // Auto-assign to nearest leader (simplified - in production use geofencing)
            await assignComplaintToLeader(data.id);

            // Send SMS notification to user
            await sendComplaintNotification(user.phone, complaintId, 'raised');

            return { success: true, data };
        } catch (error) {
            console.error('Error raising complaint:', error);
            return { success: false, error: error.message };
        }
    },

    // Leader: Get complaints in their constituency
    async getLeaderComplaints(leaderId) {
        try {
            const { data, error } = await supabase
                .from('complaints')
                .select(`
                    *,
                    users:user_id (name, phone, address)
                `)
                .eq('leader_id', leaderId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching complaints:', error);
            return { success: false, error: error.message };
        }
    },

    // User: Get user's complaints
    async getUserComplaints(userId) {
        try {
            const { data, error } = await supabase
                .from('complaints')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching user complaints:', error);
            return { success: false, error: error.message };
        }
    },

    // Leader: Update complaint status
    async updateComplaintStatus(complaintId, status, resolutionNotes = '', resolutionPhoto = '') {
        try {
            const updates = {
                status: status,
                updated_at: new Date()
            };

            if (status === 'in_progress') {
                updates.assigned_at = new Date();
            } else if (status === 'resolved') {
                updates.resolved_at = new Date();
                updates.resolution_notes = resolutionNotes;
                updates.resolution_photo_url = resolutionPhoto;
            }

            const { data, error } = await supabase
                .from('complaints')
                .update(updates)
                .eq('id', complaintId)
                .select()
                .single();

            if (error) throw error;

            // Get user phone to send SMS
            const { data: complaint } = await supabase
                .from('complaints')
                .select('users:user_id (phone)')
                .eq('id', complaintId)
                .single();

            if (complaint && complaint.users && complaint.users.phone) {
                await sendComplaintNotification(
                    complaint.users.phone,
                    data.complaint_id,
                    status
                );
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error updating complaint:', error);
            return { success: false, error: error.message };
        }
    }
};

// Helper function to auto-assign complaint to nearest leader
async function assignComplaintToLeader(complaintId) {
    try {
        // Get complaint location
        const { data: complaint } = await supabase
            .from('complaints')
            .select('latitude, longitude')
            .eq('id', complaintId)
            .single();

        if (!complaint || !complaint.latitude || !complaint.longitude) {
            // If no location, assign randomly (for demo)
            const { data: leaders } = await supabase
                .from('leaders')
                .select('id')
                .limit(1);

            if (leaders && leaders.length > 0) {
                await supabase
                    .from('complaints')
                    .update({ leader_id: leaders[0].id })
                    .eq('id', complaintId);
            }
            return;
        }

        // Find nearest leader based on constituency (simplified)
        const { data: leaders } = await supabase
            .from('leaders')
            .select('id, constituency')
            .limit(1);

        if (leaders && leaders.length > 0) {
            await supabase
                .from('complaints')
                .update({ leader_id: leaders[0].id })
                .eq('id', complaintId);
        }
    } catch (error) {
        console.error('Error assigning complaint:', error);
    }
}

// Helper function to send SMS notification
async function sendComplaintNotification(phoneNumber, complaintId, status) {
    try {
        // In production, integrate with Twilio
        console.log(`📱 SMS sent to ${phoneNumber}: Complaint ${complaintId} status: ${status}`);

        // Store notification in database
        await supabase
            .from('notifications')
            .insert([{
                notification_id: `NOT${Date.now()}`,
                complaint_id: complaintId,
                type: `complaint_${status}`,
                channel: 'sms',
                message: `Your complaint ${complaintId} is now ${status}`,
                phone_number: phoneNumber,
                status: 'sent',
                sent_at: new Date()
            }]);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}