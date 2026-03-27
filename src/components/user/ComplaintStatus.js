import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ComplaintStatus = () => {
    const { id } = useParams();
    const { userData } = useAuth();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ rating: 0, comments: '' });

    useEffect(() => {
        loadComplaint();
    }, [id]);

    const loadComplaint = async() => {
        try {
            const { data, error } = await supabase
                .from('complaints')
                .select('*, leaders:leader_id(name, title, constituency, phone)')
                .eq('id', id)
                .single();

            if (error) throw error;
            setComplaint(data);
        } catch (error) {
            toast.error('Failed to load complaint');
        } finally {
            setLoading(false);
        }
    };

    const submitFeedback = async() => {
        if (feedback.rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        try {
            const { error } = await supabase
                .from('feedback')
                .insert([{
                    complaint_id: id,
                    user_id: userData.id,
                    rating: feedback.rating,
                    comments: feedback.comments
                }]);

            if (error) throw error;
            toast.success('Thank you for your feedback!');
        } catch (error) {
            toast.error('Failed to submit feedback');
        }
    };

    if (loading) return <div style = { styles.loading } > Loading... < /div>;
    if (!complaint) return <div style = { styles.error } > Complaint not found < /div>;

    return ( <
        div style = { styles.container } >
        <
        Link to = "/user/my-complaints"
        style = { styles.backBtn } > ←Back < /Link> <
        h1 style = { styles.title } > Complaint Status < /h1>

        <
        div style = { styles.card } >
        <
        div style = { styles.header } >
        <
        h3 > { complaint.title } < /h3> <
        span style = {
            {
                ...styles.status,
                    background: complaint.status === 'pending' ? '#dc3545' :
                    complaint.status === 'in_progress' ? '#ffc107' : '#28a745'
            }
        } > { complaint.status } <
        /span> <
        /div>

        <
        p style = { styles.description } > { complaint.description } < /p>

        <
        div style = { styles.meta } >
        <
        p > < strong > Category: < /strong> {complaint.category}</p >
        <
        p > < strong > Submitted: < /strong> {new Date(complaint.created_at).toLocaleDateString()}</p >
        <
        /div>

        {
            complaint.leaders && ( <
                div style = { styles.leader } >
                <
                h4 > Assigned Leader: < /h4> <
                p > { complaint.leaders.name } - { complaint.leaders.title } < /p> <
                /div>
            )
        }

        {
            complaint.status === 'resolved' && ( <
                div style = { styles.feedback } >
                <
                h4 > Rate this resolution: < /h4> <
                div style = { styles.rating } > {
                    [1, 2, 3, 4, 5].map(r => ( <
                        span key = { r }
                        onClick = {
                            () => setFeedback({...feedback, rating: r }) }
                        style = {
                            { cursor: 'pointer', fontSize: '30px', color: r <= feedback.rating ? '#FF9933' : '#ccc' } } > ★
                        <
                        /span>
                    ))
                } <
                /div> <
                textarea placeholder = "Comments (optional)"
                value = { feedback.comments }
                onChange = {
                    (e) => setFeedback({...feedback, comments: e.target.value }) }
                style = { styles.textarea }
                /> <
                button onClick = { submitFeedback }
                style = { styles.button } > Submit Feedback < /button> <
                /div>
            )
        } <
        /div> <
        /div>
    );
};

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
    backBtn: { color: '#666', textDecoration: 'none', fontSize: '16px' },
    title: { color: '#FF9933', textAlign: 'center', margin: '20px 0' },
    card: { background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    status: { padding: '5px 15px', borderRadius: '20px', color: 'white', fontSize: '14px' },
    description: { fontSize: '16px', lineHeight: '1.6', color: '#666', marginBottom: '20px' },
    meta: { background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
    leader: { background: '#e8f5e9', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
    feedback: { marginTop: '30px' },
    rating: { display: 'flex', gap: '10px', marginBottom: '15px' },
    textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '15px' },
    button: { background: '#FF9933', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer' },
    loading: { textAlign: 'center', padding: '50px', fontSize: '18px' },
    error: { textAlign: 'center', padding: '50px', color: '#dc3545' }
};

export default ComplaintStatus;