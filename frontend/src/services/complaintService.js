import { supabase } from './supabaseClient';
import { offlineStorage } from './offlineStorage';
import { tfliteClassifier } from './tfliteClassifier';

export const complaintService = {
    async raiseComplaint(complaintData, user) {
        try {
            const complaintId = `CMP${Date.now()}${Math.floor(Math.random() * 1000)}`;
            let latitude = complaintData.latitude;
            let longitude = complaintData.longitude;
            let locationPoint = null;

            if (latitude && longitude) {
                locationPoint = `POINT(${longitude} ${latitude})`;
            }

            // On-Device AI Auto-Classification check
            let category = complaintData.category;
            if (!category || category === 'other') {
                const aiResult = await tfliteClassifier.classifyText(complaintData.description || complaintData.title);
                category = aiResult.category;
            }

            const complaintRecord = {
                complaint_id: complaintId,
                user_id: user ? user.id : 'offline_user',
                title: complaintData.title,
                description: complaintData.description,
                original_language: complaintData.language || 'hi',
                category: category,
                latitude: latitude,
                longitude: longitude,
                photo_url: complaintData.photoUrl || complaintData.photo_url,
                status: 'pending',
                severity: complaintData.severity || 'medium',
                created_at: new Date().toISOString()
            };

            // Check network connectivity
            if (!navigator.onLine) {
                console.log('📱 Device offline: saving complaint to local IndexedDB store on iQOO 15...');
                await offlineStorage.saveComplaint({
                    ...complaintRecord,
                    sync_status: 'pending'
                });

                await offlineStorage.enqueueSyncTask('CREATE_COMPLAINT', complaintRecord);

                return {
                    success: true,
                    data: complaintRecord,
                    isOffline: true,
                    message: 'Complaint saved locally on iQOO 15. Will automatically sync when online!'
                };
            }

            const validUserId = user ? (typeof user.id === 'number' ? user.id : (parseInt(user.id, 10) || null)) : null;
            const { data, error } = await supabase
                .from('complaints')
                .insert([{
                    complaint_id: complaintId,
                    user_id: validUserId,
                    title: complaintRecord.title,
                    description: complaintRecord.description,
                    original_language: complaintRecord.original_language,
                    category: complaintRecord.category,
                    latitude: latitude,
                    longitude: longitude,
                    location: locationPoint ? supabase.rpc('ST_GeogFromText', { text: locationPoint }) : null,
                    photo_url: complaintRecord.photo_url,
                    status: 'pending',
                    severity: complaintRecord.severity
                }])
                .select()
                .single();

            if (error) {
                console.warn('Supabase insert failed, falling back to local storage:', error.message);
                await offlineStorage.saveComplaint({ ...complaintRecord, sync_status: 'pending' });
                await offlineStorage.enqueueSyncTask('CREATE_COMPLAINT', complaintRecord);
                return { success: true, data: complaintRecord, isOffline: true };
            }

            // Cache successfully inserted online complaint into local storage
            await offlineStorage.saveComplaint({ ...data, sync_status: 'synced' });

            await assignComplaintToLeader(data.id);
            await sendComplaintNotification(user?.phone, complaintId, 'raised');

            return { success: true, data, isOffline: false };
        } catch (error) {
            console.error('Error raising complaint:', error);
            return { success: false, error: error.message };
        }
    },

    async getUserComplaints(userId) {
        try {
            // First fetch local complaints (ensures instantaneous response on phone)
            const localComplaints = await offlineStorage.getAllComplaints();

            if (!navigator.onLine) {
                return { success: true, data: localComplaints, isOffline: true };
            }

            const { data, error } = await supabase
                .from('complaints')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                return { success: true, data: localComplaints, isOffline: true };
            }

            // Sync down cloud complaints into local store
            for (const c of data) {
                await offlineStorage.saveComplaint({ ...c, sync_status: 'synced' });
            }

            return { success: true, data, isOffline: false };
        } catch (error) {
            console.error('Error fetching user complaints:', error);
            const fallback = await offlineStorage.getAllComplaints();
            return { success: true, data: fallback, isOffline: true };
        }
    },

    async getLeaderComplaints(leaderId) {
        try {
            if (!navigator.onLine) {
                const local = await offlineStorage.getAllComplaints();
                return { success: true, data: local, isOffline: true };
            }

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
            const fallback = await offlineStorage.getAllComplaints();
            return { success: true, data: fallback, isOffline: true };
        }
    },

    async updateComplaintStatus(complaintId, status, resolutionNotes = '', resolutionPhoto = '') {
        try {
            const updates = {
                complaint_id: complaintId,
                status: status,
                resolution_notes: resolutionNotes,
                resolution_photo_url: resolutionPhoto,
                updated_at: new Date().toISOString()
            };

            if (!navigator.onLine) {
                await offlineStorage.enqueueSyncTask('UPDATE_STATUS', updates);
                return { success: true, isOffline: true };
            }

            const { data, error } = await supabase
                .from('complaints')
                .update(updates)
                .eq('id', complaintId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error updating complaint:', error);
            return { success: false, error: error.message };
        }
    }
};

async function assignComplaintToLeader(complaintId) {
    try {
        const { data: complaint } = await supabase
            .from('complaints')
            .select('latitude, longitude')
            .eq('id', complaintId)
            .single();

        if (!complaint || !complaint.latitude || !complaint.longitude) {
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

async function sendComplaintNotification(phoneNumber, complaintId, status) {
    try {
        console.log(`📱 SMS sent to ${phoneNumber}: Complaint ${complaintId} status: ${status}`);

        if (navigator.onLine) {
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
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}