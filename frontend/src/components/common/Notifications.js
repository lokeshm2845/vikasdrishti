import React from 'react';
import { FaBell } from 'react-icons/fa';

const Notifications = () => {
    const notifications = [
        {
            id: 1,
            text: "New complaint raised in your area",
            time: "5 min ago",
            isRead: false
        },
        {
            id: 2,
            text: "Your complaint status updated",
            time: "1 hour ago",
            isRead: false
        },
        {
            id: 3,
            text: "Project update from MLA",
            time: "2 hours ago",
            isRead: true
        },
        {
            id: 4,
            text: "Welcome to VikasDrishti",
            time: "1 day ago",
            isRead: true
        }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.titleGroup}>
                        <FaBell style={styles.headerIcon} />
                        <h2 style={styles.title}>All Notifications</h2>
                    </div>
                    <button style={styles.markAllRead}>Mark all read</button>
                </div>

                <div style={styles.list}>
                    {notifications.map(notification => (
                        <div 
                            key={notification.id} 
                            style={{
                                ...styles.item,
                                background: notification.isRead ? 'white' : '#f0f7ff',
                                borderLeft: notification.isRead ? '4px solid transparent' : '4px solid #138808'
                            }}
                        >
                            <div style={styles.itemContent}>
                                <p style={styles.itemText}>{notification.text}</p>
                                <span style={styles.itemTime}>{notification.time}</span>
                            </div>
                            {!notification.isRead && <div style={styles.unreadDot} />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '30px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '80vh',
    },
    card: {
        background: 'white',
        borderRadius: '15px',
        width: '100%',
        maxWidth: '600px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid #eee',
        background: '#f8f9fa',
    },
    titleGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    headerIcon: {
        fontSize: '24px',
        color: '#FF9933',
    },
    title: {
        margin: 0,
        fontSize: '20px',
        color: '#333',
    },
    markAllRead: {
        background: 'none',
        border: 'none',
        color: '#138808',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '14px',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid #eee',
        transition: 'background 0.3s',
        cursor: 'pointer',
    },
    itemContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    itemText: {
        margin: 0,
        fontSize: '16px',
        color: '#333',
        fontWeight: '500',
    },
    itemTime: {
        margin: 0,
        fontSize: '13px',
        color: '#888',
    },
    unreadDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#138808',
    }
};

export default Notifications;
