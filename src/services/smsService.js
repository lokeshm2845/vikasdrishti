// Note: This requires a Twilio account
// For hackathon demo, we'll use mock SMS

export const smsService = {
    async sendSMS(phoneNumber, message) {
        try {
            // In production, call your backend API that uses Twilio
            console.log(`📱 SMS to ${phoneNumber}: ${message}`);

            // Store in database
            await supabase
                .from('notifications')
                .insert([{
                    notification_id: `SMS${Date.now()}`,
                    phone_number: phoneNumber,
                    message: message,
                    channel: 'sms',
                    status: 'sent',
                    sent_at: new Date()
                }]);

            return { success: true };
        } catch (error) {
            console.error('SMS error:', error);
            return { success: false, error };
        }
    },

    // For demo - shows browser notification instead
    async sendDemoNotification(phoneNumber, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('VikasDrishti Update', {
                body: message,
                icon: '/icon.png'
            });
        } else {
            alert(`📱 DEMO SMS to ${phoneNumber}: ${message}`);
        }
        return { success: true };
    }
};