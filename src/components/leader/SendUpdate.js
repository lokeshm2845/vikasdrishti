import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaUsers, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SendUpdate = () => {
    const { userData } = useAuth();
    const navigate = useNavigate();

    const [polygon, setPolygon] = useState([]);
    const [voters, setVoters] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectType, setProjectType] = useState('road');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Draw, 2: Compose, 3: Preview

    // Component to handle map clicks
    const DrawingHandler = () => {
        useMapEvents({
            click(e) {
                if (!drawing) return;
                const { lat, lng } = e.latlng;
                setPolygon(prev => [...prev, [lat, lng]]);
            }
        });
        return null;
    };

    const clearPolygon = () => {
        setPolygon([]);
        setVoters([]);
        setStep(1);
    };

    const findVoters = async() => {
        if (polygon.length < 3) {
            toast.error('Please draw a polygon first');
            return;
        }

        setLoading(true);

        try {
            const closedPolygon = [...polygon, polygon[0]];
            const coordinates = closedPolygon.map(point =>
                `${point[1]} ${point[0]}`
            ).join(',');

            const polygonWKT = `POLYGON((${coordinates}))`;

            const { data, error } = await supabase
                .rpc('find_voters_in_polygon', {
                    polygon_wkt: polygonWKT
                });

            if (error) throw error;

            setVoters(data || []);

            if (data.length === 0) {
                toast('No voters found in this area');
            } else {
                toast.success(`Found ${data.length} voters in this area!`);
                setStep(2);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error finding voters');
        } finally {
            setLoading(false);
        }
    };

    const sendUpdate = async() => {
        if (!projectName) {
            toast.error('Please enter project name');
            return;
        }

        if (voters.length === 0) {
            toast.error('No voters found in area');
            return;
        }

        setLoading(true);

        try {
            // Create project record
            const projectId = `PRJ${Date.now()}`;
            const closedPolygon = [...polygon, polygon[0]];
            const coordinates = closedPolygon.map(point =>
                `${point[1]} ${point[0]}`
            ).join(',');
            const polygonWKT = `POLYGON((${coordinates}))`;

            const { error: projectError } = await supabase
                .from('projects')
                .insert([{
                    project_id: projectId,
                    leader_id: userData.id,
                    project_name: projectName,
                    project_type: projectType,
                    constituency: userData.constituency,
                    geofence: supabase.rpc('ST_GeogFromText', { text: polygonWKT }),
                    status: 'completed'
                }]);

            if (projectError) throw projectError;

            // Send notifications to all voters
            const notificationMessage = message ||
                `📢 VikasDrishti Update: ${projectName} completed in your area! - ${userData.name} (${userData.title})`;

            for (const voter of voters) {
                await supabase
                    .from('notifications')
                    .insert([{
                        notification_id: `NOT${Date.now()}${voter.id}`,
                        user_id: voter.id,
                        leader_id: userData.id,
                        type: 'project_update',
                        message: notificationMessage,
                        phone_number: voter.phone,
                        status: 'sent',
                        sent_at: new Date()
                    }]);
            }

            toast.success(`Updates sent to ${voters.length} residents!`);
            setStep(3);

        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to send updates');
        } finally {
            setLoading(false);
        }
    };

    return ( <
        div style = { styles.container } > { /* Header */ } <
        div style = { styles.header } >
        <
        button onClick = {
            () => navigate('/leader/dashboard')
        }
        style = { styles.backBtn } >
        <
        FaArrowLeft / > Back <
        /button> <
        h1 style = { styles.title } > Send Project Update < /h1> < /
        div >

        { /* Step Indicator */ } <
        div style = { styles.stepIndicator } >
        <
        div style = {
            {...styles.step, ...(step >= 1 ? styles.stepActive : {}) }
        } >
        1. Draw Area <
        /div> <
        div style = {
            {...styles.step, ...(step >= 2 ? styles.stepActive : {}) }
        } >
        2. Compose Message <
        /div> <
        div style = {
            {...styles.step, ...(step >= 3 ? styles.stepActive : {}) }
        } >
        3. Preview & Send <
        /div> < /
        div >

        {
            step === 1 && ( <
                div style = { styles.mapSection } >
                <
                div style = { styles.mapControls } >
                <
                button onClick = {
                    () => setDrawing(!drawing)
                }
                style = { drawing ? styles.stopBtn : styles.drawBtn } > { drawing ? '⏹️ Stop Drawing' : '✏️ Start Drawing Area' } <
                /button> <
                button onClick = { clearPolygon }
                style = { styles.clearBtn } > 🧹Clear <
                /button> <
                span style = { styles.pointsCount } >
                Points: { polygon.length } <
                /span> < /
                div >

                <
                div style = { styles.mapContainer } >
                <
                MapContainer center = {
                    [28.6139, 77.2090]
                }
                zoom = { 12 }
                style = { styles.map } >
                <
                TileLayer url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution = '© OpenStreetMap' /
                >
                <
                DrawingHandler / > {
                    polygon.length > 0 && ( <
                        Polygon positions = { polygon }
                        color = "#FF9933"
                        weight = { 3 }
                        fillColor = "#FF9933"
                        fillOpacity = { 0.3 }
                        />
                    )
                } <
                /MapContainer> < /
                div >

                <
                button onClick = { findVoters }
                disabled = { polygon.length < 3 || loading }
                style = { polygon.length < 3 ? styles.nextBtnDisabled : styles.nextBtn } > { loading ? 'Searching...' : 'Find Voters & Continue →' } <
                /button> < /
                div >
            )
        }

        {
            step === 2 && ( <
                div style = { styles.composeSection } >
                <
                div style = { styles.voterInfo } >
                <
                FaUsers / > Found { voters.length }
                voters in selected area <
                /div>

                <
                div style = { styles.form } >
                <
                select value = { projectType }
                onChange = {
                    (e) => setProjectType(e.target.value)
                }
                style = { styles.input } >
                <
                option value = "road" > 🛣️Road Repair < /option> <
                option value = "streetlight" > 💡Streetlight Installation < /option> <
                option value = "sewer" > 💧Sewage / Drainage < /option> <
                option value = "park" > 🌳Park / Garden < /option> <
                option value = "school" > 🏫School / Education < /option> <
                option value = "hospital" > 🏥Hospital / Clinic < /option> < /
                select >

                <
                input type = "text"
                placeholder = "Project Name"
                value = { projectName }
                onChange = {
                    (e) => setProjectName(e.target.value)
                }
                style = { styles.input }
                />

                <
                textarea placeholder = "Custom message (optional)"
                value = { message }
                onChange = {
                    (e) => setMessage(e.target.value)
                }
                style = { styles.textarea }
                rows = "4" /
                >

                <
                div style = { styles.buttonGroup } >
                <
                button onClick = {
                    () => setStep(1)
                }
                style = { styles.backButton } > ←Back <
                /button> <
                button onClick = { sendUpdate }
                style = { styles.sendBtn } >
                Preview & Send <
                /button> < /
                div > <
                /div> < /
                div >
            )
        }

        {
            step === 3 && ( <
                div style = { styles.previewSection } >
                <
                div style = { styles.successIcon } > ✅ < /div> <
                h2 style = { styles.successTitle } > Update Sent Successfully! < /h2> <
                p style = { styles.successMessage } >
                Your project update has been sent to { voters.length }
                residents. <
                /p>

                <
                div style = { styles.summary } >
                <
                h3 > Summary: < /h3> <
                p > < strong > Project: < /strong> {projectName}</p >
                <
                p > < strong > Type: < /strong> {projectType}</p >
                <
                p > < strong > Recipients: < /strong> {voters.length} voters</p >
                <
                p > < strong > Area: < /strong> {polygon.length} points polygon</p >
                <
                /div>

                <
                div style = { styles.actionButtons } >
                <
                button onClick = { clearPolygon }
                style = { styles.newUpdateBtn } >
                Send Another Update <
                /button> <
                button onClick = {
                    () => navigate('/leader/dashboard')
                }
                style = { styles.dashboardBtn } >
                Go to Dashboard <
                /button> < /
                div > <
                /div>
            )
        } <
        /div>
    );
};

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '30px'
    },
    backBtn: {
        padding: '10px 20px',
        background: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    title: {
        color: '#FF9933',
        fontSize: '28px',
        margin: '0'
    },
    stepIndicator: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '30px',
        padding: '10px',
        background: '#f8f9fa',
        borderRadius: '10px'
    },
    step: {
        flex: 1,
        textAlign: 'center',
        padding: '10px',
        color: '#999',
        position: 'relative'
    },
    stepActive: {
        color: '#FF9933',
        fontWeight: 'bold'
    },
    mapSection: {
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    mapControls: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
    },
    drawBtn: {
        padding: '10px 20px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    stopBtn: {
        padding: '10px 20px',
        background: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    clearBtn: {
        padding: '10px 20px',
        background: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    pointsCount: {
        padding: '10px',
        color: '#666'
    },
    mapContainer: {
        height: '400px',
        marginBottom: '20px',
        borderRadius: '10px',
        overflow: 'hidden'
    },
    map: {
        height: '100%',
        width: '100%'
    },
    nextBtn: {
        width: '100%',
        padding: '15px',
        background: '#138808',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    nextBtnDisabled: {
        width: '100%',
        padding: '15px',
        background: '#ccc',
        color: '#666',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'not-allowed'
    },
    composeSection: {
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    voterInfo: {
        padding: '15px',
        background: '#e8f5e9',
        color: '#138808',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    input: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '15px'
    },
    textarea: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '15px',
        resize: 'vertical'
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px'
    },
    backButton: {
        flex: 1,
        padding: '12px',
        background: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
    },
    sendBtn: {
        flex: 2,
        padding: '12px',
        background: '#FF9933',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    previewSection: {
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        textAlign: 'center'
    },
    successIcon: {
        fontSize: '60px',
        marginBottom: '20px'
    },
    successTitle: {
        color: '#138808',
        fontSize: '24px',
        marginBottom: '10px'
    },
    successMessage: {
        color: '#666',
        marginBottom: '30px'
    },
    summary: {
        textAlign: 'left',
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px'
    },
    actionButtons: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center'
    },
    newUpdateBtn: {
        padding: '12px 24px',
        background: '#FF9933',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
    },
    dashboardBtn: {
        padding: '12px 24px',
        background: '#138808',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
    }
};

export default SendUpdate;