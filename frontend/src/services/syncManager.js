/**
 * SyncManager - Automated Background Synchronizer for VikasDrishti
 * Manages seamless switching between Offline Local DB and Supabase Cloud.
 */

import { offlineStorage } from './offlineStorage';
import { supabase } from './supabaseClient';

class SyncManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.isSyncing = false;
        this.listeners = new Set();
        this.init();
    }

    init() {
        window.addEventListener('online', () => this.handleNetworkChange(true));
        window.addEventListener('offline', () => this.handleNetworkChange(false));

        // Periodic background sync check every 30 seconds if online
        setInterval(() => {
            if (this.isOnline && !this.isSyncing) {
                this.syncPendingData();
            }
        }, 30000);
    }

    handleNetworkChange(onlineStatus) {
        this.isOnline = onlineStatus;
        console.log(`📡 Network status changed: ${onlineStatus ? 'ONLINE' : 'OFFLINE'}`);
        this.notifyListeners({ status: onlineStatus ? 'online' : 'offline' });

        if (onlineStatus) {
            this.syncPendingData();
        }
    }

    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notifyListeners(event) {
        this.listeners.forEach(cb => cb(event));
    }

    async syncPendingData() {
        if (!this.isOnline || this.isSyncing) return;
        this.isSyncing = true;
        this.notifyListeners({ status: 'syncing_started' });

        try {
            const queue = await offlineStorage.getSyncQueue();
            if (!queue || queue.length === 0) {
                this.isSyncing = false;
                this.notifyListeners({ status: 'sync_complete', syncedCount: 0 });
                return;
            }

            console.log(`🔄 Flushing ${queue.length} offline actions to Supabase...`);
            let syncedCount = 0;

            for (const task of queue) {
                try {
                    let success = false;
                    if (task.action === 'CREATE_COMPLAINT') {
                        success = await this.syncComplaint(task.payload);
                    } else if (task.action === 'UPDATE_STATUS') {
                        success = await this.syncStatusUpdate(task.payload);
                    }

                    if (success) {
                        await offlineStorage.removeSyncTask(task.id);
                        syncedCount++;
                    }
                } catch (err) {
                    console.error('Failed to sync task:', task, err);
                }
            }

            console.log(`✅ Background sync finished. ${syncedCount} items uploaded.`);
            this.notifyListeners({ status: 'sync_complete', syncedCount });
        } catch (error) {
            console.error('Sync Manager error:', error);
            this.notifyListeners({ status: 'sync_failed', error: error.message });
        } finally {
            this.isSyncing = false;
        }
    }

    async syncComplaint(complaintData) {
            const validUserId = typeof complaintData.user_id === 'number' ? complaintData.user_id : (parseInt(complaintData.user_id, 10) || null);
            const { error } = await supabase
                .from('complaints')
                .upsert([{
                    complaint_id: complaintData.complaint_id,
                    user_id: validUserId,
                    title: complaintData.title,
                    description: complaintData.description,
                    original_language: complaintData.original_language || 'hi',
                    category: complaintData.category,
                    latitude: complaintData.latitude,
                    longitude: complaintData.longitude,
                    photo_url: complaintData.photo_url,
                    status: complaintData.status || 'pending',
                    severity: complaintData.severity || 'medium',
                    created_at: complaintData.created_at
                }]);

        if (error) {
            console.error('Supabase complaint sync failed:', error);
            return false;
        }

        // Update local complaint sync state
        await offlineStorage.saveComplaint({
            ...complaintData,
            sync_status: 'synced'
        });

        return true;
    }

    async syncStatusUpdate(updateData) {
        const { error } = await supabase
            .from('complaints')
            .update({
                status: updateData.status,
                resolution_notes: updateData.resolution_notes,
                resolution_photo_url: updateData.resolution_photo_url,
                updated_at: new Date()
            })
            .eq('complaint_id', updateData.complaint_id);

        return !error;
    }
}

export const syncManager = new SyncManager();
