/**
 * OfflineStorage - High-Performance IndexedDB Storage Engine for VikasDrishti
 * Optimized for iQOO 15 On-Device Storage & Offline Resilience.
 */

const DB_NAME = 'VikasDrishtiOfflineDB';
const DB_VERSION = 1;

class OfflineStorageEngine {
    constructor() {
        this.db = null;
        this.initPromise = this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                console.warn('IndexedDB not supported. Falling back to localStorage.');
                resolve(null);
                return;
            }

            const request = window.indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error('IndexedDB error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('✅ Offline Storage initialized on iQOO 15');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Store for offline complaints created locally
                if (!db.objectStoreNames.contains('complaints')) {
                    const complaintStore = db.createObjectStore('complaints', { keyPath: 'complaint_id' });
                    complaintStore.createIndex('sync_status', 'sync_status', { unique: false });
                    complaintStore.createIndex('created_at', 'created_at', { unique: false });
                }

                // Sync Queue for pending background server pushes
                if (!db.objectStoreNames.contains('sync_queue')) {
                    const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
                    syncStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Store for cached geofence boundaries for on-device matching
                if (!db.objectStoreNames.contains('geofences')) {
                    db.createObjectStore('geofences', { keyPath: 'id' });
                }

                // Cached offline translations & dictionaries
                if (!db.objectStoreNames.contains('translations')) {
                    db.createObjectStore('translations', { keyPath: 'key' });
                }
            };
        });
    }

    async getDB() {
        if (!this.db) {
            await this.initPromise;
        }
        return this.db;
    }

    // --- Complaint Operations ---
    async saveComplaint(complaint) {
        const db = await this.getDB();
        if (!db) return this.fallbackSave('complaints_' + complaint.complaint_id, complaint);

        return new Promise((resolve, reject) => {
            const tx = db.transaction(['complaints'], 'readwrite');
            const store = tx.objectStore('complaints');
            const item = {
                ...complaint,
                sync_status: complaint.sync_status || 'pending',
                saved_at: new Date().toISOString()
            };
            const request = store.put(item);

            request.onsuccess = () => resolve(item);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    async getAllComplaints() {
        const db = await this.getDB();
        if (!db) return this.fallbackGetAll('complaints_');

        return new Promise((resolve, reject) => {
            const tx = db.transaction(['complaints'], 'readonly');
            const store = tx.objectStore('complaints');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    // --- Sync Queue Operations ---
    async enqueueSyncTask(action, payload) {
        const db = await this.getDB();
        const syncItem = {
            action,
            payload,
            timestamp: Date.now(),
            retryCount: 0
        };

        if (!db) {
            const queue = JSON.parse(localStorage.getItem('vd_sync_queue') || '[]');
            queue.push(syncItem);
            localStorage.setItem('vd_sync_queue', JSON.stringify(queue));
            return syncItem;
        }

        return new Promise((resolve, reject) => {
            const tx = db.transaction(['sync_queue'], 'readwrite');
            const store = tx.objectStore('sync_queue');
            const request = store.add(syncItem);

            request.onsuccess = () => resolve(syncItem);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    async getSyncQueue() {
        const db = await this.getDB();
        if (!db) {
            return JSON.parse(localStorage.getItem('vd_sync_queue') || '[]');
        }

        return new Promise((resolve, reject) => {
            const tx = db.transaction(['sync_queue'], 'readonly');
            const store = tx.objectStore('sync_queue');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    async removeSyncTask(id) {
        const db = await this.getDB();
        if (!db) {
            const queue = JSON.parse(localStorage.getItem('vd_sync_queue') || '[]');
            const updated = queue.filter(item => item.id !== id);
            localStorage.setItem('vd_sync_queue', JSON.stringify(updated));
            return;
        }

        return new Promise((resolve, reject) => {
            const tx = db.transaction(['sync_queue'], 'readwrite');
            const store = tx.objectStore('sync_queue');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e.target.error);
        });
    }

    // --- Offline Geofences ---
    async cacheGeofences(geofences) {
        const db = await this.getDB();
        if (!db) return;

        const tx = db.transaction(['geofences'], 'readwrite');
        const store = tx.objectStore('geofences');
        geofences.forEach(gf => store.put(gf));
    }

    async getCachedGeofences() {
        const db = await this.getDB();
        if (!db) return [];

        return new Promise((resolve, reject) => {
            const tx = db.transaction(['geofences'], 'readonly');
            const store = tx.objectStore('geofences');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => resolve([]);
        });
    }

    // --- Fallback LocalStorage Handlers ---
    fallbackSave(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
        return val;
    }

    fallbackGetAll(prefix) {
        const results = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(prefix)) {
                results.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        return results;
    }
}

export const offlineStorage = new OfflineStorageEngine();
