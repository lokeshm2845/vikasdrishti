import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext({});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user, userRole, userData } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        loadNotifications();
        
        // Subscribe to new notifications
        const subscription = supabase
            .channel('notifications')
            .on('postgres_changes', 
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'notifications' 
                }, 
                payload => {
                    const newNotification = payload.new;
                    
                    // Check if notification is for current user
                    if ((userRole === 'user' && newNotification.user_id === userData?.id) ||
                        (userRole === 'leader' && newNotification.leader_id === userData?.id)) {
                        
                        setNotifications(prev => [newNotification, ...prev]);
                        setUnreadCount(prev => prev + 1);
                        
                        toast.custom((t) => (
                            <div style={{
                                background: '#FF9933',
                                color: 'white',
                                padding: '15px',
                                borderRadius: '10px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                maxWidth: '300px'
                            }}>
                                <strong>{newNotification.type.replace(/_/g, ' ').toUpperCase()}</strong>
                                <p>{newNotification.message}</p>
                            </div>
                        ), { duration: 5000 });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user, userRole, userData]);

    const loadNotifications = async () => {
        try {
            let query = supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (userRole === 'user' && userData) {
                query = query.eq('user_id', userData.id);
            } else if (userRole === 'leader' && userData) {
                query = query.eq('leader_id', userData.id);
            }

            const { data, error } = await query;

            if (error) throw error;

            setNotifications(data || []);
            setUnreadCount(data?.filter(n => n.status === 'pending').length || 0);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ status: 'read' })
                .eq('id', notificationId);

            if (error) throw error;

            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, status: 'read' } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            let query = supabase
                .from('notifications')
                .update({ status: 'read' })
                .eq('status', 'pending');

            if (userRole === 'user' && userData) {
                query = query.eq('user_id', userData.id);
            } else if (userRole === 'leader' && userData) {
                query = query.eq('leader_id', userData.id);
            }

            const { error } = await query;

            if (error) throw error;

            setNotifications(prev =>
                prev.map(n => ({ ...n, status: 'read' }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const value = {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications: loadNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};